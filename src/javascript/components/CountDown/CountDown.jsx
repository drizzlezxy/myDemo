import React, {Component} from 'react';
import StringUtil from 'extend/common/StringUtil';
import DateUtil from 'extend/common/DateUtil';
import Logger from 'extend/common/Logger';
import './CountDown.scss';

export default
class CountDown extends Component {

	constructor(props) {
	  super(props);
	
	  this.state = {
	  	startTime: 1480599888840,
	  	durationTime: 259200000,	//3天
	  	hours: props.hours,
	  	minutes: props.minutes,
	  	seconds: props.seconds,
	  	isReady: false,
	  };
	}

	componentDidMount() {
		this.startCount();
	}

	componentWillReceiveProps(nextProps) {
		let timeInfo = nextProps.timeInfo;
		if(!!timeInfo) {
			clearInterval(this.timer);

			this.setState({
				startTime: timeInfo.startTime,
				durationTime: timeInfo.durationTime,
			}, () => {
				this.startCount();
			})
		}
	}

	startCount() {
		this.timer = setInterval( () => {
			this.resetCountDown();
		}, 1000);

		this.resetCountDown();
	}

	isCountDownEnd({hours, minutes, seconds}) {
		return parseInt(hours, 10) === 0 &&
			   parseInt(minutes, 10) === 0 &&
			   parseInt(seconds, 10) === 0;
	}

	resetCountDown() {
		let {
			hours,
			minutes,
			seconds,
		} = this.calcCountDown();
		[hours, minutes, seconds] = [
			StringUtil.padZeroLeft(hours, 2),
			StringUtil.padZeroLeft(minutes, 2),
			StringUtil.padZeroLeft(seconds, 2),
		];

		if (this.isCountDownEnd({hours, minutes, seconds})) {
			this.setState({
				hours,
				minutes,
				seconds,
				isReady: true,
			}, () => {
				clearInterval(this.timer);
			});
		} else {
			this.setState({
				hours,
				minutes,
				seconds,
				isReady: true,
			});
		}
	}

	calcCountDown() {
		let {
			startTime,
			durationTime,
		} = this.state;
		
		let currentTimeMills = new Date().getTime();
		let durationMills = durationTime;
		// let durationMills = durationDays * 24 * 60 * 60 * 1000;
		let leftTimeMills = parseInt(startTime, 10) + durationMills - currentTimeMills;
		let leftTime = Math.floor(leftTimeMills / 1000);

		return DateUtil.calcCountDownByLeftTime(leftTime);
	}

	render() {
		let {
			hours,
			minutes,
			seconds,
			isReady,
		} = this.state;

		let countDownClazz = isReady ? 'm-count-down' : 'm-count-down hide';

		return (
			<div className={countDownClazz}>
				<span>剩余</span>
				<div className="board">
					<span className="time">{hours}</span>
					<span className="colon">:</span>
					<span className="time">{minutes}</span>
					<span className="colon">:</span>
					<span className="time">{seconds}</span>
				</div>
				<span>结束</span>
			</div>
		)
	}
}