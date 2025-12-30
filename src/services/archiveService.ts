import JSZip from 'jszip';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Represents a processed file ready to be added to an archive.
 * Responsibility: Bundle file path and binary data together.
 */
export interface ProcessedFile {
  path: string;  // File path within the archive (including directory structure)
  data: Blob;    // Binary file data
}

// ============================================================================
// ARCHIVE SERVICE
// ============================================================================

/**
 * Service for ZIP archive operations.
 * Responsibility: Handle loading, extracting, and creating ZIP archives.
 */
export const ArchiveService = {
  /**
   * Load a ZIP archive from a File object.
   * Responsibility: Parse a ZIP file and return a JSZip instance.
   */
  async loadArchive(file: File): Promise<JSZip> {
    const zip = new JSZip();
    return await zip.loadAsync(file);
  },

  /**
   * Create a new ZIP archive from processed files.
   * Responsibility: Package multiple files into a single ZIP archive.
   */
  async createArchive(processedFiles: ProcessedFile[]): Promise<Blob> {
    const newZip = new JSZip();
    
    for (const file of processedFiles) {
      newZip.file(file.path, file.data);
    }
    
    return await newZip.generateAsync({ type: 'blob' });
  },

  /**
   * Get all file paths from a ZIP archive.
   * Responsibility: Extract file paths, excluding directory entries.
   */
  getFilePaths(zip: JSZip): string[] {
    return Object.keys(zip.files).filter(path => !zip.files[path].dir);
  }
};
