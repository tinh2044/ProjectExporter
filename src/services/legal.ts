import legalInfo from './legal.json';

/**
 * load legal info
 * @returns {Promise<string[]>} list legal info
 */
export const loadLegalInfo = async (): Promise<string[]> => {
  try {
    return legalInfo;
  } catch (error) {
    console.error('Error loading legal info:', error);
    return [];
  }
};

/**
 * @param {Array} data - list legal info
 * @param {string} keyword - search keyword
 */
export const searchLegalInfo = (data: string[], keyword: string) => {
  if (!keyword) return data;
  
  const lowerKeyword = keyword.toLowerCase();
  return data.filter(item => 
    item.toLowerCase().includes(lowerKeyword)
  );
};