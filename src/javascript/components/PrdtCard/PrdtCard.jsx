import React from 'react';
import Util from "extend/common/util";
import './prdtCard.scss';

class PrdtCard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let skuList = this.props.item.skuList,
      minPrice = skuList[0].payPrice,
      minPriceIndex = 0;

    skuList.map( (item,index) => {
      if(item.payPrice < minPrice) {
        minPrice = item.payPrice;
        minPriceIndex = index;
      }
    });
    let minPriceItem = skuList[minPriceIndex];
    let priceArr = Util.priceFormat(minPriceItem.payPrice);

    return (
      <div>
        <div className="m-prdtcard">
          <a className="card-wrap"
            href={'../../sijiPages/ItemDetail/index.html?prdtId=' + minPriceItem.prdtId}>
            <div className="prdt-image">
              <img src={this.props.item.image}/>
            </div>
            <div className="prdt-wrap">
              <div className="prdt-name">{this.props.item.name + ' ' + minPriceItem.spec}</div>
              <div>
                <div className="origin-price">￥<em>{minPriceItem.originPrice}</em></div>
                <div className="pay-price">￥<span>{priceArr[0]}</span>{priceArr[1]}</div>
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