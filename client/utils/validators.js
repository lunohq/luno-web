const isEmpty = value => value === undefined || value === null || (value.trim && value.trim() === '')
const join = (rules) => (value, data) => rules.map(rule => rule(value, data)).filter(error => !!error)[0] /* first error */

function required(value) {
  if (isEmpty(value)) {
    return 'Required'
  }

  return null
}

function createValidator(rules) {
  return (data = {}) => {
    const errors = {}
    Object.keys(rules).forEach((key) => {
      const rule = join([].concat(rules[key]))
      const error = rule(data[key], data)
      if (error) {
        errors[key] = error
      }
    })
    return errors
  }
}

// function arrayOf(validations) {
//   const validator = createValidator(validations)
//   return values => {
//     return values && values.map(validator)
//   }
// }

export const answerValidator = createValidator({
  title: [required],
  body: [required],
})
