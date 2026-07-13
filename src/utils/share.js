import LZString from 'lz-string';

/**
 * Encode catalogue data to a compressed string for sharing
 */
export function encodeCatalogue(data) {
  try {
    const jsonString = JSON.stringify(data);
    return LZString.compressToEncodedURIComponent(jsonString);
  } catch (error) {
    console.error('Error encoding catalogue:', error);
    return null;
  }
}

/**
 * Decode catalogue data from compressed string (with fallback to Base64)
 */
export function decodeCatalogue(encodedData) {
  try {
    // Try to decompress using lz-string first
    const decompressed = LZString.decompressFromEncodedURIComponent(encodedData);
    if (decompressed) {
      return JSON.parse(decompressed);
    }
  } catch {
    // Ignore and proceed to fallback
  }

  // Fallback to old Base64 decoding for backward compatibility
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
