# PDF to JSON Converter

A simple web application that converts PDF files to JSON format. Upload a PDF file and get the extracted text and metadata in a structured JSON format.

## Features

- Drag and drop PDF file upload
- Preview the extracted JSON with syntax highlighting
- Edit the JSON output directly
- Copy JSON to clipboard
- Download JSON file
- Responsive design that works on desktop and mobile

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

## Installation

1. Clone the repository or download the source code
2. Navigate to the project directory
3. Install the dependencies:

```bash
npm install
```

## Usage

1. Start the server:

```bash
node server.js
```

2. Open your web browser and navigate to `http://localhost:3000`
3. Drag and drop a PDF file or click to select one
4. Click "Convert to JSON" to process the file
5. View, edit, copy, or download the resulting JSON

## How It Works

The application uses the following technologies:

- **Backend**: Node.js with Express.js
- **PDF Processing**: pdf-parse library
- **Frontend**: Vanilla JavaScript with modern ES6+ features
- **Styling**: Custom CSS with responsive design

## API Endpoints

- `POST /convert` - Accepts a PDF file and returns the extracted JSON data

## Customization

You can customize the JSON output by modifying the server-side code in `server.js`. The current implementation extracts:

- Raw text content
- PDF metadata
- Number of pages
- Document information

## License

This project is open source and available under the [MIT License](LICENSE).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
