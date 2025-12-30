# MangaOne

<div align="center">

**Batch Image Resizer for Manga & Comic Archives**

Compress your manga/doujinshi collections to save storage space on your tablet or mobile device.

[🇯🇵 日本語README](./README.ja.md) | [Download Latest Release](../../releases)

</div>

---

## ✨ Features

- 📦 **ZIP/CBZ Support** - Drag & drop your manga archives
- 🎯 **Smart Resizing** - Resize based on long edge (default: 1200px)
- 🔄 **PNG → JPEG Conversion** - Automatic conversion for massive space savings
- 🗜️ **Adjustable Quality** - Control compression ratio (0.1 - 1.0)
- 📁 **Folder Structure Preserved** - Maintains subfolder organization
- 🚀 **Fast Processing** - Multi-threaded image processing
- 💻 **Cross-Platform** - Works on Windows, macOS, and Linux
- 🔒 **100% Private** - All processing happens locally on your device

## 🎯 Perfect For

- **Tablet Users** - Compress doujinshi from DLsite, BOOTH, etc. for iPad/Android tablets
- **Mobile Readers** - Optimize manga archives for phones with limited storage
- **Digital Hoarders** - Reduce your manga collection size without losing readability
- **Cloud Storage** - Save bandwidth and storage costs

## 📊 Compression Example

Real-world compression results:

| Original Format | Original Size | After MangaOne | Compression |
|----------------|---------------|----------------|-------------|
| PNG Archive    | 134 MB        | 8 MB           | **94% reduction** |
| Mixed JPG/PNG  | 85 MB         | 12 MB          | **86% reduction** |

*Results may vary based on quality settings and source images*

## 🚀 Getting Started

### Installation

**Download the latest release for your platform:**

- [Windows (.exe)](../../releases)
- [macOS (.dmg)](../../releases)
- [Linux (.AppImage)](../../releases)

### Usage

1. **Launch MangaOne**
2. **Adjust Settings** (optional)
   - Long Edge: Target size for the longest dimension (default: 1200px)
   - Quality: JPEG quality from 0.1 to 1.0 (default: 0.8)
3. **Drop your ZIP/CBZ file** onto the application window
4. **Wait for processing** - Progress bar shows current status
5. **Download** the optimized archive

That's it! Your compressed manga is ready for mobile reading.

## 🛠️ Technical Details

### Built With

- **Frontend**: React + TypeScript
- **Desktop**: Electron
- **Build Tool**: Vite
- **Image Processing**: browser-image-compression
- **Archive Handling**: JSZip
- **UI**: Framer Motion + Lucide Icons

### Features Under the Hood

- Converts Blob to File for proper image compression
- Filters macOS system files (`__MACOSX`, `.DS_Store`)
- Handles nested folder structures
- Updates file extensions when converting PNG → JPEG
- Client-side processing (no server uploads)

## 🔧 Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/mangaone.git
cd mangaone

# Install dependencies
npm install

# Run in development mode
npm run dev
```


### Build

```bash
# Build for current platform
npm run build

# Build for specific platforms
npm run build:win    # Windows
npm run build:mac    # macOS
npm run build:linux  # Linux
```

Built packages will be in the `release/` directory.

### Release

This project uses GitHub Actions for automated releases. To create a new release:

```bash
# Update version in package.json
npm version patch  # or minor, or major

# Push the tag
git push origin main --tags
```

GitHub Actions will automatically:
- Build for Windows, macOS (Intel + Apple Silicon), and Linux
- Generate release notes
- Upload all binaries to GitHub Releases

## 📝 Supported Formats

### Input

- `.zip` - Standard ZIP archives
- `.cbz` - Comic Book ZIP format

### Image Types

- `.jpg` / `.jpeg`
- `.png` (auto-converted to JPEG)
- `.gif`
- `.bmp`
- `.webp`
- `.tiff` / `.tif`
- `.svg`

## 🤝 Contributing

Contributions are welcome! Feel free to:

- Report bugs
- Suggest new features
- Submit pull requests

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) for details.

## 📚 Third-Party Libraries

MangaOne is built on top of these amazing open-source libraries:

### Core Dependencies

- **[React](https://github.com/facebook/react)** (MIT) - UI framework
- **[Electron](https://github.com/electron/electron)** (MIT) - Desktop application framework
- **[TypeScript](https://github.com/microsoft/TypeScript)** (Apache-2.0) - Type-safe JavaScript
- **[Vite](https://github.com/vitejs/vite)** (MIT) - Build tool and dev server

### Image Processing & Archive Handling

- **[browser-image-compression](https://github.com/Donaldcwl/browser-image-compression)** (MIT) - Client-side image compression
- **[JSZip](https://github.com/Stuk/jszip)** (MIT/GPL-3.0) - ZIP file creation and manipulation

### UI & Animation

- **[Framer Motion](https://github.com/framer/motion)** (MIT) - Animation library
- **[Lucide React](https://github.com/lucide-icons/lucide)** (ISC) - Icon set

### Build & Development Tools

- **[electron-builder](https://github.com/electron-userland/electron-builder)** (MIT) - Package and build Electron apps
- **[vite-plugin-electron](https://github.com/electron-vite/vite-plugin-electron)** (MIT) - Vite plugin for Electron
- **[ESLint](https://github.com/eslint/eslint)** (MIT) - Code linting

Special thanks to all the maintainers and contributors of these projects! 🙏

## 🙏 Acknowledgments

- Built for manga and doujinshi enthusiasts
- Special thanks to the open-source community
- Inspired by the need for efficient mobile manga storage

---

<div align="center">

**Made with ❤️ for manga readers everywhere**

[⭐ Star this repo](../../stargazers) | [🐛 Report Bug](../../issues) | [✨ Request Feature](../../issues)

</div>
