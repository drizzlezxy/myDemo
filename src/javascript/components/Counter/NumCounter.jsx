import React, {Component} from 'react'
import classNames from 'classnames'
import './NumCounter.scss'

export default class NumCounter extends Component {
  constructor() {
    super();
    this.state = {
      curValue: 1,
      maxSumValue: 99,
      maxValue: 99,
      minValue: 1
    }
  }

  componentDidMount() {
    let activeIndex = this.props.activeIndex;
    this.setState({maxValue: this.props.item.skuList[activeIndex].count});
    var sub = this.refs.sub,
      add = this.refs.add;
    var sHammer = new Hammer(sub, {}),
      aHammer = new Hammer(add, {});
    sHammer.on("tap", function () {
      this.sub();
    }.bind(this));
    aHammer.on("tap", function () {
      this.add();
    }.bind(this))
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.maxValue || (this.props.activeIndex !== nextProps.activeIndex)) {
      this.setState({
        curValue: 1,
        maxValue: nextProps.item.skuList[nextProps.activeIndex].count
      })
    }
  }

  handleNumChange(num) {
    this.props.numChange(num);
  }

  add() {
    if (this.state.curValue < this.state.maxValue && this.state.curValue < this.state.maxSumValue) {
      this.setState({
        curValue: ++this.state.curValue
      })
      this.handleNumChange(this.state.curValue);
    }
  }

  sub() {
    if (this.state.curValue > this.state.minValue) {
      this.setState({
        curValue: --this.state.curValue
      })
      this.handleNumChange(this.state.curValue);
    }
  }

  render() {
    return (
      <div className='m-counter'>
        <div className={classNames({'sprite':true,'icon-less':true,'active':this.state.curValue!==this.state.minValue})}
          ref="sub"></div>
        <div className='num'>{this.state.curValue}</div>
        <div className={classNames({
          'sprite': true, 'icon-more': true,
          'active': this.state.curValue !== this.state.maxValue
          && this.state.curValue !== this.state.maxSumValue
        })}
          ref="add"></div>
      </div>
    )

  }
}