/*
 * --------------------------------------------
 * gotoTop组件
 * @version  1.0
 * @author   hzguodeshi(hzguodeshi@corp.netease.com)
 * --------------------------------------------
 */
import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import Util from 'extend/Util/Util';
import Hammer from 'extend/hammer.min.js'
import './GotoTop.scss';


class GotoTop extends Component {
  constructor() {
    super();
    this.ScrollListener = null;
  }

  componentWillMount(){
    this.setState({
      hide: true
    });
  }
  componentWillReceiveProps(nextProps) {
    if( nextProps.elem !== this.props.elem){
      this.bindEvent(nextProps.elem,nextProps.offset);
    }
    if(nextProps.hide){
      this.setState({
        hide: true
      });
    }else{
      this.showTop(nextProps.elem.parentElement);
    }
  }
  shouldComponentUpdate(nextProps, nextState){
    if( nextProps.elem !== this.props.elem ||  nextProps.hide !== this.props.hide || nextState.hide !== this.state.hide){
      return true;
    }else{
      return false;
    }
  }
  componentDidMount(){
    if(!this.props.elem){
      return;
    }
    this.bindEvent(this.props.elem,this.props.offset);
  }

  bindEvent(_elem, _offset){
    var elem = _elem,
      elemParent = elem.parentElement;

    elemParent.addEventListener("scroll", (e) => {
      Util.throttleV2(this.showTop, 20, 50, this)(elemParent, _offset);
    });
  }

  showTop(elem,offset = 100) {
    if(elem.scrollTop > offset){
      if(this.state.hide === false){
        return ;
      }
      this.setState({
        hide: false
      });
    }else{
      if(this.state.hide === true){
        return ;
      }
      this.setState({
        hide: true
      });
    }
  }
  /**
   * top按钮显示控制
   */
  setTop(){
    let elemParent = this.props.elem.parentElement;
    elemParent.scrollTop = 0;
    this.setState({
      hide: true
    });
  }
  render() {
    let clazz = this.state.hide ? 'icon-top hide': 'icon-top';
    
    if (Util.isIos()) {
      clazz += ' fixedIos';
    } else {
      clazz += ' fixed';
    }

    return (
      <a onClick={this.setTop.bind(this)} className={clazz}></a>
    )
  }
}

export default GotoTop;