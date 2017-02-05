import React from 'react';
import './ItemModalHead.scss';

export default class ItemModalHead extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      < div className="m-item-modal-head">
        < img src={this.props.item.image }/>
        < div className="item-desc">
          < div className="item-name"> {this.props.item.name }</ div >
          < div className="item-spec"> {this.props.item.skuList[this.props.activeIndex].spec }</ div >
          < div className="item-price"> ￥ { this.props.item.skuList[this.props.activeIndex].payPrice }</ div >
        </div >
      </div >
  )
  }
}