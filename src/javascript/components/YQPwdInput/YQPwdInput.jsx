import React, {Component} from 'react';
import Util from "extend/common/util";
import './YQPwdInput.scss';

export default class YQPwdInput extends Component {
	constructor(props) {
		super(props);
		this.state = {
			inputPwd: '',
			pwdLen: 4,
			inputTime: 0,
			timeLimit: 5,
		}
	}

	componentDidMount() {
	}

	componentWillReceiveProps(nextProps) {
		let {pwdLen, timeLimit} = this.state;
		this.setState({
			pwdLen: Number(nextProps.pwdLen) || pwdLen,
			timeLimit:  Number(nextProps.timeLimit) || timeLimit,
		})
	}

	handleInput() {
		this.refs.pwdInput.focus();
	}

	handleChange() {
		$('.m-notify .text').css('top', '57%');
		this.setState({
			inputPwd: this.inputVali(),
		}, () => {
			let {inputPwd: strPwd, pwdLen, inputTime, timeLimit} = this.state;
			if(strPwd.length == (pwdLen)) {

				let elePwdInput = this.refs.pwdInput;
				elePwdInput.disabled = true;

				let eleShowPwd = this.refs.showPwd;
				eleShowPwd.className += ' disabled';

				this.props.checkPwd(
					strPwd, 
					{
						success: () => {
							console.log('pwd right');
						},
						fail: () => {
							console.log('pwd error');

							if(inputTime + 1 >= timeLimit) {
								this.props.exceed();
								return;
							}

							setTimeout( () => {
								elePwdInput.disabled = false;
								eleShowPwd.className = 'show-pwd';
								this.setState({
									inputPwd: '',
									inputTime: inputTime + 1,
								})
							}, 2000);
						},
					}
				);
			}
		});
	}

	inputVali() {
		let curValue = this.refs.pwdInput.value;
		if(curValue !== '') {
			if(parseInt(curValue) === 0) {
				curValue = curValue.replace(/[^\d]/g,'');

			} else {
				curValue = String(parseInt(curValue) || this.state.inputPwd);
			}
		}
		(curValue.length > this.state.pwdLen) && (curValue = this.state.inputPwd);
		return curValue;
	}

	getInputList() {
		let that = this;
		let pwdLen = this.state.pwdLen;
    	let strList = String(that.state.inputPwd).split('');
		let inputList = [];

    	for(let i = 0; i < pwdLen; i++) {
    		inputList.push(
				<div className={"item pwd-" + i} ref={"pwd" + i} key={i}>
					{!!strList[i] && <div className="dot"></div>}
				</div>
    		)
    	}
    	return inputList;
	}

	render() {
		let that = this;
		let inputList = this.getInputList();
		let pwdLen = this.state.pwdLen;
    	let inputType = Util.isIOS() ? 'number' : 'tel';

		return (
			<div className="input-outer">
				<input 
					className="pwd-input" ref="pwdInput"
					type={inputType} pattern="\d*"
					value={that.state.inputPwd || ''}
					onChange={that.handleChange.bind(that)}
				/>
				<div className="show-pwd" ref="showPwd" onClick={this.handleInput.bind(this)}>
					{inputList}
				</div>
			</div>
		)
	}
}