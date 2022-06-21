@echo off

rem with internal memory
rem -O3 -flto -Wl,--lto-O3 is for optimization
echo test.asm
clang.exe --target=wasm32 ^
    -nostdlib ^
    -Wl,--export-all ^
    -Wl,--no-entry  ^
    -Wl,--allow-undefined ^
    -O3 -flto -Wl,--lto-O3 ^
    -o test.wasm ^
    test.c


rem with imported memory
rem
echo test_memory.asm
clang.exe --target=wasm32 ^
    -nostdlib ^
    -Wl,--export-all ^
    -Wl,--no-entry  ^
    -Wl,--allow-undefined ^
    -Wl,--import-memory ^
    -O3 -flto -Wl,--lto-O3 ^
    -o test_memory.wasm ^
    test.c

rem with imported shared-array-buffered memory
rem 655360 = 64 * 1024 * 10 = 640K
rem
echo test_shared.asm
clang.exe --target=wasm32 ^
    -nostdlib ^
    -Wl,--export-all ^
    -Wl,--no-entry  ^
    -Wl,--allow-undefined ^
    -Wl,--import-memory ^
    -Wl,--shared-memory ^
    -Wl,--no-check-features ^
    -Wl,--initial-memory=655360 ^
    -Wl,--max-memory=6553600 ^
    -O3 -flto -Wl,--lto-O3 ^
    -o test_shared.wasm ^
    test.c

rem use wasm2wat *.wasm to view data