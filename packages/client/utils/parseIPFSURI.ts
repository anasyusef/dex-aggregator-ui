export default function parseIPFSURI(uri: string) {
  let url: URL;
  try {
    url = new URL(uri);
    if (url.protocol.startsWith("ipfs")) {
      const pathname = url.pathname.slice(2);
      return `https://cloudflare-ipfs.com/ipfs/${pathname}`;
    }
  } catch (_) {}

  return uri;
}
