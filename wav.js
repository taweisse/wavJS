// WAV file generation, download & playback library.

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

	// Class to manage byte arrays for WAV data.
	function _Uint8Vector(initalLength) {
		let _data = new Uint8Array(initalLength)
		let _size = 0

		// Resizes the internal UInt8Array by creating a new one and copying
		// elements from the old.
		let _resizeArray = (newSize) => {
			// Sanity check.
			if (newSize === _data.length) {
				return
			}

			// Copy all elements into the new array.
			let newArr = new Uint8Array(newSize)
			let dataStop = newSize > _data.length ? _data.length : newSize 
			for (let i = 0; i < dataStop; i++) {
				newArr[i] = _data[i]
			}

			_data = newArr
		}

		// Returns the next power of 2 greater than the given integer.
		let _nextPowerOf2 = (n) => {
			let count = 0
			while (n !== 0) {
				n >>= 1
				count += 1
			}
			return 1 << count
		}

		return ({
			writeBuffer: () => {
				return _data.slice(0, _size)
			},

			// Append data to the vector.
			appendData: (data, numBytes) => {
				if (! numBytes) {
					numBytes = data.length
				}

				// Resize the array to hold the new data if necessary.
				if (_size + numBytes > _data.length) {
					_resizeArray(_nextPowerOf2(_data.length))
				}

				// Add the data to the end.
				if (Number.isInteger(data)) {
					// Integers are stored in little endian.
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

			// Insert data at a particular index in the vector.
			insertData: (index, data, numBytes) => {
				if (! numBytes) {
					numBytes = data.length
				}
				
				// Resize the array to hold the new data if necessary.
				if (index + numBytes > _data.length) {
					_resizeArray(_nextPowerOf2(_data.length))
				}
				
				// Overwrite the data at the given index.
				if (Number.isInteger(data)) {
					// Integers are stored in little endian.
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

	// Assign defaults. Maybe we'll make these dynamic later.
	let _bpc = 2

	// Write WAV header information.
	let _dataSize = 0
	let _data = new _Uint8Vector(44)
	_data.appendData('RIFF')          // Chunk ID.
	_data.appendData(0, 4)            // Chunk size. (Filesize - 8)
	_data.appendData('WAVE')          // Format.
	_data.appendData('fmt ')          // Sub chunk 1 ID. 
	_data.appendData(16, 4)           // Sub chunk 1 size. (16 = PCM)
	_data.appendData(1, 2)            // Audio format. (1 = PCM)
	_data.appendData(_numChannels, 2) // Number of channels.
	_data.appendData(_sampleRate, 4)  // Sample rate.
	_data.appendData(_sampleRate * _numChannels * _bpc, 4) // Byte rate.
	_data.appendData(_numChannels * _bpc, 2)               // Block align.
	_data.appendData(_bpc * 8, 2)     // Bits per sample.
	_data.appendData('data')          // Sub chunk 2 ID.
	_data.appendData(0, 4)            // Sub chunk 2 size.

	//-------------------------------------------------------------------------
	// Member Function Definitions
	//-------------------------------------------------------------------------

	return ({
		// Get the sample rate for this WAV object.
		getSampleRate: () => {
			return _sampleRate
		},

		// Get the channel count for this WAV object.
		getChannelCount: () => {
			return _numChannels
		},

		/**
		 * Appends audio samples to the WAV file.
		 * 
		 * @member
		 * @param {Float32Array} samples 
		 */
		addSamples: (samples) => {
			// Ensure samples are in as many arrays as there are channels.
			if (! Array.isArray(samples)) {
				throw new Error('invalid data format')
			} else if (samples.length !== _numChannels) {
				throw new Error('invalid data format')
			}
			
			// Ensure each channel is its own sample array.
			for (let i = 0; i < _numChannels; i++) {
				if (samples[i].constructor !== Float32Array) {
					throw new Error('invalid data format')
				}
			}

			// Ensure stereo samples are the same length.
			if (_numChannels === 2 && samples[0].length !== samples[1].length) {
				throw new Error('invalid data format')
			}

			// Add samples one by one.
			if (_numChannels == 1) {
				for (let i = 0; i < samples[0].length; i++) {
					let samp = Math.round(samples[0][i] * 32767)
					_data.appendData(samp, _bpc)
				}
			} else {
				for (let i = 0; i < samples[0].length; i++) {
					let samp1 = Math.round(samples[0][i] * 32767)
					let samp2 = Math.round(samples[1][i] * 32767)
					_data.appendData(samp1, _bpc)
					_data.appendData(samp2, _bpc)
				}
			}
			_dataSize += _numChannels * _bpc * samples[0].length
		},

		download: (filename) => {
			// Update the file size.
			_data.insertData(4, 36 + _dataSize, 4)
			_data.insertData(40, _dataSize, 4)

			// Create a downloadable blob & object URL.
			let blob = new Blob([_data.writeBuffer()], {
				type: 'application/octet-stream'
			})
			let url = window.URL.createObjectURL(blob)

			// Download the blob.
			let a = document.createElement('a')
			a.href = url
			a.download = filename
			document.body.appendChild(a)
			a.style = 'display: none'
			a.click()
			a.remove()

			// Destory the object URL.
			setTimeout(() => {
				return window.URL.revokeObjectURL(url)
			}, 1000)
		},

		writeBuffer: () => {
			// Update the file size.
			_data.insertData(4, 36 + _dataSize, 4)
			_data.insertData(40, _dataSize, 4)

			return _data.writeBuffer()
		}
	})
}
