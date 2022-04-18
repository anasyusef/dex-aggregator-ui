export default function parseIPFSURI(uri: string) {
  const url = new URL(uri);
  if (url.protocol.startsWith("ipfs")) {
    const pathname = url.pathname.slice(2);
    return `https://cloudflare-ipfs.com/ipfs/${pathname}`;
  }
  return uri;
}
