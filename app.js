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

// Play note and visualize on button tap
function playNote(note) {
    synth.triggerAttackRelease(note, "8n");
    visualize(note);
}

// Add event listeners to buttons
const buttons = document.querySelectorAll(".note-button");
buttons.forEach((button) => {
    button.addEventListener("touchstart", (e) => {
        e.preventDefault(); // Prevent default touch behavior
        const note = button.dataset.note;
        playNote(note);
    });

    button.addEventListener("mousedown", () => {
        const note = button.dataset.note;
        playNote(note);
    });
});
