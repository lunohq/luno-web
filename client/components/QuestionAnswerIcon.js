import React, { PropTypes } from 'react';

const QuestionAnswerIcon = ({ height, stroke, strokeWidth, width, ...other }) => {
  return (
    <svg width={width} height={height} viewBox='0 0 48 48' {...other}>
      <path
        d='M42 12h-4v18H12v4c0 1.1.9 2 2 2h22l8 8V14c0-1.1-.9-2-2-2zm-8 12V6c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v28l8-8h20c1.1 0 2-.9 2-2z'
        fill={stroke}
        strokeWidth={strokeWidth}
      />
      </svg>
    );
};

QuestionAnswerIcon.propTypes = {
  height: PropTypes.number,
  stroke: PropTypes.string,
  strokeWidth: PropTypes.number,
  width: PropTypes.number,
};

QuestionAnswerIcon.defaultProps = {
  height: 30,
  stroke: '#FAFAFA',
  strokeWidth: 1,
  width: 30,
};

export default QuestionAnswerIcon;