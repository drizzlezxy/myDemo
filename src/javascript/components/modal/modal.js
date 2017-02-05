import React from 'react';
import './rodal.css';

const { PropTypes, Component } = React;
const propTypes = {
  width: PropTypes.number,
  // height          : PropTypes.number,
  onClose: PropTypes.func.isRequired,
  visible: PropTypes.bool,
  showMask: PropTypes.bool,
  showCloseButton: PropTypes.bool,
  animation: PropTypes.string,
  duration: PropTypes.number,
  measure: PropTypes.string,
  alignItems: PropTypes.string
};

const defaultProps = {
  width: 3.35,
  // height          : 240,
  measure: 'rem',
  visible: false,
  showMask: true,
  showCloseButton: true,
  animation: 'zoom',
  duration: 300,
  alignItems: 'center'
};

const Dialog = props =>
{

  const className = `rodal-dialog rodal-${props.animation}-${props.animationType}`;
  const CloseButton = props.showCloseButton ? <span className="rodal-close" onClick={props.onClose }/> : null;
  const { width, measure, duration } = props;
  const style = {
    width: width + measure,
    // height                  : height + measure,
    // marginTop               : - height / 2 + measure,
    // marginLeft              : - width / 2 + measure,
    animationDuration: duration + 'ms',
    WebkitAnimationDuration: duration + 'ms'
  };

  return (
    < div style={style} className={className}>
      {CloseButton}
      {props.children}
    </div >
  )
};

class Rodal extends Component {

  constructor(props) {
    super(props);

    this.animationEnd = this.animationEnd.bind(this);
    this.state = {
      isShow: false,
      animationType: 'leave'
    };
  }

  componentDidMount() {
    if (this.props.visible) {
      this.enter();
    }
    var modal = this.refs.modal;
    modal.addEventListener('touchmove', function (e) {
      e.preventDefault();
    }, false);
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.visible && nextProps.visible) {
      this.enter();
    } else if (this.props.visible && !nextProps.visible) {
      this.leave();
    }
  }

  enter() {
    this.setState({
      isShow: true,
      animationType: 'enter'
    });
  }

  leave() {
    this.setState({
      animationType: 'leave'
    });
  }

  animationEnd() {
    if (this.state.animationType === 'leave') {
      this.setState({
        isShow: false
      });
    }
  }

  render() {
    const mask = this.props.showMask ? <div className="rodal-mask" onClick={this.props.onClose }/> : null;
    const style = {
      WebkitAnimationDuration: this.props.duration + 'ms',
      animationDuration: this.props.duration + 'ms',
      alignItems: this.props.alignItems
    };
    return (
      < div ref="modal" style={style} className={this.state.isShow?("rodal rodal-fade-" + this.state.animationType+' show'):("rodal rodal-fade-" + this.state.animationType +" hide")} onAnimationEnd={this.animationEnd }>
        {mask}
        < Dialog {...this.props} animationType={this.state.animationType}>
          {this.props.children}
        </Dialog >
      </div >
    )
  }
}

Rodal.propTypes = propTypes;
Rodal.defaultProps = defaultProps;

export default Rodal;