# PDF to JSON Converter

A client-side PDF to JSON converter that works entirely in your browser using PDF.js. No server required!

## Features

- 🚀 **Client-side processing** - No data leaves your browser
- 📄 **Complete PDF parsing** - Extracts text, metadata, and page information
- 🎨 **Modern UI** - Clean, responsive design
- 📱 **Mobile friendly** - Works on all devices
- 🔒 **Privacy focused** - All processing happens locally
- 📋 **Easy sharing** - Copy or download JSON results

## Live Demo

Visit the live demo: [Your GitHub Pages URL]

## Local Development

## Usage

### GitHub Pages (Recommended)

1. Visit the live demo at your GitHub Pages URL
2. Drag and drop a PDF file or click to select one
3. Click "Convert to JSON" to process the file
4. View, edit, copy, or download the resulting JSON

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/yourusername/pdf-to-json-converter.git
cd pdf-to-json-converter
```

2. Open `index.html` in your browser or serve it using a local server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

3. Navigate to `http://localhost:8000`

## JSON Output Format

The converter extracts comprehensive information from your PDF:

```json
{
  "filename": "document.pdf",
  "size": 1024000,
  "pages": 5,
  "metadata": {
    "title": "Document Title",
    "author": "Author Name",
    "subject": "Document Subject",
    "creator": "Creator Application",
    "producer": "PDF Producer",
    "creationDate": "2023-01-01",
    "modificationDate": "2023-01-02"
  },
  "text": "Full document text...",
  "pageTexts": [
    {
      "page": 1,
      "text": "Text from page 1..."
    }
  ]
}
```

## Technology Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **PDF Processing**: [PDF.js](https://mozilla.github.io/pdf.js/) by Mozilla
- **Hosting**: GitHub Pages
- **No Backend Required**: Fully client-side application

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Deployment to GitHub Pages

1. Fork this repository
2. Go to Settings > Pages in your GitHub repository
3. Select "Deploy from a branch" and choose "main"
4. Your site will be available at `https://james-tiger.github.io/pdf-to-json-converter`

## Privacy & Security

- **No data transmission**: All PDF processing happens in your browser
- **No file storage**: Files are processed in memory and not saved anywhere
- **Open source**: Full transparency of the code
- **No tracking**: No analytics or tracking scripts


## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
