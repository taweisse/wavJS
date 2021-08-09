// Generates a tone using a custom waveform drawn on an HTML5 canvas element.

'use strict'

// Generates a waveform based on what has been drawn on the canvas.
function generateWaveform() {

}

// UI setup.
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
