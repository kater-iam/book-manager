function isNumber(value: any): value is number {
  return typeof value === 'number'
}

function isString(value: any): value is string {
  return typeof value === 'string'
}

function doubleOrRepeat<T>(input: string | number): T | undefined {
  if (isNumber(input)) {
    return input * 2
  }
  if (isString(input)) {
    return input + input
  }
  return undefined
}

const double = doubleOrRepeat(10)
console.log(double)

const repeat = doubleOrRepeat('hoge')
console.log(repeat)

