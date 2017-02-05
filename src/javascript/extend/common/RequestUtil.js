/**
 * This class is used for controlling http requests based on current ENV variable
 */
import Util from 'extend/common/util';


export default class RequestUtil {
	static config = require('extend/config/config.json');
	static YQconfig = require('extend/config/YQconfig.json');
	static currentENV = RequestUtil.config.current;
	static apiMockMap = require('extend/config/APIMockMap.json');
	static mockCache = require('extend/common/mock');
	static compareENV(env) {
		return RequestUtil.currentENV === env;
	}

	static isDevENV() {
		return RequestUtil.compareENV('dev');
	}

	static getEnvPrefix() {
		if (RequestUtil.currentENV === 'master') {
			return 'http://sjyxsrc.yiqiguang.com/';
		}

		return RequestUtil.config[RequestUtil.currentENV];
	}

	/**
	 * [GetWillShareHostUrl 要分享页面的前缀设置]
	 * Author:zss
	 * Date: 2017-01-05
	 */
	static GetWillShareHostUrl() {
		let {dev,test,onLine} = RequestUtil.YQconfig.page;
		if (RequestUtil.currentENV === 'local') {
			return dev;
		}else if(RequestUtil.currentENV === "release") {
			return test;
		}else {
			return onLine;
		}
	}

	static getYQEnvPrefix() {
		if (RequestUtil.currentENV === 'master') {
			return 'http://yqq.yiqiguang.com/';
		}
		
		return RequestUtil.YQconfig[RequestUtil.currentENV];
	}

	static fetch({
		method = 'get',
		url,
		data = {},
		successFn,
		errorFn,
		isAbsolute = false,
		absUrl
	}) {
		if (RequestUtil.isDevENV()) {
			// hook here
			// return mock data if it's in a dev env

			let promise = new Promise((resolve, reject) => {
				let mockData = RequestUtil.fetchMockData(url);
				console.log('mockData', mockData);
				if (successFn) {
					resolve(successFn(mockData));
				} else {
					reject(errorFn(mockData));
				}
			});
			return promise;
		}

		url = RequestUtil.getEnvPrefix() + url;

		if (isAbsolute) {
			url = absUrl;
		}

		if (method.toLowerCase() === 'get') {
			if (Util.isExisty(data)) {
				url = url + '?' + $.param(data);
			}
			data = null;
		} else {
			data = JSON.stringify(data);
		}

		return $.ajax({
			method: method,
			url: url,
			data: Util.isExisty(data) ? data : {},
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			dataType: 'json',
			traditional: true,
			xhrFields: {
				withCredentials: false
			},
			crossDomain: true,
			success: function(result) {
				successFn && successFn(result);
			},
			error: function(...args) {
				errorFn && errorFn.apply(null, args);
			}
		});
	}

	static fetchInAbsoluteUrl({
		method = 'get',
		url,
		data = {},
		successFn,
		errorFn
	}) {
		if (method.toLowerCase() === 'get') {
			if (Util.isExisty(data)) {
				url = url + '?' + $.param(data, true);
			}
			data = null;
		}

		$.ajax({
			method: method,
			url: url,
			data: JSON.stringify(data),
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			dataType: 'json',
			traditional: true,
			xhrFields: {
				withCredentials: true
			},
			crossDomain: true,
			success: function(result) {
				successFn && successFn(result);
			},
			error: function(...args) {
				errorFn && errorFn.apply(null, args);
			}
		});
	}

	static fetchYQ({
		method = 'get',
		url,
		data = {},
		successFn,
		errorFn,
		isAbsolute = false,
		absUrl
	}) {
		if (RequestUtil.isDevENV()) {
			// hook here
			// return mock data if it's in a dev env

			let promise = new Promise((resolve, reject) => {
				let mockData = RequestUtil.fetchMockData(url);
				console.log('mockData', mockData);
				if (successFn) {
					resolve(successFn(mockData));
				} else {
					reject(errorFn(mockData));
				}
			});
			return promise;
		}

		url = RequestUtil.getYQEnvPrefix() + url;

		if (isAbsolute) {
			url = absUrl;
		}

		if (method.toLowerCase() === 'get') {
			if (Util.isExisty(data)) {
				url = url + '?' + $.param(data);
			}
			data = null;
		} else {
			data = JSON.stringify(data);
		}

		return $.ajax({
			method: method,
			url: url,
			data: Util.isExisty(data) ? data : {},
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			dataType: 'json',
			traditional: true,
			xhrFields: {
				withCredentials: false
			},
			crossDomain: true,
			success: function(result) {
				successFn && successFn(result);
			},
			error: function(...args) {
				errorFn && errorFn.apply(null, args);
			}
		});
	}
	
	/**
	 * [fetchYQ ajax 超时请求处理]
	 * @param  {String}  options.method [description]
	 * @param  {[type]}  options.url    [description]
	 * @param  {Object}  options.data   [description]
	 * @param  {[type]}  successFn      [description]
	 * @param  {[type]}  errorFn        [description]
	 * @param  {Boolean} isAbsolute     [description]
	 * @param  {[type]}  absUrl	}      [description]
	 * @return {[type]}                 [description]
	 */
	static fetchYQTimeout({
		method = 'get',
		timeout,
		url,
		data = {},
		successFn,
		errorFn,
		completeFn,
		isAbsolute = false,
		absUrl,
		
	}) {
		if (RequestUtil.isDevENV()) {
			// hook here
			// return mock data if it's in a dev env

			let promise = new Promise((resolve, reject) => {
				let mockData = RequestUtil.fetchMockData(url);
				console.log('mockData', mockData);
				if (successFn) {
					resolve(successFn(mockData));
				} else {
					reject(errorFn(mockData));
				}
			});
			return promise;
		}

		url = RequestUtil.getYQEnvPrefix() + url;

		if (isAbsolute) {
			url = absUrl;
		}

		if (method.toLowerCase() === 'get') {
			if (Util.isExisty(data)) {
				url = url + '?' + $.param(data);
			}
			data = null;
		} else {
			data = JSON.stringify(data);
		}

		var ajaxTimeOut = $.ajax({
			method: method,
			timeout:timeout,
			url: url,
			data: Util.isExisty(data) ? data : {},
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			dataType: 'json',
			traditional: true,
			xhrFields: {
				withCredentials: false
			},
			crossDomain: true,
			success: function(result) {
				successFn && successFn(result);
			},
			error: function(...args) {
				errorFn && errorFn.apply(null, args);
			},
			complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
				completeFn && completeFn(ajaxTimeOut,status);
		　　}
		});
	}

	static fetchMockData(url) {
		return RequestUtil.mockCache[url];
	}

	static isResultSuccessful(result) {
		return Util.isExisty(result) && Util.isExisty(result.code) && result.code == '0';
	}

}