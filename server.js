const express = require('express');
const multer = require('multer');
const cors = require('cors');
const pdf = require('pdf-parse');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.static('docs'));

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads', { recursive: true });
}

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'docs', 'index.html'));
});

// Handle file upload and conversion
app.post('/convert', upload.single('pdfFile'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const filePath = req.file.path;
        
        // Read the PDF file
        const dataBuffer = fs.readFileSync(filePath);
        
        // Parse PDF
        const data = await pdf(dataBuffer).catch(parseError => {
            console.error('PDF Parsing Error:', parseError);
            throw parseError;
        });
        
        // Basic text extraction (can be enhanced based on specific PDF structure)
        const result = {
            text: data.text,
            metadata: {
                info: data.info || {},
                metadata: data.metadata || {},
                numPages: data.numpages || 0,
                version: data.version || 'Unknown'
            }
        };
        
        // Delete the uploaded file after processing
        fs.unlinkSync(filePath);
        
        res.json(result);
    } catch (error) {
        console.error('Detailed Error processing PDF:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        
        res.status(500).json({ 
            error: 'Error processing PDF', 
            details: error.message 
        });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
