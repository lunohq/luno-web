import { default as ReactDocumentTitle } from 'react-document-title'
import React, { Component, PropTypes } from 'react'

class DocumentTitle extends Component {

  static defaultProps = {
    title: '',
  }

  static rewind() {
    return ReactDocumentTitle.rewind()
  }

  getAppName() {
    const suffix = ''
    // if (__LOCAL__) {
    //   suffix = 'Local'
    // } else if (__DEVELOPMENT__) {
    //   suffix = 'Dev'
    // }

    return `Luno ${suffix}`
  }

  getTitle() {
    const { title } = this.props

    return (title ? `${title}  \u2013  ` : '') + this.getAppName()
  }

  renderChildren() {
    if (this.props.children) {
      return React.Children.only(this.props.children)
    }

    return null
  }

  render() {
    return (
      <ReactDocumentTitle title={this.getTitle()}>
        {this.renderChildren()}
      </ReactDocumentTitle>
    )
  }

}

DocumentTitle.propTypes = {
  children: PropTypes.object,
  title: PropTypes.string,
}

export default DocumentTitle
