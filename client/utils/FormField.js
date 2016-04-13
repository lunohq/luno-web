class FormField {

  constructor(fieldKey, onValueChange) {
    this.fieldKey = fieldKey;
    this.value = '';
    this.touched = false;
    this.errorText = '';
    this.onValueChange = onValueChange;
  }

  setValue(value) {
    this.value = value;
  }

  getValue() {
    return this.value;
  }

  onChange = (event) => {
    this.touched = true;
    this.value = event.target.value;
    this.onValueChange();
  }

  onBlur = () => {
    this.touched = true;
  }

  getProperties() {
    return {
      onChange: this.onChange,
      onBlur: this.onBlur,
      touched: this.touched,
      value: this.value,
      errorText: this.errorText,
    };
  }
}

export default FormField;
