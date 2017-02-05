import React from 'react';
import Util from 'extend/common/util';
import HistoryUtil from 'extend/common/HistoryUtil';
import RedirectUtil from 'extend/common/RedirectUtil';
import './payStatus.scss';

export default class PaySuccess extends React.Component {
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

  goShopping(){
    location.href = '../HomePage/index.html';
  }

  checkOrder(){
    location.href = Util.getNewUrlByPageName('OrderDetail2', Util.parseQueryString(location.href));
  }

  render() {
    return (
      <div className="m-pay-status">
        <i className="img pay-success"></i>
        <span className="text text-success">支付成功</span>
        <a href="javascript:void(0)" className="two-btn" onClick={this.goShopping.bind(this)}>继续购物</a>
        <a href="javascript:void(0)" className="two-btn" onClick={this.checkOrder.bind(this)}>查看订单</a>
      </div>
    )
  }
}