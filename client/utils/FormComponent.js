import { Component, PropTypes } from 'react';

import FormField from './FormField';

class FormComponent extends Component {

  static propTypes = {
    fields: PropTypes.array.isRequired,
    validate: PropTypes.func,
  }

  state = {
    _values: {},
  }

  componentWillMount() {
    const { fields } = this.props;
    for (const field of fields) {
      this.formFields[field] = new FormField(field, () => this.fillFormState(), () => this.validate(true));
    }

    this.fillFormState();
  }

  componentWillReceiveProps() {
    this.fillFormState();
  }

  getValue(field) {
    if (field && this.formFields[field]) {
      return this.formFields[field].getValue();
    }

    return null;
  }

  initializeWithValues(fieldNameValuesObject) {
    for (const field in fieldNameValuesObject) {
      this.formFields[field].setValue(fieldNameValuesObject[field]);
    }

    this.fillFormState();
  }

  validate(showErrorForTouchedFields) {
    const { fields, validate } = this.props;

    if (validate) {
      const errorsObject = validate(this.state._values);

      if (errorsObject && Object.keys(errorsObject).length) {
        for (const field of fields) {
          this.formFields[field].resetError();
          if (errorsObject[field] &&
              (!showErrorForTouchedFields || (showErrorForTouchedFields && this.formFields[field].touched))
          ) {
            this.formFields[field].setError(errorsObject[field]);
          }
        }

        this.fillFormState();
        return false;
      }

      this.resetErrors();
    }

    return true;
  }

  isFormValid() {
    return this.validate(false);
  }

  resetErrors() {
    const { fields } = this.props;
    fields.map(field => this.formFields[field].resetError());
    this.fillFormState();
  }

  formFields = {}

  fillFormState() {
    const stateObject = {};
    const valuesObject = {};
    const { fields } = this.props;

    for (const field of fields) {
      stateObject[field] = this.formFields[field].getProperties();
      valuesObject[field] = this.formFields[field].getValue();
    }

    stateObject._values = valuesObject;
    this.setState(stateObject);
  }

  resetFormState() {
    const stateObject = {};
    const { fields } = this.props;

    for (const field of fields) {
      stateObject[field] = null;
      this.formFields[field].reset();
    }

    stateObject._values = null;
    this.setState(stateObject);
  }
}

export default FormComponent;
