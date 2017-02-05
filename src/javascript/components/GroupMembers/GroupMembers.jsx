/*
*
*show Group member's avatar 
*
*example:
*	let groupgroupMembersInfo = [
*		"http://pic.qqtn.com/up/2015-8/2015082714050376950.jpg",
*		"http://pic.qqtn.com/up/2015-8/2015082714050376950.jpg",
*		"http://pic.qqtn.com/up/2015-8/2015082714050376950.jpg"
*	];
*	let groupStatus = 2 // 0: 拼团信息获取错误  1: 拼团中  2: 组团成功  3: 组团失败
*	
*	<GroupMembers info={groupMembersInfo} groupStatus={groupStatus}>
*		{//要插入的组件}
*	</GroupMembers>
*	
 */


import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Util from "extend/common/util";
import './GroupMembers.scss';
import 'scss/base.scss';

export default class GroupMembers extends Component {
	constructor(props){
		super(props);
		this.state = {
			groupStatus: this.props.groupStatus,
			info: this.props.info || {	
				membersLimitNum: 0,
				membersAvatar: [],
			},
			textArray: [	//0: 拼团信息获取错误  1: 拼团中  2: 组团成功  3: 组团失败
				[],
				['还差x位小伙伴加入~'],
				['组团成功啦，大家坐等美味到来~'],
				['太可惜了，离成团只差一点点距离']
			]
		}
	}

	componentWillReceiveProps(nextProps) {
		if(!!nextProps){
			this.setState({
				info: nextProps.info,
				groupStatus: nextProps.groupStatus,
				textArray: [	//0: 拼团信息获取错误  1: 拼团中  2: 组团成功  3: 组团失败
					[],
					[`还差${nextProps.info.membersLimitNum - nextProps.info.membersAvatar.length}位小伙伴加入~`],
					['组团成功啦，大家坐等美味到来~'],
					['太可惜了，离成团只差一点点距离']
				],
			});
		}
	}

	render() {
		const that = this;
		let {
			membersLimitNum,
			membersAvatar,
		} = that.state.info;

		let currentMembersLen = Util.isArray(membersAvatar) ? membersAvatar.length : 5;
		let imgs = [];
		for(let index = 0; index < membersLimitNum; index++) {
			let img = null,
				label = null,
				clazz = 'no-member';
			if(currentMembersLen > index) {
				clazz = '';
				img = <img src={membersAvatar[index]} />;
				if(index === 0) label = <span>团长</span>;
				else if(index === 1) label = <span>沙发</span>;
			}
			imgs.push(
				<div key={index} className={"list-img "+clazz}>
					{img}
					{label}
				</div>
			)
		};

		let membersText = that.state.textArray[that.state.groupStatus],
			text = Util.isArray(text) ? membersText.map( (item,index) => <div key="index">{item}</div>)
			: membersText;


		return (
			<div className="m-group-members">
				<div className="members-list">
					{imgs}
				</div>
				{that.props.children}
				<div className="members-text">{text}</div>
			</div>
		)
	}
}