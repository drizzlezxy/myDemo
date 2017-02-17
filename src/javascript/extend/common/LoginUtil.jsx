import Util from "extend/common/util";
import CookieUtil from "extend/common/CookieUtil";
import RequestUtil from "extend/common/RequestUtil";
import UrlUtil from "extend/common/UrlUtil";
import config from "extend/config/config.json";

// import userInfo from "data/userInfo.json";

const COOKIE_EXPIRE_SECONDS = 2 * 60 * 60;
// const COOKIEDOMAIN = '172.16.13.134';
const COOKIEDOMAIN = location.hostname;

export default class Authorize {
	static loginStatus = {
		error: -1,	//fail
		toAuth: 0,	//未授权
		toLogin: 1,	//未登录(本地无userId cookie)
		logined: 2,	//已登录(本地有userId cookie)
	}

	static loginResultStatus = {
		gotError: 0,	//AJAX error
		gotInfoWrong: 1,	//can not get userInfo
		gotNotBinded: 2,	//got userInfo, but not binded
		gotInfo:3,	//got userInfo, and phone binded
	}

	static login({appInfo, extraParam}, callback) {
		let authInfo = Authorize.getInfo(Authorize.checkEnv(appInfo), extraParam);
		
		if(!authInfo.isNeeded) return;

		const {error, toAuth, toLogin, logined} = Authorize.loginStatus;
		switch(Authorize.statusJudge()){
			case toAuth:{
				Authorize.doWXAuth();
			    break;
			}
			case toLogin:
				Authorize.doLogin(callback);
				break;
			case logined:
				Authorize.getUserInfo(callback);
				break;
		}
	}

	static checkEnv(appInfo = {}) {
		return appInfo.env || 'WX';	
	}

	static getInfo(env, extraParam) {
		return {
			isNeeded: true,
		};
	}

	static statusJudge() {
		const userId = CookieUtil.getCookie("userId");
		let status = Authorize.loginStatus;
		if( !userId && !UrlUtil.fetchParamValueByCurrentURL("code") )
			return status.toAuth;
		else if(!!userId)
			return status.logined;
		else if(!!UrlUtil.fetchParamValueByCurrentURL("code"))
			return status.toLogin;
	}

	static doWXAuth() {
		//定向到授权页面
		let authUrl = RequestUtil.getEnvPrefix() + 'oauth/gotoOauth';
		let options = {
			thirdPartType: 'weixin',
			redirect_url: location.hostname,
			redirect_param: UrlUtil.tempObj2redirectParam(Util.parseQueryString(location.href)),
		}
		for(let key in options)
			authUrl = UrlUtil.appendParam4Url(authUrl, key, options[key]);
		location.href = authUrl;
	}

	static doLogin(callback) {
		const {gotError, gotInfoWrong, gotNotBinded, gotInfo} = Authorize.loginResultStatus;

		let param = {
			url : 'oauth/ext/login',
			method : 'GET',
			data: {
				code: UrlUtil.fetchParamValueByCurrentURL("code"),
			},
			successFn : (result) => {
				let userMsg = result.result;

				if ( Authorize.isSuccess(result) || Authorize.notBinded(result)) {
					Authorize.setUserCookie(userMsg);
					
					if(Authorize.notBinded(result)) {
						//未绑定手机
						callback && callback(userMsg, gotNotBinded);

					} else if( Authorize.isSuccess(result)) {
						//已绑定手机
						callback && callback(userMsg, gotInfo);
					}
				} else {
					callback && callback(userMsg, gotInfoWrong);
				}
			},
			errorFn : function () {
				callback && callback({}, gotError);
			}
		};
		RequestUtil.fetch(param);
	}

	static getUserInfo(callback) {
		const userId = CookieUtil.getCookie("userId");
		const uId = CookieUtil.getCookie("uid");
		const {gotError, gotInfoWrong, gotNotBinded, gotInfo} = Authorize.loginResultStatus;

		let param = {
			url : `oauth/getUserInfo`,
			method : 'GET',
			data: {
				id: userId,
				uid: uId,
			},
			successFn : function (result){
				let userMsg = result.result;

				if(Authorize.notBinded(result)) {
					Authorize.setUserCookie(userMsg);
					//已获取用户信息，但未绑定手机
					callback && callback(userMsg, gotNotBinded);

				} else if( Authorize.isSuccess(result)) {
					Authorize.setUserCookie(userMsg);
					//已获取用户信息，且已绑定手机
					callback && callback(userMsg, gotInfo);

				} else {
					CookieUtil.deleteCookie("userId", '/', COOKIEDOMAIN);
					CookieUtil.deleteCookie("uid", '/', COOKIEDOMAIN);
					CookieUtil.deleteCookie("token", '/', COOKIEDOMAIN);

					callback && callback(userMsg, gotInfoWrong);
				}
			},
			errorFn : function () {
				callback && callback({}, gotError);

				console.error(arguments);
			}
		};
		RequestUtil.fetch(param);
	}
    
	static setUserCookie(userMsg) {
		CookieUtil.setCookie('userId', userMsg.id, COOKIE_EXPIRE_SECONDS, '/', COOKIEDOMAIN);
		CookieUtil.setCookie('uid', userMsg.uid, COOKIE_EXPIRE_SECONDS, '/', COOKIEDOMAIN);
		CookieUtil.setCookie('token', userMsg.token, COOKIE_EXPIRE_SECONDS, '/', COOKIEDOMAIN);
	}

	static isSuccess(result) {
		//获取用户信息，且用户已绑定手机
		return RequestUtil.isResultSuccessful(result);
	}

	static notBinded(result) {
		//获取用户信息，但用户未绑定手机
		return Util.isExisty(result) && Util.isExisty(result.code) && result.code == '111111';
	}

	static toBindPhone({pageName, options} = {}) {
		if(!CookieUtil.getCookie("userId")) return;
		
		let target = '../PhoneBind/index.html';

		!options && (options = Util.parseQueryString(location.href));
		options.redirect_url = !!pageName ?
								UrlUtil.getPageUrlByPageName(pageName) :
								Util.getPureUrl(location.href);

		target = Util.getNewUrlByPageName('PhoneBind', options);
		location.href = target;
	}
	
	static toBindPhoneYQ({pageName, options} = {}) {
		if(!CookieUtil.getCookie("userId")) return;
		
		let target = '../PhoneBind/index.html';

		!options && (options = Util.parseQueryString(location.href));
		options.YQQ = 1;
		options.redirect_url = !!pageName ?
								UrlUtil.getPageUrlByPageName(pageName) :
								Util.getPureUrl(location.href);

		target = Util.getNewUrlByPageName('PhoneBind', options);
		location.href = target;
	}


}