FROM python:3.8.1-alpine3.11
RUN apk --no-cache add bash make cmake gcc g++ curl git nodejs
RUN git clone https://github.com/WebAssembly/wabt.git && \
	cd wabt && \
	git submodule update --init && \
	mkdir build && \
        cd build && \
	cmake .. && \
	cmake --build .
RUN bash -c 'install /wabt/build/{wat2wasm,wasm2wat,wasm-objdump,wasm-interp,wasm-decompile,wat-desugar,wasm2c,wasm-strip,wasm-validate,wast2json,wasm-opcodecnt,spectest-interp} /usr/bin/' && \
	bash -c 'chmod 755 /usr/bin/{wat2wasm,wasm2wat,wasm-objdump,wasm-interp,wasm-decompile,wat-desugar,wasm2c,wasm-strip,wasm-validate,wast2json,wasm-opcodecnt,spectest-interp}'
WORKDIR /src
CMD /bin/bash