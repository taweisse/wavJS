# WAV.js - JavaScript WAV Generation & Playback Library

`WAV.js` is a small JavaScript library for constructing & playing back PCM WAV files right inside the browser. It is certainly not the first library of its kind, nor is it as fully featured as many alternatives.  

*Why develop it then?*

Discounting my own stubbornness, many projects do not need all of the features that come with a heavyweight audio library. Instead, they simply need to generate and play short sounds from audio samples. This is exactly what `WAV.js` aims to accomplish, and nothing more. The API is very straightforward and has only a few exposed methods. WAV files are limited by up to 2 16-bit channels at a maximum of 96000 samples per second, which is more than acceptable for most applications.

## API Spec
Getting up and running with `WAV.js` is extremely simple:
1. Create a new `WAV` object with a specified sample rate and channel count. Sample rates up to 96000 samples per second are supported in either mono or stereo.
	
	```
	let wav = new WAV(44100, 2)
	```
	
2. Add audio samples. For simplicity (and to handle varying bit-depth in the future), samples are passed as `Float32Array` arrays with sample values in `[-1, 1]`.

	```
	let channelR = new Float32Array([-1, 0, 1, 0])
	let channelL = new Float32Array([0, 1, 0, -1])
	wav.addSamples([channelR, channelL])
	```
	
3. Play or download the file. Play, pause, and stop functionality is supported, or a download prompt can be launched. As samples are added to the file, it is automatically regenerated on any call to `play` or `download`.
	
	```
	wav.play()
	wav.download('sound.wav')
	```

Several [examples](examples/) are provided to show `WAV.js` in action in much greater detail.
