// 1. Get DOM elements and setup Canvas
const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const brushSize = document.getElementById('brushSize');
const sizeValueSpan = document.getElementById('sizeValue');

// Get NEW tool buttons
const pencilBtn = document.getElementById('pencilBtn'); 
const markerBtn = document.getElementById('markerBtn'); 

const eraserBtn = document.getElementById('eraserBtn');
const clearBtn = document.getElementById('clearBtn');
const saveBtn = document.getElementById('saveBtn');
const downloadLink = document.getElementById('downloadLink');

// Set the canvas size
canvas.width = 800; 
canvas.height = 500;

// Set initial drawing properties
ctx.lineWidth = brushSize.value;
ctx.lineCap = 'round';
ctx.strokeStyle = colorPicker.value;
ctx.globalCompositeOperation = 'source-over'; // Default drawing mode

let isDrawing = false;
let lastX = 0;
let lastY = 0;
let currentTool = 'pencil'; // Track the currently active tool

// --- Helper Function to manage active button state ---
function setActiveTool(tool) {
    // Remove 'active-tool' from all tool buttons
    document.querySelectorAll('.tool-btn').forEach(btn => {
        btn.classList.remove('active-tool');
    });
    // Add 'active-tool' to the currently selected button
    if (tool === 'pencil') pencilBtn.classList.add('active-tool');
    if (tool === 'marker') markerBtn.classList.add('active-tool');
    if (tool === 'eraser') eraserBtn.classList.add('active-tool');
}

// Function to convert hex to RGBA with specific opacity (for Marker)
function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Function to set Marker properties
function setMarkerProperties() {
    // Reset composite operation for normal drawing (but with opacity)
    ctx.globalCompositeOperation = 'source-over';
    // Use an RGBA color with low opacity (e.g., 0.3) for a marker feel
    ctx.strokeStyle = hexToRgba(colorPicker.value, 0.3);
    currentTool = 'marker';
    setActiveTool('marker');
}


// 2. Event Listeners for Controls

// --- COLOR PICKER ---
colorPicker.addEventListener('input', () => {
    // When color changes, switch to Pencil mode or update Marker
    if (currentTool === 'marker') {
        setMarkerProperties(); // Recalculate RGBA color with new hex
    } else {
        ctx.globalCompositeOperation = 'source-over'; 
        ctx.strokeStyle = colorPicker.value;
        currentTool = 'pencil'; // Default to pencil on color change
        setActiveTool('pencil');
    }
});

// --- BRUSH SIZE SLIDER ---
brushSize.addEventListener('input', () => {
    ctx.lineWidth = brushSize.value;
    sizeValueSpan.textContent = brushSize.value;
    
    // Maintain tool state when changing size
    if (currentTool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
    } else if (currentTool === 'marker') {
        setMarkerProperties(); // Ensure stroke style (RGBA) is kept
    } else { // Pencil
        ctx.globalCompositeOperation = 'source-over'; 
        ctx.strokeStyle = colorPicker.value;
    }
});


// --- PENCIL BUTTON ---
pencilBtn.addEventListener('click', () => {
    ctx.globalCompositeOperation = 'source-over'; // Default drawing (opaque)
    ctx.strokeStyle = colorPicker.value; // Solid color
    currentTool = 'pencil';
    setActiveTool('pencil');
});

// --- MARKER BUTTON ---
markerBtn.addEventListener('click', setMarkerProperties);


// --- ERASER BUTTON ---
eraserBtn.addEventListener('click', () => {
    // 'destination-out' removes existing pixels where the new line is drawn (true erase)
    ctx.globalCompositeOperation = 'destination-out';
    currentTool = 'eraser';
    setActiveTool('eraser');
});


// --- CLEAR ALL ---
clearBtn.addEventListener('click', () => {
    ctx.globalCompositeOperation = 'source-over'; 
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Revert to Pencil tool after clearing
    currentTool = 'pencil';
    setActiveTool('pencil');
});

// --- DOWNLOAD BUTTON ---
saveBtn.addEventListener('click', () => {
    // Convert the canvas content to a PNG data URL
    const dataURL = canvas.toDataURL('image/png');

    // Set the link's href to the data URL
    downloadLink.href = dataURL;

    // Set a file name for the downloaded image
    downloadLink.download = `Drawing_from_My_HG_${new Date().toLocaleDateString()}.png`;
        
    alert("💖 Your drawing has been saved! You can now send the downloaded image (Drawing_from_My_HG...) to your HB! 💖");
        
    // Simulate a click on the hidden link to trigger the download
    downloadLink.click();
});


// 3. Drawing Functions
function draw(e) {
    if (!isDrawing) return; 

    // Prevent scrolling on mobile devices while drawing
    e.preventDefault(); 
        
    // Get the correct coordinates relative to the canvas
    const rect = canvas.getBoundingClientRect();
    let currentX = e.clientX - rect.left;
    let currentY = e.clientY - rect.top;

    // Start drawing a line
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();

    // Update the last position
    [lastX, lastY] = [currentX, currentY];
}

function startDrawing(e) {
    isDrawing = true;

    // Get the correct coordinates relative to the canvas
    const rect = canvas.getBoundingClientRect();
    let startX = e.clientX - rect.left;
    let startY = e.clientY - rect.top;

    // Set initial position
    [lastX, lastY] = [startX, startY];
}

function stopDrawing() {
    isDrawing = false;
}

// 4. Mouse and Touch Event Listeners
// Mouse events
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing); 

// Touch events (for mobile/tablet use)
canvas.addEventListener('touchstart', (e) => startDrawing(e.touches[0]));
canvas.addEventListener('touchmove', (e) => draw(e.touches[0]));
canvas.addEventListener('touchend', stopDrawing);

// Set initial active tool on load
setActiveTool('pencil');
