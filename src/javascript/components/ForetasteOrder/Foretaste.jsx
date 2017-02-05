/**
 * 2016/7/8
 * hzduanchao@corp.netease.com
 * 试吃订单确认页
 */
import React from 'react';
import './foretaste.scss';
import Util from 'extend/Util/Util';
import Modal from 'components/modal/modal';
import SwipeOut from 'components/SwipeOut/SwipeOut';
import Notification from 'components/Notification/Notification';
import NativePlat from 'extend/Util/NativePlat';
import {
  head,
  queryObj,
  userObj
} from 'extend/Util/initial.js'

export default class ForetasteOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      name: '',
      prdtList: [],
      categoryNum: 0,//页面底部试吃商品种类
      count: 0, //页面底部试吃商品数量
      edit: false,
      modalType: 0, //弹窗类型 1 删除商品  2 售罄 3 试吃条件变更 4 试吃活动结束
      errorMessage: '', //弹窗内容
      visible: false, //弹窗
      skuIdList: [],  //提交试吃单
      itemCount: 0, //删除的每种试吃商品的数量
      item: null, //删除的试吃单品的DOM节点
      index: -1, //删除的试吃单品的index
      enter: false,  //notification提示
      error: '' //异常信息
    }
  }

  componentDidMount() {
    console.log(queryObj);
    let skuIdList = [], skuIdObj = {};
    queryObj.products.forEach(function (value, index) {
      skuIdObj = {skuId: value.skuId, amount: value.count};
      skuIdList.push(skuIdObj);
    });
    this.setState({
      id: queryObj.id,
      name: queryObj.name,
      prdtList: queryObj.products,
      categoryNum: queryObj.categories,
      count: queryObj.pieces,
      skuIdList: skuIdList
    })
  }

  handleEditClick() {
    this.setState({
      edit: !this.state.edit
    })
  }

  handleDeleteClick(index, count, item) {
    this.setState({
      visible: true,
      modalType: 1,
      itemCount: count,
      item: item,
      index: index
    })
  }

  handleDelete() {
    this.state.skuIdList.splice(this.state.index, 1);
    this.state.prdtList.splice(this.state.index, 1);
    this.setState({
      prdtList: this.state.prdtList,
      categoryNum: this.state.categoryNum - 1,
      count: this.state.count - this.state.itemCount,
      skuIdList: this.state.skuIdList
    });
    console.log(this.state.skuIdList);
    console.log(this.state.prdtList);
  }

  show() {
    this.setState({
      visible: true
    })
  }

  hide() {
    this.setState({
      visible: false
    })
  }

  handleYes() {
    this.handleDelete();
    this.hide();
  }

  handleNo() {
    this.hide();
  }

  handleConfirmClick(){
    this.hide();
  }

  handleSubmit() {
    if (userObj.isLogin) {
      if (this.state.edit || !this.state.count || !this.state.categoryNum) {
        return;
      } else {
        // var url = '../../src/javascript/data/foretasteOrder.json';
        var url ='/commitForetaste';
         var method = 'POST';
        var param = {'shopId': this.state.id, 'skuIdList': this.state.skuIdList};
        console.log(param);
        var successfn = function (data) {
          if (data.code === 0) {
            //跳转到下单成功页面
            window.location.href = '../../sijiPages/ForetasteSuccess?shopId='+this.state.id;
          } else if (data.code === 10015 || data.code === 10051) {
            this.setState({
              modalType: 2,
              visible: true
            })
          } else if(data.code === 10008 || data.code === 10009 || data.code === 10010){
            this.setState({
              modalType: 3,
              visible: true
            })
          }else if ( data.code === 10007 ){
            this.setState({
              modalType: 4,
              visible: true
            })
          }else{
            //跳转到下单失败页面
            window.location.href = '../../sijiPages/ForetasteFail?shopId='+this.state.id;
          }
        }.bind(this);
        var errorfn = function (data) {
          //跳转到下单失败页面
          window.location.href = '../../sijiPages/ForetasteFail?shopId='+this.state.id;
        }.bind(this);
        Util.requestData(url, method, param, successfn.bind(this), errorfn.bind(this));
      }
    }else{
      this.setState({
        error: '您还未登录'
      }, this.enter());
      NativePlat.toPage("yqg-link://pageStr=10");
    }
  }

  leave() {
    this.setState({
      enter: false
    });
  }

  enter() {
    this.setState({
      enter: true
    });
    setTimeout(function () {
      this.leave()
    }.bind(this), 1000)
  }

goHome(){
  this.hide();
  NativePlat.toPage('yqg-link://pageStr=9'); //跳转到首页
}

  render() {
    var modal1 = (
      <div className="m-foretaste-modal">
        <div className="order-body">
          <div>是否要删除该商品</div>
        </div>
        <div className="order-foot order-foot-1">
          <span onClick={this.handleYes.bind(this)}>是</span>
          <span onClick={this.handleNo.bind(this)}>否</span>
        </div>
      </div>
    );
    var modal2 = (
      <div className="m-foretaste-modal">
        <div className="order-body order-body-1">
          <div>对不起，您的订单中有商品售罄或下架</div>
          <div>请重新确认商品</div>
        </div>
        <div className="order-foot" onClick={this.handleConfirmClick.bind(this)}>确定</div>
      </div>
    );
    var modal3 = (
      <div className="m-foretaste-modal">
        <div className="order-body">
          <div>试吃条件变更，请重新选择试吃商品</div>
        </div>
        <div className="order-foot" onClick={this.handleConfirmClick.bind(this)}>确定</div>
      </div>
    );
    var modal4 = (
      <div className="m-foretaste-modal">
        <div className="order-body">
          <div>试吃活动已结束</div>
        </div>
        <div className="order-foot" onClick={this.goHome.bind(this)}>返回首页</div>
      </div>
    );
    var orderStyle={};
    if (Util.isIos()) {
      var baseSize = parseInt(document.documentElement.style.fontSize, 10);
      var height = (baseSize * 0.44 + 30) + "px";
      orderStyle = {
        marginTop:height
      }
    }
    return (
      <div>
        <OrderHead edit={this.state.edit} onEditClick={this.handleEditClick.bind(this)}/>        
        <div className="m-foretaste-order" style={orderStyle}>
          {this.state.count==0?
            <div className="tips">试吃单中还没有商品哦！</div>:
            <div> 
              <h1><i className="sprite icon-shop"></i>{this.state.name}</h1>
              <OrderList list={this.state.prdtList} edit={this.state.edit}
                      onDeleteClick={this.handleDeleteClick.bind(this)}></OrderList>
            </div>
          }
          <OrderFoot categoryNum={this.state.categoryNum} count={this.state.count}
                     onSubmit={this.handleSubmit.bind(this)} edit={this.state.edit}/>
        </div>
        <Modal visible={this.state.visible}
               onClose={this.hide.bind(this)}
               showCloseButton={false}
               width={2.9}>
          {this.state.modalType === 1 ? modal1 : (this.state.modalType === 2 ? modal2 : (this.state.modalType === 3 ? modal3 : (this.state.modalType === 4 ? modal4 : null)))}
        </Modal>
        <Notification enter={this.state.enter} leave={this.leave.bind(this)}>{this.state.error}</Notification>
      </div>

    )
  }
}

class OrderList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openStatus: []
    }
  }

  handleStatusChange(index) {
    let openStatus = [];
    openStatus[index] = true;
    this.setState({
      openStatus: openStatus
    });
  }

  render() {
    // 这里reverse是为了让后加入的商品靠前
    let OrderList = this.props.list.reverse().map(function (value, index) {
      return (
        <ItemCard key={'item'+index} index={index} item={value} edit={this.props.edit}
                  toClose={this.state.openStatus[index]}
                  onDeleteClick={this.props.onDeleteClick.bind(this,index)}
                  onStatusChange={this.handleStatusChange.bind(this)}/>
      )
    }.bind(this));
    return (
      <div>
        {OrderList}
      </div>
    )
  }
}

class ItemCard extends React.Component {
  constructor(props) {
    super(props);
  }

  handleClick(count, item) {
    this.props.onDeleteClick(count, item);
  }

  handleOpen(index) {
    console.log('open');
    this.props.onStatusChange(index);
  }
  render() {
    let item = this.props.item;
    let recoverStyle = {
      swipeStyle: {left: 0},
      btnStyle: {width: 0}
    };
    return (
      <SwipeOut
        right={[{
          name:'delete',
					text:'删除',
					onPress:this.handleClick.bind(this,item.count,this.refs.itemCard),
				}]}
        additionalCls='my-swipeout'
        hasBtnBackground={true}
        onOpen={this.handleOpen.bind(this,this.props.index)}
        autoClose
        disabled={this.props.edit?true:false}
        contentStyle={!this.props.toClose || this.props.edit ?recoverStyle.swipeStyle:null}
        btnStyle={!this.props.toClose || this.props.edit ?recoverStyle.btnStyle:null}
      >
        <a href="javascript:void(0)">
          <div className="m-foretaste-card" ref="itemCard">
            <img src={item.image}/>
            <div className="detail">
              <div className="name">{item.brandName}&nbsp;&nbsp;{item.prdtName}</div>
              <div className="spec">{item.spec}</div>
              <div className="tag">试吃</div>
            </div>
            <div className="count">
              <div className="num">x {item.remainCount&&item.remainCount>0?item.remainCount:item.count}</div>
              {this.props.edit ? <i className="sprite icon-delete1"
                                    onClick={this.handleClick.bind(this,item.count,this.refs.itemCard)}></i> : null}
            </div>
          </div>
        </a>
      </SwipeOut>
    )
  }
}

class OrderFoot extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="m-foretaste-foot">
        <div className="num">{this.props.categoryNum}种 (共{this.props.count}份) 试吃商品</div>
        <div className={this.props.edit || !this.props.count || !this.props.categoryNum ? "btn disabled" : "btn"}
              onClick={this.props.onSubmit.bind(this)}>选好啦</div>
      </div>
    )
  }
}

class OrderHead extends React.Component {
  constructor(props) {
    super(props);
  }

  handleClick() {
    this.props.onEditClick();
  }

  handleReturnClick(){
    Util.back();
    //window.location.href='../../sijiPages/ForetasteShop?shopId='+this.state.id;
  }

  render() {
    var style = {};
    if (Util.isIos()) {
      var baseSize = parseInt(document.documentElement.style.fontSize, 10);
      var height = (baseSize * 0.44 + 20) + "px";
      style = {
        height: height,
        paddingTop: "20px"
      }
    }
    return (
      <header className="m-foretaste-head" style={style}>
        <div  onClick={this.handleReturnClick.bind(this)}>
          <i className="fa-angle-left"></i>
        </div>
        <div className="title">试吃选择</div>
        <div className="edit" onClick={this.handleClick.bind(this)}>{this.props.edit ? "完成" : "编辑"}</div>
      </header>
    )
  }
}
