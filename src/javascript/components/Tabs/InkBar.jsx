/*
 * --------------------------------------------
 * InkBar组件
 * @version  1.0
 * @author   hzguodeshi(hzguodeshi@corp.netease.com)
 * --------------------------------------------
 */

import React, {Component, PropTypes} from 'react';

function getStyles(props) {

    return {
        width: props.width,
        bottom: 0,
        display: 'block',
        backgroundColor: props.backgroundColor || '#2ac1bc',
        height: '0.03rem',
        marginTop: '-0.03rem',
        position: 'relative',
        transition: 'transform 1s cubic-bezier(0.23, 1, 0.32, 1) 0ms',
        transition: '-webkit-transform 1s cubic-bezier(0.23, 1, 0.32, 1) 0ms',
        WebkitTransition: 'transform 1s cubic-bezier(0.23, 1, 0.32, 1) 0ms',
        WebkitTransition: '-webkit-transform 1s cubic-bezier(0.23, 1, 0.32, 1) 0ms',
        transform: `translate3d(${props.left},0,0)`,
        WebkitTransform: `translate3d(${props.left},0,0)`
    };
}

class InkBar extends Component {
    static propTypes = {
        backgroundColor: PropTypes.string,
        style: PropTypes.object,
        width: PropTypes.string
    };

    render() {
        let styles = getStyles(this.props);
        return (<div style={Object.assign(styles, this.props.style)}/>)
    }
}

export default InkBar;
