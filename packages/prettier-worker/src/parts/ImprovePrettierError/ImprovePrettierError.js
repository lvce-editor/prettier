const isPrettierError = (error) => {
  return 'loc' in error
}

export const improvePrettierError = (error) => {
  if (!isPrettierError(error)) {
    return error
  }
  const stackLines = error.stack.split('\n')
  const newStackLines=[]
  for(const stackLine of stackLines){
    if(stackLine.startsWith('    at ')){
newStackLines.push(stackLine)
    }
  }
  const newStack = newStackLines.join('\n')
  const newError =
}
