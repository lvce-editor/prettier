export const minimizeEdit = (a, b) => {
  let i = 0
  const lengthA = a.length
  const lengthB = b.length
  while (i < lengthA && i < lengthB && a[i] === b[i]) {
    i++
  }
  let j = 0
  while (
    i + j < lengthA &&
    i + j < lengthB &&
    a[lengthA - j - 1] === b[lengthB - j - 1]
  ) {
    j++
  }
  const inserted = b.slice(i, lengthB - j)
  return {
    startOffset: i,
    endOffset: i + j,
    inserted,
  }
}
