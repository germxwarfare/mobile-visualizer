// Initialize Tone.js Synthesizers
const leadSynth = new Tone.Synth({
    oscillator: {
        type: "square" // Classic 8-bit sound
    }
}).toDestination();

const bassSynth = new Tone.Synth({
    oscillator: {
        type: "triangle" // Rich bass sound
    },
    envelope: {
        attack: 0.1,
        decay: 0.2,
        sustain: 0.5,
        release: 0.8
    }
}).toDestination();

// Canvas Setup
const canvas = document.getElementById("visualizer");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth * 0.8;
canvas.height = 300;

// Scales definition
const scales = {
    major: ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"],
    minor: ["C4", "D4", "D#4", "F4", "G4", "G#4", "A#4", "C5"],
    pentatonic: ["C4", "D4", "E4", "G4", "A4", "C5"],
    chromatic: [
        "C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4"
    ]
};

// State variables
let currentScale = scales.major;
let tempo = 120;

// Update tempo display
const tempoSlider = document.getElementById("tempo-slider");
const tempoValueDisplay = document.getElementById("tempo-value");
tempoSlider.addEventListener("input", (e) => {
    tempo = e.target.value;
    tempoValueDisplay.textContent = `${tempo} BPM`;
});

// Visualize function
function visualize(note) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Ripple effect
    const rippleX = Math.random() * canvas.width;
    const rippleY = Math.random() * canvas.height;
    const rippleRadius = Math.random() * 50 + 20;

    ctx.beginPath();
    ctx.arc(rippleX, rippleY, rippleRadius, 0, Math.PI * 2);
    ctx.fillStyle = `hsl(${Math.random() * 360}, 70%, 50%)`;
    ctx.fill();

    // Bars
    const barCount = 50;
    for (let i = 0; i < barCount; i++) {
        const barWidth = canvas.width / barCount;
        const barHeight = Math.random() * canvas.height;
        const barX = i * barWidth;

        ctx.fillStyle = `hsl(${(360 / barCount) * i}, 100%, 50%)`;
        ctx.fillRect(barX, canvas.height - barHeight, barWidth - 2, barHeight);
    }

    // Display the note
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(`Playing: ${note}`, canvas.width / 3, canvas.height / 2);
}

// Play a note
function playNote(note) {
    if (Tone.context.state !== "running") {
        console.log("Audio context not running. Waiting for interaction...");
        return;
    }

    // Calculate note duration based on tempo
    const duration = `${60 / tempo}s`;

    // Play both lead and bass
    leadSynth.triggerAttackRelease(note, duration);
    bassSynth.triggerAttackRelease(Tone.Frequency(note).transpose(-12), duration);

    visualize(note);
}

// Keyboard interaction
document.addEventListener("keydown", (e) => {
    const keyToNote = {
        a: currentScale[0],
        s: currentScale[1],
        d: currentScale[2],
        f: currentScale[3],
        g: currentScale[4],
        h: currentScale[5],
        j: currentScale[6],
        k: currentScale[7]
    };

    const note = keyToNote[e.key];
    if (note) {
        playNote(note);
    }
});

// Scale selector
const scaleSelector = document.getElementById("scale-selector");
scaleSelector.addEventListener("change", (e) => {
    currentScale = scales[e.target.value];
    console.log(`Scale changed to: ${e.target.value}`);
});

// Mobile audio activation
function enableAudio() {
    const startAudio = () => {
        Tone.start().then(() => {
            console.log("Audio context started!");
            alert("Audio is ready! Press keys or adjust controls to play.");
        }).catch((err) => {
            console.error("Error starting audio:", err);
            alert("Failed to start audio context.");
        });
    };

    document.body.addEventListener("touchstart", startAudio, { once: true });
    document.body.addEventListener("click", startAudio, { once: true });
}

// Enable audio on page load
enableAudio();
