import React from 'react';
import 'scss/base.scss';
import './ItemModalBody.scss';

export default class ItemModalBody extends React.Component {
  constructor(props) {
    super(props);
  }

  static defaultProps = {activeIndex: 0};

  handleClick(index) {
    if (index !== this.props.activeIndex) {
      this.props.activeIndexChange(index);
    }
  }

  render() {
    let activeIndex = this.props.activeIndex;
    let skus = this.props.item.skuList.map(function (value, index) {
      if (index === activeIndex) {
        return (
          <div key = {index} className = "sku sku-active" onClick = {this.handleClick.bind(this, index) }>
            {value.spec}
          </div >
        );
      } else if (index !== activeIndex && value.status === 1) {
        return (
          <div key = {index} className = "sku" onClick = {this.handleClick.bind(this, index)}>
            { value.spec }
         </div >
      );
      } else if (index !== activeIndex && value.status === 2) {
        return (
          <div key = {index} className = "sku sold-out" >
            <span> {value.spec}</span>
            <i className = "sprite icon-soldout" > </i>
          </div >
      );
      } else {
        return null;
      }

    }.bind(this));

    return (
      <div className = "m-item-modal-body clearfix" >
      {skus}
      </div>
  )
  }
}