/**
 * Created by hzduanchao on 2016/7/1.
 */
import React from 'react';
import CardUnit from 'components/CardUnit/CardUnit';
import './payChannel.scss';

export default class PayChannel extends React.Component {
  constructor(props) {
    super(props);
  }

  handleClick(value) {
    this.props.onPayChannelChange(value);
  }

  render() {
    let payChannel = this.props.payChannel;
    //去掉微信支付
    // let aliPay = <div className="u-paychannel-1" onClick={this.handleClick.bind(this,1)}>
    //   <div className="wrap"><i className={payChannel===1?"sprite radio active":"sprite radio"} type="radio"
    //                            value="1"></i><label className="label"><i className="sprite zhifubao"></i>支付宝</label>
    //   </div>
    // </div>;
    
    let wxPay = 
      <div className="u-paychannel-2" onClick={this.handleClick.bind(this,1)}>
        <i className="radio active"></i>
        <i className={"wx active"} 
           type="radio" 
           value="2">
        </i>
        <label className="label">
          <i className="weixin"></i>
          微信支付
        </label>
      </div>;
    return (
      <CardUnit title="">
        {wxPay}
        {/*aliPay*/}
      </CardUnit>
    )
  }
}