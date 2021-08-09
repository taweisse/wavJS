// Generates a sine wave of a given sample rate, frequency, duration, and
// volume.

'use strict'

// Generate a sine wave of given parameters.
function generateSine(sampleRate, freq, duration, volume) {
	let numSamples = sampleRate * duration
	let interval = (freq * 2 * Math.PI) / sampleRate

	// Generate samples.
	let samples = new Float32Array(numSamples)
	let curAngle = 0
	for (let i = 0; i < numSamples; i++) {
		samples[i] = Math.sin(curAngle)
		curAngle += interval
	}

	let sine = new WAV(sampleRate, 1)
	sine.addSamples([samples])
	return sine
}

// UI setup.
const sampleRateInput = document.getElementById('sampleRateInput')
const freqInput = document.getElementById('freqInput')
const durationInput = document.getElementById('durationInput')
const volumeInput = document.getElementById('volumeInput')
const generateBtn = document.getElementById('generateBtn')
const playPauseBtn = document.getElementById('playPauseBtn')
const stopBtn = document.getElementById('stopBtn')
const resultSection = document.getElementById('result')
const elapsedTime = document.getElementById('elapsedTime')

let sine = null
let isPlaying = false

// Generate a sine wave.
generateBtn.addEventListener('click', () => {
	// Validate inputs.
	if (document.querySelector('.invalid')) {
		return
	}

	// Stop any existing tone.
	if (isPlaying) {
		stopBtn.click()
	}

	let start = performance.now()

	// Get current parameters.
	let sampleRate = parseInt(sampleRateInput.value)
	let freq = parseInt(freqInput.value)
	let duration = parseInt(durationInput.value)
	let volume = parseFloat(volumeInput.value)

	// Generate a sine wave.
	sine = generateSine(sampleRate, freq, duration, volume)
	let end = performance.now()

	// Print the elapsed time.
	elapsedTime.innerHTML = `Generated sine wave in ${Math.round(end - start)} ms`
	resultSection.classList.remove('hidden')
})

// Play or pause the sine wave.
playPauseBtn.addEventListener('click', () => {
	if (! isPlaying) {
		sine.play(() => {
			// Show the correct button state when the sound stops.
			playPauseBtn.classList.replace('pause', 'play')
			isPlaying = false
		})

		isPlaying = true
		playPauseBtn.classList.replace('play', 'pause')
	} else {
		sine.pause()
		isPlaying = false
		playPauseBtn.classList.replace('pause', 'play')
	}
})

// Input validation.
const intInputs = [sampleRateInput, freqInput, durationInput]
const floatInputs = [volumeInput]
setInterval(() => {
	intInputs.forEach((input) => {
		if (input.value.match(/^[0-9]+$/g)) {
			input.classList.remove('invalid')
		} else {
			input.classList.add('invalid')
		}
	})
	floatInputs.forEach((input) => {
		if (input.value.match(/^[0-9]+(\.[0-9]*)?$/g)) {
			input.classList.remove('invalid')
		} else {
			input.classList.add('invalid')
		}
	})
}, 100)
