import React from 'react';

class Item extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      buttons: [

        { text: '我要试吃', properties: { className: "foretaste-button btn-buy", onClick: (event)=>{props.addToTasteList(event, props.item)} } },
        { text: '已试吃',   properties: { className: "foretaste-button btn-done" } },
        { text: '吃完啦',   properties: { className: "foretaste-button btn-done" } }
      ]
    };
  }

  render() {
    let _item = this.props.item;
    let button = this.state.buttons[_item.status];
    return (
      <div>
        <div className="foretaste-image">
          <img src={_item.image}></img>
        </div>
        <div className="foretaste-base-info">
          <div className="foretaste-product-name">{_item.prdtName}</div>
          <div className="foretaste-product-desc">{_item.desc}</div>
          <div className="foretaste-product-stock" style={ (_item.remainCount > 0) ? {} : {display: 'none'} }>仅剩{_item.remainCount}件</div>
          <div className="foretaste-product-buttons">
            <button className="foretaste-button btn-buy">去购买</button>
            <button {...button.properties}>{button.text}</button>
          </div>
        </div>
      </div>
    );
  }
};

export default Item;
