import React, { PropTypes } from 'react';
import './YQMyGift.scss';
import Util from "extend/common/util";
import RequestUtil from "extend/common/RequestUtil";
import RedirectUtil from "extend/common/RedirectUtil";
import ShareModal from "components/ShareModal/ShareModal";
import WeixinUtil from "extend/common/WeixinUtil";
import shareData from "data/YQData/shareData.json";
import icon from "images/YQGift/icon.png";

class YQMyGift extends React.Component {
	constructor(props) {
		super(props);
	}

    handleClick(giftId,benediction) {
    	this.props.shareHandleClick(giftId,benediction);
		$('.m-share-modal').fadeIn('fast');
	}
	
	LinkRedirect(giftId) {
		RedirectUtil.redirectPage({
			pageName: "YQGiftStatus",
			options: Object.assign({
				giftId: giftId
			}, {}),
		});
	}

    render() {
    	let that = this;
		let item = this.props.item;
		let _benediction = (item.benediction === null || item.benediction === "") ? shareData.defaultTitle : item.benediction;
		let handleClick = that.handleClick.bind(that, item.giftId,_benediction);
		let isShare = item.status;
		let shareText;
		let className = "desc";
		
		switch(isShare) {
				case 1:
				case 3:
				case 4: {
					shareText = "";
					className = "desc noshare";
					break;
				}
				case 2: {
					shareText = <div onClick={handleClick} className="m-btn-share" data-giftId={item.giftId} >分享</div>
					className = "desc";
					break;
				}
		}
		
		let benediction = (item.benediction ===null || item.benediction === "") ? shareData.defaultTitle : item.benediction;

		
        return (
        	<div className="m-gift-list">
	        	<div className="list"  data-giftId={item.giftId}>
	        		<div onClick={this.LinkRedirect.bind(this,item.giftId)} >
						<img src= {icon} />
						<div className={className} >
							{benediction}
						</div>
					</div>
					{shareText}
				</div>
	      	</div>
        );
    }
}

export default YQMyGift;