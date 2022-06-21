import { js_math } from './js_math.js'
import { Heap } from './heap.js'

export let Wasm = async (src, {
    memory: is_mem,   // imported memory
    is_heap = true,   // add heap malloc/free
    is_math = true,   // add js_math fucntions
} = {}) => {

    let buf

    // ex: deno's "await Deno.readFile('file.wasm')"
    //
    if (src instanceof Uint8Array) {
        buf = src
    }
    else if (typeof src==='string') {
        let url = new URL(src, import.meta.url)
        buf = await (await fetch(url)).arrayBuffer()
    }

    let heap
    let wasm
    let imports = {
        env: {
            // imported memory
            ...(is_mem && { memory:is_mem }),

            // simple malloc/free
            ...(is_heap && {
                malloc: (sz) => heap.malloc(sz),
                free: (ptr) => heap.free(ptr),
            }),

            // reuse js-math funcs
            ...(is_math && js_math),
        }
    }

    let { instance } = await WebAssembly.instantiate(buf, imports)
    wasm = instance.exports

    if (is_heap) {
        heap = new Heap(wasm, is_mem)
    }

    return {
        ...(is_mem && { memory: is_mem }),

        // for wasm.__heap.reset()
        //
        ...(is_heap && {
            __heap: heap,
            malloc: (sz) => heap.malloc(sz),
            free: (ptr) => heap.free(ptr),
        }),

        ...wasm,
    }
}

