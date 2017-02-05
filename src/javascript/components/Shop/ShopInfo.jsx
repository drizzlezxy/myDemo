import React from 'react';
import 'scss/base.scss';
import './ShopInfo.scss';
import Util from 'extend/Util/Util';
import NativePlat from 'extend/Util/NativePlat';

export default class ShopInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      distance:'0M'
    }
  }

  componentWillReceiveProps(nextProps){
    let shopLat = nextProps.shopInfo.latitude;
    let shopLng = nextProps.shopInfo.longitude;
    NativePlat.getUserPosition(function(data){
      data=Util.formatData(data);
      let myLat=data.latitude;
      let myLng=data.longitude;
      let distance = Util.computeDistance(shopLat,shopLng,myLat,myLng);
      if(distance && distance<=1){
        distance = parseInt(distance*1000)+'M';
      }else if(distance && distance>1){
        distance = distance.toFixed(1) + 'KM';
      }else{
        distance = '0M';
      }
      this.setState({
        distance:distance
      })
    }.bind(this))
  }

  handleClick(){
    NativePlat.invokeNavigation(""+this.props.shopInfo.latitude, ""+this.props.shopInfo.longitude, this.props.shopInfo.address);
  }

  render() {

    return (
      <div className="m-shopInfo">
        <div className="address-wrap">
          <i className="sprite icon-location"></i>
          <div className="address">
            <div>{this.props.shopInfo.address}</div>
            <div className="distance">据您当前位置<span className="dis-value">{this.state.distance}</span></div>
          </div>
          <div className="navigation-wrap">
            <i className="sprite icon-navigation"></i>
            <a className="navigation" onClick={this.handleClick.bind(this)}>去这里</a>
          </div>

        </div>
        <div className="opentiem-wrap">
          <i className="sprite icon-opentime"></i>
          <span className="opentime">{this.props.shopInfo.openTime}</span>
        </div>
      </div>
    )
  }
}
