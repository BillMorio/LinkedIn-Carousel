/**
 * Export-time image conversion utilities
 * Converts external image URLs to data URLs temporarily during PNG export
 */

/**
 * Converts an image URL to a base64 data URL
 */
async function convertImageUrlToDataUrl(url: string): Promise<string> {
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
 * Prepares canvas for export by converting external images to data URLs
 * Returns a cleanup function to restore original URLs
 */
export async function prepareCanvasForExport(canvasElement: HTMLElement): Promise<() => void> {
  const images = canvasElement.querySelectorAll('img');
  const originalSrcs: Map<HTMLImageElement, string> = new Map();
  
  console.log(`Preparing ${images.length} images for export...`);
  
  for (const img of Array.from(images)) {
    const src = img.src;
    
    // Skip data URLs and same-origin images
    if (src.startsWith('data:') || src.startsWith(window.location.origin)) {
      continue;
    }
    
    console.log(`Converting external image: ${src}`);
    
    // Store original
    originalSrcs.set(img, src);
    
    // Convert to data URL
    try {
      const dataUrl = await convertImageUrlToDataUrl(src);
      img.src = dataUrl;
    } catch (err) {
      console.warn(`Failed to convert image: ${src}`, err);
      // Keep original URL, will be filtered out by export filter
    }
  }
  
  console.log(`Converted ${originalSrcs.size} external images to data URLs`);
  
  // Return cleanup function
  return () => {
    console.log(`Restoring ${originalSrcs.size} original image URLs`);
    originalSrcs.forEach((originalSrc, img) => {
      img.src = originalSrc;
    });
  };
}
