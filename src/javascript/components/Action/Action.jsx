import React, {Component} from 'react'
import './Action.scss'
export default
class Action extends Component {
  static defaultProps = {
    actionList: []
  };

  render() {
    var list = this.props.actionList.map(function (ele, index) {
      return (
        <div className="row" key={index}>
          <img className="icon-action" src={ele.id} />
          <div className="value">{ele.value}</div>
        </div>
      )
    })
    if(list.length===0) {
      return null;
    }else{
      return (
        <div className="m-action">
          {list}
        </div>
      )
    }

  }
}