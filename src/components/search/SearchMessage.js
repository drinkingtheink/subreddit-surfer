import React, { Component } from 'react'
import PropTypes from 'prop-types'

class SearchMessage extends Component {
  render() {
    return (
      <div className="search-message">
        <h2>{this.props.headline}</h2>
        <p className="message-text">{this.props.message}</p>
      </div>
    )
  }
}

SearchMessage.propTypes = {
  headline: PropTypes.string,
  message: PropTypes.string
}

export default SearchMessage;