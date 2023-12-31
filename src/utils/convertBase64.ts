export const readFileAsBase64 = (
    file: File | string | null
  ): Promise<string | null> => {
    return new Promise((resolve) => {
      if (!file) {
        resolve(null);
        return;
      }
  
      // If the file is a string, assume it's already a data URL
      if (typeof file === 'string') {
        resolve(file);
        return;
      }
  
      const reader = new FileReader();
  
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result);
      };
  
      reader.onerror = () => {
        resolve(null);
      };
  
      reader.readAsDataURL(file);
    });
  };