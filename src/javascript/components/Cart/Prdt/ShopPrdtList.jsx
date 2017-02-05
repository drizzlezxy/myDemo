import React, {Component} from 'react'
import PrdtItem from 'components/PrdtItem/PrdtItem.jsx';
import Util from "extend/common/util";
import CookieUtil from "extend/common/CookieUtil";
import RequestUtil from "extend/common/RequestUtil";
import SelectButton from 'components/SelectButton/SelectButton.jsx'
import Action from 'components/Action/Action.jsx'
import PrdtList from './PrdtList.jsx'
export default
class ShopPrdtList extends Component {
  static defaultProps = {
    shopDetail: {
      actionList: []
    }
  };

  constructor(props) {
    super(props);
    let skulist = this.getShopIdList(props);

    this.state = {
      shopSkuList: skulist
    }
  }

  componentWillReceiveProps(props) {
    let skulist = this.getShopIdList(props);
    this.state = {
      shopSkuList: skulist
    }
  }

  /**
   * 获取店铺sku的id集合
   * @param  {[Object]} data [店铺商品信息]
   * @return {[Array]}      [id集合]
   */
  getShopIdList(data) {
    let skulist = [],
      skuItemList=[],
      actionList = [];
    data.shopDetail.actionList.forEach(function (ele) {
      actionList = actionList.concat(ele.skuList)
    })
    actionList.forEach(function (ele) {
      if (!(data.that.state.deleteIdList.indexOf(ele.id) > -1)) {
        skulist.push(ele.id)
      }
    })
    return skulist;
  }

  /**
   * 店铺全选按钮点击事件
   * @return {[bull]} [description]
   */
  handleSelectedClick() {
    const _this = this.props.that;
    if (_this.state.submitStatus === 1) {
      return;
    }
    let shopChoosen = Util.ArrEveEleInAnother(this.state.shopSkuList, _this.state.selectedIdList);
    let selectedIdList = _this.state.selectedIdList.concat([]);
    if (shopChoosen) {
      Util.dislodge(selectedIdList, this.state.shopSkuList)
    } else {
      selectedIdList = Util.merge(selectedIdList, this.state.shopSkuList)
    }
    _this.setState({
      selectedIdList: selectedIdList
    })
    Util.throttle(this.handleSelected, this)
  }
  
  /**
   * 店铺全选按钮点击ajax请求
   * @return {[null]} [description]
   */
  handleSelected() {
    const _this = this.props.that;
    let param = {
      url : `cart/selectCartSku`,
      method : 'GET',
      data: {
        userId: _this.state.userId,
        uid: _this.state.uId,
        selectedIdList: JSON.stringify(_this.state.selectedIdList),
      },
      successFn : function (data) {
        if (data.code == 0) {
          _this.setState({
            totalPrice: data.result.totalPrice
          })
        } else {
          _this.setErrorMessage(data);
        }
      },
      errorFn : function (data) {
        this.setErrorMessage(data);
      }
    };
    RequestUtil.fetch(param);
  }

  handleShopClick(){
    location.href="../PrdtList/index.html?shopId="+this.props.shopDetail.id
  }

  render() {
    if (this.state.shopSkuList.length === 0) {
      return null;
    }
    const that = this.props.that;
    const _this = this;
    let shopChoosen = Util.ArrEveEleInAnother(this.state.shopSkuList, that.state.selectedIdList);
    let actionList = this.props.shopDetail.actionList.map(function (ele, index) {
      let idList = ele.skuList.map(function (ele, index) {
        return ele.id
      });
      let actionList = Util.ArrEveEleInAnother(idList, that.state.deleteIdList)
      return (
        <div key={index}>
          <PrdtList list={ele.skuList} that={that}
            handleStatusChange={_this.props.handleStatusChange}/>
          {!actionList && ele.actionList && ele.actionList.length > 0 && ele.skuList.length > 0 ?
            <Action actionList={ele.actionList}/> : ""}
        </div>
      )
    })
    return (
      <div className="m-prdtList-valid">
        <div className="listHead">
          <SelectButton selected={shopChoosen} clickCallBack={this.handleSelectedClick.bind(this)}/>
          <i className="sprite icon-shop"></i>
          <div className="shopName" onClick={this.handleShopClick.bind(this)}>{this.props.shopDetail.name}</div>
          <i className="sprite icon-arrow" onClick={this.handleShopClick.bind(this)}></i>
        </div>
        <div>
          {actionList}
        </div>
      </div>
    )
  }
}