import React from 'react';
import PrdtCard from '../PrdtCard/PrdtCard.jsx';
import 'scss/base.scss';
import './list.scss';

export default
class List extends React.Component {
  static defaultProps = {
    list: []
  };

  render() {
    if (this.props.list && this.props.list.length > 0) {
      var item = this.props.list.map(function (value, index) {
        return (
          <li className="item" key={'item' + index}>
            <PrdtCard item={value} addToCart={this.props.handleAddCart}/>
          </li>
        );
      }.bind(this));
    } else {
      var item = ""
    }
    return (
      <div>
        <ul className="m-list clearfix">
  				{item}
        </ul>
        <div className="m-no-more">没有更多了哦~</div>
      </div>
    );
  }
}