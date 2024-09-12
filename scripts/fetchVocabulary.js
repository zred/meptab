export async function fetchVocabulary(apiUrl = '/api/vocabulary') {
  try {
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to load vocabulary: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching vocabulary:', error);
    throw error;
  }
}
