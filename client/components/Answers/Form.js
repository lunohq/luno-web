import React, { PropTypes } from 'react';
import {
  Dialog,
  FlatButton,
  TextField,
} from 'material-ui';

const Form = ({ onSubmit, onClose, open }) => {
  const actions = [
    <FlatButton
      label='Cancel'
      secondary
      onClick={onClose}
    />,
    <FlatButton
      label='Submit'
      primary
      onClick={onSubmit}
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
      <form onSubmit={onSubmit}>
        <div>
          <TextField
            floatingLabelText='Title'
            fullWidth
            hintText='Title'
          />
          <TextField
            floatingLabelText='Answer'
            fullWidth
            hintText='Answer'
            multiLine
            rows={2}
            rowsMax={5}
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
};

Form.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

Form.defaultPropTypes = {
  open: false,
};

export default Form;
