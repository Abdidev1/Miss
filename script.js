// 1. Get DOM elements and setup Canvas
const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const brushSize = document.getElementById('brushSize');
const sizeValueSpan = document.getElementById('sizeValue');

// Set default picker to a cool purple/indigo if it's currently pink
if (colorPicker.value === '#F542A1' || colorPicker.value === '#ffc1e3') {
    colorPicker.value = '#764ba2'; 
}

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
    // Note: ensure your HTML buttons have the class 'control-btn' or 'tool-btn'
    document.querySelectorAll('.control-btn').forEach(btn => {
        btn.classList.remove('active-tool');
    });
    
    const toolMap = {
        'pencil': pencilBtn,
        'pen': penBtn,
        'marker': markerBtn,
        'crayon': crayonBtn,
        'eraser': eraserBtn
    };

    if (toolMap[tool]) toolMap[tool].classList.add('active-tool');
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
    ctx.lineCap = 'butt'; 
    ctx.lineJoin = 'miter'; 
    ctx.strokeStyle = colorPicker.value;
    currentTool = 'pen';
    setActiveTool('pen');
}

function setMarkerProperties() {
    ctx.globalCompositeOperation = 'source-over';
    ctx.lineCap = 'square'; 
    ctx.lineJoin = 'bevel'; 
    ctx.strokeStyle = hexToRgba(colorPicker.value, 0.3);
    currentTool = 'marker';
    setActiveTool('marker');
}

function setCrayonProperties() {
    ctx.globalCompositeOperation = 'multiply';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = colorPicker.value;
    currentTool = 'crayon';
    setActiveTool('crayon');
}

function setEraserProperties() {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    currentTool = 'eraser';
    setActiveTool('eraser');
}

// 2. Event Listeners for Controls
colorPicker.addEventListener('input', () => {
    const toolActions = {
        'marker': setMarkerProperties,
        'pencil': setPencilProperties,
        'pen': setPenProperties,
        'crayon': setCrayonProperties
    };
    (toolActions[currentTool] || setPencilProperties)();
});

brushSize.addEventListener('input', () => {
    ctx.lineWidth = brushSize.value;
    sizeValueSpan.textContent = brushSize.value;
    
    const toolActions = {
        'marker': setMarkerProperties,
        'crayon': setCrayonProperties,
        'pencil': setPencilProperties,
        'pen': setPenProperties,
        'eraser': setEraserProperties
    };
    if (toolActions[currentTool]) toolActions[currentTool]();
});

pencilBtn.addEventListener('click', setPencilProperties);
penBtn.addEventListener('click', setPenProperties);
markerBtn.addEventListener('click', setMarkerProperties);
crayonBtn.addEventListener('click', setCrayonProperties);
eraserBtn.addEventListener('click', setEraserProperties);

clearBtn.addEventListener('click', () => {
    ctx.globalCompositeOperation = 'source-over'; 
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setPencilProperties();
});

saveBtn.addEventListener('click', () => {
    const dataURL = canvas.toDataURL('image/png');
    downloadLink.href = dataURL;
    downloadLink.download = `Sketch_${new Date().getTime()}.png`;
    // Removed the "HB/HG" pink message for something cleaner
    alert("✨ Sketch saved successfully!");
    downloadLink.click();
});

// 3. Drawing Functions
function getCoordinates(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    let clientX, clientY;
    if (e.touches) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }

    return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
    };
}

function draw(e) {
    if (!isDrawing) return; 
    if (e.touches && e.touches.length > 1) return;
    if (e.touches) e.preventDefault();

    const coords = getCoordinates(e);
    
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
    
    [lastX, lastY] = [coords.x, coords.y];
}

function startDrawing(e) {
    isDrawing = true;
    if (e.touches) e.preventDefault();
    const coords = getCoordinates(e);
    [lastX, lastY] = [coords.x, coords.y];
}

function stopDrawing() {
    isDrawing = false;
}

// 4. Mouse and Touch Event Listeners 
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing); 

canvas.addEventListener('touchstart', startDrawing, {passive: false});
canvas.addEventListener('touchmove', draw, {passive: false});
canvas.addEventListener('touchend', stopDrawing);

// Set initial active tool on load
setPencilProperties();
