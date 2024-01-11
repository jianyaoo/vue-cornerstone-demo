# openjpegjs



This library is a JavaScript port made possible by [emscripten](https://emscripten.org/) and [Chris Hafey](https://github.com/chafey). It is a JavaScript and WebAssembly build of [OpenJPEG](https://github.com/uclouvain/openjpeg).

## Table of Contents

...

## Features

...

## Installing

Using npm:

```bash
$ npm install @cornerstonejs/openjpegjs
```

Using yarn:

```bash
$ yarn add @cornerstonejs/openjpegjs
```

Using unpkg CDN:

```html
<script src="https://unpkg.com/@???/openjpegjs"></script>
```

## Try It Out!

Try it in your browser [here](https://???.github.com/openjpegjs/test/browser/index.html)


## openjpegjs API

### Creating an instance

```js
// JS / WASM promises resolve the library
const openjpegwasm = await OpenJPEGWASM;
const openjpegjs = await OpenJPEGJS;

// Decoder
const J2KDecoder = new openjpegjs.J2KDecoder();

// Encoder
const J2KEncoder = new openjpegjs.J2KEncoder();
```

### Decoder instance methods

- `J2KDecoder#getEncodedBuffer([encodedBitStreamLength: int]): ArrayBuffer`
- `J2KDecoder#getDecodedBuffer(): ArrayBuffer`
- `J2KDecoder#readHeader(): ?`
- `J2KDecoder#calculateSizeAtDecompositionLevel(decodeLevel: int): void`
- `J2KDecoder#decode(): void`
- `J2KDecoder#decodeSubResolution(decodeLevel: int, decodeLayer: int)`
- `J2KDecoder#getFrameInfo(): FrameInfo`
- `J2KDecoder#getNumDecomposition(): int`
- `J2KDecoder#getIsReversible(): bool`
- `J2KDecoder#getProgressionOrder(): int`
- `J2KDecoder#getImageOffset(): Point`
- `J2KDecoder#getTileSize(): Size`
- `J2KDecoder#getTileOffset(): Point`
- `J2KDecoder#getBlockDimensions(): Size`
- `J2KDecoder#getNumLayers(): int`
- `J2KDecoder#getColorSpace(): int`

```js
// ~ Setup
// const encodedArrayBuffer = ...;
const fullEncodedBitStream = new Uint8Array(encodedArrayBuffer);
const numBytes = 0;
const encodedBitStream = new Uint8Array(encodedArrayBuffer, 0, fullEncodedBitStream.length -numBytes);

// ~ DECODE
const encodedBuffer = decoder.getEncodedBuffer(encodedBitStream.length);
encodedBuffer.set(encodedBitStream);
decoder.decode(); // or .decodeSubResolution() to go by layer or level

// ~ Display (see example index.html file)
const decodedBuffer = decoder.getDecodedBuffer();
const frameInfo = decoder.getFrameInfo(); // width/height will be wrong if using decodeSubResolution
const interleaveMode = 2;

// In example index.html file
display(frameInfo, decodedBuffer, interleaveMode)
```

### Encoder instance methods

- `J2KEncoder#getDecodedBuffer`
- `J2KEncoder#getEncodedBuffer`
- `J2KEncoder#encode`
- `J2KEncoder#setDecompositions`
- `J2KEncoder#setQuality`
- `J2KEncoder#setProgressionOrder`
- `J2KEncoder#setDownSample`
- `J2KEncoder#setImageOffset`
- `J2KEncoder#setTileSize`
- `J2KEncoder#setTileOffset`
- `J2KEncoder#setBlockDimensions`
- `J2KEncoder#setNumPrecincts`
- `J2KEncoder#setPrecinct`
- `J2KEncoder#setCompressionRatio`

## Contributing

It can be difficult to contribute if your environment is not setup correctly. I highly recommend trying out VS Code's "Dev Containers" that make it easier to share and use a consistent development environment.

### Dev Containers

- [Setting up VS Code Dev Containers](https://code.visualstudio.com/docs/remote/containers-tutorial)
- [Additional Dev Containers configuration guidance](https://code.visualstudio.com/docs/remote/containers)

### Requirements

0. VS Code and Docker Desktop
1. [Remote-Containers extension](vscode:extension/ms-vscode-remote.remote-containers)
2. Command Pallete --> `Remote-Containers: Open Folder in Container`