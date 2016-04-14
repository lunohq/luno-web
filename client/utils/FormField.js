class FormField {

  constructor(fieldKey, onValueChange, onFieldBlur) {
    this.fieldKey = fieldKey;
    this.value = '';
    this.touched = false;
    this.errorText = '';
    this.onValueChange = onValueChange;
    this.onFieldBlur = onFieldBlur;
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

  getValue() {
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
      onChange: this.onChange,
      onBlur: this.onBlur,
      touched: this.touched,
      value: this.value,
      errorText: this.errorText,
    };
  }

  reset() {
    this.value = '';
    this.errorText = '';
    this.touched = false;
  }
}

export default FormField;
