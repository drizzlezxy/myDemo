import React, {Component} from 'react';
import 'scss/base.scss';
import Util from 'extend/Util/Util'
import './ShopHead.scss';

export default class ShopHeader extends Component {
  static defaultProps = {
    shopInfo: {
      imageList: []
    }
  };

  render() {
    let styleShop = {};
    let styleInfo = {}
    if (Util.isIos()) {
      var baseSize = parseInt(document.documentElement.style.fontSize, 10);
      var heightS = (baseSize * 2.12 + 20) + "px";
      var heightI = (baseSize * 0.35 + 20) + "px";
      styleShop = {
        height: heightS
      }
      styleInfo = {
        marginTop: heightI
      }
    }
    return (
      <div className='m-head-shop' style={styleShop}>
        <div className='background'>
          <img className="backimg" src={this.props.shopInfo.imageList[0]}/>
          <div className='mask'></div>
        </div>
        <div className='shopInfo' style={styleInfo}>
          <img src={this.props.shopInfo.logo} className='shopavator'/>
          <div className='title'>{this.props.shopInfo.name}
            <a href={"../../sijiPages/Commerce?businessId=" + this.props.shopInfo.userId}>
              <i className='sprite icon-gs'></i>
            </a>
          </div>
          <div className='detail'>{this.props.shopInfo.desc}</div>
        </div>
      </div>
    )
  }
}