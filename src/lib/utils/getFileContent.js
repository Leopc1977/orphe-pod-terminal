export default async function getFileContent(filePath) {
    try {
      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error('Failed to fetch file');
      }
      const text = await response.text();
      return text;
    } catch (err) {
      console.error(err);
      return null;
    }
}
