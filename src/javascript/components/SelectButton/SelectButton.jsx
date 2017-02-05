import React, {Component} from 'react'
import './SelectButton.scss'
import Util from "extend/common/util";
export default
class SelectButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: props.selected
    }
  }

  handleClick() {
    if (this.props.clickCallBack) {
      this.props.clickCallBack();
    }
  }

  componentWillReceiveProps(props) {
    if (this.props.choosen !== props.choosen) {
      this.setState({
        selected: props.choosen
      })
    }
  }

  render() {
    var classes = ""
    if (this.props.selected) {
      classes = "sprite icon-select"
    } else {
      classes = "sprite icon-unselect"
    }
    return (
      <i className={classes} onClick={this.handleClick.bind(this)}>
      </i>
    )
  }
}