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
function WAV(sampleRate, numChannels) {
	
	//-------------------------------------------------------------------------
	// Constructor Helpers
	//-------------------------------------------------------------------------

	function _Uint8Vector(initalLength) {
		let _data = new Uint8Array(initalLength)
		let _size = 0

		// Resizes the internal UInt8Array by creating a new one and copying
		// elements from the old.
		function _resizeArray(newSize) {
			// Sanity check.
			if (newSize === _data.length) {
				return
			}

			// Copy all elements into the new array.
			newArr = new Uint8Array(newSize)
			dataStop = newSize > _data.length ? _data.length : newSize 
			for (let i = 0; i < dataStop; i++) {
				newArr[i] = _data[i]
			}

			_data = newArr
			_size = newSize
		}

		// Returns the next power of 2 greater than the given integer.
		function _nextPowerOf2(n) {
			let count = 0
			while (n !== 0) {
				n >>= 1
				count += 1
			}
			return 1 << count
		}

		return ({
			getBuffer: function() {
				console.log(_data)
			},

			// Append data to the vector. Integers are stored as with little
			// endianess.
			appendData: function(data, numBytes) {
				// Resize the array to hold the new data if necessary.
				if (! numBytes) {
					numBytes = data.length
				}

				if (_size + numBytes > _data.length) {
					_resizeArray(_nextPowerOf2(_data.length))
				}

				// Add the data to the end.
				if (Number.isInteger(data)) {
					for (let i = 0; i < numBytes; i++) {
						_data[_size + i] = (data >> (i * 8)) & 0xFF
					}
				} else {
					for (let i = 0; i < numBytes; i++) {
						_data[_size + i] = data.charCodeAt(i)
					}
				}

				// Update size.
				_size += numBytes
			},

			// Insert data at a particular index in the vector. Integers are
			// stored with little endianess.
			insertData: function(index, data, numBytes) {
				if (! numBytes) {
					numBytes = data.length
				}
				
				// Resize the array to hold the new data if necessary.
				if (index + numBytes > _data.length) {
					_resizeArray(_nextPowerOf2(_data.length))
				}
				
				// Overwrite the data at the given index.
				if (Number.isInteger(data)) {
					for (let i = 0; i < numBytes; i++) {
						_data[index + i] = (data >> (i * 8)) & 0xFF
					}
				} else {
					for (let i = 0; i < numBytes; i++) {
						_data[index + i] = data.charCodeAt(i)
					}
				}

				// Update size if needed.
				if (index + numBytes > _size) {
					_size = index + numBytes
				}
			}
		}) 
	}

	//-------------------------------------------------------------------------
	// Member Variable Assignemnt
	//-------------------------------------------------------------------------

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

	// Write WAV header information.
	let wavHeader = new _Uint8Vector(44)
	wavHeader.appendData('RIFF')             // Chunk ID.
	wavHeader.appendData(28, 4)              // Chunk size.
	wavHeader.appendData('WAVE')             // Format.
	wavHeader.appendData('fmt ')             // Sub chunk 1 ID. 
	wavHeader.appendData(16, 4)              // Sub chunk 1 size. (16 for PCM)
	wavHeader.appendData(1, 2)               // Audio format. (1 = PCM)
	wavHeader.appendData(numChannels, 2)     // Number of channels.
	wavHeader.appendData(sampleRate, 4)      // Sample rate.
	wavHeader.appendData(sampleRate * numChannels * 2, 4) // Byte rate.
	wavHeader.appendData(numChannels * 2, 2) // Block align.
	wavHeader.appendData(16, 2)              // Bits per sample.
	wavHeader.appendData('data')             // Sub chunk 2 ID.
	wavHeader.appendData(0, 4)               // Sub chunk 2 size.
	
	wavHeader.getBuffer()

	// Set up a sample array for each channel.
	let _samples = []
	for (let i = 0; i < this.numChannels; i++) {
		_samples[i] = new Uint16Array()
	}

	//-------------------------------------------------------------------------
	// Member Function Definitions
	//-------------------------------------------------------------------------

	return ({
		// Get the sample rate for this WAV object.
		getSampleRate: function() {
			return _sampleRate
		},

		// Get the channel count for this WAV object.
		getChannelCount: function() {
			return _numChannels
		},

		// 
		addSamples: function() {

		}
	})
}
