import React, { PropTypes } from 'react';

const CrossIcon = ({height, stroke, strokeWidth, width, ...other}) => {
    return (
        <svg width={width} height={height} viewBox="0 0 40 40" {...other}>
            <g id="Icon-Slices" stroke="none" strokeWidth={strokeWidth} fill="none" fill-rule="evenodd">
                <g id="cross" transform="translate(11.000000, 11.000000)" fill={stroke}>
                    <g id="Layer_1">
                        <path d="M10.4280923,8.86153846 L17.3985231,1.89083077 C17.8310769,1.45827692 17.8310769,0.756830769 17.3985231,0.324553846 C16.9659692,-0.108 16.2648,-0.108 15.8322462,0.324553846 L8.86153846,7.29498462 L1.89110769,0.324553846 C1.45855385,-0.108 0.757107692,-0.108 0.324553846,0.324553846 C-0.108,0.757107692 -0.108,1.45855385 0.324553846,1.89083077 L7.29526154,8.86153846 L0.324553846,15.8322462 C-0.108,16.2648 -0.108,16.9662462 0.324553846,17.3985231 C0.540830769,17.6148 0.8244,17.7230769 1.10769231,17.7230769 C1.39098462,17.7230769 1.67483077,17.6148 1.89110769,17.3985231 L8.86153846,10.4280923 L15.8322462,17.3985231 C16.0485231,17.6148 16.3320923,17.7230769 16.6153846,17.7230769 C16.8986769,17.7230769 17.1825231,17.6148 17.3985231,17.3985231 C17.8310769,16.9659692 17.8310769,16.2645231 17.3985231,15.8322462 L10.4280923,8.86153846 L10.4280923,8.86153846 Z" id="Shape"></path>
                    </g>
                </g>
            </g>
        </svg>
    );
};

CrossIcon.propTypes = {
    height: PropTypes.number,
    stroke: PropTypes.string,
    strokeWidth: PropTypes.number,
    width: PropTypes.number,
};
CrossIcon.defaultProps = {
    height: 26,
    stroke: '#000000',
    strokeWidth: 2,
    width: 26,
};

export default CrossIcon;
