import React from 'react';
import NativePlat from 'extend/Util/NativePlat'
import './pageHead.scss';
import Notification from 'components/Notification/Notification'
import Util from 'extend/Util/Util'
import {
  userObj
  } from 'extend/Util/initial.js'

export default class PageHead extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      enter: false
    }
  }

  static defaultProps = {
    cartNum: 0
  };

  leave() {
    this.setState({
      enter: false
    });
  }

  enter() {
    this.setState({
      enter: true
    });
    setTimeout(this.leave.bind(this), 1000);
  }

  handleClick() {
    if (userObj.isLogin) {
      location.href = '../../sijiPages/Cart'
    } else {
      this.enter();
      NativePlat.toPage("yqg-link://pageStr=10")
    }
  }

  handleBackClick() {
    Util.back();
  }

  render() {
    let cartNum = this.props.cartNum;
    var style = {};
    if (Util.isIos()) {
      var baseSize = parseInt(document.documentElement.style.fontSize, 10);
      var height = (baseSize * 0.44 + 20) + "px"
      style = {
        height: height,
        paddingTop: "20px"
      }
    }
    return (
      <div className="m-page-head" name='top' style={style}>
        <div className="return-wrap">
          <i id="icon-return" className="sprite icon-return-white" onClick={this.handleBackClick.bind(this)}></i>
        </div>
        <div id="title" className='title'></div>
        <div id="icon-cart" className="sprite icon-cart-white" onClick={this.handleClick.bind(this)}>{cartNum > 0 ? (cartNum <= 10 ?
          <span className="sku-num" id="cartNum">{cartNum}</span> : <span className="sku-num" id="cartNum">10</span>) : null}
        </div>
        <Notification enter={this.state.enter} leave={this.leave.bind(this)}>您还没有登录哦</Notification>
      </div>
    )
  }
}