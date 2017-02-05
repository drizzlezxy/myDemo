import React, {Component} from 'react'
import CounterEdit from 'components/Counter/CounterEdit.jsx'
import Util from "extend/common/util";
import CookieUtil from "extend/common/CookieUtil";
import RequestUtil from "extend/common/RequestUtil";
import './YQPrdtItem.scss'
import CONSTANTS from 'constants/YQconstants.json';

export default
class PrdtItem extends Component {
  constructor(){
    super();

    this.state = {
      remainCount : -1
    }
  }

  handleClick() {
    RedirectUtil.redirectPage({
      pageName: 'YQPrdtDetail',
      options: {
        poSkuId: Util.fetchValueByCurrentURL('poSkuId'),
        prdtId: Util.fetchValueByCurrentURL('prdtId'),
        skuId: Util.fetchValueByCurrentURL('skuId'),
      },
    });
  }

  render() {
    const that = this.props.that;
    let item  = this.props.item;
    let priceArr = Util.priceFormat(item.price);

    let remainCount = item.remainCount? item.remainCount : null;
    let limitCount = item.limitCount? item.limitCount: null;
    if(this.state.remainCount>-1){
      remainCount = this.state.remainCount;
    }
    
    let explain = "";
    let notification = '';
    let minValue = 1;
    let maxValue = 999;
    if (remainCount) {
      maxValue = remainCount;
      explain = "仅剩" + remainCount + "份";
      notification = CONSTANTS.MSG.ITEM.SKU_INSUFFICIENT;
    } else if (limitCount) {
      maxValue = limitCount;
      explain = "限购" + limitCount + "份";
      notification = CONSTANTS.MSG.ITEM.SKU_BUYLIMIT;
    } else {
      notification = CONSTANTS.MSG.ITEM.SKU_COUNTLIMIT;
    }

    let handleBuy = !item.invalid ? 
      (
          <div className="handleBuy">
            <div className="buyNum">
              <CounterEdit
                minVal={minValue} 
                maxVal={maxValue} 
                curVal={1}
                numChange={that.handlePrdtNumChange.bind(that)} 
                showNotification={that.enter.bind(that, notification)}
              />
              <div className="explain">{explain}</div>
            </div>
          </div>
      ) : "";
    return (
      <div className="m-prdtItem">
        <div className="column">
          <img className="prdtImg" src={item.prdtImage} onClick={this.handleClick.bind(this)}/>
					{item.status === 2 ? <div className="mask">
            <i className="soldout">已售罄</i>
          </div> : ""}
					{item.status === 3 ? <div className="mask">
            <i className="stock">已下架</i>
          </div> : ""}
        </div>
        <div className="column detail">
          <a className="prdtName" href="javascript:void(0)">
            <div className="text">
              {
                (item.brandName || '') + ' '
                + (item.prdtName || '') + ' '
              }
            </div>
            <div className="price">￥{item.price}</div>
          </a>
          {handleBuy}
        </div>
      </div>
    )
  }
}