import React, { PropTypes, Component } from 'react'
import Relay from 'react-relay'

import Avatar from 'material-ui/Avatar'
import Chip from 'material-ui/Chip'
import CircularProgress from 'material-ui/CircularProgress'
import FileIcon from 'material-ui/svg-icons/editor/insert-drive-file'

import colors from 's/colors'
import UploadFile from 'm/UploadFile'

const Uploading = ({ name }) => (
  <Chip
    labelStyle={{ paddingLeft: 4, }}
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
}

const Uploaded = ({ name }) => (
  <Chip
    labelStyle={{ paddingLeft: 4 }}
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
}

const UPLOADING = 1
const UPLOADED = 2

class Attachment extends Component {

  state = {
    status: UPLOADED,
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
        this.setState({ status: UPLOADED })
        resolve({ file })
      }
      const onFailure = (transaction) => reject(transaction)
      Relay.Store.commitUpdate(new UploadFile({ file }), { onSuccess, onFailure })
    })
  }

  render() {
    const { value } = this.props
    let chip
    switch (this.state.status) {
      case UPLOADED:
        chip = <Uploaded name={value.name} />
        break
      default:
        chip = <Uploading name={value.name} />
    }
    return chip
  }

}

Attachment.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.object.isRequired,
}

export default Attachment
