document.addEventListener('DOMContentLoaded', () => {
    // Configure PDF.js worker
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    // DOM Elements
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const fileInfo = document.getElementById('fileInfo');
    const convertBtn = document.getElementById('convertBtn');
    const copyBtn = document.getElementById('copyBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const toggleViewBtn = document.getElementById('toggleViewBtn');
    const jsonOutput = document.getElementById('jsonOutput');
    const jsonTextarea = document.getElementById('jsonTextarea');
    const loadingOverlay = document.getElementById('loadingOverlay');
    
    let currentFile = null;
    let jsonData = null;
    let isEditView = false;

    // Event Listeners
    dropZone.addEventListener('click', () => fileInput.click());
    
    fileInput.addEventListener('change', handleFileSelect);
    
    // Drag and Drop Events
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });
    
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });
    
    dropZone.addEventListener('drop', handleDrop, false);
    
    // Button Events
    convertBtn.addEventListener('click', convertToJson);
    copyBtn.addEventListener('click', copyToClipboard);
    downloadBtn.addEventListener('click', downloadJson);
    toggleViewBtn.addEventListener('click', toggleView);
    
    // Prevent default drag behaviors
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    // Highlight drop zone when dragging over
    function highlight() {
        dropZone.classList.add('drag-over');
    }
    
    // Remove highlight when leaving drop zone
    function unhighlight() {
        dropZone.classList.remove('drag-over');
    }
    
    // Handle dropped files
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (files.length) {
            handleFiles(files);
        }
    }
    
    // Handle file selection via input
    function handleFileSelect(e) {
        const files = e.target.files;
        if (files.length) {
            handleFiles(files);
        }
    }
    
    // Process selected files
    function handleFiles(files) {
        const file = files[0];
        
        // Check if file is PDF
        if (file.type !== 'application/pdf') {
            alert('Please upload a valid PDF file.');
            return;
        }
        
        // Update UI
        currentFile = file;
        fileInfo.textContent = `Selected: ${file.name} (${formatFileSize(file.size)})`;
        convertBtn.disabled = false;
        
        // Reset previous results
        resetResults();
    }
    
    // Convert PDF to JSON using client-side PDF.js
    async function convertToJson() {
        if (!currentFile) return;
        
        try {
            // Show loading overlay
            loadingOverlay.style.display = 'flex';
            
            // Read file as ArrayBuffer
            const arrayBuffer = await currentFile.arrayBuffer();
            
            // Load PDF using PDF.js
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            
            const result = {
                filename: currentFile.name,
                size: currentFile.size,
                pages: pdf.numPages,
                metadata: {},
                text: '',
                pageTexts: []
            };
            
            // Get metadata
            try {
                const metadata = await pdf.getMetadata();
                result.metadata = {
                    title: metadata.info?.Title || '',
                    author: metadata.info?.Author || '',
                    subject: metadata.info?.Subject || '',
                    creator: metadata.info?.Creator || '',
                    producer: metadata.info?.Producer || '',
                    creationDate: metadata.info?.CreationDate || '',
                    modificationDate: metadata.info?.ModDate || ''
                };
            } catch (metaError) {
                console.warn('Could not extract metadata:', metaError);
            }
            
            // Extract text from all pages
            let fullText = '';
            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                try {
                    const page = await pdf.getPage(pageNum);
                    const textContent = await page.getTextContent();
                    const pageText = textContent.items.map(item => item.str).join(' ');
                    result.pageTexts.push({
                        page: pageNum,
                        text: pageText
                    });
                    fullText += pageText + '\n';
                } catch (pageError) {
                    console.warn(`Error extracting text from page ${pageNum}:`, pageError);
                    result.pageTexts.push({
                        page: pageNum,
                        text: '',
                        error: pageError.message
                    });
                }
            }
            
            result.text = fullText.trim();
            jsonData = result;
            
            // Display the JSON
            displayJson(result);
            
            // Enable buttons
            copyBtn.disabled = false;
            downloadBtn.disabled = false;
            toggleViewBtn.disabled = false;
            
        } catch (error) {
            console.error('Conversion error:', error);
            alert(`Error converting PDF: ${error.message}`);
        } finally {
            // Hide loading overlay
            loadingOverlay.style.display = 'none';
        }
    }
    
    // Display JSON in the UI
    function displayJson(data) {
        const jsonString = JSON.stringify(data, null, 2);
        jsonOutput.textContent = jsonString;
        jsonTextarea.value = jsonString;
        
        // Apply syntax highlighting
        jsonOutput.innerHTML = syntaxHighlight(jsonString);
    }
    
    // Toggle between pretty and edit views
    function toggleView() {
        isEditView = !isEditView;
        
        if (isEditView) {
            jsonOutput.classList.add('hidden');
            jsonTextarea.classList.remove('hidden');
            toggleViewBtn.textContent = 'Pretty View';
        } else {
            // Update the JSON output with any changes from the textarea
            try {
                const parsedJson = JSON.parse(jsonTextarea.value);
                jsonData = parsedJson;
                displayJson(parsedJson);
            } catch (e) {
                alert('Invalid JSON. Please check your input.');
                return;
            }
            
            jsonOutput.classList.remove('hidden');
            jsonTextarea.classList.add('hidden');
            toggleViewBtn.textContent = 'Edit JSON';
        }
    }
    
    // Copy JSON to clipboard
    async function copyToClipboard() {
        try {
            const textToCopy = isEditView ? jsonTextarea.value : JSON.stringify(jsonData, null, 2);
            await navigator.clipboard.writeText(textToCopy);
            
            // Show copied feedback
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            
            setTimeout(() => {
                copyBtn.textContent = originalText;
            }, 2000);
            
        } catch (err) {
            console.error('Failed to copy:', err);
            alert('Failed to copy to clipboard');
        }
    }
    
    // Download JSON as a file
    function downloadJson() {
        if (!jsonData) return;
        
        const dataStr = isEditView 
            ? jsonTextarea.value 
            : JSON.stringify(jsonData, null, 2);
            
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = currentFile 
            ? `${currentFile.name.replace(/\.\w+$/, '')}.json` 
            : 'converted.json';
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    // Reset results
    function resetResults() {
        jsonData = null;
        jsonOutput.textContent = 'Upload a PDF file to see the JSON output here...';
        jsonTextarea.value = '';
        
        // Disable buttons
        copyBtn.disabled = true;
        downloadBtn.disabled = true;
        toggleViewBtn.disabled = true;
        
        // Reset view
        if (isEditView) {
            toggleView();
        }
    }
    
    // Helper function to format file size
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    // Helper function for syntax highlighting
    function syntaxHighlight(json) {
        if (typeof json !== 'string') {
            json = JSON.stringify(json, null, 2);
        }
        
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        
        return json.replace(/("(\\.|[^\\"])*"|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, 
            function (match) {
                let cls = 'number';
                if (/^"/.test(match)) {
                    if (/:$/.test(match)) {
                        cls = 'key';
                    } else {
                        cls = 'string';
                    }
                } else if (/true|false/.test(match)) {
                    cls = 'boolean';
                } else if (/null/.test(match)) {
                    cls = 'null';
                }
                return '<span class="' + cls + '">' + match + '</span>';
            }
        );
    }
});
