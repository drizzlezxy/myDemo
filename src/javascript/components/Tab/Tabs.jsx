import React from 'react';
import classNames from 'classnames'
import './Tab.scss'
import Hammer from 'extend/hammer.min.js'
import Util from 'extend/Util/Util.jsx'
export class TabMenu extends React.Component {
  render() {
    var that = this;
    var activeIndex = this.props.activeTabIndex;
    var tabnum = this.props.list.length;
    var menuItems = this.props.list.map(function (child, index) {
      var ref = 'tabs-menu-' + index;
      var title = child.props.title;
      var classes = classNames({
        'tabs-menu-item': true,
        'tab-active': activeIndex === index

      })
      return (
        <li ref={ref} key={index} className={classes} onClick={that.props.onActiveChange.bind(null,index)}>
          <a>
            {title}
          </a>
        </li>
      )
    });
    return (
      <nav className='tabs-nav' id='tabs-nav'>
        <ul className='tabs-menu'>
          {menuItems}
        </ul>
      </nav>
    )
  }
}

export class TabPanels extends React.Component {
  render() {
    var that = this;
    var activeIndex = this.props.activeTabIndex;
    var PanelList = this.props.list.map(function (child, index) {
      var ref = 'tab-panel-' + index;
      var classes = classNames({
        'tab-panel': true,
        'tab-panel-active': index === activeIndex
      });
      return (
        <article ref={ref} className={classes} key={index}>
          {child}
        </article>
      )
    });
    return (
      <div>
        {PanelList}
      </div>
    );
  }
}
export class Sort extends React.Component {
  static defaultProps = {
    types: [],
    activeType: 0
  }

  constructor(props) {
    super(props);
    this.state={
      activeType: props.activeType
    }
  }

  onTypeChangeClick = (e,index) => {
    let i=0;
    let activeType=this.state.activeType
    if(index===1){
      if(activeType===1){
        i=2
      }else{
        i=1
      }
    }
    if(index===2){
      if(activeType===3){
        i=4
      }else{
        i=3
      }
    }
    this.setState({
      activeType: i
    })
    Util.throttle(this.onTypeChange,this);
  }

  onTypeChange(){
    var _this=this.props._this;
    _this.loadPrdtList(this.state.activeType)
  }

  render() {
    var that = this;
    var type = this.state.activeType;
    var length = this.props.types.length;
    var arr=[0,1,1,2,2];
    var list = this.props.types.map(function (ele, index) {
      var activeindex = arr[type];
      var classes = classNames({
        'tabs-sort-item': true,
        'sort-active': activeindex === index
      })
      var sortClasses = classNames({
        'last': (length - 1) === index,
        'sort': ele.sort && (type === 0||(index===1&&activeindex===2)||(index===2&&activeindex===1)),
        'sort-up': ele.sort && ((index===1&&type===1)||(index===2&&type===3)),
        'sort-down': ele.sort && ((index===1&&type===2)||(index===2&&type===4))
      })
      return (
        <li key={index} className={classes}>
          <a onClick={e=>that.onTypeChangeClick(e,index)}>
            <span className={sortClasses}>{ele.title}</span>
          </a>
        </li>

      )
    })
    return (
      <ul className='tabs-sort'>
        {list}
      </ul>
    )
  }

}
export class TabPanel extends React.Component {
  constructor() {
    super()
  }

  componentDidMount() {
    var ele = this.refs.div;
    var hammer = new Hammer(ele, {});
    hammer.on('swipeleft', function (ev) {
      this.props.change("left");
    }.bind(this));
    hammer.on('swiperight', function (ev) {
      this.props.change("right");
    }.bind(this));
    hammer.on('panup swipeup', function (ev) {
      this.props.change('up');
    }.bind(this))
  }

  render() {
    return (
      <div ref='div'>
        {this.props.children}
      </div>
    )
  }
}