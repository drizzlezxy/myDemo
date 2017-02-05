import React, {Component} from 'react';
import './OpenGroupList.scss';

export default
class OpenGroupList extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	openGroupList: props.data,
	  	interval: props.interval || 5000,
	  	openInfo: null,
	  };
	}

	componentDidMount() {
		this.setRandomItem();

		setInterval(()=>{
			this.setRandomItem();	
		}, this.state.interval);
	}

	setRandomItem() {
		let list = this.state.openGroupList;
		let rndItem = list[Math.floor(Math.random() * list.length)];
		this.setState({
			openInfo: rndItem,
		});
	}

	render() {
		let {openInfo} = this.state;

		if(!openInfo) {
			return (
				<div></div>
			)
		}

		let openContent = `${openInfo.place}用户${openInfo.name}刚刚开团2sdfsdf22222`;
		return (
			<div className="m-opengrouplist">
				<a className="info">
					<div className="facebook">
						<img src={openInfo.headImage} />
					</div>
					<div className="open-info">
						{openContent}
					</div>
				</a>
			</div>
		)
	}
}