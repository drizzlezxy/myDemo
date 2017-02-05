import React, {Component} from 'react'
import Util from "extend/common/util";
import SelectButton from 'components/SelectButton/SelectButton'
export default
class CartFoot extends Component {
  render() {
    let priceArr = Util.priceFormat(this.props.price);
    let classes = this.props.pending === 1 ? "m-cartFoot cart-pending" :
      (this.props.pending === 2 || this.props.pending === 3 ? "m-cartFoot cart-invalid" : "m-cartFoot");
    return (
      <div className={classes}>
        <div className="choose">
          <SelectButton selected={this.props.allSelected} clickCallBack={this.props.handleAllSelected}/>
          <span>全选</span>
        </div>
        <div className="price">
          <span>合计</span>
          <span className="small">￥</span>
          <span className="big">{priceArr[0]}</span>
          <span className="small">{priceArr[1]}</span>
        </div>
        <div className="pay" onClick={this.props.handleSubmit}>
          <span>去结算</span>
          <span>({this.props.sumCount > 10 ? "10+" : this.props.sumCount})</span>
        </div>
      </div>
    )
  }
}