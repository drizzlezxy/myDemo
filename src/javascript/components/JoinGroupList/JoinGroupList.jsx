import React, {Component} from 'react';
import Logger from 'extend/common/Logger';
import DateUtil from 'extend/common/DateUtil';
import './JoinGroupList.scss';


export default
class JoinGroupList extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {};
	}


	render() {
		let {
			memberList,
		} = this.props;

		memberList.push({
			startTime: null,
			headImage: null,
			isLeader: false,
			isPlaceholder: true,
		});
		let joinGroupContent = memberList.map((member, index) => {
			let memberKey = `member-${index}`;
			let {
				startTime,
				isLeader,
				headImage,
				isPlaceholder,
			} = member;
			let joinGroup = isLeader ? '开团' : '参团';
			let startDate = DateUtil.formatDate(startTime, 'yyyy-MM-dd HH:mm:ss');

			if (isPlaceholder) {
				startDate = '等待小伙伴参团';
				joinGroup = '';
			}
			return (
				<li
					key={memberKey}
					className="member">
					<img className="facebook" src={headImage} />
					<div className="info">
						<span className="date">{startDate}</span>
						<span className="desc">{joinGroup}</span>
					</div>
				</li>
			);
		});

		return (
			<div className="m-joingrouplist">
				<ul className="u-member-list">
					{joinGroupContent}
				</ul>
			</div>
		)
	}
}