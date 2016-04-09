import React, { Component, PropTypes } from 'react';
import {
  Dialog,
  FlatButton,
  TextField,
} from 'material-ui';

class Form extends Component {

  handleSubmit = () => {
    const { onSubmit } = this.props;
    onSubmit({
      title: this.refs.title.getValue(),
      body: this.refs.body.getValue(),
    });
  }

  render() {
    const { onClose, open } = this.props;

    const actions = [
      <FlatButton
        label='Cancel'
        secondary
        onClick={onClose}
      />,
      <FlatButton
        label='Submit'
        primary
        onClick={this.handleSubmit}
      />,
    ];

    return (
      <Dialog
        title='Add an Answer'
        actions={actions}
        modal={false}
        open={open}
        onRequestClose={onClose}
      >
        <form>
          <div>
            <TextField
              floatingLabelText='Title'
              fullWidth
              hintText='Title'
              ref='title'
            />
            <TextField
              floatingLabelText='Answer'
              fullWidth
              hintText='Answer'
              multiLine
              rows={2}
              rowsMax={5}
              ref='body'
            />
            <TextField
              floatingLabelText='Topics'
              fullWidth
              hintText='Topics'
            />
          </div>
        </form>
      </Dialog>
    );
  }
}

Form.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

Form.defaultPropTypes = {
  open: false,
};

export default Form;
