import React, {Component} from 'react';
import classNames from 'classnames';
import './NumCounter.scss';
import Util from "extend/common/util";
import Hammer from 'extend/hammer.min.js';
export default
class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      num: props.curVal || 1
    }
  }

  componentDidMount(){
    // var sub = this.refs.sub,
    //     add = this.refs.add;
    // var sHammer = new Hammer(sub,{}),
    //     aHammer = new Hammer(add,{});
    // sHammer.on("tap",function(){
    //   this.sub();
    // }.bind(this));
    // aHammer.on("tap",function(){
    //   this.add();
    // }.bind(this))
  }

  handleNumChange() {
    this.props.numChange(this.state.num);
  }

  componentWillReceiveProps(props) {
    if (this.props.curVal !== props.curVal) {
      this.setState({
        num: props.curVal
      })
    }
  }

  add() {
    var num = this.state.num + 1;
    if (num <= this.props.maxVal) {
      this.setState({
        num: num
      }, function () {
        Util.throttle(this.handleNumChange, this);
      }.bind(this))
    } else {
      !!this.props.showNotification && this.props.showNotification();
    }
  }

  sub() {
    var num = this.state.num - 1;
    if (num >= 1) {
      this.setState({
        num: num
      }, function () {
        Util.throttle(this.handleNumChange, this);
      }.bind(this))
    }
  }

  render() {
    var maxValue = this.props.maxVal;
    var minValue = this.props.minVal;
    var curValue = this.state.num;
    return (
      <div className='m-counter'>
        <div className={classNames({'disabled': curValue==minValue, 'enabled': true, 'icon-less': true, 'active': curValue !== 1})}
             ref="sub" onClick={this.sub.bind(this)}><i className="icon"></i></div>
        <div className='num'>{this.state.num}</div>
        <div className={classNames({'disabled': curValue==maxValue, 'enabled': true, 'icon-more': true, 'active': curValue < maxValue})}
            ref="add" onClick={this.add.bind(this)}><i className="icon"></i></div>
      </div>
    )

  }
}