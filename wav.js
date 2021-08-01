// WAV generation & playback library.

'use strict'

/**
 * 
 * 
 * @constructor
 * @param {number} sampleRate  Sample rate in samples per second. Integers
 *                              between 1 and 96000 are supported.
 * @param {number} numChannels The number of channels. Must be an integer.
 *                              1 or 2 channels are supported.
 */
WAV = (sampleRate, numChannels) => {
    // Sanity check.
    if (! Number.isInteger(sampleRate) || ! Number.isInteger(numChannels)) {
        throw new Error('sample rate & channel count must be integers')
    }
    
    // Assign sample rate.
    if (sampleRate < 1 || sampleRate > 96000) {
        throw new Error('unsupported sample rate')
    } 
    let _sampleRate = sampleRate

    // Assign channel count.
    if (numChannels < 1 || numChannels > 2) {
        throw new Error('unsupported number of channels')
    }
    let _numChannels = numChannels

    // Set up a WAV data buffer & a sample array for each channel.
    let _wavData = new Uint8Array()
    let _samples = []
    for (let i = 0; i < this.numChannels; i++) {
        _samples[i] = new Uint16Array()
    }

    // Member function definitions.
    return ({
        // Get the sample rate for this WAV object.
        getSampleRate: () => {
            return _sampleRate
        },

        // Get the channel count for this WAV object.
        getChannelCount: () => {
            return _numChannels
        },

        // 
        addSamples: () => {

        }
    })
}

// TESTING:
// ----------------------------------------------------------------------------
let context = new AudioContext()

// function playByteArray()
