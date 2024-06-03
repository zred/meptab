export async function fetchVocabulary() {
  const dataDirectory = './data/dataFiles.json'; // Path to the JSON file list
  const response = await fetch(dataDirectory);
  
  if (!response.ok) {
    throw new Error(`Failed to load file list: ${response.statusText}`);
  }
  
  const files = await response.json();

  let combinedData = [];

  for (const file of files) {
    if (file.endsWith('.json')) {
      const filePath = `./data/${file}`;
      const fileResponse = await fetch(filePath);
      
      if (!fileResponse.ok) {
        throw new Error(`Failed to load ${file}: ${fileResponse.statusText}`);
      }
      
      const data = await fileResponse.json();
      combinedData.push(data);
    }
  }

  return combinedData;
}
