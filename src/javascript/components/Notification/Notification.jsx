import React from 'react';
import './notification.scss';

export default class Notification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isShow: false};
  }

  componentWillReceiveProps(nextProps) {

    // console.log('nextProps in Notification', nextProps);

    // if (!this.props.enter && nextProps.enter) {
    //   this.enter();
    // } else if (this.props.enter && !nextProps.enter) {
    //   this.leave();
    // } else {
    //   this.enter();
    // }

    if (nextProps.enter != null) {
      this.setState({
        isShow: !!nextProps.enter
      });
    }
  }

  enter() {
    this.setState({isShow: true});
  }

  leave() {
    this.setState({isShow: false});
  }

  render() {
    let style = {
      display: this.state.isShow ? 'block' : 'none'
    }
    return (
      <div className="m-notify" style={style}>
        <div className="mask" onClick={this.props.leave}></div>
        <div className="text">{this.props.children}</div>
      </div>
    )
  }
}