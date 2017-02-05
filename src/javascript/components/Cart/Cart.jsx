/**
 * @author hzzhouming
 * 购物车实现组件
 */
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Util from "extend/common/util";
import CookieUtil from "extend/common/CookieUtil";
import RequestUtil from "extend/common/RequestUtil";
import LoginUtil from "extend/login/loginUtil";
import './Cart.scss'
import SelectButton from 'components/SelectButton/SelectButton.jsx'
import Rodal from 'components/modal/modal.js'
import CartEmpty from './CartEmpty.jsx'
import ShopPrdtList from './Prdt/ShopPrdtList.jsx'
import InvalidPrdtList from './Prdt/InvalidPrdtList.jsx'
import CartFoot from './CartFoot.jsx'
import Notification from 'components/Notification/Notification.jsx'
import Confirm from 'components/Confirm/Confirm';
import WeixinUtil from "extend/common/WeixinUtil";

import CartSkuItem1 from 'data/CartSkuItem1.json';
import CONSTANTS from 'extend/constants/constants.json';

export default
class Cart extends Component {
  constructor(props) {
    super(props);

    const userId = CookieUtil.getCookie("userId"),
      uId = CookieUtil.getCookie("uid");

    this.state = {
      userId,
      uId,
      cartDetail: {   //购物车详情
        shopList: [{
          actionList: []
        }],
        invalidSkuList: []
      },
      totalPrice: 0,
      selectedIdList: [],
      deleteIdList: [],
      modalType: 0,   //弹出框类型
      visible: false,
      animation: 'zoom',
      enter: false,  //提示信息显示
      message: "",  //提示信息显示内容
      submitStatus: 0, //提交购物车按钮  0 可提交 1 提交中 2 购物车错误不可提交
    }
  }

  componentDidMount() {
    this.initAuth();
    
    WeixinUtil.hideWeixinMenu();
  }

  initAuth() {
    let appInfo = {
      env: 'WX',
    };

    let extraParam = {
      pageId: 'Cart',
      queryObj: {},
      options: {},
    };

    LoginUtil.login({
      appInfo,
      extraParam,
    }, (userMsg, gotStatus) => {
      this.authCallback(userMsg, gotStatus);
      this.setState({
        userId: userMsg.id,
        uId: userMsg.uid,
      }, () => this.getCartDetail());
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

  /**
   * 获取购物车详情
   * @return {[type]} [description]
   */
  getCartDetail(){
    let param = {
      // url : `cart/getCartDetail?userId=34&uid=abcdefg`,
      url : `cart/getCartDetail`,
      method : 'GET',
      data: {
        userId: this.state.userId,
        uid: this.state.uId,
      },
      successFn : (data) => {
        // data = CartSkuItem1;
        if (data.code == 0) {
          let skusidList = this.getIdList(data);
          if(skusidList.length > 0){
            this.props.setEmptyStatus(false);
          }
          this.setState({
            cartDetail: data.result.cartDetail,
            skuidList: skusidList,
            selectedIdList: skusidList,
            totalPrice: data.result.cartDetail.totalPrice,
            submitStatus: 0
          });
        } else {
          this.setErrorMessage({message: "获取购物车数据失败"});
        }
      },
      errorFn : (data) => {
        this.setErrorMessage({message: CONSTANTS.MSG.NETWORK.NETWORK_EXCEPTION});
      }
    };
    RequestUtil.fetch(param);
  }

  /**
   *
   * @param  {[String]} animation [动画类型]
   * @param  {[String]} type      [modal类型]
   * @param  {[String]} id        [删除购物车item的sku的id,非必须]
   * @return {[null]}           [description]
   */
  show(animation, type, id) {
    this.setState({
      modalType: type,
      animation: animation,
      visible: true,
      deleteid: id
    })
  }

  /**
   * 隐藏modal
   * @return {[null]} [description]
   */
  hide() {
    this.setState({
      type: 0,
      visible: false
    })
  }

  /**
   * 设置提示信息并显示
   * @param {[Object]} data [{message："提示信息"}]
   */
  setErrorMessage(data) {
    let message = data&&data.message || CONSTANTS.MSG.NETWORK.NETWORK_EXCEPTION;
    this.setState({
      message: message,
      submitStatus: 0
    }, function () {
      this.enter();
    }.bind(this))
  }

  /**
   * 获取购物车所有商品的sku的id集合
   * @param  {[Object]} data [购物车详情数据]
   * @return {[Array]}      [sku的id集合]
   */
  getIdList(data) {
    let actionList = [],
      skus = [],
      skusidList = [];
    data.result.cartDetail.shopList.forEach(function (ele) {
      actionList = actionList.concat(ele.actionList);
    })
    actionList.forEach(function (ele) {
      skus = skus.concat(ele.skuList);
    })
    skus.forEach(function (ele) {
      skusidList = skusidList.concat(ele.id);
    })
    return skusidList;
  }

  /**
   * 全选按钮点击事件
   * @return {[null]} [description]
   */
  handleAllSelectedClick() {
    if (this.state.submitStatus === 1) {
      return
    }
    let value = this.state.selectedIdList.length > 0 && this.state.skuidList.length === this.state.selectedIdList.length;
    let selectedIdList = value ? [] : this.state.skuidList
    this.setState({
      selectedIdList: selectedIdList
    })
    Util.throttle(this.handleAllSelected, this)
  }

  /**
   * 全选按钮点击ajax请求处理
   * @return {[null]} [description]
   */
  handleAllSelected() {
    let value = this.state.selectedIdList.length > 0 && this.state.skuidList.length === this.state.selectedIdList.length;
    let param = {
      // url: `cart/selectCartSku?userId=133&uid=abcdefg&selectedIdList=${JSON.stringify(value ? this.state.skuidList : [])}`,
      url : `cart/selectCartSku`,
      method : 'GET',
      data: {
        userId: this.state.userId,
        uid: this.state.uId,
        selectedIdList: JSON.stringify(value ? this.state.skuidList : []),
      },
      successFn : (data) => {
        if (data.code == 0) {
          this.setState({
            totalPrice: data.result.totalPrice,
          })
        } else {
          this.setErrorMessage(data);
        }
      },
      errorFn : (data) => {
        this.setErrorMessage(CONSTANTS.MSG.NETWORK.NETWORK_EXCEPTION);
      }
    };
    RequestUtil.fetch(param);
  }

  /**
   * 购物车删除单品
   * @param  {[String]} id [删除单品sku的id]
   * @return {[null]}    [description]
   */
  handleDelete(id) {
    let arrId = [].concat(id);
    let selectedIdList = [].concat(this.state.selectedIdList);
    let skusidList = [].concat(this.state.skuidList);
    Util.dislodge(selectedIdList, arrId);
    Util.dislodge(skusidList, arrId);
    let deleteIdList = Util.merge(this.state.deleteIdList, arrId);

    let param = {
      url : `cart/deleteCart`,
      method : 'GET',
      data: {
        userId: this.state.userId,
        uid: this.state.uId,
        idList: JSON.stringify(arrId),
        selectedIdList: JSON.stringify(selectedIdList),
      },
      successFn : (data) => {
        if (data.code == 0) {
          this.setState({
            skuidList: skusidList,
            selectedIdList: selectedIdList,
            deleteIdList: deleteIdList,
            totalPrice: data.result.totalPrice
          });
          if(skusidList.length===0){
            this.props.setEmptyStatus(true);
          }
        } else {
          this.setErrorMessage(data);
        }
      },
      errorFn : (data) => {
        this.setErrorMessage(CONSTANTS.MSG.NETWORK.NETWORK_EXCEPTION);
      }
    };
    RequestUtil.fetch(param);
  }

  /**
   * 清除购物车失效商品
   * @return {[null]} [description]
   */
  clearInvalidSkus() {
    let skuids = [];
    this.state.cartDetail.invalidSkuList.forEach(function (ele, index) {
      skuids.push(ele.id);
    });

    let param = {
      url : `cart/cartDeleteInvalid`,
      method : 'GET',
      data: {
        userId: this.state.userId,
        uid: this.state.uId,
        selectedIdList: JSON.stringify(skuids),
      },
      successFn : (data) => {
        if (data.code == 0) {
          let cartDetail = Util.deepClone(this.state.cartDetail);
          cartDetail.invalidSkuList = [];
          this.setState({
            cartDetail: cartDetail
          });
        } else {
          this.setErrorMessage(data);
        }
      },
      errorFn : (data) => {
        this.setErrorMessage(CONSTANTS.MSG.NETWORK.NETWORK_EXCEPTION);
      }
    };
    RequestUtil.fetch(param);
  }

  /**
   * 购物车提交
   * @submitStatus{1正在提交重复点击直接返回}
   * @submitStatus{0正常且购物车勾选数量为0不处理}
   * @submitStatus{3购物车错误 提示}
   * @return {[null]} [description]
   */
  handleSubmit() {
    if (this.state.submitStatus === 1) {
      return;
    } else if (this.state.submitStatus === 0) {
      if (this.state.selectedIdList.length === 0) {
        return
      }
      this.setState({
          submitStatus: 1
        },
        function () {
          let selectedIdList = this.state.selectedIdList.join(',');
          let param = {
            url : `cart/cartConfirm`,
            method : 'GET',
            data: {
              userId: this.state.userId,
              uid: this.state.uId,
              selectedIdList: JSON.stringify(this.state.selectedIdList),
            },
            successFn : (data) => {
              if (data.code == 0) {
                this.setState({
                  submitStatus: 0
                })
                let orderToCommit = data.result;
                location.href = "../ConfirmOrder/index.html?selectedIdList=" + selectedIdList;
              } else if (data.code === 300001) {
                this.setState({
                  modalType: 2,
                  submitStatus: 0,
                  visible: true
                })
              }else{
                 this.setErrorMessage(data);
              }
            },
            errorFn : (data) => {
              this.setErrorMessage(CONSTANTS.MSG.NETWORK.NETWORK_EXCEPTION);
            }
          };
          RequestUtil.fetch(param);

        }.bind(this))
    } else {
      this.setErrorMessage({message: "刷新购物车重试"});
    }
  }

  setSubmitStatus(value){
    this.setState({
      submitStatus: value
    })
  }

  /**
   * modal组件点击事件 按钮背景改变 modal消失
   * @param  {[按钮类型]} type [{0:yes, 1:no, 2：confirm}}]
   * @return {[type]}      [description]
   */
  handleModalClick(type) {
    let dom;
    if (type === 0) {
      dom = this.refs.yes;
    } else if (type === 1) {
      dom = this.refs.no;
    } else {
      dom = this.refs.confirm;
    }
    dom.style.backgroundColor = "#E2E7EA";
    if (type === 0) {
      this.handleDelete(this.state.deleteid);
    }
    if (type === 2) {
      window.location.reload();
    }

    setTimeout(function () {
      this.hide();
      dom.style.backgroundColor = "#fff";
    }.bind(this), 100)
  }

  /**
   * 提示组件Notification消失
   * @return {[type]} [description]
   */
  leave() {
    this.setState({
      enter: false
    });
  }

  /**
   * 提示组件Notification出现，2s后自动消失
   * @return {[type]} [description]
   */
  enter(message = this.state.message) {
    this.setState({
      enter: true,
      message,
    });
    setTimeout(function () {
      this.leave()
    }.bind(this), 2000)
  }

  render() {
    if (!this.state.skuidList) {
      return <Notification enter={this.state.enter} leave={this.leave.bind(this)}>{this.state.message}</Notification>;
    }
    if (this.state.skuidList.length === 0 && (this.state.cartDetail.invalidSkuList && this.state.cartDetail.invalidSkuList.length === 0)) {
      return (
        <CartEmpty />
      )
    } else {
      let _this = this;
      //全选按钮状态判定
      let allSelected = this.state.selectedIdList.length > 0 && this.state.skuidList.length === this.state.selectedIdList.length;
      //购物车提交按钮判定
      let submitStatus = (this.state.submitStatus === 0 && this.state.selectedIdList.length === 0) ? 3 : this.state.submitStatus;
      let shops = this.state.cartDetail.shopList.map(function (ele, index) {
        return (<ShopPrdtList
          key={ele.id} shopDetail={ele}
          selectedIdList={_this.state.selectedIdList}
          that={_this} />)
      })
      let modal1 = (
        <div className="m-modal">
          <div className="row1">是否删除该商品</div>
          <div className="row2">
            <div className="item yes" ref="yes" onClick={this.handleModalClick.bind(this, 0)}>确定</div>
            <div className="item no" ref="no" onClick={this.handleModalClick.bind(this, 1)}>取消</div>
          </div>
        </div>
      )
      let modal2 = (
        <div className="m-modal">
          <div className="row1 multi">
            <div className="line1">抱歉，有商品告罄或下架</div>
            <div className="line2">请返回购物车中重新确认商品</div>
          </div >
          <div className="row2 confirm" ref="confirm" onClick={this.handleModalClick.bind(this, 2)}>返回购物车</div>
        </div>
      )
      // if (Util.isIos()) {
      //   let baseSize = parseInt(document.documentElement.style.fontSize, 10);
      //   let height = (baseSize * 0.44 + 20) + "px"
      //   style = {
      //     paddingTop: height
      //   }
      // }
      return (
        <div className="m-cart">
          {shops}
          {this.state.cartDetail.invalidSkuList && this.state.cartDetail.invalidSkuList.length > 0 ?
            (<InvalidPrdtList 
              that={_this} 
              invalidSkuList={this.state.cartDetail.invalidSkuList}
              clearInvalidSkus={this.clearInvalidSkus.bind(this)}/>) : ""
          }
           {this.state.skuidList && this.state.skuidList.length > 0 ? <CartFoot pending={submitStatus}
                    allSelected={allSelected} 
                    handleAllSelected={this.handleAllSelectedClick.bind(this)}
                    price={this.state.totalPrice} 
                    sumCount={this.state.selectedIdList.length}
                    handleSubmit={this.handleSubmit.bind(this)}/> : null}
          <Rodal width={2.5} visible={this.state.visible} onClose={this.hide.bind(this)} animation={this.state.animation} showCloseButton={false}>
            {this.state.modalType === 1 ? modal1 : (this.state.modalType === 2 ? modal2 : "")}
          </Rodal>
          <Notification enter={this.state.enter} leave={this.leave.bind(this)}>{this.state.message}</Notification>
        </div>
      )
    }
  }
}

