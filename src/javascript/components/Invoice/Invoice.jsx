/**
 * Created by hzduanchao on 2016/7/1.
 */
import React from 'react';
import './invoice.scss';
import Util from 'extend/common/util';

export default class Invoice extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOldOrder: false,
      invoiceType: {
        selected: props.invoiceType,
        invoiceTitle: props.invoiceTitle,
        types: [
          {
            id: 0, name: 'placeHolder', label: '占位符', display: false,
          },
          {
            id: 1, name: 'personal', label: '个人', placeholder: '个人发票无需填写抬头', value: null, display: false,
          },
          {
            id: 2, name: 'company', label: '公司', placeholder: '请输入抬头', value: null, display: false,
          },
        ]
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (Util.isExisty(nextProps.invoiceType)) {
      let clonedInvoiceType = Util.deepClone(this.state.invoiceType);
      clonedInvoiceType.invoiceTitle = nextProps.invoiceTitle;
      clonedInvoiceType.selected = nextProps.invoiceType;

      if (clonedInvoiceType.selected > 0) {
        clonedInvoiceType.types.map((typeEl) => {
          typeEl.display = true;
          return typeEl;
        });
      }

      this.setState({
        isOldOrder: nextProps.isOldOrder,
        invoiceType: clonedInvoiceType,
      }, () => {
        console.log(this.state);
      });
    }
  }

  handleClick() {
    this.props.onInvoiceChange();
  }

  handleTypeChange(type) {
    if (this.state.isOldOrder) return;
    this.props.onInvoiceTypeChange(type);
  }

  handleInvoiceTitleChange(e) {
    this.props.onInvoiceTitleChange(e.target.value);
  }

  isPersonalInvoice() {
    let {
      invoiceType: {
        invoiceTitle,
        selected,
        types,
      },
      totalPrice,
      postage,
    } = this.state;

    return selected == 1;
  }

  render() {
    let {
      isOldOrder,
      invoiceType: {
        selected,
        invoiceTitle,
        types,
      },
    } = this.state;

    let {placeholder} = types[selected];
    let invoiceTitleInput = null;
    console.log('this.state in invoiceTitle', this.state);
    if (selected == 1) {
      invoiceTitleInput = <input type="text" placeholder={placeholder} disabled value=""/>;
    } else if (selected > 1){
      if (isOldOrder) {
        invoiceTitleInput = <input type="text" placeholder={placeholder} value={invoiceTitle} readOnly />;
      } else {
        invoiceTitleInput = <input type="text" placeholder={placeholder} value={invoiceTitle} onChange={this.handleInvoiceTitleChange.bind(this)}/>;
      }
    }

    let invoiceChecked = this.props.invoiceChecked;
    
    return (
      <div className="m-invoice">
        <h1 onClick={this.handleClick.bind(this)}><i
          className={invoiceChecked? "sprite checkbox active":"sprite checkbox"}></i>开具发票</h1>
        {invoiceChecked ? <div className="invoice-detail">
          <div className="invoice-type">
            <span className="type">类型</span>
            <div>
              <label className="person" onClick={this.handleTypeChange.bind(this,1)}>
                <i className={selected===1?"sprite radio active":"sprite radio"}></i>
                个人
              </label>
              <label htmlFor="company" onClick={this.handleTypeChange.bind(this,2)}>
                <i className={selected===2?"sprite radio active":"sprite radio"} value={invoiceTitle}></i>
                公司
              </label>
            </div>
          </div>
          <div className="invoice-title">
            <span className="title">抬头</span>
            {invoiceTitleInput}
          </div>
        </div> : null}
      </div>
    )
  }

}