import React, {Component} from 'react';
import './GroupMemberList.scss';

export default
class GroupMemberList extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {};
	}

	render() {
		let {data:memberList} = this.props;
		let memberListContent = memberList.map(function(item, index) {

			return (
				<MemberInfo
					key={index}
					data={item}
				/>
			)
		});
		return (
			<div className="m-groupmemberlist">
				<div className="groupmember-header">
					有其他小伙伴刚刚开启该商品拼团，可以直接参团喔~
				</div>
				<div className="groupmember-body">
					{memberListContent}
				</div>
			</div>
		)
	}
}

class MemberInfo extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {};
	}

	handleJoinGroup() {
		Logger.log('handleJoinGroup');
	}

	render() {
		let {
			id,
			name,
			headImage,
			place,
			remain,
		} = this.props.data;

		return (
			<div className="m-member-info">
				<div className="facebook">
					<img src={headImage} />
				</div>
				<div className="info">
					<div className="basic-info">
						<div className="label">
							<div className="name">
								{name}
							</div>
							<div className="original-place">
								{place}
							</div>
						</div>
					</div>
					
					<div className="remain">
						<div className="label">
							还差{remain}人成团
						</div>
					</div>

					<div className="btn" onClick={this.handleJoinGroup.bind(this)}>
						<div className="label">
							去参团
						</div>
					</div>
				</div>
			</div>
		)
	}
}