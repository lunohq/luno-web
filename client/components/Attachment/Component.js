import React, { PropTypes, Component } from 'react'

import Avatar from 'material-ui/Avatar'
import Chip from 'material-ui/Chip'
import CircularProgress from 'material-ui/CircularProgress'
import FileIcon from 'material-ui/svg-icons/editor/insert-drive-file'

import colors from 's/colors'

const Uploading = ({ disabled, name, onRemove, value }) => {
  let handleDelete = onRemove
  const chipStyle = { margin: '4px 8px 4px 0' }
  const progressStyle = { height: '32px', margin: 0, width: '32px' }
  if (disabled) {
    handleDelete = null
    chipStyle.cursor = 'not-allow'
    progressStyle.opacity = 0.4
  }
  return (
    <Chip
      labelStyle={{ paddingLeft: 4 }}
      onRequestDelete={handleDelete}
      style={chipStyle}
    >
      <Avatar backgroundColor='none'>
        <CircularProgress
          innerStyle={{ height: '32px', marginLeft: '-8px', marginTop: '-9px', width: '32px', }}
          mode='determinate'
          size={0.4}
          style={progressStyle}
          value={value}
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
  const chipStyle = { margin: '4px 8px 4px 0' }
  if (disabled) {
    handleDelete = null
    chipStyle.cursor = 'not-allow'
    avatarColor = colors.muiHintTextColor
  }
  return (
    <Chip
      labelStyle={{ paddingLeft: 4 }}
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
  }

  componentWillMount() {
    this.initialize(this.props)
    this.setState({ status: this.props.value.promise ? UPLOADING : UPLOADED })
  }

  componentWillReceiveProps(nextProps) {
    this.initialize(nextProps)
  }

  initialize(props) {
    if (props.value.promise) {
      props.value.promise.then(() => this.setState({ status: UPLOADED }))
    }
    let status
    try {
      status = props.value.transaction && props.value.transaction.getStatus() ? UPLOADING : UPLOADED
    } catch (err) {
      status = UPLOADED
    }
    this.setState({ status })
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
            value={this.state.completed}
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
  value: PropTypes.object.isRequired,
}

Attachment.contextTypes = {
  store: PropTypes.object.isRequired,
}

export default Attachment
