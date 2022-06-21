// deno test --allow-read --watch
//
import { assert, assertEquals, } from "https://deno.land/std@0.136.0/testing/asserts.ts";
import { describe, it, } from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { Wasm } from '../mod.js'

let values = [0,1,2,3,4,5,6,7,8,9]

describe('normal wasm', () => {

    it ('can load', async () => {
        let wasm = await Wasm (
            await Deno.readFile('test.wasm')
        )
        let n = values.length
        let p = wasm.malloc(n * 4)
        let i32 = new Uint32Array(
            wasm.memory.buffer,
            p,
            n
        )
        i32.set(values)
        assertEquals(wasm.sum(p,n), 45)
    })
})

describe('wasm w imported memory', () => {

    it ('can load', async () => {
        let memory = new WebAssembly.Memory({
            initial: 10
        })

        let wasm = await Wasm (
            await Deno.readFile('test_memory.wasm'),
            {memory}
        )
        let n = values.length
        let p = wasm.malloc(n * 4)
        let i32 = new Uint32Array(
            memory.buffer,
            p,
            n
        )
        i32.set(values)
        assertEquals(wasm.sum(p,n), 45)
    })
})

describe('wasm w shared memory', () => {
    it ('can load', async () => {
        let memory = new WebAssembly.Memory({
            initial: 10,
            maximum: 100,
            shared: true,
        })
        let wasm = await Wasm (
            await Deno.readFile('test_shared.wasm'),
            {memory}
        )
        let n = values.length
        let p = wasm.malloc(n * 4)
        let i32 = new Uint32Array(
            memory.buffer,
            p,
            n
        )
        i32.set(values)
        assertEquals(wasm.sum(p,n), 45)

    })
})


import { wrap } from 'https://raw.githubusercontent.com/kodema5/waaf.js/master/mod.js'
let fw = wrap(`
    import { proxy } from 'https://raw.githubusercontent.com/kodema5/waaf.js/master/mod.js'
    import { Wasm } from 'https://raw.githubusercontent.com/kodema5/wasm.js/master/mod.js'
    let wasm

    proxy({
        init: async ({memory}) => {
            wasm = await Wasm (
                await Deno.readFile('test_shared.wasm'),
                {memory}
            )
        },

        malloc: (a) => wasm.malloc(a),

        sum: (p,n) => wasm.sum(p,n),
    })
`)

describe('wasm in worker with shared memory', () => {
    it('can load', async () => {
        let memory = new WebAssembly.Memory({
            initial: 10,
            maximum: 100,
            shared: true,
        })
        await fw.init({memory})
        let n = values.length
        let p = await fw.malloc(n * 4)
        let i32 = new Uint32Array(
            memory.buffer,
            p,
            n
        )
        i32.set(values)
        assertEquals(await fw.sum(p,n), 45)
    })
})
