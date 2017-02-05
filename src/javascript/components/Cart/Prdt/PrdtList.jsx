import React, {Component} from 'react'
import Util from "extend/common/util";
import PrdtItem from 'components/PrdtItem/PrdtItem.jsx'
import RequestUtil from "extend/common/RequestUtil";
import SelectButton from 'components/SelectButton/SelectButton.jsx'
import SwipeOut from 'components/SwipeOut/SwipeOut';

export default
class PrdtList extends Component {
  static defaultProps = {
    list: []
  };

  /**
   * 单个商品点击按钮事件
   * @param  {[String]} id [商品sku的id]
   * @return {[type]}    [description]
   */
  handleSingleSelectClick(id) {
    const that = this.props.that;
    if (that.state.submitStatus === 1) {
      return;
    }
    let arrId = [].concat(id);
    let selectedIdList = Util.deepClone(that.state.selectedIdList).concat([]);
    let choosen = selectedIdList.indexOf(id) > -1;
    if (choosen) {
      Util.dislodge(selectedIdList, arrId)
    } else {
      selectedIdList = Util.merge(selectedIdList, arrId)
    }
    that.setState({
      selectedIdList: selectedIdList
    })
    Util.throttle(this.handleSingleSelect, this)
  }

  /**
   * 单个商品点击ajax请求
   * @return {[type]} [description]
   */
  handleSingleSelect() {
    const that = this.props.that;
    let param = {
      url : `cart/selectCartSku`,
      method : 'GET',
      data: {
        userId: that.state.userId,
        uid: that.state.uId,
        selectedIdList: JSON.stringify(that.state.selectedIdList),
      },
      successFn : function (data) {
        if (data.code == 0) {
          that.setState({
            totalPrice: data.result.totalPrice
          })
        } else {
          that.setErrorMessage(data);
        }
      },
      errorFn : function (data) {
        that.setErrorMessage(data);
      }
    };
    RequestUtil.fetch(param);
  }


  render() {
    const _this = this;
    const that = this.props.that;
    let classes;
    let recoverStyle = {
      swipeStyle: {left: 0},
      btnStyle: {width: 0}
    };
    let list = this.props.list.map(function (ele, index) {
      let selectButton = "",
        submitStatus = that.state.submitStatus;
      let handleDelete = function () {
      };
      if (that && that.state.deleteIdList.indexOf(ele.id) > -1) {
        return ""
      }
      if (!_this.props.invalid) {
        let itemChoosen = that.state.selectedIdList.indexOf(ele.id) > -1 ? true : false;
        selectButton = <SelectButton selected={itemChoosen} clickCallBack={_this.handleSingleSelectClick.bind(_this, ele.id)} />
        handleDelete = that.show.bind(that, "zoom", 1, ele.id);
        classes = that.state.cartType === 2 ? "cart-edit" : "";
        return (
            <li key={ele.id}>
              <div className="select">
              {selectButton}
              </div>
              <PrdtItem item={ele} handleDelete={handleDelete}
                submitStatus={submitStatus}
                that={that}
                invalid={_this.props.invalid} />
            </li>
      )
      } else {
        return (
          <li key={ele.id} className={classes}>
            <div className="select">
              {selectButton}
            </div>
            <PrdtItem item={ele} handleDelete={handleDelete}
              submitStatus={submitStatus}
              that={that}
              invalid={_this.props.invalid} />
          </li>
        )
      } 
    });
    return (
      <ul className="m-list-cart">
        {list}
      </ul>
    )
  }
}