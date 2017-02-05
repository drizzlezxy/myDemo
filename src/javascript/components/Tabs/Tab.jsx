/*
 * --------------------------------------------
 * Tab组件
 * @version  1.0
 * @author   hzguodeshi(hzguodeshi@corp.netease.com)
 * --------------------------------------------
 */
import React, {Component,PropTypes} from 'react';

function getStyles(props) {
  return {
    color: props.selected ? (props.selectedColor || '#2ac1bc') : (props.textColor || '#333'),
    fontSize: '0.14rem',
    width: props.width,
    flex: 1,
    textAlign: 'center',
    textTransform: 'uppercase',
    padding: '0.15rem 0',
  }
}

class Tab extends Component {
  static propTypes = {

    className: PropTypes.string,

    label: PropTypes.node.isRequired,

    onActive: PropTypes.func,

    onTouchTap: PropTypes.func,

    selected: PropTypes.bool,

    textColor: PropTypes.string,

    selectedColor: PropTypes.string,

    style: PropTypes.object,

    value: PropTypes.any.isRequired,

    width: PropTypes.string.isRequired,
  };
  getClassName(){
    const className = this.props.className || '';
    return  this.props.selected ? className + ' active' : className;
  }
  handleTouchTap = (event) => {
    if (this.props.onTouchTap) {
      this.props.onTouchTap(this.props.value,this.props.index,event);
    }
  }

  render() {
    const {
      onActive,
      onTouchTap,
      selected,
      value,
      width,
      label,
      style,
      icon,
      ...other,
    } = this.props;

    const styles = getStyles(this.props);
    const className = this.getClassName();
    return (
      <li onClick={this.handleTouchTap} style = {Object.assign(styles, this.props.style)} className = {className} >
        {label}
      </li>
    );
  }
}

export default Tab;
