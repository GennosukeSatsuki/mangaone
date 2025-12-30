import React, { useState, useCallback } from 'react';
import { Upload, Download, Loader2, CheckCircle2, AlertCircle, Settings as SettingsIcon, FileArchive } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMangaProcessor } from './hooks/useMangaProcessor';
import type { ResizeSettings } from './services/imageService';

// ============================================================================
// CONSTANTS
// ============================================================================

const DEFAULT_SETTINGS: ResizeSettings = {
  maxLongEdge: 1200,
  quality: 0.8,
};

const ACCEPTED_FILE_EXTENSIONS = ['.zip', '.cbz'] as const;
const FILE_INPUT_ID = 'file-input';

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/**
 * Application header with title and icon.
 * Responsibility: Display app branding.
 */
const Header = () => (
  <header style={{ marginBottom: '2rem' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
      <FileArchive size={32} className="text-primary" />
      <h1 className="title" style={{ margin: 0 }}>MangaOne</h1>
    </div>
    <p className="subtitle">Batch Image Resizer for Manga/Comic Archives</p>
  </header>
);

/**
 * Settings panel for user configuration.
 * Responsibility: Allow user to adjust resize parameters.
 */
const SettingsPanel = ({ settings, setSettings }: { settings: ResizeSettings, setSettings: (s: ResizeSettings) => void }) => (
  <section className="settings-section">
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>
      <SettingsIcon size={18} />
      <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Resize Settings</span>
    </div>
    <div className="settings-grid">
      <div className="input-group">
        <label>Long Edge (px)</label>
        <input 
          type="number" 
          value={settings.maxLongEdge} 
          onChange={e => setSettings({...settings, maxLongEdge: parseInt(e.target.value) || 0})}
          placeholder="1200"
        />
      </div>
      <div className="input-group">
        <label>Quality (0.1 - 1.0)</label>
        <input 
          type="number" 
          step="0.1"
          min="0.1"
          max="1.0"
          value={settings.quality} 
          onChange={e => setSettings({...settings, quality: parseFloat(e.target.value) || 0.1})}
        />
      </div>
    </div>
  </section>
);

/**
 * Footer with feature highlights.
 * Responsibility: Display key features and benefits.
 */
const Footer = () => (
  <footer style={{ marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', opacity: 0.6 }}>
      {['Client-side Only', 'Fast & Private', 'Lossy/Lossless Support'].map(text => (
        <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div className="dot" />
          <span style={{ fontSize: '0.75rem' }}>{text}</span>
        </div>
      ))}
    </div>
  </footer>
);

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check if a file has a valid archive extension.
 * Responsibility: Validate file type before processing.
 */
function isValidArchiveFile(filename: string): boolean {
  return ACCEPTED_FILE_EXTENSIONS.some(ext => filename.endsWith(ext));
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * Main application component.
 * Responsibility: Orchestrate UI and user interactions for manga processing.
 */
export default function App() {
  const [settings, setSettings] = useState<ResizeSettings>(DEFAULT_SETTINGS);
  const { state, processFile, reset } = useMangaProcessor(settings);

  /**
   * Validate file and start processing.
   * Responsibility: File validation before delegating to processor.
   */
  const validateAndSet = useCallback((file: File) => {
    if (!isValidArchiveFile(file.name)) {
      alert('Please drop a ZIP or CBZ file.');
      return;
    }
    processFile(file);
  }, [processFile]);

  /**
   * Handle drag and drop events.
   * Responsibility: Extract file from drag event and validate.
   */
  const onDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) validateAndSet(file);
  }, [validateAndSet]);

  /**
   * Download processed archive.
   * Responsibility: Trigger browser download of result ZIP.
   */
  const downloadResult = () => {
    if (!state.resultBlob) return;
    
    const url = URL.createObjectURL(state.resultBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = state.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card">
        <Header />
        
        <SettingsPanel settings={settings} setSettings={setSettings} />

        <div 
          className={`drop-zone ${['extracting', 'processing', 'compressing'].includes(state.status) ? 'active' : ''}`}
          onDragOver={e => e.preventDefault()}
          onDrop={onDrop}
          onClick={() => state.status === 'idle' && document.getElementById(FILE_INPUT_ID)?.click()}
        >
          <input 
            id={FILE_INPUT_ID} 
            type="file" 
            accept=".zip,.cbz" 
            style={{ display: 'none' }} 
            onChange={(e) => e.target.files?.[0] && validateAndSet(e.target.files[0])}
          />
          
          <AnimatePresence mode="wait">
            {state.status === 'idle' && (
              <motion.div key="idle" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="drop-content">
                <div className="icon-circle"><Upload size={32} color="var(--primary)" /></div>
                <p style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem' }}>Drop your archive here</p>
                <p style={{ color: 'var(--text-muted)' }}>or click to browse from your device</p>
              </motion.div>
            )}

            {['extracting', 'processing', 'compressing'].includes(state.status) && (
              <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ width: '100%' }}>
                <Loader2 className="animate-spin" size={48} color="var(--primary)" style={{ marginBottom: '1.5rem', margin: '0 auto' }} />
                <h3 style={{ marginBottom: '0.5rem' }}>
                  {state.status === 'extracting' ? 'Extracting...' : state.status === 'processing' ? 'Resizing Images' : 'Compressing...'}
                </h3>
                {state.status === 'processing' && (
                  <p className="status-text" style={{ marginBottom: '1.5rem' }}>{state.currentFile} ({state.progress}%)</p>
                )}
                <div className="progress-container">
                  <div className="progress-bar">
                    <motion.div className="progress-fill" initial={{ width: 0 }} animate={{ width: `${state.progress}%` }} />
                  </div>
                </div>
              </motion.div>
            )}

            {state.status === 'done' && (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                <div className="icon-circle success"><CheckCircle2 size={32} color="var(--success)" /></div>
                <h3 style={{ marginBottom: '0.5rem' }}>Processing Complete!</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Successfully resized {state.fileCount} images.</p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button className="btn outline" onClick={(e) => { e.stopPropagation(); reset(); }}>Process Another</button>
                  <button className="btn" onClick={(e) => { e.stopPropagation(); downloadResult(); }}><Download size={20} /> Download ZIP</button>
                </div>
              </motion.div>
            )}

            {state.status === 'error' && (
              <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="icon-circle error"><AlertCircle size={32} color="var(--error)" /></div>
                <p style={{ color: 'var(--error)', fontWeight: 600, marginBottom: '1.5rem' }}>{state.error}</p>
                <button className="btn outline" onClick={(e) => { e.stopPropagation(); reset(); }}>Try Again</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Footer />
      </motion.div>
      
      <style>{`
        .icon-circle { width: 80px; height: 80px; background: rgba(99, 102, 241, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; }
        .icon-circle.success { background: rgba(34, 197, 94, 0.1); }
        .icon-circle.error { background: rgba(239, 68, 68, 0.1); }
        .btn.outline { background: transparent; border: 1px solid var(--border); color: var(--text); }
        .btn.outline:hover { background: rgba(255, 255, 255, 0.05); border-color: var(--text-muted); }
        .dot { width: 6px; height: 6px; background: var(--primary); border-radius: 50%; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .text-primary { color: var(--primary); }
      `}</style>
    </div>
  );
}
