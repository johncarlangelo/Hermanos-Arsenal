/**
 * Get favicon URL for a given website URL
 * Uses Google's favicon service
 */
export function getFaviconUrl(url) {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  } catch (error) {
    console.error('Invalid URL:', error);
    return null;
  }
}

/**
 * Validate if a string is a valid URL
 */
export function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}
