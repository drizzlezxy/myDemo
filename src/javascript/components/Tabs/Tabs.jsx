/*
 * --------------------------------------------
 * Tabs组件
 * @version  1.0
 * @author   hzguodeshi(hzguodeshi@corp.netease.com)
 * --------------------------------------------
 */


import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import Hammer from 'extend/hammer.min.js';
import Tab from './Tab';
import InkBar from './InkBar';
import './tab.scss';

function getHeaderStyles(props) {
    return {
      root: {
        width: '100%',
        overflow: 'hidden',
      },
      header: {
        width: '100%',
        backgroundColor: props.backgroundColor || '#fff',
        whiteSpace: 'nowrap',
        borderBottom: '0.005rem solid #e2e7ea',
      }
    };
}

function setTranslateX(elem,left,duration){
  return setTranslate(elem,left,0,duration);
}

function setTranslateY(elem,top,duration){
  return setTranslate(elem,0,top,duration);
}
/**
 * [setTranslate tanslate执行函数]
 * public
 * @param {[Object]} elem     [elem元素]
 * @param {[number]} left     [左移动距离]
 * @param {[number]} top      [顶移动距离]
 * @param {[number]} duration [动画执行时间]
 */
function setTranslate(elem,left,top,duration) {
  var _elem = elem,
    _left = left || 0,
    _top = top || 0,
    _duration = duration || 200;
  _elem.style.transform = "translate3d( " + _left + "px, " + _top + "px, 0px)";
  _elem.style.transitionDuration = _duration + "ms";
  _elem.style.WebkitTransitionDuration = _duration + "ms";
}
/**
 * params
 *------------
 * tabs,                    //tab列表
 * initialSelectedIndex,    // 初始化selected元素，这个是按照index顺序
 * value                    //初始化selected元素的value值
 * hasInkBar,               //是否需要inkbar
 * tabTemplate,             //内容区域component，当每个子内容都使用相同组件时，可以定义一个tabTemplate
 * onHandleChange,          // 处理tab切换前的钩子，如果返回的值是false，tab就不会切换
 * onHandleActive,          // 处理tab完成切换的函数 三个参数第一个是value,第二个是index,第三个是event事件
 * style,                   // tabs的style
 * headerStyle,             // header的style
 * inkBarStyle,             // inkbar的style
 * contentClassName,        // content的className
 * contentStyle,            // content的style
 *
 */
/**
 * Tab组件
 *
 * import React from 'react';
 * import Tabs from 'Tabs';
 *
 * class Sample extends React.Component {
 * 	constructor() {
 * 		super();
 * 		this.tabs = [
 * 		  {
 * 		    "value": 1,
 * 		    "label": "景点"，
 * 		    "children": <div>1<div>
 * 		  },
 * 		  {
 * 		    "value": 2,
 * 		    "label": "美食"，
 * 		    "children": <div>2<div>
 * 		  },
 * 		  {
 * 		    "value": 3,
 * 		    "label": "购物"，
 * 		    "children": <div>3<div>
 * 		  },
 * 		]
 *
 * 	}
 * 	render() {
 * 	let tabProps = {
 *   tabs: this.tabs,
 *   onHandleActive: this.onTabChanged.bind(this),
 *   value: 1
 *  };
 * 		return (<Tabs {...tabProps}>);
 * 	}
 *
 * }
 */
class Tabs extends Component {
    static propTypes = {
        tabs: PropTypes.array,
        children: PropTypes.node,

        className: PropTypes.string,

        inkBarStyle: PropTypes.object,

        headerStyle: PropTypes.object,

        contentStyle: PropTypes.object,

        onHandleChange: PropTypes.func,

        onHandleActive: PropTypes.func,

        hasInkBar: PropTypes.bool,

        style: PropTypes.object,

    }
    static defaultProps = {
        initialSelectedIndex: 0,
        hasInkBar: true,
        onChange: () => {}
    }

    state = {selectedIndex: 0};
    /**
     * [componentWillMount 设置选中select]
     * public
     * @return {void}
     */
    componentWillMount() {
        this.initSetSelectedIndex(this.props);
    }
    /**
     * [componentWillReceiveProps 存在tabs是从后台获取，导致props更新，才能设置选中select]
     * public
     * @return {void}
     */
    componentWillReceiveProps(nextProps){
      if(this.props.tabs.length !== nextProps.tabs.length || this.props.value !== nextProps.value){
        this.initSetSelectedIndex(nextProps);
      }
    }
    shouldComponentUpdate(nextProps, nextState){
      return  this.props.tabs !== nextProps.tabs || this.state.selectedIndex !== nextState.selectedIndex;
    }

    componentDidMount(){
      this.initContentSwipe();
    }
    /**
     * [initSetSelectedIndex 初始化被选中元素]
     * public
     * @param  {[type]} _props [description]
     * @return {[type]}        [description]
     */
    initSetSelectedIndex(_props){
      const props = _props || this.props;
      const initialIndex = props.initialSelectedIndex;
      this.setState({
          selectedIndex: props.value !== undefined
              ? this.getSelectedIndex(props)
              : initialIndex < this.getTabsCount()
                  ? initialIndex
                  : 0
      });
    }
    /**
     * [getSelectedIndex 获取被选中的index]
     * public
     * @param  {Object} _props [props对象]
     * @return {string || value}        [index]
     */
    getSelectedIndex(_props) {
        const props = _props || this.props;
        const value = props.value;
        let selectedIndex = -1;

        props.tabs.forEach((tab, index) => {
            if (value === tab.value) {
                selectedIndex = index;
            }
        });

        return selectedIndex;
    }
    /** 获取tabs数量 */
    getTabsCount() {
        return this.props.tabs.length;
    }
    /** 判断此tab是否被选中 */
    getSelected(tab, index) {
        return this.state.selectedIndex === index;
    }

    /**
     * [handleTabTouch 处理tab切换函数]
     * public
     * @param  {[string || number]} value [选中元素的value值]
     * @param  {[number]}  [index]
     * @param  {[Object]} event   [事件]
     * @return {void}
     */
    handleTabTouch(value, _index, event) {
        const index = _index;

        if (this.state.selectedIndex !== index) {
            if (this.props.onHandleChange && !this.props.onHandleChange(value, index, event)) {
              return null;
            }
            this.setState({
                selectedIndex: index
            },function(){
              this.props.onHandleActive && this.props.onHandleActive(value, index, event);
            }.bind(this));
        }
    }
    /**
     * [initContentSwipe 注册tab content swipe]
     * public
     * @param  {[Object]} _options [hammerjs options]
     * @return {void}
     */
    initContentSwipe(_options){
      const elem = ReactDOM.findDOMNode(this.refs.content),
            options = Object.assign({},_options);
      this.contentHammer = this.onSwipe(elem,options);
    }

    /**
     * [onSwipe 监听元素左右swipe]
     * public
     * @param  {[object]} elem    [elem对象]
     * @param  {[Object]} _options [hammerjs options]
     * @return {[object]}          [hammerjs object]
     */
    onSwipe(elem,options){
      var hammer = new Hammer(elem,options);
      hammer.on('swipeleft',function (e){
        const length = this.props.tabs.length,
              selectedIndex = this.state.selectedIndex === length - 1 ? this.state.selectedIndex : this.state.selectedIndex + 1;
        this.handleTabTouch(this.props.tabs[selectedIndex].value,selectedIndex,e);
      }.bind(this));
      hammer.on('swiperight',function (e){
        const selectedIndex = this.state.selectedIndex === 0 ? 0 : this.state.selectedIndex - 1;
        this.handleTabTouch(this.props.tabs[selectedIndex].value,selectedIndex,e);
      }.bind(this));
      return hammer;
    }
    /**
     * [renderTabs 渲染tabs函数]
     * public
     * @param  {[Array]} _tabs [tabs列表]
     * @return {[Object]}       [{header头部, content内容块}]
     */
    renderTabs(_tabs) {
        const tabs = _tabs || [];
        const value = this.props.value;
        const width = 100 / this.getTabsCount();
        const tabTemplate = this.props.tabTemplate;
        const content = [];
        const _this = this;

        const header = tabs.map(function(tab, index) {
            if (value && tab.value === undefined) {
                console.warn('tab.value属性缺失！')
            }
            // 内容块组件添加
            content.push(React.createElement(tabTemplate || TabTemplate, {
                    key: index,
                    value: tab.value,
                    selected: _this.getSelected.call(_this,tab,index),
                },tab.children || null ));
                // 添加tab组件
            return React.createElement(Tab, {
                key: index,
                index: index,
                label: tab.label,
                value: tab.value,
                selected: _this.getSelected.call(_this,tab,index),
                width: `${width}%`,
                onTouchTap: _this.handleTabTouch.bind(_this)
            },null);
        });
        return {header, content};
    }
    /**
     * [renderInkBar 渲染inkbar]
     * public
     * @param  {[type]} inkBarStyle [description]
     * @return {[type]}             [description]
     */
    renderInkBar(inkBarStyle) {
        const width = 100 / this.getTabsCount();
        return this.state.selectedIndex !== -1
            ? (<InkBar left={`${100 * this.state.selectedIndex}%`} width={`${width}%`} style={inkBarStyle}/>)
            : null;
    };
    render() {
        const {
            tabs,
            contentClassName,
            contentStyle,
            initialSelectedIndex,
            inkBarStyle,
            style,
            hasInkBar,
            headerStyle,
            tabTemplate,
            onHandleChange,
            onHandleActive,
            backgroundColor,
            ...other
        } = this.props;
        const styles = getHeaderStyles(this.props);
        const inkBarContainerWidth = (headerStyle && headerStyle.width)
            ? headerStyle.width : '100%';
        const inkBar = hasInkBar ? this.renderInkBar(inkBarStyle) : null;
        const {header, content} = this.renderTabs.call(this,tabs);
        return (

<div {...other} style = {Object.assign(styles.root, style)} className='m-tab'>
<ul style={Object.assign(styles.header, headerStyle)} className='menu'>
            {header}
            </ul>
            <div style = {{width: inkBarContainerWidth}}>
              {inkBar}
            </div>
            <div style={Object.assign({}, contentStyle)} className={contentClassName || 'tab-container'} ref="content">
              {content}
            </div >
          </div>
        );
    }
}
/**
 * [TabTemplate 内容块默认template]
 */
class TabTemplate extends Component {
    static propTypes = {
        selected: PropTypes.bool
    };

    render() {
        const styles = {
            width: '100%',
            position: 'relative',
            textAlign: 'initial'
        };
        const {
          children,
          ...other
        }  = this.props;
        const childrenElm = React.cloneElement(
          children,
          other
        );
        if (!this.props.selected) {
            styles.display = 'none';
        }else{
          styles.display = 'block';
        }
        return (
            <div style={styles} className={this.props.selected ? 'tab-content active': 'tab-content'}>
                {childrenElm}
            </div>
        );
    }
}

export default Tabs;
