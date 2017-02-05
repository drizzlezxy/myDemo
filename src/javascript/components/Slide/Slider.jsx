import React from 'react';
import Hammer from 'extend/hammer.min.js';
import Util from 'extend/common/util';
import className from 'classnames'
import "./Slider.scss"

export default class Slider extends React.Component {
  static defaultProps = {
    itemList: []
  };

  constructor() {
    super()
    this.state = {
      activeSlide: 0,
    }
  }

  nextSlide() {
    var slide = this.state.activeSlide + 1 < this.props.itemList.length ? this.state.activeSlide + 1 : 0;
    this.setState({
      activeSlide: slide
    });
    this.props.setShowIndex(slide);
  }

  previousSlide() {
    var slide = this.state.activeSlide - 1 < 0 ? this.props.itemList.length - 1 : this.state.activeSlide - 1;
    this.setState({
      activeSlide: slide
    });
    this.props.setShowIndex(slide);
  }

  componentDidMount() {
    var dom = this.refs.div;
    var hammer = new Hammer(dom, {});
    hammer.on('swipeleft', function () {
      this.nextSlide();
    }.bind(this));
    hammer.on('swiperight', function () {
      this.previousSlide();
    }.bind(this));

    Util.lazyLoadImages($('img'), 8, 200);

  }

  componentWillReceiveProps(nextProps) {
    if(this.state.activeSlide != nextProps.showIndex) {
      this.setState({
        activeSlide: nextProps.showIndex
      },()=>{
        console.log(this.state)});
    }
    if (nextProps.itemList) {
      this.setState({
        itemList: nextProps.itemList
      }, () => {
         Util.lazyLoadImages($('img'), 8, 200);
      });
    }
  }

  render() {
    const _this = this;
    let slides = this.props.itemList,
      activeIndex = this.state.activeSlide;
    let slide = slides.map( (item, index) => {
      let isActive = index === activeIndex,
        classes = className({
          'slide': true,
          'active': isActive,
        });
      let child = this.props.children;
      return (
        <div className={"slider-container " + classes} key={"sort_"+index}>
          {React.cloneElement(child, { list: item || [] })}
        </div>
      )
    });
    return (
      <div className="m-slider" ref='div'>
          {slide}
      </div>
    )
  }
}