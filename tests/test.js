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




// var memory = new WebAssembly.Memory({
//     initial:10,
//     maximum:10,
//     shared:true
// })

// {(async () => {

//     let wasm1 = await Wasm('../sum.wasm', {memory})
//     console.log('sin2', wasm1.sin2(0.2), Math.sin(0.2) * 2)
//     console.log('deg2rad', wasm1.degToRad(30), 30 * Math.PI / 180.)

//     let a = await Deno.readFile('add.wasm')
//     console.log(a instanceof Uint8Array)

//     let wasm2 = await Wasm(a)
//     console.log('add', wasm2.add(1,2), 1 + 2)


// })()}
