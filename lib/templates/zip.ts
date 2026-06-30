import type { TemplateFile } from "./types";

// Dependency-free, store-only (method 0) ZIP writer. The template bundle is a
// directory of small text files; "stored" (uncompressed) entries keep this to
// ~100 lines, produce deterministic output, and run in the browser. Swap in
// `fflate` here if real DEFLATE compression is ever needed.

const CRC_TABLE: number[] = (() => {
  const table: number[] = new Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    crc = CRC_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

interface Entry {
  nameBytes: Uint8Array;
  data: Uint8Array;
  crc: number;
  offset: number;
}

/** Build a store-only ZIP archive from template files. */
export function zipFiles(files: TemplateFile[]): Uint8Array {
  const encoder = new TextEncoder();
  const localChunks: Uint8Array[] = [];
  const entries: Entry[] = [];
  let offset = 0;

  for (const file of files) {
    const nameBytes = encoder.encode(file.path);
    const data = encoder.encode(file.contents);
    const crc = crc32(data);

    const header = new Uint8Array(30 + nameBytes.length);
    const view = new DataView(header.buffer);
    view.setUint32(0, 0x04034b50, true); // local file header signature
    view.setUint16(4, 20, true); // version needed
    view.setUint16(6, 0, true); // flags
    view.setUint16(8, 0, true); // method: store
    view.setUint16(10, 0, true); // mod time
    view.setUint16(12, 0x21, true); // mod date (1980-01-01)
    view.setUint32(14, crc, true);
    view.setUint32(18, data.length, true); // compressed size
    view.setUint32(22, data.length, true); // uncompressed size
    view.setUint16(26, nameBytes.length, true);
    view.setUint16(28, 0, true); // extra length
    header.set(nameBytes, 30);

    entries.push({ nameBytes, data, crc, offset });
    localChunks.push(header, data);
    offset += header.length + data.length;
  }

  // Central directory
  const centralChunks: Uint8Array[] = [];
  let centralSize = 0;
  for (const e of entries) {
    const rec = new Uint8Array(46 + e.nameBytes.length);
    const view = new DataView(rec.buffer);
    view.setUint32(0, 0x02014b50, true); // central dir signature
    view.setUint16(4, 20, true); // version made by
    view.setUint16(6, 20, true); // version needed
    view.setUint16(8, 0, true); // flags
    view.setUint16(10, 0, true); // method
    view.setUint16(12, 0, true); // mod time
    view.setUint16(14, 0x21, true); // mod date
    view.setUint32(16, e.crc, true);
    view.setUint32(20, e.data.length, true); // compressed size
    view.setUint32(24, e.data.length, true); // uncompressed size
    view.setUint16(28, e.nameBytes.length, true);
    view.setUint16(30, 0, true); // extra length
    view.setUint16(32, 0, true); // comment length
    view.setUint16(34, 0, true); // disk number start
    view.setUint16(36, 0, true); // internal attrs
    view.setUint32(38, 0, true); // external attrs
    view.setUint32(42, e.offset, true); // local header offset
    rec.set(e.nameBytes, 46);
    centralChunks.push(rec);
    centralSize += rec.length;
  }

  const end = new Uint8Array(22);
  const endView = new DataView(end.buffer);
  endView.setUint32(0, 0x06054b50, true); // end of central dir signature
  endView.setUint16(4, 0, true); // disk number
  endView.setUint16(6, 0, true); // disk with central dir
  endView.setUint16(8, entries.length, true); // entries on this disk
  endView.setUint16(10, entries.length, true); // total entries
  endView.setUint32(12, centralSize, true); // central dir size
  endView.setUint32(16, offset, true); // central dir offset
  endView.setUint16(20, 0, true); // comment length

  const total =
    offset + centralSize + end.length;
  const out = new Uint8Array(total);
  let pos = 0;
  for (const chunk of localChunks) {
    out.set(chunk, pos);
    pos += chunk.length;
  }
  for (const chunk of centralChunks) {
    out.set(chunk, pos);
    pos += chunk.length;
  }
  out.set(end, pos);
  return out;
}

/** Build a downloadable ZIP Blob from template files. */
export function zipToBlob(files: TemplateFile[]): Blob {
  const bytes = zipFiles(files);
  return new Blob([bytes as BlobPart], { type: "application/zip" });
}
