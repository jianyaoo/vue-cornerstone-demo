# openjphjs - HTJ2K support

JS/WebAssembly build of [OpenJPH](https://github.com/aous72/OpenJPH)

## Try It Out!

Try it in your browser [here](https://chafey.github.io/openjphjs/test/browser/index.html)  (The @cornerstonejs version doesn't run this way any longer)

## Building

This project uses Visual Studio Remote Containers to simplify setup and running (everything is contained in a docker image).  Use the devconvtainer from the
root codecs packages for the @cornerstonejs/codecs version.

This project uses git submodules to pull in OpenJPH.  If developing, initialize the git submodules first (do this outside the container):

```
> $ git submodule update --init --recursive
```

To build WASM:

```
> ./build.sh
```

To build native C/C++ version:
```
> ./build-native.sh
```

To update to latest version of OpenJPH
```
> git submodule update --remote --merge
```
