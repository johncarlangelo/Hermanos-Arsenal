/**
 * Export catalogue data as JSON file
 */
export function exportCatalogue(catalogueData, username) {
  const safeData = {
    ...catalogueData,
    categories: (catalogueData.categories || []).filter(cat => !cat.isPrivate)
  };
  const dataStr = JSON.stringify(safeData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `linkdock-${username || 'backup'}-${Date.now()}.json`;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

/**
 * Import catalogue data from JSON file
 */
export function importCatalogue(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        resolve(data);
      } catch {
        reject(new Error('Invalid JSON file'));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

/**
 * Detect duplicates between existing and imported data
 */
export function detectDuplicates(existingCategories, importedCategories) {
  const duplicates = [];
  const newCategories = [];
  
  importedCategories.forEach(importedCat => {
    const existing = existingCategories.find(cat => cat.id === importedCat.id);
    
    if (existing) {
      duplicates.push({ existing, imported: importedCat });
    } else {
      newCategories.push(importedCat);
    }
  });
  
  return { duplicates, newCategories };
}

/**
 * Merge imported data with existing data based on user choice
 * @param {string} strategy - 'replace', 'skip', or 'merge'
 */
export function mergeData(existingCategories, importedCategories, strategy = 'merge') {
  switch (strategy) {
    case 'replace':
      return importedCategories;
      
    case 'skip':
      return existingCategories;
      
    case 'merge':
    default: {
      const merged = [...existingCategories];
      
      importedCategories.forEach(importedCat => {
        const existingIndex = merged.findIndex(cat => cat.id === importedCat.id);
        
        if (existingIndex !== -1) {
          // Merge links, avoiding duplicates
          const existingLinks = merged[existingIndex].links || [];
          const importedLinks = importedCat.links || [];
          
          const newLinks = importedLinks.filter(
            link => !existingLinks.some(existing => existing.url === link.url)
          );
          
          // Create a new category object to avoid mutating state
          merged[existingIndex] = {
            ...merged[existingIndex],
            links: [...existingLinks, ...newLinks]
          };
        } else {
          merged.push(importedCat);
        }
      });
      
      return merged;
    }
  }
}
