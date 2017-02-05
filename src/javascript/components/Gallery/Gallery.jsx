import React from 'react';
import Slider from 'components/Slide/Slide.jsx';
import Util from 'extend/util';
import className from 'classnames';
import './Gallery.scss'
import PinchZoom from 'components/PinchZoom/PinchZoom'

export default class Gallery extends React.Component {
  constructor() {
    super();
    this.state = {
      activeIndex: 0,
      modal: 'hide'
    }
  }

  componentDidMount() {
    var modal = this.refs.modal;
    modal.addEventListener('touchmove', function (e) {
      e.preventDefault();
    }, false);

    this.initLazyLoad();
  }

  initLazyLoad () {
    Util.lazyLoadImages($('img'), 8, 100);
  }

  handleClick(index) {
    this.setState({
      activeIndex: index,
      modal: 'show'
    })
  }

  handleClose = () => {
    this.setState({
      modal: 'hide'
    })
  }

  render() {
    var totallen = this.props.pics.length;
    var length = totallen > 8 ? 8 : totallen;

    var pics = this.props.pics.map((ele, index)=> {
      if (index < 7) {
        return (<div className='picItem' key={index} onClick={this.handleClick.bind(this, index)}>
          <img data-src={ele}/>
        </div>)
      } else if (index === 7) {
        return (
          <a className='picItem more' key={index} onClick={this.handleClick.bind(this, index)}>
            <div className='more-cn'>查看更多</div>
            <div className='division'>
              <div className="division-content"></div>
            </div>
            <div className='more-en'>MORE</div>
          </a>
        )
      } else {
        return;
      }
    });
    var style = {
      width: ((length) * 1.50 + (length + 1) * 0.05) + 'rem'
    };
    var modalstyle = {
      height: document.documentElement.clientHeight + 'px'
    }
    var clazz = this.state.modal === 'hide' ? 'slide-modal hide' : 'slide-modal'
    return (
      <div className='m-gallery'>
        <div className='scrollFixed'>
          <div className='container' style={style}>
            {pics}
          </div>
        </div>
        <div className={clazz} style={modalstyle} ref='modal'>
          <div className="returnBtn" onClick={this.handleClose}>
            <i className='sprite icon-return-white'></i>
          </div>
          <SlideModal activeIndex={this.state.activeIndex} imageList={this.props.pics} />
        </div>
      </div>
    )
  }
}

class SlideModal extends Slider {
  constructor(props) {
    super(props)
    this.state = {
      activeSlide: props.activeIndex,
      pinchZooms: []
    }
  }

  componentWillReceiveProps(props) {
    this.state = {
      activeSlide: props.activeIndex
    }
    if(this.state.pinchZooms&&this.state.pinchZooms.length>0) return;
    this.bindPinch();
  }

  nextSlide() {
    var slide = this.state.activeSlide + 1 < this.props.imageList.length ? this.state.activeSlide + 1 : 0;
    this.reset();
    this.setState({
      activeSlide: slide
    })
  }

  previousSlide() {
    var slide = this.state.activeSlide - 1 < 0 ? this.props.imageList.length - 1 : this.state.activeSlide - 1;
    this.reset();
    this.setState({
      activeSlide: slide
    });
  }

  componentDidMount() {
    var dom = this.refs.div;
    var hammer = new Hammer(dom, {});
    hammer.on('swipeleft', function() {
      this.nextSlide();
    }.bind(this));
    hammer.on('swiperight', function() {
      this.previousSlide();
    }.bind(this));
    this.bindPinch();
  }

  bindPinch(){ 
    //if(Util.isIos()){
      var pinchZooms = [];
      $('.pinchContainer').each(function() {
        pinchZooms.push(new PinchZoom($(this), {}));
      });
      this.setState({
        pinchZooms: pinchZooms
      })
    //}
  }

  reset() {
    //if (Util.isIos()) {
      var pinchZoom = this.state.pinchZooms[this.state.activeSlide];
      pinchZoom.zoomFactor = 1;
      pinchZoom.lastScale = 1;
      pinchZoom.offset = {
        x: 0,
        y: 0
      };
      pinchZoom.update();
    //}
  }
  render() {
    var _this = this;
    var slides = this.props.imageList, len = slides.length;
    var activeIndex = this.state.activeSlide;
    var slide = slides.map(function (ele, index) {
      var classes = className({
        'slide': true,
        'active': index === activeIndex
      })
      return (
        <div id="scaleItem" className={classes} key={index}>
          <div className="pinchContainer">
            <img src={ele}>
            </img>
          </div>
        </div>
      )
    })
    return (
      <div>
        <div className="m-slider" ref='div'>
          {slide}
        </div>
        <div className="slideNum">
          {this.state.activeSlide + 1}/{len}
        </div>
      </div>
    )
  }
}