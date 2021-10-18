// 'WebAssembly Text Format' Monarch language

var WebAssemblyTextLanguage = {
  config: {
    brackets: [
      ['(', ')'],
      ['if', 'end'],
      ['loop', 'end'],
      ['block', 'end']
    ],
    autoClosingPairs: [
      { open: '(', close: ')' },
      { open: 'if', close: 'end' },
      { open: 'loop', close: 'end' },
      { open: 'block', close: 'end' }
    ],
    surroundingPairs: [
      { open: '(', close: ')' },
      { open: 'if', close: 'end' },
      { open: 'loop', close: 'end' },
      { open: 'block', close: 'end' }
    ]
  },
  tokens: {
    keywords: [
      'module',
      'import',
      'export',
      'memory',
      'data',
      'table',
      'elem',
      'start',
      'func',
      'tag',
      'type',
      'param',
      'result',
      'global',
      'local',
      'mut',
      'struct',
      'array',
      'field'
    ],
    types: [
      'i8',
      'i16',
      'i32',
      'i64',
      'f32',
      'f64',
      'v128',
      'i31ref',
      'eqref',
      'anyref',
      'dataref',
      'externref',
      'funcref',
      'exnref',
      'extern',
      'null',
      'any',
      'eq'
    ],
    instructions: [
      'pop',
      'nop',
      'drop',
      'data.drop',
      'elem.drop',
      'local.get',
      'local.set',
      'local.tee',
      'global.get',
      'global.set',
      'tuple.make',
      'tuple.extract',
      'select',
      'v128.const',
      'v128.and',
      'v128.or',
      'v128.xor',
      'v128.not',
      'v128.andnot',
      'v128.bitselect',
      'v128.load',
      'v128.load8x8_s',
      'v128.load8x8_u',
      'v128.load16x4_s',
      'v128.load16x4_u',
      'v128.load32x2_s',
      'v128.load32x2_u',
      'v128.load8_lane',
      'v128.load16_lane',
      'v128.load32_lane',
      'v128.load64_lane',
      'v128.load8_splat',
      'v128.load16_splat',
      'v128.load32_splat',
      'v128.load64_splat',
      'v128.load32_zero',
      'v128.load64_zero',
      'v128.store',
      'v128.store16_lane',
      'v128.store32_lane',
      'v128.store64_lane',
      'v128.any_true',
      'i8x16.shuffle',
      'i8x16.swizzle',
      'i8x16.bitmask',
      'i8x16.splat',
      'i8x16.popcnt',
      'i8x16.replace_lane',
      'i8x16.extract_lane_s',
      'i8x16.extract_lane_u',
      'i8x16.all_true',
      'i8x16.abs',
      'i8x16.add',
      'i8x16.add_sat_s',
      'i8x16.add_sat_u',
      'i8x16.sub',
      'i8x16.sub_sat_s',
      'i8x16.sub_sat_u',
      'i8x16.mul',
      'i8x16.neg',
      'i8x16.shl',
      'i8x16.shr_s',
      'i8x16.shr_u',
      'i8x16.eq',
      'i8x16.ne',
      'i8x16.lt_s',
      'i8x16.lt_u',
      'i8x16.le_s',
      'i8x16.le_u',
      'i8x16.gt_s',
      'i8x16.gt_u',
      'i8x16.ge_s',
      'i8x16.ge_u',
      'i8x16.min_s',
      'i8x16.min_u',
      'i8x16.max_s',
      'i8x16.max_u',
      'i8x16.avgr_u',
      'i8x16.narrow_i16x8_s',
      'i8x16.narrow_i16x8_u',
      'i16x8.bitmask',
      'i16x8.splat',
      'i16x8.load_8x8_s',
      'i16x8.load_8x8_u',
      'i16x8.replace_lane',
      'i16x8.extract_lane_s',
      'i16x8.extract_lane_u',
      'i16x8.extend_low_i8x16_s',
      'i16x8.extend_high_i8x16_s',
      'i16x8.extend_low_i8x16_u',
      'i16x8.extend_high_i8x16_u',
      'i16x8.all_true',
      'i16x8.abs',
      'i16x8.add',
      'i16x8.add_sat_s',
      'i16x8.add_sat_u',
      'i16x8.extadd_pairwise_i8x16_s',
      'i16x8.extadd_pairwise_i8x16_u',
      'i16x8.sub',
      'i16x8.sub_sat_s',
      'i16x8.sub_sat_u',
      'i16x8.q15mulr_sat_s',
      'i16x8.mul',
      'i16x8.extmul_low_i8x16_s',
      'i16x8.extmul_high_i8x16_s',
      'i16x8.extmul_low_i8x16_u',
      'i16x8.extmul_high_i8x16_u',
      'i16x8.neg',
      'i16x8.shl',
      'i16x8.shr_s',
      'i16x8.shr_u',
      'i16x8.eq',
      'i16x8.ne',
      'i16x8.lt_s',
      'i16x8.lt_u',
      'i16x8.le_s',
      'i16x8.le_u',
      'i16x8.gt_s',
      'i16x8.gt_u',
      'i16x8.ge_s',
      'i16x8.ge_u',
      'i16x8.min_s',
      'i16x8.min_u',
      'i16x8.max_s',
      'i16x8.max_u',
      'i16x8.avgr_u',
      'i16x8.narrow_i32x4_s',
      'i16x8.narrow_i32x4_u',
      'i32x4.bitmask',
      'i32x4.splat',
      'i32x4.load_16x4_s',
      'i32x4.load_16x4_u',
      'i32x4.replace_lane',
      'i32x4.extract_lane',
      'i32x4.extend_low_i16x8_s',
      'i32x4.extend_high_i16x8_s',
      'i32x4.extend_low_i16x8_u',
      'i32x4.extend_high_i16x8_u',
      'i32x4.all_true',
      'i32x4.abs',
      'i32x4.add',
      'i32x4.extadd_pairwise_i16x8_s',
      'i32x4.extadd_pairwise_i16x8_u',
      'i32x4.sub',
      'i32x4.mul',
      'i32x4.extmul_low_i16x8_s',
      'i32x4.extmul_high_i16x8_s',
      'i32x4.extmul_low_i16x8_u',
      'i32x4.extmul_high_i16x8_u',
      'i32x4.neg',
      'i32x4.shl',
      'i32x4.shr_s',
      'i32x4.shr_u',
      'i32x4.eq',
      'i32x4.ne',
      'i32x4.lt_s',
      'i32x4.lt_u',
      'i32x4.le_s',
      'i32x4.le_u',
      'i32x4.gt_s',
      'i32x4.gt_u',
      'i32x4.ge_s',
      'i32x4.ge_u',
      'i32x4.min_s',
      'i32x4.min_u',
      'i32x4.max_s',
      'i32x4.max_u',
      'i32x4.trunc_sat_f32x4_s',
      'i32x4.trunc_sat_f32x4_u',
      'i32x4.trunc_sat_f64x2_s_zero',
      'i32x4.trunc_sat_f64x2_u_zero',
      'i32x4.dot_i16x8_s',
      'i64x2.bitmask',
      'i64x2.splat',
      'i64x2.load32x2_s',
      'i64x2.load32x2_u',
      'i64x2.replace_lane',
      'i64x2.extract_lane',
      'i64x2.extend_low_i32x4_s',
      'i64x2.extend_high_i32x4_s',
      'i64x2.extend_low_i32x4_u',
      'i64x2.extend_high_i32x4_u',
      'i64x2.all_true',
      'i64x2.abs',
      'i64x2.add',
      'i64x2.sub',
      'i64x2.mul',
      'i64x2.neg',
      'i64x2.shl',
      'i64x2.shr_s',
      'i64x2.shr_u',
      'f32x4.splat',
      'f32x4.replace_lane',
      'f32x4.extract_lane',
      'f32x4.add',
      'f32x4.sub',
      'f32x4.mul',
      'i64x2.extmul_low_i32x4_s',
      'i64x2.extmul_high_i32x4_s',
      'i64x2.extmul_low_i32x4_u',
      'i64x2.extmul_high_i32x4_u',
      'i64x2.eq',
      'i64x2.ne',
      'i64x2.lt_s',
      'i64x2.le_s',
      'i64x2.gt_s',
      'i64x2.ge_s',
      'f32x4.neg',
      'f32x4.eq',
      'f32x4.ne',
      'f32x4.lt',
      'f32x4.le',
      'f32x4.gt',
      'f32x4.ge',
      'f32x4.abs',
      'f32x4.min',
      'f32x4.pmin',
      'f32x4.max',
      'f32x4.pmax',
      'f32x4.div',
      'f32x4.sqrt',
      'f32x4.ceil',
      'f32x4.floor',
      'f32x4.trunc',
      'f32x4.nearest',
      'f32x4.demote_f64x2_zero',
      'f32x4.convert_i32x4_s',
      'f32x4.convert_i32x4_u',
      'f64x2.splat',
      'f64x2.replace_lane',
      'f64x2.extract_lane',
      'f64x2.add',
      'f64x2.sub',
      'f64x2.mul',
      'f64x2.neg',
      'f64x2.eq',
      'f64x2.ne',
      'f64x2.lt',
      'f64x2.le',
      'f64x2.gt',
      'f64x2.ge',
      'f64x2.abs',
      'f64x2.min',
      'f64x2.max',
      'f64x2.pmin',
      'f64x2.pmax',
      'f64x2.div',
      'f64x2.sqrt',
      'f64x2.ceil',
      'f64x2.floor',
      'f64x2.trunc',
      'f64x2.nearest',
      'f64x2.promote_low_f32x4',
      'f64x2.convert_low_i32x4_s',
      'f64x2.convert_low_i32x4_u',
      'i32.atomic.load',
      'i32.atomic.load8_u',
      'i32.atomic.load16_u',
      'i32.atomic.store',
      'i32.atomic.store8',
      'i32.atomic.store16',
      'i32.atomic.rmw.add',
      'i32.atomic.rmw.sub',
      'i32.atomic.rmw.and',
      'i32.atomic.rmw.or',
      'i32.atomic.rmw.xor',
      'i32.atomic.rmw.xchg',
      'i32.atomic.rmw.cmpxchg',
      'i32.atomic.rmw8.add_u',
      'i32.atomic.rmw8.sub_u',
      'i32.atomic.rmw8.and_u',
      'i32.atomic.rmw8.or_u',
      'i32.atomic.rmw8.xor_u',
      'i32.atomic.rmw8.xchg_u',
      'i32.atomic.rmw8.cmpxchg_u',
      'i32.atomic.rmw16.add_u',
      'i32.atomic.rmw16.sub_u',
      'i32.atomic.rmw16.and_u',
      'i32.atomic.rmw16.or_u',
      'i32.atomic.rmw16.xor_u',
      'i32.atomic.rmw16.xchg_u',
      'i32.atomic.rmw16.cmpxchg_u',
      'i64.atomic.load',
      'i64.atomic.load8_u',
      'i64.atomic.load16_u',
      'i64.atomic.load32_u',
      'i64.atomic.store',
      'i64.atomic.store8',
      'i64.atomic.store16',
      'i64.atomic.store32',
      'i64.atomic.rmw.add',
      'i64.atomic.rmw.sub',
      'i64.atomic.rmw.and',
      'i64.atomic.rmw.or',
      'i64.atomic.rmw.xor',
      'i64.atomic.rmw.xchg',
      'i64.atomic.rmw.cmpxchg',
      'i64.atomic.rmw8.add_u',
      'i64.atomic.rmw8.sub_u',
      'i64.atomic.rmw8.and_u',
      'i64.atomic.rmw8.or_u',
      'i64.atomic.rmw8.xor_u',
      'i64.atomic.rmw8.xchg_u',
      'i64.atomic.rmw8.cmpxchg_u',
      'i64.atomic.rmw16.add_u',
      'i64.atomic.rmw16.sub_u',
      'i64.atomic.rmw16.and_u',
      'i64.atomic.rmw16.or_u',
      'i64.atomic.rmw16.xor_u',
      'i64.atomic.rmw16.xchg_u',
      'i64.atomic.rmw16.cmpxchg_u',
      'i64.atomic.rmw32.add_u',
      'i64.atomic.rmw32.sub_u',
      'i64.atomic.rmw32.and_u',
      'i64.atomic.rmw32.or_u',
      'i64.atomic.rmw32.xor_u',
      'i64.atomic.rmw32.xchg_u',
      'i64.atomic.rmw32.cmpxchg_u',
      'atomic.fence',
      'func.bind',
      'ref',
      'ref.eq',
      'ref.null',
      'ref.is_null',
      'ref.is_func',
      'ref.is_data',
      'ref.is_i31',
      'ref.as_func',
      'ref.as_non_null',
      'ref.as_data',
      'ref.as_i31',
      'ref.func',
      'ref.cast',
      'ref.cast_static',
      'ref.test',
      'ref.test_static',
      'table.get',
      'table.set',
      'table.size',
      'table.grow',
      'table.fill',
      'table.init',
      'table.copy',
      'throw',
      'rethrow',
      'i32.load',
      'i32.load8_s',
      'i32.load8_u',
      'i32.load16_s',
      'i32.load16_u',
      'i32.store',
      'i32.store8',
      'i32.store16',
      'i32.const',
      'i32.eqz',
      'i32.eq',
      'i32.ne',
      'i32.lt_s',
      'i32.lt_u',
      'i32.le_s',
      'i32.le_u',
      'i32.gt_s',
      'i32.gt_u',
      'i32.ge_s',
      'i32.ge_u',
      'i32.clz',
      'i32.ctz',
      'i32.popcnt',
      'i32.add',
      'i32.sub',
      'i32.mul',
      'i32.div_s',
      'i32.div_u',
      'i32.rem_s',
      'i32.rem_u',
      'i32.and',
      'i32.or',
      'i32.xor',
      'i32.shl',
      'i32.shr_s',
      'i32.shr_u',
      'i32.rotl',
      'i32.rotr',
      'i32.wrap_i64',
      'i32.trunc_f32_s',
      'i32.trunc_f32_u',
      'i32.trunc_f64_s',
      'i32.trunc_f64_u',
      'i32.reinterpret_f32',
      'i64.load',
      'i64.load8_s',
      'i64.load8_u',
      'i64.load16_s',
      'i64.load16_u',
      'i64.load32_s',
      'i64.load32_u',
      'i64.store',
      'i64.store8',
      'i64.store16',
      'i64.store32',
      'i64.const',
      'i64.eqz',
      'i64.eq',
      'i64.ne',
      'i64.lt_s',
      'i64.lt_u',
      'i64.le_s',
      'i64.le_u',
      'i64.gt_s',
      'i64.gt_u',
      'i64.ge_s',
      'i64.ge_u',
      'i64.clz',
      'i64.ctz',
      'i64.popcnt',
      'i64.add',
      'i64.sub',
      'i64.mul',
      'i64.div_s',
      'i64.div_u',
      'i64.rem_s',
      'i64.rem_u',
      'i64.and',
      'i64.or',
      'i64.xor',
      'i64.shl',
      'i64.shr_s',
      'i64.shr_u',
      'i64.rotl',
      'i64.rotr',
      'i64.extend_i32_s',
      'i64.extend_i32_u',
      'i64.trunc_f32_s',
      'i64.trunc_f32_u',
      'i64.trunc_f64_s',
      'i64.trunc_f64_u',
      'i64.reinterpret_f64',
      'f32.load',
      'f32.store',
      'f32.const',
      'f32.eq',
      'f32.ne',
      'f32.lt',
      'f32.le',
      'f32.gt',
      'f32.ge',
      'f32.abs',
      'f32.neg',
      'f32.ceil',
      'f32.floor',
      'f32.trunc',
      'f32.nearest',
      'f32.sqrt',
      'f32.add',
      'f32.sub',
      'f32.mul',
      'f32.div',
      'f32.min',
      'f32.max',
      'f32.copysign',
      'f32.convert_i32_s',
      'f32.convert_i32_u',
      'f32.convert_i64_s',
      'f32.convert_i64_u',
      'f32.demote_f64',
      'f32.reinterpret_i32',
      'f64.load',
      'f64.store',
      'f64.const',
      'f64.eq',
      'f64.ne',
      'f64.lt',
      'f64.le',
      'f64.gt',
      'f64.ge',
      'f64.abs',
      'f64.neg',
      'f64.ceil',
      'f64.floor',
      'f64.trunc',
      'f64.nearest',
      'f64.sqrt',
      'f64.add',
      'f64.sub',
      'f64.mul',
      'f64.div',
      'f64.min',
      'f64.max',
      'f64.copysign',
      'f64.convert_i32_s',
      'f64.convert_i32_u',
      'f64.convert_i64_s',
      'f64.convert_i64_u',
      'f64.promote_f32',
      'f64.reinterpret_i64',
      'i32.extend8_s',
      'i32.extend16_s',
      'i64.extend8_s',
      'i64.extend16_s',
      'i64.extend32_s',
      'i32.trunc_sat_f32_s',
      'i32.trunc_sat_f32_u',
      'i32.trunc_sat_f64_s',
      'i32.trunc_sat_f64_u',
      'i64.trunc_sat_f32_s',
      'i64.trunc_sat_f32_u',
      'i64.trunc_sat_f64_s',
      'i64.trunc_sat_f64_u',
      'memory.size',
      'memory.grow',
      'memory.copy',
      'memory.fill',
      'memory.init',
      'memory.atomic.notify',
      'memory.atomic.wait32',
      'memory.atomic.wait64',
      'i31.new',
      'i31.get_u',
      'i31.get_s',
      'array.new',
      'array.new_default',
      'array.init',
      'array.init_static',
      'array.get',
      'array.get_s',
      'array.get_u',
      'array.set',
      'array.len',
      'array.copy',
      'struct.new',
      'struct.new_default',
      'struct.new_with_rtt',
      'struct.new_default_with_rtt',
      'struct.get',
      'struct.get_s',
      'struct.get_u',
      'struct.set',
      'rtt.canon',
      'rtt.sub',
      'rtt.fresh_sub'
    ],
    controlInstructions: [
      'block',
      'loop',
      'if',
      'else',
      'then',
      'end',
      'do',
      'let',
      'br',
      'br_if',
      'br_table',
      'br_on_exn',
      'br_on_null',
      'br_on_non_null',
      'br_on_cast',
      'br_on_cast_static',
      'br_on_cast_fail',
      'br_on_cast_static_fail',
      'br_on_func',
      'br_on_non_func',
      'br_on_data',
      'br_on_non_data',
      'br_on_i31',
      'br_on_non_i31',
      'call',
      'call_indirect',
      'call_ref',
      'return',
      'return_call',
      'return_call_indirect',
      'return_call_ref',
      'try',
      'catch',
      'catch_all',
      'delegate',
      'unreachable'
    ],

    escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
    digits: /\d+(_+\d+)*/,
    octaldigits: /[0-7]+(_+[0-7]+)*/,
    binarydigits: /[0-1]+(_+[0-1]+)*/,
    hexdigits: /[[0-9a-fA-F]+(_+[0-9a-fA-F]+)*/,

    tokenizer: {
      root: [

        // whitespace
        { include: '@whitespace' },

        // strings
        [/"([^"\\]|\\.)*$/, 'string.invalid'], // non-teminated string
        [/"/, 'string', '@string'],

        // numbers (not all of these are generated, but here to be sure)
        [/(@digits)[eE]([\-+]?(@digits))?[fFdD]?/, 'number.float'],
        [/(@digits)\.(@digits)([eE][\-+]?(@digits))?[fFdD]?/, 'number.float'],
        [/0[xX](@hexdigits)[Ll]?/, 'number.hex'],
        [/0(@octaldigits)[Ll]?/, 'number.octal'],
        [/0[bB](@binarydigits)[Ll]?/, 'number.binary'],
        [/(@digits)[fFdD]/, 'number.float'],
        [/(@digits)[lL]?/, 'number'],

        // variable names
        [/\$[^\s\)]*/, { token: 'identifier' }],

        // instructions
        [/[a-zA-Z0-9]+(?:\.[a-zA-Z0-9_]+)*/, {
          cases: {
            '@instructions': { token: 'instruction.$0' },
            '@controlInstructions': { token: 'controlInstruction.$0' },
            '@keywords': { token: 'keyword.$0' },
            '@types': { token: 'type.$0' },
            '@default': 'identifier'
          }
        }]
      ],

      string: [
        [/[^\\"]+/, 'string'],
        [/@escapes/, 'string.escape'],
        [/\\./, 'string.escape.invalid'],
        [/"/, 'string', '@pop']
      ],

      whitespace: [
        [/[ \t\r\n]+/, ''],
        [/(;; )(ERROR |FAILURE )([^\n]*)/, [ 'comment', 'error', '' ]],
        [/(;; )(WARNING )([^\n]*)/, [ 'comment', 'warning', '' ]],
        [/(;; )(INFO )([^\n]*)/, [ 'comment', 'info', '' ]],
        [/(;; )(PEDANTIC )([^\n]*)/, [ 'comment', 'pedantic', '' ]],
        [/(;;  +)(~+|\^)$/, ['comment', 'underline']],
        [/(;;  )([^\n]*)/, ['comment', '']],
        [/;;[^\n]*/, 'comment']
      ]
    }
  }
}

if (typeof define === 'function' && define.amd) {
  define(() => WebAssemblyTextLanguage)
} else if (typeof module === 'object' && module.exports) {
  module.exports = WebAssemblyTextLanguage
}
