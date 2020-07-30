import { RandomNumber } from './Math'

export type HSV = { H: number; S: number; V: number }
export type HSL = { H: number; S: number; L: number }

export function HSVtoHSL (hsv: HSV): HSL {
  const HSV: HSV = { H: hsv.H, S: hsv.S / 100, V: hsv.V / 100 }
  const HSL: HSL = { H: HSV.H, S: undefined, L: undefined }

  HSL.L = (HSV.V * (1 - (HSV.S / 2)))

  if (HSL.L === 0 || HSL.L === 1) {
    HSL.S = 0
  } else {
    HSL.S = (HSV.V - HSL.L) / Math.min(HSL.L, 1 - HSL.L)
  }

  HSL.L = Math.ceil(HSL.L * 100)
  HSL.S = Math.ceil(HSL.S * 100)

  return HSL
}

export function HSLtoString (hsl: HSL): string {
  return `hsl(${hsl.H}, ${hsl.S}%, ${hsl.L}%)`
}

export function RGBtoHEX (array: Array<number>): string {
  let finalColour = '#'
  for (let i = 0; i < 3; i++) {
    let number: string = array[i].toString(16)
    if (number.length === 1) {
      number = '0' + number
    }
    finalColour += number
  }
  return finalColour
}

export function RandomColour (): string {
  return RGBtoHEX([RandomNumber(0, 255), RandomNumber(0, 255), RandomNumber(0, 255)])
}
