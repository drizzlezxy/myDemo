import React from 'react';
import 'scss/base.scss';
import './itemModalFoot.scss';
import NumCounter from '../Counter/NumCounter.jsx';

export default class ItemModalFoot extends React.Component {
  constructor(props) {
    super(props);
  }

  handleAddCardClick() {
    this.props.onAddCart();
  }

  handleAtonceClick() {
    this.props.onAtonce();
  }
  render() {
    return (
      < div className = "m-item-modal-foot" >
        < NumCounter {...this.props}/>
        <div className="buy" onClick={this.handleAtonceClick.bind(this)}> 立即购买</ div >
        < div className="cart" onClick={this.handleAddCardClick.bind(this)}>加入购物车</ div >
      </ div >
    )
  }
}