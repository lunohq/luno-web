import React, { PropTypes, Component } from 'react'
import Relay from 'react-relay'

import Avatar from 'material-ui/Avatar'
import Chip from 'material-ui/Chip'
import CircularProgress from 'material-ui/CircularProgress'
import FileIcon from 'material-ui/svg-icons/editor/insert-drive-file'

import colors from 's/colors'
import UploadFile from 'm/UploadFile'
import { startUpload, cancelUpload } from 'd/files'

const Uploading = ({ name, onRemove }) => (
  <Chip
    labelStyle={{ paddingLeft: 4 }}
    onRequestDelete={onRemove}
    style={{ margin: '4px 8px 4px 0' }}
  >
    <Avatar backgroundColor='none'>
      <CircularProgress
        innerStyle={{ height: '32px', marginLeft: '-8px', marginTop: '-9px', width: '32px', }}
        size={0.4}
        style={{ height: '32px', margin: 0, width: '32px' }}
      />
    </Avatar>
    {name}
  </Chip>
)

Uploading.propTypes = {
  name: PropTypes.string.isRequired,
  onRemove: PropTypes.func.isRequired,
}

const Uploaded = ({ name, onRemove }) => (
  <Chip
    labelStyle={{ paddingLeft: 4 }}
    onRequestDelete={onRemove}
    style={{ margin: '4px 8px 4px 0' }}
  >
    <Avatar
      backgroundColor='none'
      color={colors.darkGrey}
      icon={<FileIcon />}
    />
    {name}
  </Chip>
)

Uploaded.propTypes = {
  name: PropTypes.string.isRequired,
  onRemove: PropTypes.func.isRequired,
}

const UPLOADING = 1
const UPLOADED = 2
const CANCELLED = 3

class Attachment extends Component {

  state = {
    status: UPLOADED,
    transaction: null,
  }

  componentWillMount() {
    if (!this.props.value.id) {
      const promise = this.uploadFile(this.props.value)
      this.props.value.promise = promise
      this.props.onChange(this.props.value)
      this.setState({ status: UPLOADING })
    }
  }

  uploadFile(file) {
    return new Promise((resolve, reject) => {
      const onSuccess = ({ uploadFile: { file } }) => {
        if (this.state.status !== CANCELLED) {
          this.setState({ status: UPLOADED })
        }
        let payload
        if (file) {
          payload = { file }
        }
        resolve(payload)
      }
      const onFailure = (transaction) => reject(transaction.getError())
      const transaction = Relay.Store.commitUpdate(new UploadFile({ file }), { onSuccess, onFailure })
      this.setState({ transaction })
      this.context.store.dispatch(startUpload({ file, transaction }))
    })
  }

  handleRemove = () => {
    if (this.state.status === UPLOADING) {
      this.context.store.dispatch(cancelUpload(this.state.transaction))
      this.setState({ status: CANCELLED }, this.props.onRemove)
      return
    }
    this.props.onRemove()
  }

  render() {
    const { value } = this.props
    let chip
    switch (this.state.status) {
      case UPLOADED:
        chip = <Uploaded name={value.name} onRemove={this.handleRemove} />
        break
      default:
        chip = <Uploading name={value.name} onRemove={this.handleRemove} />
    }
    return chip
  }

}

Attachment.propTypes = {
  index: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  value: PropTypes.object.isRequired,
}

Attachment.contextTypes = {
  store: PropTypes.object.isRequired,
}

export default Attachment
