class FormField {

  constructor(fieldKey, onValueChange, onFieldBlur) {
    this.fieldKey = fieldKey;
    this.value = undefined;
    this.defaultValue = '';
    this.touched = false;
    this.errorText = '';
    this.onValueChange = onValueChange;
    this.onFieldBlur = onFieldBlur;
  }

  setDefaultValue(defaultValue) {
    this.defaultValue = defaultValue;
  }

  setValue(value) {
    this.value = value;
  }

  setError(errorText) {
    this.errorText = errorText;
  }

  resetError() {
    this.errorText = '';
  }

  getDefaultValue() {
    return this.defaultValue;
  }

  getValue() {
    if (!this.touched || this.value === undefined) {
      return this.defaultValue;
    }

    return this.value;
  }

  onChange = (event) => {
    this.touched = true;
    this.value = event.target.value;
    this.onValueChange(this.fieldKey, this.value);
  }

  onBlur = () => {
    this.touched = true;
    if (this.onFieldBlur) {
      this.onFieldBlur(this.fieldKey, this.value);
    }
  }

  getProperties() {
    return {
      defaultValue: this.defaultValue,
      onChange: this.onChange,
      onBlur: this.onBlur,
      touched: this.touched,
      value: this.value,
      errorText: this.errorText,
    };
  }

  reset() {
    this.defaultValue = '';
    this.value = undefined;
    this.errorText = '';
    this.touched = false;
  }
}

export default FormField;
