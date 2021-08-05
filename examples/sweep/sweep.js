// Generates a sweeping sine wave between 2 endpoint frequencies, and from left
// to right channel.

'use strict'

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

generateBtn.addEventListener('click', () => {
	// Get current sweep parameters.
	let startFreq = startFreqInput.value
	let endFreq = endFreqInput.value
	let duration = durationInput.value

	// Generate a sweep.
	let sweep = generateSweep(startFreq, endFreq, duration)
	sweep.download('sweep.wav')
})
