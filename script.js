// 1. Get DOM elements and setup Canvas
const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const brushSize = document.getElementById('brushSize');
const sizeValueSpan = document.getElementById('sizeValue');

// Get all drawing tool buttons
const pencilBtn = document.getElementById('pencilBtn'); 
const penBtn = document.getElementById('penBtn'); 
const markerBtn = document.getElementById('markerBtn'); 
const crayonBtn = document.getElementById('crayonBtn'); 

const eraserBtn = document.getElementById('eraserBtn');
const clearBtn = document.getElementById('clearBtn');
const saveBtn = document.getElementById('saveBtn');
const downloadLink = document.getElementById('downloadLink');

// Set the canvas size (Internal resolution)
canvas.width = 800; 
canvas.height = 500;

// Set initial drawing properties
ctx.lineWidth = brushSize.value;
ctx.lineCap = 'round';
ctx.lineJoin = 'round'; 
ctx.strokeStyle = colorPicker.value;
ctx.globalCompositeOperation = 'source-over'; 

let isDrawing = false;
let lastX = 0;
let lastY = 0;
let currentTool = 'pencil'; 

// --- Helper Function to manage active button state ---
function setActiveTool(tool) {
    document.querySelectorAll('.tool-btn').forEach(btn => {
        btn.classList.remove('active-tool');
    });
    if (tool === 'pencil') pencilBtn.classList.add('active-tool');
    if (tool === 'pen') penBtn.classList.add('active-tool');
    if (tool === 'marker') markerBtn.classList.add('active-tool');
    if (tool === 'crayon') crayonBtn.classList.add('active-tool');
    if (tool === 'eraser') eraserBtn.classList.add('active-tool');
}

// Function to convert hex to RGBA with specific opacity (for Marker)
function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// --- Tool Property Functions ---

function setPencilProperties() {
    ctx.globalCompositeOperation = 'source-over'; 
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = colorPicker.value;
    currentTool = 'pencil';
    setActiveTool('pencil');
}

function setPenProperties() {
    ctx.globalCompositeOperation = 'source-over'; 
    ctx.lineCap = 'butt'; // Gives a slightly sharper pen stroke
    ctx.lineJoin = 'miter'; // Gives a sharp corner
    ctx.strokeStyle = colorPicker.value;
    currentTool = 'pen';
    setActiveTool('pen');
}

function setMarkerProperties() {
    ctx.globalCompositeOperation = 'source-over';
    ctx.lineCap = 'square'; // Marker often has a square tip
    ctx.lineJoin = 'bevel'; // Smoother corner blending
    // Use an RGBA color with low opacity (e.g., 0.3) for a marker feel
    ctx.strokeStyle = hexToRgba(colorPicker.value, 0.3);
    currentTool = 'marker';
    setActiveTool('marker');
}

function setCrayonProperties() {
    // 'multiply' darkens overlapping strokes, simulating crayon wax build-up
    ctx.globalCompositeOperation = 'multiply';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = colorPicker.value;
    currentTool = 'crayon';
    setActiveTool('crayon');
}

function setEraserProperties() {
    // 'destination-out' creates transparency
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    currentTool = 'eraser';
    setActiveTool('eraser');
}


// 2. Event Listeners for Controls

// --- COLOR PICKER ---
colorPicker.addEventListener('input', () => {
    // When color changes, re-apply the properties for the current drawing tool
    if (currentTool === 'marker') {
        setMarkerProperties(); 
    } else if (currentTool === 'pencil') {
        setPencilProperties();
    } else if (currentTool === 'pen') {
        setPenProperties();
    } else if (currentTool === 'crayon') {
        setCrayonProperties();
    } else {
        // If eraser was selected, switch back to pencil
        setPencilProperties();
    }
});

// --- BRUSH SIZE SLIDER ---
brushSize.addEventListener('input', () => {
    ctx.lineWidth = brushSize.value;
    sizeValueSpan.textContent = brushSize.value;
    
    // Re-apply tool properties to maintain stroke style (e.g., RGBA or composite mode)
    if (currentTool === 'marker') {
        setMarkerProperties(); 
    } else if (currentTool === 'crayon') {
        setCrayonProperties(); 
    } else if (currentTool === 'pencil') {
        setPencilProperties();
    } else if (currentTool === 'pen') {
        setPenProperties();
    } else if (currentTool === 'eraser') {
        setEraserProperties();
    }
});


// --- TOOL BUTTON LISTENERS ---
pencilBtn.addEventListener('click', setPencilProperties);
penBtn.addEventListener('click', setPenProperties);
markerBtn.addEventListener('click', setMarkerProperties);
crayonBtn.addEventListener('click', setCrayonProperties);
eraserBtn.addEventListener('click', setEraserProperties);


// --- CLEAR ALL ---
clearBtn.addEventListener('click', () => {
    ctx.globalCompositeOperation = 'source-over'; 
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Revert to Pencil tool after clearing
    setPencilProperties();
});

// --- DOWNLOAD BUTTON ---
saveBtn.addEventListener('click', () => {
    const dataURL = canvas.toDataURL('image/png');
    downloadLink.href = dataURL;
    downloadLink.download = `Drawing_from_My_HG_${new Date().toLocaleDateString()}.png`;
    alert("💖 Your drawing has been saved! You can now send the downloaded image (Drawing_from_My_HG...) to your HB! 💖");
    downloadLink.click();
});


// 3. Drawing Functions
function draw(e) {
    if (!isDrawing) return; 

    // Get touch point for mobile
    if (e.touches && e.touches.length === 1) {
        e.preventDefault(); 
        e = e.touches[0]; 
    } else if (e.touches) {
        isDrawing = false;
        return;
    }
    
    // *** COORDINATE FIX: Calculate true coordinates based on canvas scaling ***
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    // Calculate the corrected coordinates
    let currentX = (e.clientX - rect.left) * scaleX; 
    let currentY = (e.clientY - rect.top) * scaleY; 
    // *** END COORDINATE FIX ***

    
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();
    
    // Update the last position using corrected coordinates
    [lastX, lastY] = [currentX, currentY];
}

function startDrawing(e) {
    isDrawing = true;
    
    // Get touch point for mobile and prevent scrolling
    if (e.touches) {
        e.preventDefault();
        e = e.touches[0]; 
    }

    // *** COORDINATE FIX: Calculate true coordinates based on canvas scaling ***
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    // Calculate the corrected start position
    let startX = (e.clientX - rect.left) * scaleX; 
    let startY = (e.clientY - rect.top) * scaleY; 
    // *** END COORDINATE FIX ***
    
    // Set initial position using corrected coordinates
    [lastX, lastY] = [startX, startY];
}

function stopDrawing() {
    isDrawing = false;
}

// 4. Mouse and Touch Event Listeners 
// Mouse events (for desktop)
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing); 

// Touch events (for mobile/tablet use)
canvas.addEventListener('touchstart', startDrawing);
canvas.addEventListener('touchmove', draw);
canvas.addEventListener('touchend', stopDrawing);

// Set initial active tool on load
setPencilProperties();
