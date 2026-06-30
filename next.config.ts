import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The @google/design.md CLI is invoked via child_process in API routes;
  // keep it external so Next doesn't try to bundle the binary.
  serverExternalPackages: ["@google/design.md"],
};

export default nextConfig;
