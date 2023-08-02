// Generates a tone using a custom waveform drawn on an HTML5 canvas element.

'use strict'

// Input validation.
setInterval(() => {
	if (freqInput.value.match(/^[0-9]+$/g)) {
		freqInput.classList.remove('invalid')
	} else {
		freqInput.classList.add('invalid')
	}
}, 100)

// ----------------------------------------------------------------------------
// Waveform Generation.
// ----------------------------------------------------------------------------

// Reads the raw data from the canvas.
function getCanvasData() {

}

// ----------------------------------------------------------------------------
// Canvas Drawing.
// ----------------------------------------------------------------------------

const canvas = document.getElementById('waveformCanvas')
const offset = canvas.getBoundingClientRect()
const ctx = canvas.getContext('2d')
ctx.lineCap = 'round'
ctx.lineWidth = 10

let lastMousePos = []
function drawHandler(e) {
	if (lastMousePos.length > 1) {
		lastMousePos.shift()
	}
	lastMousePos.push({x: e.clientX - offset.left, y: e.clientY - offset.top})

	if (lastMousePos.length > 1) {
		ctx.beginPath()
		ctx.moveTo(lastMousePos[0].x, lastMousePos[0].y)
		ctx.lineTo(lastMousePos[1].x, lastMousePos[1].y)
		ctx.stroke()
	} else {
		ctx.beginPath()
		ctx.moveTo(lastMousePos[0].x, lastMousePos[0].y)
		ctx.lineTo(lastMousePos[0].x + 0.1, lastMousePos[0].y + 0.1)
		ctx.stroke()
	}
}

canvas.addEventListener('mousedown', drawHandler)

canvas.addEventListener('mousedown', () => {
	canvas.addEventListener('mousemove', drawHandler)
})

canvas.addEventListener('mouseenter', () => {
	lastMousePos = []
})

document.addEventListener('mouseup', () => {
	canvas.removeEventListener('mousemove', drawHandler)
	lastMousePos = []
})

const clearBtn = document.getElementById('clearBtn')
clearBtn.addEventListener('click', () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height)
})

// ----------------------------------------------------------------------------
// UI Setup
// ----------------------------------------------------------------------------

const waveformCanvas = document.getElementById('waveformCanvas')
const freqInput = document.getElementById('freqInput')
const playStopBtn = document.getElementById('playStopBtn')

let waveform = null
let isPlaying = false

// Play or stop the waveform.
playStopBtn.addEventListener('click', () => {
	// Do nothing if there is no waveform drawn.
	if (! waveform) {
		return
	}

	if (! isPlaying) {
		waveform.play()
		isPlaying = true
		playStopBtn.innerHTML = 'Stop'
	} else {
		waveform.stop()
		isPlaying = false
		playStopBtn.innerHTML = 'Play'
	}
})

// Input validation.
setInterval(() => {
	if (freqInput.value.match(/^[0-9]+$/g)) {
		freqInput.classList.remove('invalid')
	} else {
		freqInput.classList.add('invalid')
	}
}, 100)
