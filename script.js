// 1. Get DOM elements and setup Canvas
const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const brushSize = document.getElementById('brushSize');
const sizeValueSpan = document.getElementById('sizeValue');
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

let isDrawing = false;
let lastX = 0;
let lastY = 0;

// 2. Event Listeners for Controls
brushSize.addEventListener('input', () => {
    ctx.lineWidth = brushSize.value;
    sizeValueSpan.textContent = brushSize.value;
});

colorPicker.addEventListener('input', () => {
    ctx.strokeStyle = colorPicker.value;
});

eraserBtn.addEventListener('click', () => {
    // Set color to white (same as background) to simulate erasing
    ctx.strokeStyle = '#ffffff'; 
});

clearBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

saveBtn.addEventListener('click', () => {
    // Convert the canvas content to a PNG data URL
    const dataURL = canvas.toDataURL('image/png');

    // Set the link's href to the data URL
    downloadLink.href = dataURL;

    // Set a file name for the downloaded image
    downloadLink.download = `Drawing_from_My_HG_${new Date().toLocaleDateString()}.png`;
    
    // You can customize the message here!
    alert("💖 Your drawing has been saved! You can now send the downloaded image (Drawing_from_My_HG...) to your HB! 💖");
    
    // Simulate a click on the hidden link to trigger the download
    downloadLink.click();
});

// Revert back to the color picker's color when she changes color or size
colorPicker.addEventListener('input', () => {
    ctx.strokeStyle = colorPicker.value;
});
brushSize.addEventListener('input', () => {
    // Reset to the chosen color in case she was on the eraser
    ctx.strokeStyle = colorPicker.value;
});


// 3. Drawing Functions
function draw(e) {
    if (!isDrawing) return; // Stop the function if they are not moused down

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
canvas.addEventListener('mouseout', stopDrawing); // Stop drawing if mouse leaves the canvas

// Touch events (for mobile/tablet use)
canvas.addEventListener('touchstart', (e) => startDrawing(e.touches[0]));
canvas.addEventListener('touchmove', (e) => draw(e.touches[0]));
canvas.addEventListener('touchend', stopDrawing);
