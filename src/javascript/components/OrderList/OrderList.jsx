import React, {Component} from 'react';
import OrderCard from 'components/OrderCard/OrderCard';
import Util from 'extend/common/util';
import LoginUtil from 'extend/login/loginUtil';
import './orderList.scss';

export default class OrderList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      orderList: props.orderList,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (Util.isExisty(nextProps.orderList)) {
      this.setState({
        orderList: nextProps.orderList,
      });
    }
  }

  initAuth() {
    let appInfo = {
      env: 'WX',
    };

    let extraParam = {
      pageId: 'OrderList',
      queryObj: {},
      options: {},
    };

    LoginUtil.login({
      appInfo,
      extraParam,
    }, (userMsg, gotStatus) => {
      this.authCallback(userMsg, gotStatus);
    });
  }

  authCallback(userMsg, gotStatus) {
    const {gotError, gotInfoWrong, gotNotBinded, gotInfo} = LoginUtil.loginResultStatus;
    switch(gotStatus) {
      case gotError: 
      case gotInfoWrong:
        break;

      case gotNotBinded:
        LoginUtil.toBindPhone();

        break;

      case gotInfo:
        // this.setUserInfo(userMsg);
        break;

      default:
        break;
    }
  }

  handleRefresh() {
    this.props.handleRefresh && this.props.handleRefresh();
  }

  render() {
    let that = this;
    let orderInfo = this.state.orderList.map(function (item, index) {
      let {
        id,
        orderStatus,
        submitDate,
        orderTime,
        orders,
        buttonList,
        totalPrice,
        shopName,
        isGroup,
      } = item;

      return (
        <OrderCard 
          key={`ordercard-${id}-${isGroup}-${index}`}
          id={id}
          orderStatus={orderStatus}
          submitDate={submitDate}
          orderTime={orderTime}
          orders={orders}
          buttonList={buttonList}
          totalPrice={totalPrice}
          shopName={shopName}
          isGroup={isGroup}
          onRefresh={that.handleRefresh.bind(that)}
          setModalInfo={that.props.setModalInfo}
        />
      )
    });
    return (
      <div className="m-order-list">
        {orderInfo}
      </div>
    )
  }
}