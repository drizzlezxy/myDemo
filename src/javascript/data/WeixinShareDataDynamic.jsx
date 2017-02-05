import shareData from "data/YQData/shareData.json";

export default class WeixinShareDataDynamic {

	/**
	 * [getData description]
	 * @param  {String} pageName [description]
	 * @param  {[type]} username [用户名]
	 * @param  {[type]} desc     [描述:祝福语]
	 * @param  {[type]} link     [分享出去链接地址：动态变化]
	 * @param  {[type]} imgUrl   [图片Url:动态获取用户头像]
	 * @return {[type]}          [description]
	 */
	static getData(
		pageName = 'QingList', 
		{
			nickName,
			desc=shareData.defaultTitle,
			link,
			imgUrl
		}
	) {
		let WXShareData = {
			QingList: {
				title: nickName + '送您一个免费大礼盒，快去碰手气吧',
				desc: desc || shareData.defaultTitle,
				link: link, // 分享链接
				imgUrl: imgUrl, // 分享图标
				success: () => {},
				cancel: () => {},
			},
		}

		return WXShareData[pageName] ;
	}

}