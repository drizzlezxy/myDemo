/**
 * Created by hzduanchao on 2016/6/30.
 */
import React from 'react';
import './cardUnit.scss';

export default class CardUnit extends React.Component {
  constructor(props) {
    super(props);
  }

  static defaultProps = {
    title: ''
  };

  render() {
    var style = this.props.style?this.props.style:null;
    return (
      <div className="m-cardunit" style={style}>
        {this.props.children}
      </div>
    )
  }
}