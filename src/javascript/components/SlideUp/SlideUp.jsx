import React from 'react';
import Hammer from 'extend/hammer.min.js';
import Util from 'extend/common/util';
import className from 'classnames'
import "./SlideUp.scss"

export default class SlideUp extends React.Component {

  constructor(props) {
    super(props);

    this.hammer = null;
    this.state = {
      reset: false,
      activeSlide: 0,
      itemList: props.itemList || [],
      navItemActiveIndex: props.navItemActiveIndex || 0,
    }
  }

  nextSlide() {
    if (this.state.activeSlide + 2 < this.state.itemList.length) {
      this.setState({
        activeSlide: this.state.activeSlide + 2
      });
    } else {
      this.nextBlock();
    }
  }

  previousSlide() {
    if (this.state.activeSlide > 2) {
      this.setState({
        activeSlide: this.state.activeSlide - 2
      });
    } else {
      this.previousBlock();
    }
  }

  componentDidMount() {
    document.addEventListener('touchmove', function (event) {
      event.preventDefault();
    }, false);
    var dom = this.refs.div;
    var hammer = new Hammer(dom, {});
    hammer.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
    hammer.on('swipeup', function () {
      this.nextSlide();
    }.bind(this));
    hammer.on('swipedown', function () {
      this.previousSlide();
    }.bind(this));

    hammer.on('swipeleft', function () {
      this.nextBlock();
    }.bind(this));
    hammer.on('swiperight', function () {
      this.previousBlock();
    }.bind(this));

    this.hammer = hammer;

    Util.lazyLoadImages($('img'), 8, 200);

  }

  componentWillUnmount() {
    this.hammer = null;
    console.log('unmount');
  }

  nextBlock() {
    this.props.nextBlock && this.props.nextBlock();
  }

  previousBlock() {
    this.props.previousBlock && this.props.previousBlock();
  }

  componentWillReceiveProps(nextProps) {
    if (typeof nextProps.itemList != 'undefined') {
      let newState = {
        itemList: nextProps.itemList
      }
      if(nextProps.navItemActiveIndex != this.state.navItemActiveIndex)
        newState = {
          itemList: nextProps.itemList,
          navItemActiveIndex: nextProps.navItemActiveIndex,
          activeSlide: 0,
        }
      this.setState(newState,  () => {
        Util.lazyLoadImages($('img'), 8, 200);
      });
    }

    if (typeof nextProps.reset != 'undefined') {
      this.setState({
        reset: nextProps.reset,
      });
    }
  }

  handleSlideClick(id, isActive) {
    let redirectTarget = Util.getUrlByPageName('CalendarPrdtDetail', {
      prdtId: id,
    });
    location.href = redirectTarget;
  }

  toggleLike(index, isActive) {
    if(this.state.itemList[index].likes) return;

    let clonedList = Util.deepClone(this.state.itemList);
    clonedList[index].likes = !clonedList[index].likes;
    this.setState({
      itemList: clonedList,
    }, () => {
      this.props.updateItemList && this.props.updateItemList(clonedList);
    });
  }

  render() {
    let _this = this;
    let {itemList, reset} = this.state;
    let activeIndex = this.state.activeSlide;
    let clientWidth = 3.75;
    let clientHeight = 2.62;
    let imageHeight = 2.6;

    let slide = itemList.map(function (item, index) {
      let isActive = index === activeIndex;
      let classes = className({
        'slide': true,
        'active': isActive,
      });

      let imageObj = {
        width: `${clientWidth}rem`,
        height: `${imageHeight}rem`,
      };

      let actionClazz = item.likes ? 'like' : 'unlike';

      if (index > 10) {
        // 次页的图片通过给data-src属性进行懒加载
        return (
          <div className={classes} key={index}>
            <img data-src={item.image} style={imageObj}/>
            <div className="labels">
              <div className="title">{item.title}</div>
              <div className="desc">{item.desc}</div>
            </div>
            <div className="action"
              onClick={_this.toggleLike.bind(_this, index, isActive)}
              >
              <div
              className={actionClazz}></div>
            </div>
            <div className="mask"
              onClick={_this.handleSlideClick.bind(_this, item.id, isActive)}
              ></div>
          </div>
        )
      } else {
        return (
          <div className={classes} key={index}>
            <img src={item.image} style={imageObj}/>
            <div className="labels">
              <div className="title">{item.title}</div>
              <div className="desc">{item.desc}</div>
            </div>
            <div className="action"
              onClick={_this.toggleLike.bind(_this, index, isActive)}
              >
              <div
              className={actionClazz}></div>
            </div>
            <div className="mask"
              onClick={_this.handleSlideClick.bind(_this, item.id, isActive)}
              ></div>
          </div>
        )
      }
    });

    let containerObjStyle = {
      height: `${itemList.length*clientHeight}rem`,
      transform: `translate3d(0, ${-activeIndex*clientHeight}rem, 0)`,
      WebkitTransform: `translate3d(0, ${-activeIndex*clientHeight}rem, 0)`,
    };

    if (reset) {
      containerObjStyle = {
        height: `${itemList.length*clientHeight}rem`,
        transform: `translate3d(0, ${-activeIndex*clientHeight}rem, 0)`,
        WebkitTransform: `translate3d(0, ${-activeIndex*clientHeight}rem, 0)`,
        transition: 'all 0s ease-in-out',
        WebkitTransition: 'all 0s ease-in-out',
      };
    }

    return (
      <div className="m-slider" ref='div'>
        <div className="slide-container" style={containerObjStyle}>
          {slide}
        </div>
      </div>
    )
  }
}
