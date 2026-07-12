/**
 * Encode catalogue data to Base64 for sharing
 */
export function encodeCatalogue(data) {
  try {
    const jsonString = JSON.stringify(data);
    return btoa(encodeURIComponent(jsonString));
  } catch (error) {
    console.error('Error encoding catalogue:', error);
    return null;
  }
}

/**
 * Decode catalogue data from Base64
 */
export function decodeCatalogue(encodedData) {
  try {
    const jsonString = decodeURIComponent(atob(encodedData));
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error decoding catalogue:', error);
    return null;
  }
}

/**
 * Generate shareable link with encoded catalogue data
 */
export function generateShareLink(catalogueData) {
  const encoded = encodeCatalogue(catalogueData);
  if (!encoded) return null;
  
  const baseUrl = window.location.origin + window.location.pathname;
  return `${baseUrl}?share=${encoded}`;
}

/**
 * Extract shared catalogue from URL
 */
export function getSharedCatalogueFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  const shareParam = urlParams.get('share');
  
  if (!shareParam) return null;
  
  return decodeCatalogue(shareParam);
}
