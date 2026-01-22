/**
 * Converts an image URL to a base64 data URL
 * Handles CORS by using a proxy approach
 */
export async function convertImageUrlToDataUrl(url: string): Promise<string> {
  try {
    // If already a data URL, return as-is
    if (url.startsWith('data:')) {
      return url;
    }

    // Fetch the image
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`Failed to fetch image: ${url}`);
      return url; // Return original URL if fetch fails
    }

    // Convert to blob
    const blob = await response.blob();
    
    // Convert blob to data URL
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.warn(`Error converting image URL to data URL: ${url}`, error);
    return url; // Return original URL on error
  }
}

/**
 * Recursively finds and converts all image URLs in an object to data URLs
 */
export async function convertImagesInObject(obj: any): Promise<any> {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return Promise.all(obj.map(item => convertImagesInObject(item)));
  }

  const result: any = {};
  
  for (const [key, value] of Object.entries(obj)) {
    // Check if this is an image URL field
    const isImageField = 
      key === 'profileImage' || 
      key === 'icon' || 
      key === 'logos' ||
      key === 'image';

    if (isImageField && typeof value === 'string' && value.startsWith('http')) {
      // Convert single image URL
      result[key] = await convertImageUrlToDataUrl(value);
    } else if (isImageField && Array.isArray(value)) {
      // Convert array of image URLs
      result[key] = await Promise.all(
        value.map(url => 
          typeof url === 'string' && url.startsWith('http') 
            ? convertImageUrlToDataUrl(url) 
            : url
        )
      );
    } else if (typeof value === 'object' && value !== null) {
      // Recursively process nested objects
      result[key] = await convertImagesInObject(value);
    } else {
      result[key] = value;
    }
  }

  return result;
}
