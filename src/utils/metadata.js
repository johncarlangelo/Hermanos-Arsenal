export async function fetchMetadata(url) {
  try {
    const { hostname } = new URL(url);
    const domainName = hostname.replace('www.', '').split('.')[0];
    const capitalizedName = domainName.charAt(0).toUpperCase() + domainName.slice(1);
    
    return {
      title: capitalizedName
    };
  } catch {
    return { title: url };
  }
}
