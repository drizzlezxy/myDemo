/**
 * Created by hzduanchao on 2016/6/29.
 */
import React from 'react';
import './radio.scss';

export default class Radio extends React.Component {
  constructor(props) {
    super(props);
  }

  static defaultProps = {
    checked: false
  };

  handleChange(value) {
    this.props.onDeliveryChange(value);
  }

  render() {
    return (
      <div className="m-radio">
        <input className={this.props.checked?"sprite active":"sprite"} name={this.props.name} type="radio"
               value={this.props.value} checked={this.props.checked}
               onChange={this.handleChange.bind(this,this.props.value)}/>
      </div>
    )
  }
}