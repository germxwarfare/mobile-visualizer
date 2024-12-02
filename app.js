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

// Attach an Analyser node to the lead synth
const analyser = new Tone.Analyser("waveform", 1024);
leadSynth.connect(analyser);

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

// Update tempo display and handle tempo changes
const tempoSlider = document.getElementById("tempo-slider");
const tempoValueDisplay = document.getElementById("tempo-value");
tempoSlider.addEventListener("input", (e) => {
    tempo = parseInt(e.target.value);
    tempoValueDisplay.textContent = `${tempo} BPM`;
});

// Circular waveform visualization
function visualize() {
    requestAnimationFrame(visualize);

    // Get waveform data from the analyser
    const waveform = analyser.getValue();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;

    // Translate to the center of the canvas
    ctx.translate(canvas.width / 2, canvas.height / 2);

    ctx.beginPath();
    for (let i = 0; i < waveform.length; i++) {
        const angle = (i / waveform.length) * 2 * Math.PI;
        const radius = map(waveform[i], -1, 1, 100, 150); // Map amplitude to radius
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.closePath();
    ctx.stroke();

    // Reset transformation
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

// Utility function to map a value
function map(value, inMin, inMax, outMin, outMax) {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

// Play a note
function playNote(note) {
    if (Tone.context.state !== "running") {
        console.log("Audio context not running. Waiting for interaction...");
        return;
    }

    const duration = `${60 / tempo}s`; // Use tempo for note duration
    leadSynth.triggerAttackRelease(note, duration);
    bassSynth.triggerAttackRelease(Tone.Frequency(note).transpose(-12), duration);
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
    currentScale = scales[e.target.value]; // Update the current scale dynamically
    console.log(`Scale changed to: ${e.target.value}`);
});

// On-screen button interaction
const noteButtons = document.querySelectorAll(".note-button");
noteButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
        const note = currentScale[index % currentScale.length]; // Match the button to the current scale
        playNote(note);
    });
});

// Mobile audio activation
document.getElementById("enable-audio").addEventListener("click", () => {
    Tone.start().then(() => {
        console.log("Audio context started!");
        alert("Audio is ready! Press keys or use buttons to play.");
    }).catch((err) => {
        console.error("Error starting audio:", err);
        alert("Failed to start audio context.");
    });
});

// Start the visualization loop
visualize();
