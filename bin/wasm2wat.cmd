@echo off
docker run --rm -v %cd%:/src wabt wasm2wat %*