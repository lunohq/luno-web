import React, { PropTypes } from 'react'

import Result from './Result'

const Results = ({ results, ...other }) => {
  const items = results.map((result, index) => <Result key={index} {...result} />)
  return (
    <section {...other}>
      {items}
    </section>
  )
}

Results.propTypes = {
  results: PropTypes.array.isRequired,
}

export default Results
