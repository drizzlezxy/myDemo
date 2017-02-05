import React, {Component} from 'react'
import './PrdtInfo.scss'
import ItemModalBody from 'components/modal/ItemModalBody.js'
import ItemModalFoot from 'components/modal/ItemModalFoot'
import Action from 'components/Action/Action'
import {userObj} from 'extend/Util/initial.js'
import Util from 'extend/Util/Util'
import NativePlat from 'extend/Util/NativePlat'

export default class PrdtInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSkuIndex: 0,
      buyNum: 1,
      prdtStatus: 0,
      isConfirm: false
    }
  }

  componentWillReceiveProps(next){
    if (next.prdtInfo.skuList.length !== 0) {
      this.getValidItemIndex(next.prdtInfo.skuList)
    }
  }

  getValidItemIndex(skuList) {
    let validList = [];//可选规格列表 l=length l=0 根据prdtStatus显示 l=1 加入购物车 l>1 弹窗
    let statusList = [];//规格状态列表
    let prdtStatus = this.state.prdtStatus;//商品状态
    let activeSkuIndex = this.state.activeSkuIndex;//第一个可售规格
    if(skuList.length===0) return ;
    for (let i = 0, l = skuList.length; i < l; i++) {
      if (skuList[i].status === 1) {
        validList.push(i);
        if (validList.length > 1) {
          break;
        }
      }
      if (skuList[i].status === 2) {
        statusList.push(2);
      }
      if (skuList[i].status === 3) {
        statusList.push(3);
      }
    }
    if (validList.length === 0) {
      if (statusList.indexOf(2) === -1 && statusList.indexOf(3) !== -1) {
        activeSkuIndex = 0;
        prdtStatus = 3;
      } else {
        activeSkuIndex = 0;
        prdtStatus = 2;
      }
    } else if (validList.length === 1) {
      activeSkuIndex = validList[0];
      prdtStatus = 1;
    } else {
      activeSkuIndex = validList[0];
      prdtStatus = 1;
    }
    activeSkuIndex = this.state.activeSkuIndex!==0 ? this.state.activeSkuIndex : activeSkuIndex;
    this.setState({
      prdtStatus: prdtStatus,
      activeSkuIndex: activeSkuIndex
    });
  }

  handleIndexChange(index) {
    this.setState({
      activeSkuIndex: index,
      buyNum:1
    });
  }

  /*
   * 更改购买数量时的回调函数
   */
  handleBuyNumChange(num) {
    this.setState({
      buyNum: num
    })
  }

  /**
   * [立即购买，做按钮重复点击防护]
   * @return {[null]} [description]
   */
  confirmBuy() {
    if (userObj.isLogin&& (!this.state.isConfirm)) {
      var url = '/cartConfirm';
      var method = 'GET';
      var param = {
        'atonceSkuId': this.props.prdtInfo.skuList[this.state.activeSkuIndex].id,
        'atonceCount': this.state.buyNum
      };
      var successfn = function(data) {
        if (data.code == 0) {
          var param = $.param(data.result);
          this.setState({
            isConfirm: false
          })
          //跳转到订单确认页
          window.location.href = "../../sijiPages/Order?orderToCommit=" + param;
        } else {
            this.props.setErrorMessage(data)
        }
      };
      var errorfn = function(data) {
        this.setState({
          message: '网络问题',
          isConfirm: false
        }, ()=>{this.enter()});
      };      
      this.setState({
        isConfirm: true
      }, ()=>{
        Util.requestData(url, method, param, successfn.bind(this), errorfn.bind(this));
      })    
    } else {
      this.props.setErrorMessage({message: '您还没有登录'})
      NativePlat.toPage("yqg-link://pageStr=10");
    }
  }
  /*
   * 加入购物车的回调，调用从index.jsx传递过来的addToCart方法，更改页面顶部购物车数量
   */
  handleAddToCart() {
    let skuId = this.props.prdtInfo.skuList[this.state.activeSkuIndex].id;
    let count = this.state.buyNum;
    this.props.addToCart(skuId, count);
  }

  render() {
    var prdtStatus = this.state.prdtStatus; 
    var viewIndex = this.state.activeSkuIndex >= 0 ? this.state.activeSkuIndex : 0; //显示Index
    var foot="";
    var activeSkuIndex=this.state.activeSkuIndex;
    if(prdtStatus===1){
      foot=<ItemModalFoot activeIndex={viewIndex} item={this.props.prdtInfo} 
                          numChange={this.handleBuyNumChange.bind(this)} 
                          onAtonce={this.confirmBuy.bind(this)}
                          onAddCart={this.handleAddToCart.bind(this)}/>
    }else if(prdtStatus===2){
      foot=<div className="m-foot-base">已告罄</div>
      activeSkuIndex=-1;
    }else if(prdtStatus===3){
      foot=<div className="m-foot-base">已下架</div>
      activeSkuIndex=-1;
    }
    return (
      <div className="m-prdt">
        <div className="name">{this.props.prdtInfo.name}</div>
        <div className="desc">{this.props.prdtInfo.desc}</div>
        <div className="price">
        ￥
          <span className="pay-price">{this.props.prdtInfo.skuList[viewIndex]?this.props.prdtInfo.skuList[viewIndex].payPrice:""}</span>
          <span className="origin-price">￥{this.props.prdtInfo.skuList[viewIndex]?this.props.prdtInfo.skuList[viewIndex].originPrice: ""}</span>
        </div>
        <Action actionList={this.props.prdtInfo.actionList} />
        <ItemModalBody activeIndex={activeSkuIndex} item={this.props.prdtInfo} activeIndexChange={this.handleIndexChange.bind(this)}/>
        {foot}
        <Slogan />
      </div>
    )
  }
}

class Slogan extends Component {
  render() {
    return (
      <div className="slogan">
        <div className="item">
          <i className='icon-slogan sprite icon-local'></i>
          <span>本地原产</span>
        </div>
        <div className="item">
          <i className='icon-slogan sprite icon-Return'></i>
          <span>15天退货</span>
        </div>
        <div className="item">
          <i className='icon-slogan sprite icon-pay'></i>
          <span>坏损包赔</span>
        </div>
      </div>
    )
  }
}