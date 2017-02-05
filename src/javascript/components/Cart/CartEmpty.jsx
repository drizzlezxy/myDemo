/**
 * @author  hzzhouming
 */
import React from 'react';
// import '../PayStatus/payStatus.scss';

export default
class CartEmpty extends React.Component {
  constructor(props) {
    super(props);
  }

  handleClick() {
    location.href = '../HomePage/index.html'
  }

  render() {
    let background = {
      position: "fixed",
      width: "100%",
      height: "100%",
      backgroundColor: "#eee",

    }
    let block = {
      display: "block",
      margin: "1.64rem auto 0.16rem",
      width: "0.44rem",
      height: "0.44rem",
      backgroundImage: "url(../../../res/images/BottomBar/bottom_bar_icon@3x.png)",
      backgroundPosition: "-1.76rem",
      backgroundSize: "auto 0.44rem",
      backgroundRepeat: "no-repeat",
    }
    let text = {
      lineHeight: "0.15rem",
      textAlign: "center",
      fontSize: "0.14rem",
      color: "#222",
    }
    let style = {
      color: "#000",
      backgroundColor: "#ffe123",
      borderRadius: "0.02rem",
      marginTop: "0.2rem",
      display: "block",
      margin: "0.2rem auto",
      lineHeight: "0.4rem",
      width: "1.8rem",
      textAlign: "center",
      fontSize: "0.15rem",
      color: "#222",
    }
    return (
      <div className="m-pay-status" style={background}>
        <i className="img empty" style={block}></i>
        <div className="text" style={text}>你还没有挑选任何商品哦~</div>
        <a onClick={this.handleClick.bind(this)} style={style}>去逛逛吧~</a>
      </div>
    )
  }
}