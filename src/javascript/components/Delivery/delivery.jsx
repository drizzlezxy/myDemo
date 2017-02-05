/**
 * Created by hzduanchao on 2016/6/30.
 */
import React from 'react';
import CardUnit from 'components/CardUnit/CardUnit';
import './delivery.scss';
import NativePlat from 'extend/Util/NativePlat';
import Util from 'extend/Util/Util';


export default class Delivery extends React.Component {
  constructor(props) {
    super(props);
  }

  handleDeliveryChange(value) {
    this.props.onExpressTypeChange(value);
  }

  //handleClick(value) {
  //  this.props.onExpressTypeChange(value);
  //  //跳转到Native填写地址
  //  this.jumpToNative();
  //}

  jumpToNative(expressType) {
    NativePlat.getUserAddress(function(data){
      this.props.onAddressChange(data,expressType);
    }.bind(this));
  }

  render() {
    let deliveryMethod;
    let expressType = this.props.expressType;
    if (expressType === -1 || this.props.address == ''|| this.props.address == null){
      deliveryMethod = <div className="u-noaddress" onClick={this.jumpToNative.bind(this,2)}>
        <i className={expressType===2?"sprite radio active":"sprite radio"} type="radio" value="2"></i>
        <label className="label">添加收货地址</label><i className="sprite arrow"></i>
      </div>;
    } else {
      let address = this.props.address;
      let addressDetail;
      if(address){
        if(address.provinceName==address.cityName){
          addressDetail = (address.cityName||'') + (address.districtName||'') + (address.streetName||'');
        }else{
          addressDetail = (address.provinceName||'') + (address.cityName||'') + (address.districtName||'') + (address.streetName||'');
        }
      }else{
        addressDetail='';
      }
      //let addressDetail = address?((address.provinceName||'') + (address.cityName||'') + (address.districtName||'') + (address.streetName||'')):'';
      let addressSuffix = address?(address.addressSuffix||''):'';
      deliveryMethod = <div className="u-hasaddress">
        <i className={expressType===2?"sprite radio active":"sprite radio"} type="radio" value="2"
           onClick={this.handleDeliveryChange.bind(this,2)}></i>
        <div className="wrap" onClick={this.jumpToNative.bind(this,2)}>
          <div className="address-detail">
            <div className="userinfo">
              <span>{address?address.name||'':''}</span><span className="phone">{address?address.phone||'':''}</span>
              {address && address.isDefault==1 ? <span className="default">默认</span> : null}
            </div>
            <div className="address">
              <span>{addressDetail}</span><span>{addressSuffix}</span>
            </div>
          </div>
          <i className="sprite arrow"></i>
        </div>
      </div>
    }
    //var style={};
    //if (Util.isIos()) {
    //  var baseSize = parseInt(document.documentElement.style.fontSize, 10);
    //  var height = (baseSize * 0.44 + 20) + "px"
    //  style = {
    //    marginTop:height
    //  }
    //}else{
    //  style = {
    //    marginTop:0.44+'rem'
    //  }
    //}
    return (
      <CardUnit title="收货方式">
        {deliveryMethod}
        <div className="u-nodelivery" onClick={this.handleDeliveryChange.bind(this,1)}>
          <i className={expressType===1?"sprite radio active":"sprite radio"} type="radio" value="1"></i>
          <label className="label">现场自提</label></div>
      </CardUnit>
    )
  }
}

