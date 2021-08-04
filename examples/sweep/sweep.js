// Generates a sweeping sin wave between 2 endpoint frequencies, and from left
// to right channel.

// Setup.
let freq1 = 1000
let freq2 = 3000
let secs = 5
let sampleRate = 44100

// Calculate some things we'll need.
let numSamples = sampleRate * secs
let startInterval = (freq1 * 2 * Math.PI) / sampleRate
let stopInterval = (freq2 * 2 * Math.PI) / sampleRate
let intervalStep = (stopInterval - startInterval) / numSamples
let strengthR = 0;
let strengthL = 1;
let panStep = 1 / numSamples

// Generate samples for an ever-changing frequency.
let sampR = new Float32Array(numSamples)
let sampL = new Float32Array(numSamples)
let curInterval = startInterval
let curAngle = 0
for (let i = 0; i < numSamples; i++) {
	curSample = Math.sin(curAngle)
	
	sampR[i] = curSample * strengthR
	sampL[i] = curSample * strengthL
	
	curAngle += curInterval
	curInterval += intervalStep
	strengthR += panStep
	strengthL -= panStep
}

// Generate the WAV.
let sweep = new WAV(sampleRate, 2)
sweep.addSamples([sampR, sampL])
sweep.download('sweep.wav')
