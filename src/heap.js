// ref: https://surma.dev/things/c-to-webassembly/
//
// LLVM web-assembly memory model
// 0           __data_end           Data
// __data_end  __heap_base          Stack
// __heap_base (growable max memory) Heap
//
// heap can be "safely" controlled by client
//
export class Heap {
    constructor(wasm, memory) {
        this.__heap_base = wasm.__heap_base.value
        this.memory = wasm.memory || memory
        this.pointers = []
    }

    malloc(length_in_bytes) {
        let arr = this.pointers
        let p
        if (arr.length===0) {
            p = this.__heap_base
        } else {
            let a = arr[0] // last pointer
            p = a.ptr + a.len
        }

        let maxP = this.memory.buffer.byteLength - 1
        if (p + length_in_bytes >=maxP) {
            let ps = Math.ceil((maxP - p)/65536)
            this.memory.grow(ps) // ps = 1 = 64K
        }

        arr.unshift({
            ptr: p,
            len: length_in_bytes
        })
        return p
    }


    free(ptr) {
        let arr = this.pointers
        let n = arr.findIndex((a) => a.ptr === ptr)
        arr.splice(n, 1)
    }

    // reset all pointers to restart
    reset() {
        this.pointers = []
    }
}