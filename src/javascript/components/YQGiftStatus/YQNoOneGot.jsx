import React, {Component} from 'react';
import Logger from 'extend/common/Logger';
import './YQNoOneGot.scss';

export default
class YQNoOneGot extends Component {
	constructor(props) {
	  super(props);
	
	}

	handleShareClick() {
		$('.m-share-modal').fadeIn('fast');
	}

	render() {
		return (
			<div className="m-YQNoOneGot">
				<div className="content">
					<div className="img"></div>
					<div className="txt-go-treat">
						<div>还没有小伙伴抢到礼盒哟~</div>
						<div>快去请客吧</div>
					</div>
					<button className="btn-go-treat"
						onClick={this.handleShareClick.bind(this)}
					>去请客</button>
				</div>
			</div>
		)
	}
}