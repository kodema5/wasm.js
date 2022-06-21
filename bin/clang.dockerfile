
# docker build -t clang -f clang.dockerfile .
# docker run --rm -it clang
#
FROM ubuntu:18.04

RUN apt-get update && apt-get install -y \
    xz-utils \
    curl \
    && rm -rf /var/lib/apt/lists/*

# get link from https://releases.llvm.org/download.html
# https://github.com/llvm/llvm-project/releases/tag/llvmorg-14.0.0
#
RUN curl -SL https://github.com/llvm/llvm-project/releases/download/llvmorg-14.0.0/clang+llvm-14.0.0-x86_64-linux-gnu-ubuntu-18.04.tar.xz \
    | tar -xJC . && \
    mv clang+llvm-14.0.0-x86_64-linux-gnu-ubuntu-18.04 clang_ && \
    echo "export PATH=/clang_/bin:$PATH" >> ~/.bashrc && \
    echo "export LD_LIBRARY_PATH=/clang_/lib:$LD_LIBRARY_PATH" >> ~/.bashrc

WORKDIR /src

CMD [ "/bin/bash" ]