import RequestUtil from "extend/common/RequestUtil";
import UrlUtil from 'extend/common/UrlUtil';
import Util from './util';

export default class WeixinUtil {
	static initWeixinJSBridge (readyCallback) {
		let onBridgeReady = function (fn) {
			WeixinUtil.configWeixinSDK(function (config) {
				fn(config);
			});
	 	}
		  
		if (typeof WeixinJSBridge === "undefined"){
		    if (document.addEventListener){
		        document.addEventListener('WeixinJSBridgeReady', function (){
		        	onBridgeReady(readyCallback);
		        }, false);
		    }
		}else{
		    onBridgeReady(readyCallback);
		}
	}

	static configWeixinSDK (callback) { 
		let wxConfigParam = {
			url: 'weixin/gainSign',
			method: 'get',
			data : {
				url: location.href.split('#')[0]
			},
			successFn: function (json){
				wx.config({
					debug: false,
					appId: json.appid,
					timestamp: json.timestamp,
					nonceStr: json.nonceStr,
					signature: json.signature,
					jsApiList: [
							"onMenuShareTimeline",
							"onMenuShareAppMessage",
							"onMenuShareQQ",
							"onMenuShareWeibo",
							"onMenuShareQZone",
							"startRecord",
							"stopRecord",
							"onVoiceRecordEnd",
							"playVoice",
							"pauseVoice",
							"stopVoice",
							"onVoicePlayEnd",
							"uploadVoice",
							"downloadVoice",
							"chooseImage",
							"previewImage",
							"uploadImage",
							"downloadImage",
							"translateVoice",
							"getNetworkType",
							"openLocation",
							"getLocation",
							"hideOptionMenu",
							"showOptionMenu",
							"hideMenuItems",
							"showMenuItems",
							"hideAllNonBaseMenuItem",
							"showAllNonBaseMenuItem",
							"closeWindow",
							"scanQRCode",
							"chooseWXPay",
							"openProductSpecificView",
							"addCard",
							"chooseCard",
							"openCard"
						]
					});

				wx.error(function (){
					//alert('error in weixin jssdk:' + JSON.stringify(arguments));
				});

				wx.ready(function (){
					setTimeout(function (){
						callback(json);
					}, 50);
				});
			},
			errorFn: function (){
				//alert('网络异常，请检查网络');
			}
		};

		RequestUtil.fetch(wxConfigParam);
	}

	static share2Friends (options) {
		wx.onMenuShareAppMessage({
			 title: options.title,
			 desc: options.desc,
			 link: options.link, // 分享链接
			 imgUrl: options.imgUrl, // 分享图标
			 success: options.success,
			 cancel: options.cancel,
		});
	}

	static share2FriendCircle (options) {
		wx.onMenuShareTimeline({
			 title: options.title, // 分享标题
			 link: options.link, // 分享链接
			 imgUrl: options.imgUrl, // 分享图标
			 success: options.success,
			 cancel: options.cancel
		});
	}

	static hideWeixinMenu () {
		WeixinUtil.initWeixinJSBridge(function () {
			WeixinUtil.hideOptionMenu();
		});
	}

	static showWeixinMenu () {
		WeixinUtil.initWeixinJSBridge(function () {
			WeixinUtil.showOptionMenu();
		});
	}

	static hideOptionMenu () {
		wx.hideOptionMenu();
	}

	
	static showOptionMenu () {
		wx.showOptionMenu();
	}

	static hideMenuItems (options) {
		wx.hideMenuItems({
			menuList: options.menuList,
			success: options.success,
			fail: options.fail
		});
	}

	static testHide () {
		wx.hideMenuItems({
		    menuList: [
		      'menuItem:readMode', // 阅读模式
		      'menuItem:share:timeline', // 分享到朋友圈
		      'menuItem:copyUrl' // 复制链接
		    ],
		    success: function (res) {
		      alert('已隐藏“阅读模式”，“分享到朋友圈”，“复制链接”等按钮');
		    },
		    fail: function (res) {
		      alert(JSON.stringify(res));
		    }
		});
	}
	static test () {
		let _options = {
			'msg1' : '测试分享标题',
			'link' : 'http://www.baidu.com',
			'imgUrl' : 'xxx.jpg',
			'title' : 'title',
			'desc' : 'desc'
		};

		wx.ready(function () {
			wx.onMenuShareTimeline({
				 title: _options.msg1, // 分享标题
				 link: _options.link, // 分享链接
				 imgUrl: _options.imgUrl, // 分享图标
				 success: function () {
				     // 用户确认分享后执行的回调函数
				     alert('confirm分享');
				 },
				 cancel: function () {
				     // 用户取消分享后执行的回调函数
				     alert('cancel分享');
				 }
			});

			wx.onMenuShareAppMessage({
				 title: _options.title,
				 desc: _options.msg2,
				 link: _options.link, // 分享链接
				 imgUrl: _options.imgUrl, // 分享图标
				 success: function (res) {
				     alert('已分享');
				 },
				 cancel: function (res) {
				     alert('已取消');
				 },
				 fail: function (res) {
				     alert(JSON.stringify(res));
				 }
			});
		});
	}

	static getWXShareOption(option) {
		let {data = {}, callback} = option;

		let param = {
			url: 'item/shareSku',
			method: 'GET',
			data,
			successFn: function (result) {
				callback(result);
			},
			errorFn: function (){
				//alert('网络异常，请检查网络');
			}
		};
		RequestUtil.fetch(param);
	}

	static shareByRemoteOption(opt) {
		let {targetLink: {pageName, options}, data = {}, successFn, cancelFn} = opt;
		
		WeixinUtil.initWeixinJSBridge(function(){

			WeixinUtil.getWXShareOption({
				data: data,
				callback: (result) => {
					if(RequestUtil.isResultSuccessful(result)) {			
						let data = result.result;
						data.link = UrlUtil.getUrlByPageName(pageName, options);
						data.success = successFn;
						data.cancel = cancelFn;

						WeixinUtil.share2Friends(data);
						WeixinUtil.share2FriendCircle(data);
						WeixinUtil.showOptionMenu();
					}
				}
			})
		})
	}

	static shareByPageOption(opt) {	
		WeixinUtil.initWeixinJSBridge(() => {
			WeixinUtil.share2Friends(opt);
			WeixinUtil.share2FriendCircle(opt);
			WeixinUtil.showOptionMenu();
		})
	}

}