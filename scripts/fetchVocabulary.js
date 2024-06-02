export async function fetchVocabulary() {
  const response = await fetch('../data/vocabulary.json');
  const data = await response.json();
  return data;
}
