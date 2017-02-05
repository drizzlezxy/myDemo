/*
 * --------------------------------------------
 * GotoTop 组件
 * @version  1.0
 * @author   hzguodeshi(hzguodeshi@corp.netease.com)
 * --------------------------------------------
 */
import React from 'react';
import ReactDOM from 'react-dom';
import GotoTop from './GotoTop.jsx';

//function GotoTopRender(_elem, _key, _offset) {
//  let elem = (_elem._reactInternalInstance ? ReactDOM.findDOMNode(_elem) : _elem) || document.documentElement,
//       key = _key || 'toTop'+ new Date(),
//       offset = _offset || null;
//  var container = document.getElementById('goTop');
//  if(!container){
//    container = document.createElement('div');
//    container.id = 'goTop';
//    document.body.appendChild(container);
//  }
//  ReactDOM.render(<GotoTop elem={elem} offset={offset} scrollTop={scrollTop} />,container);
//}

export default GotoTop;
