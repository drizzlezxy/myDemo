/**
 * Created by hzduanchao on 2016/7/6.
 */

import React from 'react';
import Util from "extend/common/util";
import HistoryUtil from "extend/common/HistoryUtil";
import RedirectUtil from "extend/common/RedirectUtil";
import './payStatus.scss';

export default class PayFail extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    HistoryUtil.addHistoryBackListener(() => {
      RedirectUtil.redirectPage({
        pageName: 'OrderList',
        options: {
          type: 0,
        }
      });
    });
  }

  payAgain(){
    location.href = Util.getNewUrlByPageName('ConfirmOrder', Util.parseQueryString(location.href));
  }

  checkOrder(){
    location.href = Util.getNewUrlByPageName('OrderDetail2', Util.parseQueryString(location.href));
  }

  render() {
    return (
      <div className="m-pay-status">
        <i className="img pay-fail"></i>
        <span className="text text-fail">支付失败</span>
        <a href="javascript:void(0)" className="two-btn" onClick={this.payAgain.bind(this)}>去付款</a>
        <a href="javascript:void(0)" className="two-btn" onClick={this.checkOrder.bind(this)}>查看订单</a>
      </div>
    )
  }
}