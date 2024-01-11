# charls-js
JS/WebAssembly build of [CharLS](https://github.com/team-charls/charls)

## Try It Out!

Try it in your browser [here](https://chafey.github.com/charls-js/test/browser/index.html)

## Install

Install this in your JavaScript project using npm:

```bash
# NOTE - this is not published yet so won't work yet...
#npm install --save-dev charls-js 
```

## Usage

Before using this library, you must wait for it to be initialized:

``` javascript
const charls = require('charlsjs')
charls.onRuntimeInitialized = async _ => {
    // Now you can use it
}
```

To decode a JPEG-LS image, create a decoder instance, copy the JPEG-LS bitstream
into its memory space, decode it, copy the decoded pixels out of its memory
space and finally, delete the decoder instance.

```javascript
function decode(jpeglsEncodedBitStream) {
  // Create a decoder instance
  const decoder = new charls.JpegLSDecoder();
  
  // get pointer to the source/encoded bit stream buffer in WASM memory
  // that can hold the encoded bitstream
  const encodedBufferInWASM = decoder.getEncodedBuffer(jpeglsEncodedBitStream.length);
  
  // copy the encoded bitstream into WASM memory buffer
  encodedBufferInWASM.set(jpeglsEncodedBitStream);
  
  // decode it
  decoder.decode();
  
  // get information about the decoded image
  const frameInfo = decoder.getFrameInfo();
  const interleaveMode = decoder.getInterleaveMode();
  const nearLossless = decoder.getNearLossless();
  
  // get the decoded pixels
  const decodedPixelsInWASM = decoder.getDecodedBuffer();
  
  // TODO: do something with the decoded pixels here (e.g. display them)
  // The pixel arrangement for color images varies depending upon the
  // interleaveMode parameter, see documentation in JpegLSDecode::getInterleaveMode()
  
  // delete the instance.  Note that this frees up memory including the
  // encodedBufferInWASM and decodedPixelsInWASM invalidating them. 
  // Do not use either after calling delete!
  decoder.delete();
}

const jpeglsEncodedBitStream = // read from file, load from URL, etc
decode(jpeglsEncodedBitStream)
```

See examples for [browsers](test/browser/index.html) and [nodejs](test/node/index.js).
Also read the API documentation for [JpegLSDecoder.hpp](src/JpegLSDecoder.hpp) and
[JpegLSEncoder.hpp](src/JpegLSEncoder.hpp)

## Building

See information about building [here](BUILDING.md)

## Design

Read about the design considerations that went into this library [here](DESIGN.md)

## Performance

Read about the encode/decode performance of this library with NodeJS 14,
Google Chrome and FireFox vs Native [here](PERFORMANCE.md)