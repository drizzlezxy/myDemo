import React from 'react';
import Util from "extend/common/util";
import DateUtil from 'extend/common/DateUtil';
import './YQLuckyOne.scss';

class PrdtCard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let item = this.props.item;

    return (
        <div className="lucky-item">
          <div className="head-img">
            <img className="head-img" src={item.headUrl} alt="暂无图片"/>
          </div>
          <div className="content">
            <div className="nick-name">{item.userName}</div>
            <div className="seckill-time">{DateUtil.formatDate(item.seckillTime, 'yyyy-MM-dd HH:mm:ss')}</div>
          </div>
          <div className="lucky-quantity">{item.quantity}份</div>
        </div>
    )
  }
}
PrdtCard.contextTypes={
  addCartHandler:React.PropTypes.func
};
export default PrdtCard