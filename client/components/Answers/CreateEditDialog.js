import React, { Component, PropTypes } from 'react';
import { destroy, initialize } from 'redux-form';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import t from '../../utils/gettext';
import Form, { FORM_NAME } from './FormV2';

class CreateEditDialog extends Component {

  componentWillMount() {
    if (this.props.answer) {
      initialize(this.props.answer);
    }
  }

  componentWillReceiveProps(nextProps) {
    const newAnswer = (
      (this.props.answer && nextProps.answer && this.props.answer.id !== nextProps.answer.id) ||
      (!this.props.answer && nextProps.answer)
    );
    if (newAnswer) {
      this.initialize(nextProps.answer);
    }
  }

  initialize(answer) {
    const initialValues = {
      body: answer.body,
      title: answer.title,
    };
    this.context.store.dispatch(initialize(FORM_NAME, initialValues));
  }

  handleSubmit = (values) => {
    const { answer, onSubmit } = this.props;
    this.props.onSubmit({ answer, ...values });
  }

  cancelForm = () => {
    this.context.store.dispatch(destroy(FORM_NAME));
    this.props.onClose();
  }

  submitForm = () => {
    this.refs.form.submit();
  }

  render() {
    const { answer, children, open } = this.props;

    const actions = [
      <FlatButton
        label={t('Cancel')}
        secondary
        onTouchTap={this.cancelForm}
      />,
      <FlatButton
        label={t('Add')}
        primary
        onTouchTap={this.submitForm}
      />,
    ];

    return (
      <Dialog
        title={t('Add an answer')}
        actions={actions}
        modal={false}
        open={open}
        onRequestClose={this.cancelForm}
      >
        <Form
          onSubmit={this.handleSubmit}
          ref="form"
        />
      </Dialog>
    );
  }
};

CreateEditDialog.propTypes = {
  answer: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  open: PropTypes.bool,
};

CreateEditDialog.contextTypes = {
  store: PropTypes.object.isRequired,
};

export default CreateEditDialog;
