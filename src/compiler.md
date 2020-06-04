---
description: How to use the compiler from the command line or as an API.
---

# Compiler

Similar to TypeScript's `tsc` compiling to JavaScript, AssemblyScript's `asc` compiles to WebAssembly.

## Command line options

### Entry file\(s\)

Non-option arguments are treated as the names of entry files. A single program can have multiple entries, with the exports of each entry becoming the exports of the WebAssembly module. Exports of imported files that are not entry files do not become WebAssembly module exports.

```sh
asc entryFile.ts
```

### Optimization

The compiler can optimize for both speed and size. `--optimizeLevel` \(0-3\) indicates how much the compiler focuses on optimizing the code with `--shrinkLevel` \(0-2, 1=s, 2=z\) indicating how much it focuses on keeping the size low during code generation and while optimizing. A convenient shorthand is `-O[optimizeLevel][shrinkLevel]` , with shrink level indicated by appending the letter `s` \(1\) or `z` \(2\) to the optimize level.

```
--optimize, -O        Optimizes the module. Typical shorthands are:

                       Default optimizations   -O / -O3s
                       Make a release build    -O --noAssert
                       Make a debug build      --debug
                       Optimize for speed      -O3
                       Optimize for size       -O3z --converge

--optimizeLevel       How much to focus on optimizing code. [0-3]
--shrinkLevel         How much to focus on shrinking code size. [0-2, s=1, z=2]
--converge            Re-optimizes until no further improvements can be made.
--noAssert            Replaces assertions with just their value without trapping.
```

Also noteworthy: The standard library provides [memory manager and garbage collector variants](./runtime.md#variants) for various use cases. From largest/most sophisticated to smallest/simplest:

```
--runtime             Specifies the runtime variant to include in the program.

                       full  Default runtime based on TLSF and reference counting.
                       half  Same as 'full', but not exported to the host.
                       stub  Minimal stub implementation without free/GC support.
                       none  Same as 'stub', but not exported to the host.
```

If external allocation is not required, choosing either `half` or `none` can significantly reduce the module's size.

### Output

Typical output formats are WebAssembly binary \(.wasm\) and/or text format \(.wat\). Often, both are used in tandem to run and also inspect generated code.

```
--outFile, -o         Specifies the output file. File extension indicates format.
--binaryFile, -b      Specifies the binary output file (.wasm).
--textFile, -t        Specifies the text output file (.wat).
```

There are several other output formats as well for tooling purposes with varying levels of maturity.

```
--jsFile, -j          Specifies the JavaScript output file (.js).
--idlFile, -i         Specifies the WebIDL output file (.webidl).
--tsdFile, -d         Specifies the TypeScript definition output file (.d.ts).
```

### Debugging

For easier debugging a [source map](./debugging.md#source-maps) can be emitted alongside the WebAssembly binary.

```
--sourceMap           Enables source map generation. Optionally takes the URL
                      used to reference the source map from the binary file.
```

It is also often useful to emit debug information, like function names, alongside the binary.

```
--debug               Enables debug information in emitted binaries.
```

### Features

There are several flags that enable or disable specific WebAssembly or compiler features. By default, only the bare minimum is exposed, and fully standardized WebAssembly features will be used.

```
--importMemory        Imports the memory provided as 'env.memory'.
--noExportMemory      Does not export the memory as 'memory'.
--initialMemory       Sets the initial memory size in pages.
--maximumMemory       Sets the maximum memory size in pages.
--sharedMemory        Declare memory as shared. Requires maximumMemory.
--importTable         Imports the function table provided as 'env.table'.
--exportTable         Exports the function table as 'table'.
--explicitStart       Exports an explicit '_start' function to call.
--enable              Enables WebAssembly features being disabled by default.

                       sign-extension      Sign-extension operations
                       bulk-memory         Bulk memory operations.
                       simd                SIMD types and operations.
                       threads             Threading and atomic operations.
                       reference-types     Reference types and operations.

--disable             Disables WebAssembly features being enabled by default.

                       mutable-globals     Mutable global imports and exports.

--use, -u             Aliases a global object under another name, e.g., to switch
                      the default 'Math' implementation used: --use Math=JSMath
                      Can also be used to introduce an integer constant.
--lowMemoryLimit      Enforces very low (<64k) memory constraints.
```

### Linking

Specifying the base offsets of compiler-generated memory respectively the table leaves some space for other data in front. In its current form this is mostly useful to link additional data into an AssemblyScript binary after compilation, be it by populating the binary itself or initializing the data externally upon initialization. One good example is leaving some scratch space for a frame buffer.

```
--memoryBase          Sets the start offset of emitted memory segments.
--tableBase           Sets the start offset of emitted table elements.
```

### API

To integrate with the compiler, for example to post-process the AST, one or multiple custom [transforms](./transforms.md) can be specified.

```
--transform           Specifies the path to a custom transform to 'require'.
```

### Other

Other options include those forwarded to Binaryen and various flags useful in certain situations.

#### Binaryen

```
--trapMode            Sets the trap mode to use.

                       allow  Allow trapping operations. This is the default.
                       clamp  Replace trapping operations with clamping semantics.
                       js     Replace trapping operations with JS semantics.

--runPasses           Specifies additional Binaryen passes to run after other
                      optimizations, if any. See: Binaryen/src/passes/pass.cpp
--noValidate          Skips validating the module using Binaryen.
```

#### And the kitchen sink

```
--noColors            Disables terminal colors.
--baseDir             Specifies the base directory of input and output files.
--extension           Specifies an alternative file extension to use.
--noUnsafe            Disallows the use of unsafe features in user code.
                      Does not affect library files and external modules.
--noEmit              Performs compilation as usual but does not emit code.
--measure             Prints measuring information on I/O and compile times.
--pedantic            Make yourself sad for no good reason.
--lib                 Adds one or multiple paths to custom library components and
                      uses exports of all top-level files at this path as globals.
--path                Adds one or multiple paths to package resolution, similar
                      to node_modules. Prefers an 'ascMain' entry in a package's
                      package.json and falls back to an inner 'assembly/' folder.
--traceResolution     Enables tracing of package resolution.
--listFiles           Lists files to be compiled and exits.
-- ...                Specifies node.js options (CLI only). See: node --help
```

## API

The compiler can also be used programmatically.

* [Compiler frontend API](https://github.com/AssemblyScript/assemblyscript/tree/master/cli#api)
* [Browser SDK](https://github.com/AssemblyScript/assemblyscript/tree/master/lib/sdk) \([example](https://github.com/AssemblyScript/examples/tree/master/sdk)\)
