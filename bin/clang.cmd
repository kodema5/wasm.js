@echo off

docker run --rm -v %cd%:/src clang /clang_/bin/clang %*

rem alternatively download LLVM from
rem https://releases.llvm.org/download.html
