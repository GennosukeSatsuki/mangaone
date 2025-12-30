import imageCompression from 'browser-image-compression';

// ============================================================================
// TYPES & CONSTANTS
// ============================================================================

/**
 * Settings for image resizing operations.
 * Responsibility: Define the parameters for image compression.
 */
export interface ResizeSettings {
  maxLongEdge: number;  // Maximum size of the longest edge in pixels
  quality: number;      // JPEG quality (0.1 to 1.0)
}

/**
 * Result of image resizing operation.
 * Responsibility: Carry both the processed image data and its filename.
 */
export interface ResizedImageResult {
  blob: Blob;
  filename: string;
}

// Supported image file extensions
const IMAGE_EXTENSIONS = /\.(jpg|jpeg|png|gif|bmp|webp|tiff|tif|svg)$/i;

// System files to exclude from processing
const SYSTEM_FILE_PATTERNS = ['__MACOSX', '.DS_Store'];

// ============================================================================
// IMAGE SERVICE
// ============================================================================

/**
 * Service for image processing operations.
 * Responsibility: Handle image resizing, format conversion, and validation.
 */
export const ImageService = {
  /**
   * Resize and optionally convert an image.
   * Responsibility: 
   * - Resize images based on long edge
   * - Convert PNG to JPEG for better compression
   * - Return both the processed blob and updated filename
   */
  async resizeImage(
    blob: Blob, 
    settings: ResizeSettings, 
    filename: string
  ): Promise<ResizedImageResult> {
    const isPng = filename.toLowerCase().endsWith('.png');
    
    // browser-image-compression requires a File object, not just a Blob
    const file = new File([blob], filename, { 
      type: blob.type || 'image/jpeg' 
    });
    
    const options = {
      maxWidthOrHeight: settings.maxLongEdge,
      useWebWorker: true,
      initialQuality: settings.quality,
      // Convert PNG to JPEG for significant size reduction
      fileType: isPng ? 'image/jpeg' as const : undefined,
    };

    const resizedBlob = await imageCompression(file, options);
    
    // Update filename extension when converting PNG → JPEG
    const newFilename = isPng 
      ? filename.replace(/\.png$/i, '.jpg') 
      : filename;
    
    return { blob: resizedBlob, filename: newFilename };
  },

  /**
   * Check if a file is a valid image based on its filename.
   * Responsibility:
   * - Filter out system files
   * - Validate image file extensions
   */
  isImageFile(filename: string): boolean {
    // Exclude macOS and Windows system files
    const isSystemFile = SYSTEM_FILE_PATTERNS.some(pattern => 
      filename.includes(pattern)
    );
    
    if (isSystemFile) {
      return false;
    }
    
    // Check for supported image extensions
    return IMAGE_EXTENSIONS.test(filename);
  }
};
