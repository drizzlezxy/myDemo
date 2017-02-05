import React, {Component} from 'react';
import Logger from 'extend/common/Logger';
import Util from 'extend/common/util';
import StringUtil from 'extend/common/StringUtil';
import RequestUtil from 'extend/common/RequestUtil';
import RedirectUtil from 'extend/common/RedirectUtil';
import PayUtil from 'extend/common/PayUtil';
import DateUtil from 'extend/common/DateUtil';
import './orderCard.scss';
import CONSTANTS from 'extend/constants/constants.json';

export default class OrderCard extends Component {
  constructor(props) {
    super(props);

    let {
      id,
      orderStatus,
      submitDate,
      orders,
      orderTime,
      buttonList,
      totalPrice,
      shopName,
      isGroup,
    } = props;

    this.state = {
      id,
      orderStatus,
      submitDate,
      orders,
      orderTime,
      buttonList,
      totalPrice,
      shopName,
      isGroup,
      isPending: false,
      pendingText: '',
    }
  }


  static cancelOrder({orderId}, callback) {
    let param = {
      url: 'order/cancelOrder',
      method: 'get',
      data: {
        userId: Util.fetchUserId(),
        orderId,
      },
      successFn: (data) => {
        if (RequestUtil.isResultSuccessful(data)) {
          callback && callback(data.result);
        } else {
           Logger.error(data);
        }
      },
      errorFn: (...args) => {
        alert(CONSTANTS.MSG.NETWORK.NETWORK_EXCEPTION);
      },
    };

    RequestUtil.fetch(param);
  }

  static payOrder({orderId}, callback) {
    let param = {
      url: 'order/recommitOrder',
      method: 'get',
      data: {
        userId: Util.fetchUserId(),
        orderId,
        payChannel: 2,
        openId: Util.fetchOpenId(),
      },
      successFn: (data) => {
        if (RequestUtil.isResultSuccessful(data)) {
          callback && callback(data.result);
        } else {
           alert(data.message);
        }
      },
      errorFn: (...args) => {
        alert(CONSTANTS.MSG.NETWORK.NETWORK_EXCEPTION);
      },
    };

    RequestUtil.fetch(param);
  }

  static viewLogistics({orderId}, callback) {
    RedirectUtil.redirectPage({
      pageName: 'ViewDeliveryDetail',
      options: {
        orderId,
      }
    });
  }

  static confirmOrder({orderId}, callback) {
    let param = {
      url: 'order/confirmReceipt',
      method: 'get',
      data: {
        userId: Util.fetchUserId(),
        orderId,
      },
      successFn: (data) => {
        if (RequestUtil.isResultSuccessful(data)) {
          callback && callback(data.result);
        } else {
           Logger.error(data);
        }
      },
      errorFn: (...args) => {
        alert(CONSTANTS.MSG.NETWORK.NETWORK_EXCEPTION);
      },
    };

    RequestUtil.fetch(param);
  }

  static deleteOrder({orderId}, callback) {
    let param = {
      url: 'order/deleteOrder',
      method: 'get',
      data: {
        userId: Util.fetchUserId(),
        orderId,
      },
      successFn: (data) => {
        if (RequestUtil.isResultSuccessful(data)) {
          callback && callback(data.result);
        } else {
           Logger.error(data);
        }
      },
      errorFn: (...args) => {
        alert(CONSTANTS.MSG.NETWORK.NETWORK_EXCEPTION);
      },
    };

    RequestUtil.fetch(param);
  }

  static viewGroupDetail({orderId}, callback) {
    let param = {
      url: 'posku/getPoOrder',
      method: 'post',
      data: {
        userId: Util.fetchUserId(),
        orderId,
      },
      successFn: (data) => {
        if (RequestUtil.isResultSuccessful(data)) {
          callback && callback(data.result);
        } else {
           Logger.error(data);
        }
      },
      errorFn: (...args) => {
        alert(CONSTANTS.MSG.NETWORK.NETWORK_EXCEPTION);
      },
    };

    RequestUtil.fetch(param);
  }

  static handleClick({type, orderId, orderStatus}, context) {
    switch(type) {
      case 'cancelOrder':
        OrderCard.cancelOrder({orderId, orderStatus}, () => {
          context.props.onRefresh && context.props.onRefresh();
        });
        break;
      case 'payOrder':
        // 订单再支付直接跳转到订单确认页
        RedirectUtil.redirectPage({
          pageName: 'ConfirmOrder',
          options: {
            orderId,
          },
        });
        break;
      case 'viewLogistics':
        OrderCard.viewLogistics({orderId, orderStatus}, () => {
          //alert('view');
        });
        break;
      case 'confirmOrder':
        OrderCard.confirmOrder({orderId, orderStatus}, () => {
           context.props.onRefresh && context.props.onRefresh();
        });
        break;
      case 'deleteOrder':
        OrderCard.deleteOrder({orderId, orderStatus}, () => {
           context.props.onRefresh && context.props.onRefresh();
        });
        break;
      case 'viewGroupDetail':
        OrderCard.viewGroupDetail({orderId, orderStatus}, (result) => {
           let {
            id,
            orderId,
            groupId,
            poSkuId,
            skuId,
            addressId,
            logisticsType,
            isInvoice,
            invoiceTitle,
           } = result;

           RedirectUtil.redirectPage({
            pageName: 'GroupInvite',
            options: {
              groupId,
              poSkuId,
            },
          });

        });
        break;
    }
    Logger.log(type, orderId, orderStatus);
  }

  static orderBtnStretagies = {
    //1查看团详情，2查看物流，3付款，4取消订单，5删除订单，6确认收货，顺序按照数组顺序
    '1': function(orderId, orderStatus, context) {
      return (
          <button key={1} onClick={ () => {
            OrderCard.handleClick({
              type: 'viewGroupDetail', 
              orderId, 
              orderStatus,
            }, context)
          }} className="view">查看团详情</button>
      )
    },
    '2': function(orderId, orderStatus, context) {
      return (
          <button key={2} onClick={ () => {
            OrderCard.handleClick({
              type: 'viewLogistics', 
              orderId, 
              orderStatus,
            }, context)
          }} className="view">查看物流</button>
      )
    },
    '3': function(orderId, orderStatus, context) {
      return (
          <button key={3} onClick={ () => {
            OrderCard.handleClick({
              type: 'payOrder', 
              orderId, 
              orderStatus,
            }, context)
          }} className="pay">付款</button>
      )
    },
    '4': function(orderId, orderStatus, context) {
      return (
          <button key={4} 
            onClick={ () => {
              context.props.setModalInfo({
                visible: true,
                animation: 'zoom',
                msg: '是否取消该订单', 
                handleClick: OrderCard.handleClick.bind(context, {
                      type:'cancelOrder', 
                      orderId, 
                      orderStatus,
                    }, context),
              })
            }}
            className="cancel">取消订单</button>
      )
    },
    '5': function(orderId, orderStatus, context) {
      return (
          <button key={5}
            onClick={ () => {
              context.props.setModalInfo({
                visible: true,
                animation: 'zoom',
                msg: '是否删除该订单', 
                handleClick: OrderCard.handleClick.bind(context, {
                      type:'deleteOrder', 
                      orderId, 
                      orderStatus,
                    }, context),
              })
            }}
            className="del">删除订单</button>
      )
    },
    '6': function(orderId, orderStatus, context) {
      return (
          <button key={6} onClick={ () => {
              context.props.setModalInfo({
                visible: true,
                animation: 'zoom',
                msg: '是否确认收货', 
                handleClick: OrderCard.handleClick.bind(context, {
                      type:'confirmOrder', 
                      orderId, 
                      orderStatus,
                    }, context),
              })
            }}
            className="confirm">确认收货</button>
      )
    },
    '7': function(orderId, orderStatus, context) {
      return null
      // return (
      //     <button key={7} onClick={ () => {
      //       OrderCard.handleClick({
      //         type:'viewGroupDetail', 
      //         orderId, 
      //       }, context)
      //     }} className="view">查看团详情</button>
      // )
    },
    '8': function(orderId, orderStatus, context) {
      return null
      // return (
      //     <button key={7} onClick={ () => {
      //       OrderCard.handleClick({
      //         type:'viewGroupDetail', 
      //         orderId, 
      //       }, context)
      //     }} className="view">查看团详情</button>
      // )
    },
    '9': function(orderId, orderStatus, context) {
      return null
      // return (
      //     <button key={7} onClick={ () => {
      //       OrderCard.handleClick({
      //         type:'viewGroupDetail', 
      //         orderId, 
      //       }, context)
      //     }} className="view">查看团详情</button>
      // )
    },
    '10': function(orderId, orderStatus, context) {
      return null
      // return (
      //     <button key={7} onClick={ () => {
      //       OrderCard.handleClick({
      //         type:'viewGroupDetail', 
      //         orderId, 
      //       }, context)
      //     }} className="view">查看团详情</button>
      // )
    },
  }

  //1. 待支付; 2. 已支付;
  //3. 待发货; 4. 已发货,待签收; 
  //5. 已签收,待确认; 6. 已确认,交易成功; 
  //7. 订单关闭, 用户取消; 
  //8. 订单关闭, 支付超时; 
  //9. 申请退款, 处理中; 
  //10. 退款成功，交易关闭
  //

  // 0:全部 1:待支付 2:待成团 3:待发货 4:待收货
  static orderStatusText = [
    '',
    '待支付',
    '已支付',
    '待发货',
    '已发货',
    '已收货',
    '交易成功',
    '已取消',
    '已关闭',
    '申请退款，处理中',
    '退款成功，交易关闭',
  ]

  static orderStatusClazz = [
    '',
    'order-status paying',
    'order-status payed',
    'order-status deliverying',
    'order-status received',
    'order-status trade-success',
    'order-status cancel',
    'order-status close',
    'order-status refund',
    'order-status refund-close',
  ]

  buildOrderBtns(orderId, orderStatus, buttonList) {
    let context = this;
    let buttonContent = buttonList.map((id, index) => {
      return OrderCard.orderBtnStretagies[''+id](orderId, orderStatus, context);
    });
    return (
      <div className="btn-group clearfix">
        {buttonContent}
      </div>
    );
  }

  getStatusInfo(orderStatus) {
    if (orderStatus === 1) {
      // 待支付定单要15分钟倒计时
      return {
        text: this.state.pendingText,
        clazz: OrderCard.orderStatusClazz[orderStatus],
      }
    }

    return {
      text: OrderCard.orderStatusText[orderStatus],
      clazz: OrderCard.orderStatusClazz[orderStatus],
    }
  }

  getOrderCardContents(orderId, orders) {
    return orders.map(function(order, index) {
      let {
        id,
        prdtIdId,
        name,
        spec,
        price,
        image,
        count,
        orderTime,
        isGroup,
        groupId,
      } = order;

      console.log('image', image);

      let tagContent = isGroup ? 
                       (<div className="tag-container">
                          <div className="tag"></div>
                        </div>) : null;
      let handleOrderCardDetail = () => {
        RedirectUtil.redirectPage({
          pageName: 'OrderDetail2',
          options: {
            orderId,
          },
        });
      };

      return (
        <div 
          key={`order-${orderTime}-${index}`} 
          className="m-order-card"
          onClick={handleOrderCardDetail}
        >
          <img src={image}/>
          <div className="detail">
            {tagContent}
            <div className="detail-name">
              {<div>{name}</div>}
              <div>{spec}</div>
            </div>
            <div className="detail-spec">
              <span>￥{price}</span>
              <span>x {count}</span>
            </div>
            {/*cardDetail.status === 1 ? <div className="status">此地址暂不支持配送</div> : null*/}
          </div>
        </div>
        )
    });
  }


  componentWillReceiveProps(nextProps) {
    if (Util.isExisty(nextProps.id)) {
      this.setState({
        id: nextProps.id,
        orderStatus: nextProps.orderStatus,
        submitDate: nextProps.submitDate,
        shopName: nextProps.shopName,
        orderTime: nextProps.orderTime,
        isGroup: nextProps.isGroup,
        orders: nextProps.orders,
        buttonList: nextProps.buttonList,
        totalPrice: nextProps.totalPrice,
      });
    }
  }


  componentDidMount() {
    let {
      orderStatus,
      orderStatusStr,
      orderTime,
    } = this.state;

    let pendingMins = 15;
    let leftTime = Math.floor((parseInt(orderTime, 10) + (pendingMins * 1000 * 60) - (new Date().getTime())) / 1000);

    leftTime = leftTime < 0 ? 0 : leftTime;

    let countDown = DateUtil.calcCountDownByLeftTime(leftTime);

    [countDown.hours, countDown.minutes, countDown.seconds] = 
    [
      StringUtil.padZeroLeft(countDown.hours, 2),
      StringUtil.padZeroLeft(countDown.minutes, 2),
      StringUtil.padZeroLeft(countDown.seconds, 2)
    ];
 
    let pendingText =  `请在${countDown.minutes}:${countDown.seconds}内支付`;

    if (orderStatus == 1) {
      if (leftTime == 0) {
        clearInterval(this.timer);
        this.setState({
          pendingText: '',
        });
      } else {

        this.timer = setInterval(() => {
          let leftTime = Math.floor((parseInt(orderTime, 10) + (pendingMins * 1000 * 60) - (new Date().getTime())) / 1000);
          let countDown = DateUtil.calcCountDownByLeftTime(leftTime);
          [countDown.hours, countDown.minutes, countDown.seconds] = 
          [
            StringUtil.padZeroLeft(countDown.hours, 2),
            StringUtil.padZeroLeft(countDown.minutes, 2),
            StringUtil.padZeroLeft(countDown.seconds, 2)
          ];
          let pendingText =  `请在${countDown.minutes}:${countDown.seconds}内支付`;
          
          this.setState({
            isPending: true,
            pendingText,
          }, () => {
            //Logger.log(pendingText);
          });
        }, 1000);
        


        let leftTime = Math.floor((parseInt(orderTime, 10) + (pendingMins * 1000 * 60) - (new Date().getTime())) / 1000);
        let countDown = DateUtil.calcCountDownByLeftTime(leftTime);
        [countDown.hours, countDown.minutes, countDown.seconds] = 
        [
          StringUtil.padZeroLeft(countDown.hours, 2),
          StringUtil.padZeroLeft(countDown.minutes, 2),
          StringUtil.padZeroLeft(countDown.seconds, 2)
        ];
        let pendingText =  `请在${countDown.minutes}:${countDown.seconds}内支付`;
        
        this.setState({
          isPending: true,
          pendingText,
        }, () => {
          //Logger.log(pendingText);
        });
      }
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    this.timer = null;
  }

  render() {
    let {
      id,
      orderStatus,
      submitDate,
      orders,
      orderTime,
      buttonList,
      totalPrice,
      isGroup,
      shopName,
      pendingText,
    } = this.state;
    
    let btns = this.buildOrderBtns(id, orderStatus, buttonList);
    let status = this.getStatusInfo(orderStatus);

    if (orderStatus == 1) {
      // 待支付、走支付倒计时
      status.text = pendingText;
    }

    console.log('orderStatus， isGroup', orderStatus, isGroup);

    if (orderStatus == 2) {
      if (isGroup) {
        [status.text, status.clazz] = [
          '拼团进行中', 'order-status group-wating',
        ];
      } else {
        [status.text, status.clazz] = [
          '待发货', 'order-status deliverying',
        ];
      }
    }

    console.log('status', status);
    
    let orderCardContent = this.getOrderCardContents(id, orders);
    if (!Util.isExisty(id)) {
      return (
        <div></div>
      )
    }
    return (
      <a href="javascript:void(0);" className="m-order-card-item">
        <div className="m-order-header">
          <span className="submit-date">{shopName}</span>
          <span className={status.clazz}>{status.text}</span>
        </div>
        {orderCardContent}
        <div className="m-order-footer">
          <span>实付：￥{totalPrice}</span>
          {btns}
        </div>
      </a>
    )
  }
}