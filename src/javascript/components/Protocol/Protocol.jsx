/**
 * Created by hzduanchao on 2016/7/2.
 */
import React from 'react';
import Util from 'extend/common/util';
import './protocol.scss';

export default class Protocol extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      checked: props.checked,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (Util.isExisty(nextProps.checked)) {
      this.setState({
        checked: nextProps.checked,
      });
    }
  }

  handleClick() {
    this.props.onProtocolChange && this.props.onProtocolChange();
  }

  render() {
    let {checked} = this.state;
    return (
      <div className="m-protocol">
        <i className={checked?"checkbox active":"checkbox"}
           onClick={this.handleClick.bind(this)}></i>我同意<a href="../Protocol/index.html">《四季平台服务协议》</a>
      </div>
    )
  }
}