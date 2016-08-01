import React, { PropTypes, Component } from 'react'

import Avatar from 'material-ui/Avatar'
import Chip from 'material-ui/Chip'
import CircularProgress from 'material-ui/CircularProgress'
import FileIcon from 'material-ui/svg-icons/editor/insert-drive-file'

import colors from 's/colors'

const Uploading = ({ disabled, name, onRemove, value }) => {
  let handleDelete = onRemove
  const labelStyle = { paddingLeft: 4 }
  const chipStyle = { margin: '4px 8px 4px 0' }
  const progressStyle = {}
  if (disabled) {
    handleDelete = null
    labelStyle.color = colors.muiHintTextColor
    chipStyle.cursor = 'not-allowed'
    progressStyle.opacity = 0.4
  }
  return (
    <Chip
      labelStyle={labelStyle}
      onRequestDelete={handleDelete}
      style={chipStyle}
    >
      <Avatar backgroundColor='none'>
        <CircularProgress
          size={0.35}
          style={progressStyle}
        />
      </Avatar>
      {name}
    </Chip>
  )
}

Uploading.propTypes = {
  disabled: PropTypes.bool,
  name: PropTypes.string.isRequired,
  onRemove: PropTypes.func.isRequired,
  value: PropTypes.number.isRequired,
}

const Uploaded = ({ disabled, name, onRemove }) => {
  let handleDelete = onRemove
  let avatarColor = colors.darkGrey
  const labelStyle = { paddingLeft: 4 }
  const chipStyle = { margin: '4px 8px 4px 0' }
  if (disabled) {
    handleDelete = null
    labelStyle.color = colors.muiHintTextColor
    chipStyle.cursor = 'not-allowed'
    avatarColor = colors.muiHintTextColor
  }
  return (
    <Chip
      labelStyle={labelStyle}
      onRequestDelete={handleDelete}
      style={chipStyle}
    >
      <Avatar
        backgroundColor='none'
        color={avatarColor}
        icon={<FileIcon />}
      />
      {name}
    </Chip>
  )
}

Uploaded.propTypes = {
  disabled: PropTypes.bool,
  name: PropTypes.string.isRequired,
  onRemove: PropTypes.func.isRequired,
}

const UPLOADING = 1
const UPLOADED = 2

class Attachment extends Component {

  state = {
    status: UPLOADING,
    complete: 0,
  }

  componentWillMount() {
    this.initialize(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.initialize(nextProps)
  }

  initialize(props) {
    const { value: { promise, transaction }, uploads } = props
    if (promise) {
      promise.then(() => this.setState({ status: UPLOADED }))
    }

    let complete
    if (transaction) {
      const upload = uploads[transaction.getID()]
      if (upload) {
        complete = upload.complete
      }
    }

    let status
    try {
      status = transaction && transaction.getStatus() ? UPLOADING : UPLOADED
    } catch (err) {
      status = UPLOADED
    }

    const state = { status }
    if (complete) {
      state.complete = complete
    }

    this.setState(state)
  }

  handleRemove = () => {
    this.props.onRemove(this.props.value)
  }

  render() {
    const { disabled, value } = this.props
    let chip
    switch (this.state.status) {
      case UPLOADED:
        chip = (
          <Uploaded
            disabled={disabled}
            name={value.name}
            onRemove={this.handleRemove}
          />
        )
        break
      default:
        chip = (
          <Uploading
            disabled={disabled}
            name={value.name}
            onRemove={this.handleRemove}
            value={this.state.complete}
          />
        )
    }
    return chip
  }

}

Attachment.propTypes = {
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  uploads: PropTypes.object,
  value: PropTypes.object.isRequired,
}

Attachment.contextTypes = {
  store: PropTypes.object.isRequired,
}

export default Attachment
