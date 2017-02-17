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
		return RequestUtil.config[RequestUtil.currentENV];
	}

	/**
	 * [fetch ajax 超时请求处理]
	 * @param  {String}  method 		[description]
	 * @param  {[type]}  url    		[description]
	 * @param  {Object}  data   		[description]
	 * @param  {[type]}  successFn      [description]
	 * @param  {[type]}  errorFn        [description]
	 * @param  {Boolean} isAbsolute     [description]
	 * @param  {String}  absUrl	      	[description]
	 */
	static fetch({
		method = 'get',
		url,
		data = {},
		successFn,
		errorFn,
		isAbsolute = false,
		absUrl = ''
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

		url = isAbsolute ? absUrl : (RequestUtil.getEnvPrefix() + url);

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

	static fetchMockData(url) {
		return RequestUtil.mockCache[url];
	}

	static isResultSuccessful(result) {
		return Util.isExisty(result) && Util.isExisty(result.code) && result.code == '0';
	}

}