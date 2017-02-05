import React, {Component} from 'react';
import Logger from 'extend/common/Logger';
import Util from "extend/common/util";
import RequestUtil from "extend/common/RequestUtil";
// import GroupMemberList from 'components/GroupMemberList/GroupMemberList';
// import JoinGroupPrdt from 'components/JoinGroupPrdt/JoinGroupPrdt';
import CountDown from 'components/CountDown/CountDown';
// import GroupList from 'components/GroupList/GroupList';
import JoinGroupList from 'components/JoinGroupList/JoinGroupList';
import GroupMembers from "components/GroupMembers/GroupMembers";
import PrdtFragment from "components/PrdtFragment/PrdtFragment";
import './JoinGroupHeader.scss';


export default
class GroupItemDetailHeader extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {
			groupMembersInfo: this.props.groupMembersInfo || {	
				membersLimitNum: 0,
				membersAvatar: [],
			}
		};
	}

	componentDidMount () {
	}

	componentWillReceiveProps(nextProps) {
		let groupMembersInfo = nextProps.groupMembersInfo;
		if(!!groupMembersInfo) {
			this.setState({
				groupMembersInfo,
			})
		}
	}


	render() {
		let {prdtInfo, groupStatus, timeInfo} = this.props;
		let {groupMembersInfo} = this.state;

		return (
			<div className="m-joingroup-header">
				<PrdtFragment  info={prdtInfo} groupStatus={groupStatus} />

				<GroupMembers info={groupMembersInfo} groupStatus={groupStatus}>
					<CountDown timeInfo={timeInfo} />
				</GroupMembers>
{/*
				<JoinGroupPrdt 
					data={basic}
				/>
				<GroupList 
					memberList={memberList}
				/>
				<CountDown />
				<div className="remain">
					还差{remain}位小伙伴加入~
				</div>
				<JoinGroupList 
					memberList={memberList}
				/>
*/}
			</div>
		)
	}
}