/**
 * hzduanchao@corp.netease.com
 * 2016/7/11
 * 试吃-下单成功
 **/

import React from 'react';
import './payStatus.scss';
import {
  queryObj,
} from 'extend/Util/initial.js'

export default class ForetasteSuccess extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="m-pay-status">
        <i className="img foretaste-fail"></i>
        <span className="text">下单失败</span>
        <span className="text-sm">请尝试重新下单</span>
        <a href={"../../sijiPages/ForetasteShop?shopId="+queryObj.shopId} className="one-btn">返回试吃店铺</a>
      </div>
    )
  }
}