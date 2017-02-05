export default class WeixinShareData {
	static getData(pageName = 'HomePage') {
		let WXShareData = {
			HomePage: {
				title: '「四季严选 • 年货节」寻味西域，乐享地道美食',
				desc: '严选最地道的新疆美食，产地直供，新鲜速达！',
				link: location.href, // 分享链接
				imgUrl: 'http://sjyx.xinguang.com/res/images/Common/LOGO.png', // 分享图标
				success: () => {},
				cancel: () => {},
			},
			GroupSkuDetail: {
				title: '「四季严选 • 拼出低价」拼团低至三折 年货好礼带回家',
				desc: '严选最地道的新疆美食，产地直供，新鲜速达！',
				link: location.href, // 分享链接
				imgUrl: 'http://sjyx.xinguang.com/res/images/Common/LOGO.png', // 分享图标
				success: () => {},
				cancel: () => {},
			},
		}

		return WXShareData[pageName] || WXShareData.HomePage;
	}

}