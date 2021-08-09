# WAV.js - JavaScript WAV Generation & Playback Library

`WAV.js` is a small JavaScript library for constructing & playing back PCM WAV files right inside the browser. It is certainly not the first library of its kind, nor is it as fully featured as many alternatives.  

*Why develop it then?*

Discounting my own stubbornness, many projects do not need all of the features that come with a heavyweight audio library. Instead, they simply need to generate and play short sounds from audio samples. This is exactly what `WAV.js` aims to accomplish, and nothing more. The API is very straightforward and has only a few exposed methods. WAV files are limited by up to 2 16-bit channels at a maximum of 96000 samples per second, which is more than acceptable for most applications.

### API Spec
Getting up and running with `WAV.js` is extremely simple:
1. Create a new `WAV` object with a specified sample rate and channel count.
	
	```
	let wav = new WAV(44100, 2)
	```
	Sample rates up to 96000 samples per second are supported in either mono or stereo.
	
2. Add audio samples.
