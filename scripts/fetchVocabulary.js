export async function fetchVocabulary() {
  try {
    const response = await fetch('../data/vocabulary.json');
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch vocabulary data:', error);
    return [];
  }
}
