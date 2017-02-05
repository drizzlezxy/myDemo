import React, {Component} from 'react';
import Util from 'extend/common/util';
import './GroupList.scss';

export default
class GroupList extends Component {

	constructor(props) {
	  super(props);
	
	  this.state = {
	  	count: 5,
	  	rowCount: 5,
	  	memberList: [{src: 'aaa.jpg'}],
	  };
	}

	render() {
		let {
			count,
			rowCount,
			memberList,
		} = this.state;


		while (memberList.length < count) {
			memberList.push({});
		}

		let groupList = Util.makeChunks(memberList, rowCount);


		let rowsContent = groupList.map((row, rowIndex) => {
			let rowKey = `row-${rowIndex}`;
			let groupListContent = row.map((item, index) => {
				let memberKey = `member-${index}`;
				let isLeader = (rowIndex || index);
				let memberClazz = isLeader ? 'group-member-item' : 'group-member-item leader';
				return (
					<li 
						key={memberKey}
						className={memberClazz}>
						<img src={item.src} />
					</li>
				)
			});

			return (
				<ul 
					key={rowKey} 
					className="u-group-member-list clearfix">
					{groupListContent}
				</ul>
			)
		});



		return (
			<div className="m-grouplist">
				{rowsContent}
			</div>
		)
	}
}