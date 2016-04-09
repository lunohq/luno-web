import React, { Component, PropTypes } from 'react';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import TextField from 'material-ui/lib/text-field';

export default class SmartAnswerForm extends Component {

  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
  };

  static defaultPropTypes = {
    open: false,
  }

  render() {
    const {
      handleClose,
      handleSubmit
    } = this.props;
    const actions = [
      <FlatButton
        label='Cancel'
        secondary
        onClick={handleClose}
      />,
      <FlatButton
        label='Submit'
        primary
        onClick={handleSubmit}
      />,
    ];

    return (
      <Dialog
        title='Add a Smart Answer'
        actions={actions}
        modal={false}
        open={this.props.open}
        onRequestClose={handleClose}
      >
        <form onSubmit={handleSubmit}>
          <div>
            <TextField
              floatingLabelText='Title'
              fullWidth
              hintText='Title'
            />
            <TextField
              floatingLabelText='Smart Answer'
              fullWidth
              hintText='Smart Answer'
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
  }
}
