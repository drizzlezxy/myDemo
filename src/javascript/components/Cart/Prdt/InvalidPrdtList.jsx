import React, {Component} from 'react'
import PrdtItem from 'components/PrdtItem/PrdtItem.jsx'
import Util from "extend/common/util";
import PrdtList from './PrdtList.jsx'

export default
class InvalidPrdtList extends Component {
  render() {
    const that = this.props.that;
    return (
      <div className="m-prdtList-invalid">
        <div className="listHead">
          <div className="label">失效商品</div>
          <div className="clearbutton" onClick={this.props.clearInvalidSkus}>清除</div>
        </div>
        <PrdtList list={this.props.invalidSkuList} invalid={true}  that={that}/>
      </div>
    )
  }
}