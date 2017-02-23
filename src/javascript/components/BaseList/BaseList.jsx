/**
 * 基础列表控件，响应上滑加载更多的事件
 * @author wuxiaotian (hzwuxiaotian3@corp.netease.com)
 * @param {Object}   items    列表数组
 *        {String}   clazz    自定义class名称
 *        {Function} loadMore 加载更多的回调函数，若没有指定回调或传入false，
 *                           则不会显示“向上滑动加载更多”的提示，并且不会响应加载更多事件
 *
 * @sample:
 * class ForetasteList extends React.Component {
 *   constructor() {
 *     super();
 *
 *      this.state = {
 *        items: []
 *      };
 *
 *      this.loadMore = this.loadMore.bind(this);
 *    }
 *
 *  componentDidMount() {
 *    Util.requestData('src/javascript/data/foretaste.json', 'get',
 *                     { shopId: this.props.shopId, categoryId: this.props.categoryId },
 *                     function(data) {
 *                       this.setState({
 *                         items: data.result.prdtList
 *                       });
 *                     }.bind(this));
 *  }
 *
 *  render() {
 *    return (
 *      <BaseList items={this.state.items} clazz="m-foretaste-list" loadMore={false}>
 *        -------------------------------------------------------
 *        | 自定义的列表项对象，作为子控件传入，                   |
 *        | 每个列表项的数据对象，可在Item控件内通过props.item获取，|
 *        | 可通过item.index属性获取item在列表中的下标             |
 *        -------------------------------------------------------
 *        <Item status={this.props.stateId}></Item>
 *      </BaseList>
 *    )
 *  }
 *
 *  loadMore() {
 *    console.log('loading...');
 *  }
 *};
 */
import React from 'react';
import Util from "extend/common/util";
import Hammer from 'extend/hammer.min.js';

import './BaseList.scss';

class BaseList extends React.Component {
  constructor() {
    super();

    this.state = {};
    this.timer = null;
  }

  componentDidMount() {
    this.bindEvents();
  }

  render() {
    let items = [];
    //将传入的子控件作为列表项模板
    if (this.props.items.length) {
      let child = this.props.children;
      items = this.props.items.map((item, index) => {
        item.index = index;
        let _item = React.cloneElement(child, { item: item });

        return (
          <li className="base-list-item" key={index}>
            { _item }
          </li>
        )
      })
    } else {
      // items = <div className="m-loading fa-spinner fa-spin">正在加载...</div>
      items = null;
    }

    return (
        <ul ref="baseList" className={ "m-base-list " + this.props.clazz }>
          { items }
          <div ref="loadMore" className="m-load-more fa-spinner fa-spin">
            { this.getMessage.apply(this) }
          </div>
        </ul>
      );
  }

  getMessage(){
    var message = '正在加载...';
    if(typeof this.props.hasMore !== "boolean" && this.props.items.length === 0){
      return message;
    }else if(typeof this.props.hasMore === "boolean" && !this.props.hasMore){
     return message = '哎呀，你竟然看完了';
    }else{
      message = this.props.loadMore ? '向上滑动加载更多' : '更多商品敬请期待...';
    }
    return message;
  }

  bindEvents() {
    this.loadMoreEvent();
  }

  /**
   * 加载更多事件回调
   */
  loadMoreEvent() {
    if(this.props.loadMore && typeof this.props.loadMore === 'function') {
      let hammer = new Hammer(this.refs.baseList, {});
      hammer.on('swipeup panup', () => {
        if(this.__isNeedLoadMore()) {
          this.__loadMore();
        }
      });
    }
  }

  /**
   * 函数分流，避免过于频繁地加载数据
   * @param  {Function} func  待执行的回调函数
   * @param  {Number}   delay 延迟时间
   */
  throttle(func, delay) {
    clearTimeout(this.timer);
    this.timer = setTimeout(()=>{
      func.apply(this, arguments);
    }, delay);
  }

  /**
   * 判断页面是否需要加载
   */
  __isNeedLoadMore() {
    if(!this.props.hasMore){
      return false;
    }
    return ( Util.DomInView(this.refs.loadMore));
  }

  __loadMore() {
    this.throttle(this.props.loadMore, 300);
  }
};

export default BaseList;
