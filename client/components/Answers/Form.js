import React, { Component, PropTypes } from 'react';
import {
  Dialog,
  FlatButton,
  TextField,
} from 'material-ui';

class Form extends Component {

  state = {
    title: {},
    body: {},
    topics: {},
    answer: null,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.answer &&
        ((this.props.answer && this.props.answer.id !== nextProps.answer.id) || !this.props.answer)
    ) {
      this.setState({
        answer: nextProps.answer,
        title: { value: nextProps.answer.title },
        body: { value: nextProps.answer.body },
        topics: {}
      });
    }
  }

  getFormTitle() {
    if (this.state.answer && this.state.answer.id) {
      return 'Edit answer';
    }

    return 'Add an answer';
  }

  handleTitleChange = (event) => {
    this.setState({
      title: { value: event.target.value },
    });
  }

  handleBodyChange = (event) => {
    this.setState({
      body: { value: event.target.value },
    });
  }

  handleTopicsChange = (event) => {
    this.setState({
      topics: { value: event.target.value },
    });
  }

  handleSubmit = () => {
    const { onSubmit } = this.props;
    const answerId = this.state.answer !== null ? this.state.answer.id : null;
    onSubmit({
      title: this.refs.title.getValue(),
      body: this.refs.body.getValue(),
    }, answerId);
  }

  render() {
    const { onClose, open } = this.props;
    const { title, body, topics } = this.state;

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
        title={this.getFormTitle()}
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
              onChange={this.handleTitleChange}
              ref='title'
              {...title}
            />
            <TextField
              floatingLabelText='Answer'
              fullWidth
              hintText='Answer'
              multiLine
              onChange={this.handleBodyChange}
              rows={1}
              rowsMax={5}
              ref='body'
              {...body}
            />
            <TextField
              floatingLabelText='Topics'
              fullWidth
              hintText='Topics'
              onChange={this.handleTopicsChange}
              {...topics}
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
