/**
 * Created by hzduanchao on 2016/6/30.
 */
import React from 'react';
import CardUnit from 'components/CardUnit/CardUnit';
import Modal from 'components/modal/modal';
import Picker from 'components/Picker/Picker';
import './coupon.scss';

export default class Coupon extends React.Component{
	constructor(props){
		super(props);
    this.state = {
      visible: false,
      selectedIndex: this.props.couponIndex,
      valueGroups: {
        couponContent: this.props.couponContent.length === 0 ? '无可用优惠券' : this.props.couponContent[this.props.couponIndex]
      },
      optionGroups: {
        couponContent: this.props.couponContent.length === 0 ? ['无可用优惠券'] : this.props.couponContent
      }
    }
	}

  componentWillReceiveProps(nextProps){
    this.setState({
      selectedIndex: nextProps.couponIndex,
      valueGroups: {
        couponContent: nextProps.couponContent.length === 0 ? '无可用优惠券' : nextProps.couponContent[nextProps.couponIndex]
      },
      optionGroups: {
        couponContent: nextProps.couponContent.length === 0 ? ['无可用优惠券'] : nextProps.couponContent
      }
    })
  }

 show(animation) {
    this.setState({
      animation,
      visible: true
    })
  }


  hide() {
    this.setState({
      visible: false
    });
  }

  handleClick(type){
    this.show(type);
  }
  cancel(){
    this.hide();
  }
  confirm(){
    this.hide();
    this.props.onCouponIndexChange(this.state.selectedIndex);
  }

  handleChange = (name, value, index)=> {
    this.setState(({valueGroups})=>({
      valueGroups: {
        ...valueGroups,
        [name]: value
      },
      selectedIndex:index
    }));
  };

	render(){
    let couponBody, couponList = this.state.optionGroups.couponContent;
    let type='slideUp';
    if(this.props.couponIndex===-1){
      couponBody=<div className="m-coupon-invalid">暂无可用的优惠券</div>;
    }else{
      couponBody = <div className="m-coupon-valid" onClick={this.handleClick.bind(this,type)}>
        <span>使用优惠券：{couponList[this.props.couponIndex]}</span><i className="sprite arrow"></i></div>;
    }
    let ModalHead=<div className="coupon-head clearfix"><span className="cancel" onClick={this.cancel.bind(this)}>取消</span><span className="confirm" onClick={this.confirm.bind(this)}>确认</span></div>;
		return(
			<CardUnit title="优惠券">
        {couponBody}
        <Modal visible={this.state.visible}
               onClose={this.hide.bind(this)}
               showCloseButton={false}
               width={3.75}
               alignItems={'flex-end'}
               animation={this.state.animation}
        >
          {ModalHead}
          <Picker
            optionGroups={this.state.optionGroups}
            valueGroups={this.state.valueGroups}
            onChange={this.handleChange.bind(this)}
          />
        </Modal>
      </CardUnit>
		)
	}
}