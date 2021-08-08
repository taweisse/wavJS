// Generates a sweeping sine wave between 2 endpoint frequencies, and from left
// to right channel.

'use strict'

// Generates a tone sweep between two frequencies.
function generateSweep(startFreq, endFreq, duration) {
	const sampleRate = 44100

	// Calculate some things we'll need.
	let numSamples = sampleRate * duration
	let startInterval = (startFreq * 2 * Math.PI) / sampleRate
	let endInterval = (endFreq * 2 * Math.PI) / sampleRate
	let intervalStep = (endInterval - startInterval) / numSamples
	let pan = -1
	let panStep = 2 / numSamples

	// Generate samples at an ever-changing frequency.
	let sampL = new Float32Array(numSamples)
	let sampR = new Float32Array(numSamples)
	let curInterval = startInterval
	let curAngle = 0
	for (let i = 0; i < numSamples; i++) {
		// Generate a sample.
		let curSample = Math.sin(curAngle)
		
		// Pan from left to right channel.
		let volL = (1 - pan) / 2
		let volR = (pan + 1) / 2

		// Add the panned sample to the arrays.
		sampL[i] = curSample * volL
		sampR[i] = curSample * volR

		// Iterate.
		curAngle += curInterval
		curInterval += intervalStep
		pan += panStep
	}

	// Generate the WAV.
	let sweep = new WAV(sampleRate, 2)
	sweep.addSamples([sampL, sampR])
	return sweep;
}

// UI setup.
const startFreqInput = document.getElementById('startFreqInput')
const endFreqInput = document.getElementById('endFreqInput')
const durationInput = document.getElementById('durationInput')
const generateBtn = document.getElementById('generateBtn')
const resultSection = document.getElementById('result')
const playStopBtn = document.getElementById('playStopBtn')
const downloadBtn = document.getElementById('downloadBtn')
const elapsedTime = document.getElementById('elapsedTime')

let sweep = null

generateBtn.addEventListener('click', () => {
	// Validate inputs.
	if (document.querySelector('.invalid')) {
		return
	}
	
	let start = performance.now()

	// Get current sweep parameters.
	let startFreq = startFreqInput.value
	let endFreq = endFreqInput.value
	let duration = durationInput.value

	// Generate a sweep.
	sweep = generateSweep(startFreq, endFreq, duration)
	let end = performance.now()

	// Print the elapsed time.
	elapsedTime.innerHTML = `Generated WAV in ${Math.round(end - start)} ms`
	resultSection.classList.remove('hidden')
})

let isPlaying = false
playStopBtn.addEventListener('click', () => {
	if (! isPlaying) {
		sweep.play()
		isPlaying = true
		playStopBtn.innerHTML = 'Stop'
	} else {
		sweep.stop()
		isPlaying = false
		playStopBtn.innerHTML = 'Play'
	}
})

downloadBtn.addEventListener('click', () => {
	sweep.download('sweep.wav')
})

// Input validation.
const inputs = document.querySelectorAll('input')
setInterval(() => {
	inputs.forEach((input) => {
		if (input.value.match(/^[0-9]+$/g)) {
			input.classList.remove('invalid')
		} else {
			input.classList.add('invalid')
		}
	})
}, 100)
