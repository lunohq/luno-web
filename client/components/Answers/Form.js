import React, { PropTypes } from 'react';
import {
  Dialog,
  FlatButton,
  TextField,
} from 'material-ui';

import { answerValidator } from '../../helpers/validators';
import FormComponent from '../../helpers/FormComponent';

class Form extends FormComponent {

  static defaultProps = {
    fields: ['title', 'body'],
    validate: answerValidator,
  }

  state = {
    answer: null,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.answer &&
        ((this.props.answer && this.props.answer.id !== nextProps.answer.id) || !this.props.answer)
    ) {
      this.setState({
        answer: nextProps.answer,
      });

      this.initializeWithValues({
        title: nextProps.answer.title,
        body: nextProps.answer.body,
      });
    }
  }

  getFormTitle() {
    if (this.isNew()) {
      return 'Add an answer';
    }

    return 'Edit answer';
  }

  getSubmitButtonLabel() {
    if (this.isNew()) {
      return 'Add';
    }

    return 'Update';
  }

  resetState() {
    this.setState({
      answer: null,
    });

    this.resetFormState();
  }

  isNew() {
    return !(this.state.answer && this.state.answer.id);
  }

  handleSubmit = () => {
    if (this.isFormValid()) {
      const { onSubmit } = this.props;
      onSubmit({
        title: this.getValue('title'),
        body: this.getValue('body'),
      }, this.state.answer);
      this.handleClose();
    }
  }

  handleClose = () => {
    const { onClose } = this.props;
    this.resetState();
    onClose();
  }

  render() {
    const { open } = this.props;
    const { title, body } = this.state;

    const actions = [
      <FlatButton
        label='Cancel'
        secondary
        onClick={this.handleClose}
      />,
      <FlatButton
        label={this.getSubmitButtonLabel()}
        primary
        onClick={this.handleSubmit}
      />,
    ];

    return (
      <Dialog
        title={this.getFormTitle()}
        actions={actions}
        modal={false}
        open={open}
        onRequestClose={this.handleClose}
      >
        <form>
          <div>
            <TextField
              floatingLabelText='Title'
              fullWidth
              hintText='Title'
              key='title'
              {...title}
            />
            <TextField
              floatingLabelText='Answer'
              fullWidth
              hintText='Answer'
              key='body'
              multiLine
              rows={1}
              {...body}
            />
          </div>
        </form>
      </Dialog>
    );
  }
}

Form.propTypes = {
  answer: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

Form.defaultPropTypes = {
  answer: null,
  open: false,
};

export default Form;
