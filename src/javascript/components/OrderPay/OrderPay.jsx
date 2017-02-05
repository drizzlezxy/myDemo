/**
 * Created by hzduanchao on 2016/7/2.
 */
import React from 'react';
import Modal from 'components/modal/modal';
import Util from 'extend/Util/Util';
import Notification from 'components/Notification/Notification';
import './orderPay.scss';

export default class OrderPay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      enter: false,
      error: ''
    }
  }

  show() {
    this.setState({
      visible: true
    })
  }

  hide() {
    this.setState({
      visible: false
    })
  }


  handleClick(flag) {
    if (flag.addressFlag) {
      this.show();
    } else if (flag.protocolFlag || flag.btnFlag || flag.priceFlag) {
      return;
    } else if(flag.invoiceFlag){
      this.setState({
        error:'请填写公司抬头'
      },function(){
        this.enter();
      }.bind(this))
    }else{
      this.props.commitOrder();
    }
  }

  handleAddressClick() {
    this.hide();
  }

  leave() {
    this.setState({
      enter: false
    });
  }

  enter() {
    this.setState({
      enter: true
    });
    setTimeout(function () {
      this.leave()
    }.bind(this), 1000)
  }

  render() {
    let orderDetail = this.props.orderDetail;
    let flag = {
      addressFlag: this.props.addressFlag==-1,
      protocolFlag: !this.props.protocolFlag,
      btnFlag: !this.props.btnFlag,
      invoiceFlag: (this.props.invoiceType==2) && (this.props.invoiceTitle==''),
      priceFlag: this.props.finalPrice==0
    };
    var priceArr = Util.priceFormat(orderDetail.finalPrice);
    return (
      <div className="m-order-pay">
        <div className="wrap">
          <div className="pay-price"><span>合计</span>
            <span className="small">￥</span>
            <span className="big">{priceArr[0]}</span>
            <span className="small">{priceArr[1]}</span>&nbsp;
            <span className="carriageFee">(含运费{orderDetail.carriageFee || 0}元)</span></div>
          <div className={flag.btnFlag||flag.protocolFlag||flag.invoiceFlag || flag.priceFlag ?"pay-button disabled":"pay-button"}
               onClick={this.handleClick.bind(this,flag)}>立即支付
          </div>
        </div>
        <Modal visible={this.state.visible}
               onClose={this.hide.bind(this)}
               showCloseButton={false}
               width={2.9}>
          {flag.addressFlag ? <div className="order-body">您还未选择收货方式</div> : null}
          {flag.addressFlag ? <div className="order-foot" onClick={this.handleAddressClick.bind(this)}>确定</div> : null}
        </Modal>
        <Notification enter={this.state.enter} leave={this.leave.bind(this)}>{this.state.error}</Notification>
      </div>
    )
  }
}