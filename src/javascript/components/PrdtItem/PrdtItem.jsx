import React, {Component} from 'react'
import Counter from 'components/Counter/Counter.jsx'
import Util from "extend/common/util";
import CookieUtil from "extend/common/CookieUtil";
import RequestUtil from "extend/common/RequestUtil";
import './PrdtItem.scss'
import CONSTANTS from 'constants/constants.json';

export default
class PrdtItem extends Component {
  constructor(){
    super();

    this.state = {
      remainCount : -1
    }
  }

   /**
   * 商品数量更改接口
   * @param  {[String]} id  [商品id]
   * @param  {[Int]} num [修改后的商品数量]
   * @return {[type]}     [description]
   */
  handlePrdtNumChange(id, skuId, num) {
    const that = this.props.that,
      _this = this;
    let param = {
      url : `cart/updateCartSku`,
      method : 'GET',
      data: {
        userId: that.state.userId,
        selectedIdList: JSON.stringify(that.state.selectedIdList),
        id: id,
        skuId: skuId,
        count: num,
      },
      successFn : function (data) {
        if (data.code == 0) {
          that.setState({
            totalPrice: data.result.totalPrice
          })
          if (data.result && data.result.remainCount) {
            _this.setState({
              remainCount: data.result.remainCount
            })
          }
        } else{
          that.setErrorMessage(data);
        }
      },
      errorFn : function (data) {
        that.setErrorMessage(data);
      }
    };
    RequestUtil.fetch(param);
  }

  handleClick() {
    location.href = "../ItemDetail/index.html?prdtId="+this.props.item.prdtId;
  }

  render() {
    const that = this.props.that;
    let priceArr = Util.priceFormat(this.props.item.price);

    let remainCount = this.props.item.remainCount? this.props.item.remainCount : null;
    let limitCount = this.props.item.limitCount? this.props.item.limitCount: null;
    if(this.state.remainCount>-1){
      remainCount=this.state.remainCount
    }
    let explain = "";
    let notification = '';
    let minValue = 1,
        maxValue = 99;
    if (remainCount) {
      maxValue = remainCount;
      explain = "仅剩" + remainCount + "份";
      notification = CONSTANTS.MSG.ITEM.SKU_INSUFFICIENT;
    } else if (limitCount) {
      maxValue = limitCount;
      explain = "限购" + limitCount + "份";
    } else {
      notification = CONSTANTS.MSG.ITEM.SKU_COUNTLIMIT;
    }

    let handleBuy = !this.props.invalid ? 
      (
          <div className="handleBuy">
            <div className="buyNum">
              <Counter
                minVal={minValue} 
                maxVal={maxValue} 
                curVal={this.props.item.buyCount}
                numChange={this.handlePrdtNumChange.bind(this, this.props.item.id, this.props.item.skuId)} 
                submitStatus={this.props.submitStatus}
                showNotification={that.enter.bind(that, notification)}
              />
              <div className="explain">{explain}</div>
            </div>
            <a className="cartItemDel" onClick={this.props.handleDelete.bind(null, this.props.item.id)}>
              <i className="sprite icon-delete-gray"></i>
            </a>
          </div>
      ) : "";
    return (
      <div className="m-prdtItem">
        <div className="column">
          <img className="prdtImg" src={this.props.item.prdtImage} onClick={this.handleClick.bind(this)}/>
					{this.props.item.status === 2 ? <div className="mask">
            <i className="soldout">已售罄</i>
          </div> : ""}
					{this.props.item.status === 3 ? <div className="mask">
            <i className="stock">已下架</i>
          </div> : ""}
        </div>
        <div className="column detail">
          <a className="prdtName" href={"../ItemDetail/index.html?prdtId="+this.props.item.prdtId}>
            <div className="text">
              {this.props.item.brandName + ' '
              + this.props.item.prdtName + ' '
              + this.props.item.spect}
            </div>
          </a>
          <div className="price">￥<span>{priceArr[0]}</span>{priceArr[1]}</div>
          {handleBuy}
        </div>
      </div>
    )
  }
}