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
		
		// Determine how much of the sample should go to the R & L channels.
		let volL = Math.pow((1 - pan) / 2, 2)
		let volR = Math.pow((pan + 1) / 2, 2)

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

let sweep = generateSweep(1000, 3000, 5)
sweep.download('sweep.wav')
