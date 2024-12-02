// Initialize Tone.js Synth
const synth = new Tone.Synth({
    oscillator: {
        type: "square" // Classic 8-bit sound
    }
}).toDestination();

// Canvas Setup
const canvas = document.getElementById("visualizer");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = 300;

// Resize canvas dynamically
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = 300;
});

// Visualization function
function visualize(note) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const barWidth = canvas.width / 30;
    const barHeight = Math.random() * canvas.height;
    const barX = Math.random() * canvas.width;
    ctx.fillStyle = `hsl(${Math.random() * 360}, 100%, 50%)`;
    ctx.fillRect(barX, canvas.height - barHeight, barWidth, barHeight);
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(`Playing: ${note}`, canvas.width / 3, canvas.height / 2);
}

// Play a note and visualize it
function playNote(note) {
    if (!Tone.context.state || Tone.context.state !== "running") {
        console.log("Audio context is not running. Waiting for user interaction...");
        return;
    }
    synth.triggerAttackRelease(note, "8n");
    visualize(note);
}

// Add touch/mouse event listeners to buttons
const buttons = document.querySelectorAll(".note-button");
buttons.forEach((button) => {
    button.addEventListener("touchstart", (e) => {
        e.preventDefault();
        const note = button.dataset.note;
        playNote(note);
    });

    button.addEventListener("mousedown", () => {
        const note = button.dataset.note;
        playNote(note);
    });
});

// Add touch interaction for canvas
canvas.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];
    const x = touch.clientX;
    const regionWidth = canvas.width / 8; // Divide canvas into 8 regions
    const noteIndex = Math.floor(x / regionWidth);

    const notes = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"];
    if (noteIndex >= 0 && noteIndex < notes.length) {
        const note = notes[noteIndex];
        playNote(note);
    }
});

// Mobile audio activation
function enableAudio() {
    const startAudio = () => {
        Tone.start().then(() => {
            console.log("Audio context started!");
            alert("Audio is ready! Tap the buttons or canvas to play notes.");
        });
        document.body.rem
