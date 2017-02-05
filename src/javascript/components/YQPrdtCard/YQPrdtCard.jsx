import React from 'react';
import Util from "extend/common/util";
import './YQprdtCard.scss';

class PrdtCard extends React.Component {
  constructor(props) {
    super(props);
    this.postatus = {
      waiting: 1, // 是未开始
      ended: 2, //是已结束
      during: 3, //进行中
      soldOut: 4, //是已售罄
      offSale: 5, //已下架
    };
    this.statusNoti = [
      null,
      '未开始',
      '已结束',
      '进行中',
      '已售罄',
      '已下架',
    ];
  }

  getStatusInfo() {
    let {waiting, ended, during, soldOut, offSale} = this.postatus;
    let {postatus, poSkuId, itemId, skuId} = this.props.item;
    
    let mask = null;
    let url = `../../sijiPages/YQItemDetail/index.html?poSkuId=${poSkuId}&prdtId=${itemId}&skuId=${skuId}`;
    switch(postatus) {
      case waiting:
        // url = 'javascript:void(0)';
      case ended:
        // url = 'javascript:void(0)';
      case soldOut:
      case offSale:
        mask = <div className="mask">{this.statusNoti[postatus] || ''}</div>;
        break;
      case during:
      default:
        break;
    }
    
    return {mask, url};
  }

  render() {
    let {itemUrl, skuName, skuDescription, quantity, promotionSalePrice} = this.props.item;
    let {mask, url} = this.getStatusInfo();
    let priceArr = Util.priceFormat(promotionSalePrice);

    return (
      <div>
        <div className="m-prdtcard">
          <a className="card-wrap"
            href={url}>
            <div className="prdt-image">
              <img src={itemUrl}/>
              {mask}
            </div>
            <div className="prdt-wrap">
              <div className="prdt-name">{(skuName || '') + ' ' + (skuDescription || '')}</div>
              <div className="prdt-detail">
                {/*<div className="origin-price">￥<em>{minPriceItem.originPrice}</em></div>*/}
                <div className="pay-price">￥<span>{priceArr[0]}</span>{priceArr[1]}</div>
                <div className="quantity">剩余{quantity}件</div>
              </div>
            </div>
          </a>
        </div>
      </div>
    )
  }
}
PrdtCard.contextTypes={
  addCartHandler:React.PropTypes.func
};
export default PrdtCard