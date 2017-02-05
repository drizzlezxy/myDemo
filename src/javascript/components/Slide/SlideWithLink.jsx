import React from 'react';
import Hammer from 'extend/hammer.min.js';
import Util from 'extend/common/util';
import className from 'classnames';
import "./Slide.scss";

export default class SlideWithLink extends React.Component {
  static defaultProps = {
    imageList: []
  };

  constructor(props) {
    super(props);
    
    this.state = {
      activeSlide: 0,
      imageList: props.imageList,
      autoPlay: true,
    }
  }

  nextSlide() {
    var slide = this.state.activeSlide + 1 < this.props.imageList.length ? this.state.activeSlide + 1 : 0;
    this.setState({
      activeSlide: slide
    })
  }

  previousSlide() {
    var slide = this.state.activeSlide - 1 < 0 ? this.props.imageList.length - 1 : this.state.activeSlide - 1;
    this.setState({
      activeSlide: slide
    });
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


    if (this.state.autoPlay && this.state.imageList.length > 1) {
      this.timer = setInterval( () => {
        this.nextSlide();
      }, this.props.interval || 3000);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.imageList) {
      this.setState({
        imageList: nextProps.imageList
      }, () => {
         Util.lazyLoadImages($('img'), 8, 200);
      });
    }
  }

  render() {
    let _this = this;
    let slides = this.props.imageList;
    let activeIndex = this.state.activeSlide;
    let clientWidth = document.documentElement.clientWidth / parseFloat(document.documentElement.style.fontSize);
    // let clientWidth = (document.documentElement.clientWidth / 100);
    let slide = slides.map(function (ele, index) {
      let isActive = index === activeIndex;
      let classes = className({
        'slide': true,
        'active': isActive,
      });

      let imageObj = {
        width: `${clientWidth}rem`,
      };

      if (index) {
        // 次页的图片通过给data-src属性进行懒加载
        return (
          <a className={classes} key={index} href={ele.linkHref}>
            <img data-src={ele.imgUrl} style={imageObj}/>
          </a>
        )
      } else {
        return (
          <a className={classes} key={index} href={ele.linkHref}>
            <img src={ele.imgUrl} style={imageObj}/>
          </a>
        )
      }
    });

    let containerObjStyle = {
      width: `${slides.length*clientWidth}rem`,
      left: `${-activeIndex*clientWidth}rem`,
    };
    return (
      <div className="m-slider" ref='div'>
        <div className="slide-container" style={containerObjStyle}>
          {slide}
        </div>
        <Dot activeIndex={this.state.activeSlide} slideslength={slides.length}/>
      </div>
    )
  }
}
class Dot extends React.Component {
  constructor() {
    super()
  }

  render() {
    let len = this.props.slideslength;
    if(len<=1){
      return null;
    }
    
    let activeIndex = this.props.activeIndex;
    let arr = [];
    for (let i = 0; i < len; i++) {
      arr.push(<span key={i} className={i === activeIndex ? 'active' : 'inactive'}></span>)
    }

    let spanWidth = (len * 0.15);
    let leftMargin = -(spanWidth/2) + 'rem';
    let style = {
      width: spanWidth + 'rem',
      marginLeft: leftMargin,
    }
    return (
      <div className='dots' style={style}>
        {arr}
      </div>
    )
  }

}