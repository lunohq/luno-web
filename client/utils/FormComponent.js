import { Component, PropTypes } from 'react';

import FormField from './FormField';

class FormComponent extends Component {

  static propTypes = {
    fields: PropTypes.array.isRequired,
    validators: PropTypes.object,
  }

  componentWillMount() {
    const { fields } = this.props;
    for (const field of fields) {
      this.formFields[field] = new FormField(field, () => {
        this.fillState();
      });
    }

    this.fillState();
  }

  getValue(field) {
    if (field && this.formFields[field]) {
      return this.formFields[field].getValue();
    }

    return null;
  }

  componentDidReceiveProps() {
    this.fillState();
  }

  initializeWithValues(fieldNameValuesObject) {
    for (const field in fieldNameValuesObject) {
      this.formFields[field].setValue(fieldNameValuesObject[field]);
    }

    this.fillState();
  }

  formFields = {}

  fillState() {
    const stateObject = {};
    const { fields } = this.props;

    for (const field of fields) {
      stateObject[field] = this.formFields[field].getProperties();
    }

    this.setState(stateObject);
  }
}

export default FormComponent;
