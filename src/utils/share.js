import LZString from 'lz-string';

/**
 * Convert catalogue object to a compact array format
 * Root: [username, categories]
 * Category: [id, name, icon, color, [x, y, w, h], viewType, iconSize, links]
 * Link: [id, name, url, description, icon, starred]
 */
function toCompact(data) {
  if (!data) return data;
  
  const publicCategories = (data.categories || []).filter(cat => !cat.isPrivate);
  
  const compactCategories = publicCategories.map(cat => {
    const compactLinks = (cat.links || []).map(link => [
      link.id,
      link.name,
      link.url,
      link.description,
      link.icon,
      link.starred ? 1 : 0
    ]);
    
    return [
      cat.id,
      cat.name,
      cat.icon,
      cat.color,
      cat.size ? [cat.size.width, cat.size.height] : null,
      cat.viewType,
      cat.iconSize,
      compactLinks
    ];
  });

  return [data.username, compactCategories];
}

/**
 * Convert compact array format back to catalogue object
 */
function fromCompact(arr) {
  if (!Array.isArray(arr)) return arr;
  
  const [username, categoriesArr] = arr;
  
  const categories = (categoriesArr || []).map(catArr => {
    const [id, name, icon, color, posArr, viewType, iconSize, linksArr] = catArr;
    
    const links = (linksArr || []).map(linkArr => {
      const [linkId, linkName, url, description, linkIcon, starred] = linkArr;
      return {
        id: linkId,
        name: linkName,
        url,
        description,
        icon: linkIcon,
        starred: !!starred
      };
    });
    
    const category = { id, name, icon, color, viewType, iconSize, links };
    if (posArr && Array.isArray(posArr)) {
      if (posArr.length === 2) {
        category.size = { width: posArr[0], height: posArr[1] };
      } else if (posArr.length === 4) {
        // Legacy fallback
        category.position = { x: posArr[0], y: posArr[1], w: posArr[2], h: posArr[3] };
      }
    }
    
    return category;
  });
  
  return { username, categories };
}

/**
 * Encode catalogue data to a compressed string for sharing
 */
export function encodeCatalogue(data) {
  try {
    const compact = toCompact(data);
    const jsonString = JSON.stringify(compact);
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
      const parsed = JSON.parse(decompressed);
      
      if (Array.isArray(parsed)) {
        return fromCompact(parsed);
      }
      // Check if it's minified by looking for mapped root keys
      if (parsed.u !== undefined || parsed.c !== undefined) {
        return parsed;
      }
      return parsed; // old payload, not minified
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
