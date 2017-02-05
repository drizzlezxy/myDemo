import React from 'react';
import './UserDialog.scss';

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
      <div className="m-notify-dlg" style={style}>
        <div className="mask" onClick={this.props.leave}></div>
        <div className="dlg_content">
            {this.props.children}
            {this.props.closeFlag ==1 ?
                <div onClick={this.props.leave} className="close_icon"></div>
                :null
            }
            
        </div>
        
      </div>
    )
  }
}