import React, { PropTypes } from 'react';

const MessagesIcon = ({ height, stroke, strokeWidth, width, ...other }) => {
  return (
    <svg width={width} height={height} viewBox='0 0 48 48' {...other}>
      <path
        d='M40 4H8C5.79 4 4.02 5.79 4.02 8L4 44l8-8h28c2.21 0 4-1.79 4-4V8c0-2.21-1.79-4-4-4zM12 18h24v4H12v-4zm16 10H12v-4h16v4zm8-12H12v-4h24v4z'
        fill={stroke}
        strokeWidth={strokeWidth}
      />
      </svg>
    );
};

MessagesIcon.propTypes = {
  height: PropTypes.number,
  stroke: PropTypes.string,
  strokeWidth: PropTypes.number,
  width: PropTypes.number,
};

MessagesIcon.defaultProps = {
  height: 30,
  stroke: '#FAFAFA',
  strokeWidth: 1,
  width: 30,
};

export default MessagesIcon;
