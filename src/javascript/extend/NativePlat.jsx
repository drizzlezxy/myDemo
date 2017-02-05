import React, {
  Component
  } from 'react'
import NEJsbridge from 'extend/jsBridge.js'
import {contentLoaded,
  loaded} from 'extend/Util/initial.js'

export default class NativePlat extends Component {

  static toPage(id) {
    window.NEJsbridge.sendJSEvent('toPage', {
      "link": id
    })
  }

  static goBack() {
    window.NEJsbridge.sendJSEvent('invokeBack', {})
  }

  static pay(payStr, payChannel, fun) {
    window.NEJsbridge.invokeNative('invokePay', {
      'payParam': payStr,
      'payChannel' : payChannel
    }, function (data) {
      fun(data);
    }, function () {
    })
  }

  static invokeNavigation(x, y, name) {
    window.NEJsbridge.sendJSEvent('invokeNavigation', {
      "latitude": ""+x,
      "longitude": ""+y,
      "dstname": name||""
    })
  }

  static getUserPosition(fun) {
    window.NEJsbridge.invokeNative('getUserPosition', {}, function (data) {
      fun(data);
    }, function () {
    })
  }

  static getUserAddress(fun) {
    window.NEJsbridge.invokeNative('getUserAddress', {}, function (data) {
      fun(data);
    }, function () {
    })
  }

  static invokeVoice(voice, id) {
    window.NEJsbridge.sendJSEvent('invokeVoice', {
      "voiceSrc": voice,
      "scenicId": id
    })
  }

  /**
   * 头部下拉刷新结束事件
   * @return {[type]} [description]
   */
  static invokeRefreshResult() {
    setTimeout(function (){
      alert('('+ (+new Date()) +')' + 'H5 send to Native ====> headerPullRefreshEnd');
    }, 10);
    window.NEJsbridge.sendJSEvent('headerPullRefreshEnd', {})
  }

  /**
   * 头部下拉刷新监听
   * @param  {[type]} func [description]
   * @return {[type]}      [description]
   */
  static receiveNativeRefresh(func) {
    window.NEJsbridge.observeNativeEvent('headerPullRefreshStart', function (e) {
      setTimeout(function (){
        alert('('+ (+new Date()) +')' + 'Native call to H5 ====> headerPullRefreshStart');
      }, 10);
      func()
    })
  }

  /**
   * 页面是否需要下拉刷新通知事件
   * @return {[type]} [description]
   */
  static invokeNeedDropRefresh() {
    window.NEJsbridge.sendJSEvent('needPullRefresh', {
      "pullRefresh": "1"
    })
  }

  /**
   * [setStatusBar description]
   * @param {[String]} value [1 黑色 0 白色]
   */
  static setStatusBar(value) {
    window.NEJsbridge.sendJSEvent('setStatusBar', {
      "style": value
    })
  }

  static sendStatisticalTime(requestEnd, requestParse) {
    window.NEJsbridge.sendJSEvent('sendStatisticalTime', {
      "domContenteLoadedEnd": "" + contentLoaded,
      "onLoad": "" + loaded,
      "dynamicReady": "" + requestEnd,
      "dynamicLoaded": "" + requestParse
    })
  }
}