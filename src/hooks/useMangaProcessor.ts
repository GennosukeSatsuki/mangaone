import { useState } from 'react';
import { ArchiveService, type ProcessedFile } from '../services/archiveService';
import { ImageService, type ResizedImageResult } from '../services/imageService';
import type { ResizeSettings } from '../services/imageService';

// ============================================================================
// TYPES
// ============================================================================

export type ProcessorStatus = 'idle' | 'extracting' | 'processing' | 'compressing' | 'done' | 'error';

/**
 * State of the manga processing pipeline.
 * Responsibility: Track the current status and results of file processing.
 */
export interface ProcessorState {
  status: ProcessorStatus;
  progress: number;
  error: string | null;
  resultBlob: Blob | null;
  fileName: string;
  fileCount: number;
  currentFile: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const INITIAL_STATE: ProcessorState = {
  status: 'idle',
  progress: 0,
  error: null,
  resultBlob: null,
  fileName: '',
  fileCount: 0,
  currentFile: '',
};

const OUTPUT_FILE_SUFFIX = '_resized.zip';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Generate output filename from input filename.
 * Responsibility: Convert "manga.zip" → "manga_resized.zip"
 */
function generateOutputFilename(inputFilename: string): string {
  return inputFilename.replace(/\.(zip|cbz)$/i, '') + OUTPUT_FILE_SUFFIX;
}

/**
 * Extract just the filename from a full path.
 * Responsibility: "/folder/image.jpg" → "image.jpg"
 */
function extractFilename(path: string): string {
  return path.split('/').pop() || path;
}

/**
 * Extract directory path from a full path.
 * Responsibility: "/folder/image.jpg" → "/folder/"
 */
function extractDirectory(path: string): string {
  return path.substring(0, path.lastIndexOf('/') + 1);
}

/**
 * Reconstruct full path with new filename.
 * Responsibility: Maintain directory structure when filename changes.
 */
function updatePath(originalPath: string, newFilename: string): string {
  const directory = extractDirectory(originalPath);
  return directory + newFilename;
}

/**
 * Calculate progress percentage.
 * Responsibility: Convert (current/total) to rounded percentage.
 */
function calculateProgress(current: number, total: number): number {
  return Math.round((current / total) * 100);
}

// ============================================================================
// MAIN HOOK
// ============================================================================

/**
 * React hook for processing manga/comic archives.
 * Responsibility: Orchestrate the entire image resizing pipeline.
 * 
 * Pipeline stages:
 * 1. Extract images from ZIP
 * 2. Resize each image (with PNG→JPEG conversion)
 * 3. Recompile into new ZIP
 */
export const useMangaProcessor = (settings: ResizeSettings) => {
  const [state, setState] = useState<ProcessorState>(INITIAL_STATE);

  /**
   * Process a manga archive file.
   * Responsibility: Execute the full processing pipeline and update state.
   */
  const processFile = async (file: File) => {
    try {
      // ===== Stage 1: Extract =====
      setState(prev => ({ 
        ...prev, 
        status: 'extracting', 
        error: null, 
        progress: 0,
        fileName: generateOutputFilename(file.name)
      }));

      const zip = await ArchiveService.loadArchive(file);
      const allPaths = ArchiveService.getFilePaths(zip);
      const imagePaths = allPaths.filter(path => ImageService.isImageFile(path));

      if (imagePaths.length === 0) {
        throw new Error('No images found in the archive. Please ensure the ZIP contains image files.');
      }

      // ===== Stage 2: Process Images =====
      setState(prev => ({ 
        ...prev, 
        status: 'processing', 
        fileCount: imagePaths.length 
      }));

      const processedFiles: ProcessedFile[] = [];
      
      for (let i = 0; i < imagePaths.length; i++) {
        const path = imagePaths[i];
        const filename = extractFilename(path);
        
        // Update UI with current file
        setState(prev => ({ ...prev, currentFile: filename }));
        
        // Extract and resize image
        const fileData = await zip.files[path].async('blob');
        const resizedImage: ResizedImageResult = await ImageService.resizeImage(
          fileData, 
          settings, 
          filename
        );
        
        // Update path if filename changed (e.g., PNG → JPG conversion)
        const newPath = updatePath(path, resizedImage.filename);
        
        processedFiles.push({ 
          path: newPath, 
          data: resizedImage.blob 
        });
        
        // Update progress
        setState(prev => ({ 
          ...prev, 
          progress: calculateProgress(i + 1, imagePaths.length) 
        }));
      }

      // ===== Stage 3: Compress =====
      setState(prev => ({ ...prev, status: 'compressing' }));
      const finalBlob = await ArchiveService.createArchive(processedFiles);

      // ===== Done =====
      setState(prev => ({ 
        ...prev, 
        status: 'done', 
        resultBlob: finalBlob 
      }));
      
    } catch (err: any) {
      setState(prev => ({ 
        ...prev, 
        status: 'error', 
        error: err.message || 'An unexpected error occurred during processing.' 
      }));
    }
  };

  /**
   * Reset processor to initial state.
   * Responsibility: Clear all state for processing a new file.
   */
  const reset = () => {
    setState(INITIAL_STATE);
  };

  return { state, processFile, reset };
};
