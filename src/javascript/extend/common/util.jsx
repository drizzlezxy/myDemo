import StringUtil from "extend/common/StringUtil";
import CookieUtil from "extend/common/CookieUtil";
import RequestUtil from 'extend/common/RequestUtil';
import RedirectUtil from 'extend/common/RedirectUtil';
import urlConfig from '../config/config.json';
/**
 * This class is used for defining tool methods such as isType, deepClone, flatten, etc...
 */
let obj2str = Object.prototype.toString;
let myUserId = 413;
let myOpenId = 'o7_w1wXS8u8Lb5QWzILw02MKQwV0';

// let myUserId = 0;
// let myOpenId = null;

export default class Util {

	// static fetchUserId() {
	// 	return Util.fetchCookie('userId') || myUserId;
	// }

	// static fetchOpenId() {
	// 	return Util.fetchCookie('uid') || myOpenId;
	// }

	// static fetchUid() {
	// 	return Util.fetchCookie('uid') || myOpenId;
	// }


	static fetchUserId() {
		return Util.fetchCookie('userId');
	}

	static fetchOpenId() {
		return Util.fetchCookie('uid');
	}

	static fetchUid() {
		return Util.fetchCookie('uid');
	}

	static isOldOrder() {
		return Util.isExisty(Util.fetchValueByCurrentURL('orderId'));
	}

	static fetchCookie(name) {
		return CookieUtil.getCookie(name)
	}

	

	static px2rem($px) {
		return $px / parseFloat(document.documentElement.style.fontSize);
	}

	static deepClone(obj) {
		if (obj === null || typeof obj !== 'object') return obj;
		
		let ret = new obj.constructor();

		if (Util.isArray(obj)) {
			ret = [];
			for (let i = 0, l = obj.length; i < l; i++) {
				ret[i] = Util.deepClone(obj[i]);
			}
		} else {

			if (obj instanceof Date) {
				return new Date(obj.valueOf());
			}

			if (obj instanceof RegExp) {
				var pattern = obj.valueOf();
				var flags = '';
				flags += pattern.global ? 'g' : '';
				flags += pattern.ignoreCase ? 'i' : '';
				flags += pattern.multiline ? 'm' : '';
				return new RegExp(pattern.source, flags);
			}

			if (obj instanceof Function) {
				// 函数的话直接指向相对的内存地址
				return obj;
			}

			for (let attr in obj) {
				if (Object.hasOwnProperty.call(obj, attr)) {
					ret[attr] = Util.deepClone(obj[attr]);
				}
			}
		}
		return ret;
	}

	/**
	 * [flatten Flatten an array, eg below:
	 *           input: var array = [[1, 2, 3], [4, 5, 6], 7, [8]]]
	 *           call: Util.flatten(array);
	 *           output: [1, 2, 3, 4, 5, 6, 7, 8]
	 *           
	 * @Author   JohnNong
	 * @Email    overkazaf@gmail.com
	 * @Github   https://github.com/overkazaf
	 * @DateTime 2016-11-02T16:47:20+0800
	 * @param    {[type]}                     array [description]
	 * @return   {[type]}                           [description]
	 */
	static flatten(array) {
		let ret = [];

		array.forEach(function (item) {
			if (Util.isArray(item)) {
				ret = ret.concat(Util.flatten(item));
			} else {
				ret.push(item);
			}
		});

		return ret;
	}

	/**
	 * [uuid A tiny seed uuid generator]
	 * @Author   JohnNong
	 * @Email    overkazaf@gmail.com
	 * @Github   https://github.com/overkazaf
	 * @DateTime 2016-11-03T23:37:15+0800
	 * @param    {Number}                     len    [description]
	 * @param    {[type]}                     radix  [description]
	 * @param    {[type]}                     prefix [description]
	 * @param    {[type]}                     subfix [description]
	 * @return   {[type]}                            [description]
	 */
	static uuid(len = 32, radix, prefix, subfix){
		let targetId = '';
		let uuid = [], i;
		const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
		
		len = len || 32;
		radix = radix || chars.length;
		prefix = prefix || '';
		prefix = prefix === '' ? '' : prefix + '_';
		subfix = subfix || '';
		subfix = subfix === '' ? '' : '_' + subfix;
	 
		if (len) {
			// Compact form
			for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
		} else {
			// rfc4122, version 4 form
			let r;

			// rfc4122 requires these characters
			uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
			uuid[14] = '4';

			// Fill in random data.  At i==19 set the high bits of clock sequence as
			// per rfc4122, sec. 4.1.5
			for (i = 0; i < 36; i++) {
				if (!uuid[i]) {
				  r = 0 | Math.random()*16;
				  uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
				}
			}
		}
 
  		targetId = uuid.join('');

		return prefix + targetId + subfix;
	}

	// ============== Is 类似的工具函数，用于环境检测或是布尔判断 ==================== //

	static isGroupBuy() {
		return Util.isExisty(Util.fetchParamValueByCurrentURL('poSkuId'));
	}

	/**
	 * [isExisty Check if a given var is existy]
	 * @Author   JohnNong
	 * @Email    overkazaf@gmail.com
	 * @Github   https://github.com/overkazaf
	 * @DateTime 2016-11-09T11:49:03+0800
	 * @param    {[type]}                     obj [description]
	 * @return   {Boolean}                        [description]
	 */
	static isExisty(obj) {
		return obj != null;
	}

	static isEmptyObject(options) {
    	return options != null && Object.keys(options).length == 0;
    }

	static isAos() {
		let __userAgent = navigator.userAgent;
		return !!__userAgent.match(/Android/i);
	}

	static isIOS() {
	    let __userAgent = navigator.userAgent;
	    return !!__userAgent.match(/(iPhone|iPod|iPad)/i);
	}

	static webSource() {
		if(Util.isAos()) {
			return 3;
		}else if(Util.isIOS()) {
			return 2;
		}else {
			return 1;
		}
	}

	static isEnv(env) {
		let userAgent = window.navigator.userAgent;
		return function() {
			return Util.isExisty(userAgent.match(/(env.toString())/i));
		}
	}

	static __isWeChat = Util.isEnv('MicroMessenger');

	static isType(obj, type) {
		return obj2str.call(obj) === '[object ' + type +']';
	}

	static isArray(obj) {
		if (typeof Array.isArray == 'function') {
			return Array.isArray(obj);
		} else {
			return Util.isType(obj, 'Array');
		}
	}

	static throttle(method, context, delay = 200) {
		clearTimeout(method.tId);
		method.tId = setTimeout(function() {
		  	method.call(context);
		},
		delay);
	}

	static throttleV2(fn, delay, mustRunDelay, context) {
		let timer = null;
		let t_start;

		return function() {
			let args = arguments,
			  t_curr = +new Date();
			clearTimeout(timer);

			if (!t_start) {
				t_start = t_curr;
			}

			if (t_curr - t_start >= mustRunDelay) {
				fn.apply(context, args);
				t_start = t_curr;
			} else {
				timer = setTimeout(function() {
				  fn.apply(context, args);
				}, delay);
			}
		};
	}

	static getLoadingImageSRC () {
		return 'http://yougo.xinguang.com/fightgroup-web/public/res/imgs/loading@3x.png';
	}

	/**
	 * [lazyLoadeImages 图片懒加载函数]
	 * @param  {[type]} $images [description]
	 * @return {[type]}         [description]
	 */
	static lazyLoadImages ($images, size = 8, timeout = 200) {
		let chunks = [],
			tmp = [];
		$images = $images.filter(function (index, item) {
			// 加载过的不处理
			return typeof $(item).attr('data-src') != 'undefined';
		});

		// 从上到下进行排序，后边这个优先级算法可以放进algorithm里处理
		$images.sort(function (a, b){
			if ($(a).offset().top == $(b).offset().top) {
				return $(a).offset().left - $(b).offset().left;
			} else {
				return $(a).offset().top - $(b).offset().top;
			}
		});

		$images.each(function (index, item){
			if (tmp.length < size) {
				tmp.push($(item));
			} else {
				chunks.push([...tmp]);
				tmp = [item];
			}
		});
		if (tmp.length) chunks.push(tmp);

		$.each(chunks, function (index, chk){
			setTimeout(function (){
				$.each(chk, function (idx, img){
					let $img = $(img);
					let src = $img.attr('data-src');
					if(src) {

						// 先把占位用的 default loading image放进去，图片加载完成再替换掉
						let $loadingImage = $('<div></div>').css({
							width: $img.width() + 'px',
							height: $img.height() + 'px',
							backgroundImage: 'url('+ Util.getLoadingImageSRC() +')',
							backgroundRepeat: 'no-repeat',
							backgroundSize: '50%',
							backgroundPosition: '50% 50%'
						});

						$loadingImage.insertAfter($img);
						
						$img.hide()
						$img.attr('src', src).on('load', function () {
							$loadingImage.remove();
							$img.show().removeAttr('data-src');
						});
						
					}
				})
			}, index * timeout);
		})
	}

	static getUrlByPageName(pageName, option = {}) {
		return Util.getNewUrlByPageName(pageName, option);
	}

    static makeChunks(arr, chunkSize) {
    	let target = [];
    	let tmp = [];
    	arr.map((item, index) => {
    		if (tmp.length < chunkSize) {
    			tmp.push(Util.deepClone(item));
    		} else {
    			target.push(Util.deepClone(tmp));
    			tmp = [];
    		}
    	});

    	if (tmp.length) {
    		target.push([...tmp]);
    	}

    	return target;
    }

    static fetchValueByCurrentURL(key) {
    	return Util.fetchParamValueByCurrentURL(key);
    }

	static getNewUrlByPageName(pageName, option = {}) {
		let target = RedirectUtil.getPageUrlByPageName(pageName);

		for (let key in option) {
			target = Util.appendParam4Url(target, key, option[key]);
		}

		return target;
	}

	static getPureUrl(url) {
		let urlArr = /^([^\?]+)?/.exec(url);
		return !!urlArr ? urlArr[0] : url;
	}

	static parseQueryString(url) {
	    return StringUtil.parseQueryString(url);
	}

    
    static fetchParamValueByCurrentURL (key) {
    	let obj = StringUtil.parseQueryString(location.href);

    	let newObj = {};
    	if(!!obj.state)
    		newObj = Util.tempRedirectParam2Obj(obj.state);

    	for(let k in obj)
    		if(k != 'state') newObj[k] = obj[k];

    	return newObj[key];
    }

	static appendParam4Url (url, paramKey, paramValue) {
		let obj = StringUtil.parseQueryString(url);
		let paramSubfix = paramKey + '=' + paramValue;
		let targetUrl = url.indexOf('?') >= 0 ? url.split('?')[0] : url;
		
		if(!obj) obj = {};

		obj[paramKey] = paramValue;
		
		if (targetUrl.indexOf('?') < 0) {
			targetUrl += '?';
		}

		Object.keys(obj).map(function (key, index){
			if (index > 0) targetUrl += '&';
			targetUrl += key + '=' + obj[key];
		});

		return targetUrl;
	}

	static getRedirectUrl(pureUrl, options = {}) {
		let redirectUrl = pureUrl;

		for(let key in options) 
			redirectUrl = Util.appendParam4Url(redirectUrl, key, options[key]);

		return redirectUrl;
	}

	static cloneObjExceptParam(obj, paramName) {
		let newObj = {};
		for(let key in obj) {
			if(key != paramName)
				newObj[key] = obj[key];
		}
		return newObj;
	}

		/**
	 * [getCurrentUserId 从cookie中获取用户userid]
	 * @Author   JohnNong
	 * @Email    overkazaf@gmail.com
	 * @Github   https://github.com/overkazaf
	 * @DateTime 2016-09-02T16:21:48+0800
	 * @return   {Boolean}                    [description]
	 */
    static getCurrentUserId () {
    	if (urlConfig['current'] == 'dev') {
    		return 767;
    	} else {
    		return CookieUtil.getCookie('user');
    	}
    }

    static setCurrentUserId (userId) {
    	const COOKIE_EXPIRE_SECONDS = 30 * 24 * 60 * 60; // 30 天 cookie 过期
        return CookieUtil.setCookie('user', userId, COOKIE_EXPIRE_SECONDS, '/', 'yougo.xinguang.com');
    }

	static dislodge(arr1, arr2) {
		for (let i = 0, len = arr2.length; i < len; i++) {
			let index = arr1.indexOf(arr2[i]);
			if (index >= 0) {
				arr1.splice(index, 1)
			}
		}
	}

	static merge(arr1, arr2) {
		let ret = [];
		for (let i = 0, len1 = arr1.length; i < len1; i++) {
			ret.push(arr1[i]);
		}
		for (let j = 0, len2 = arr2.length; j < len2; j++) {
			if (!(ret.indexOf(arr2[j]) > -1)) {
				ret.push(arr2[j])
			}
		}
		return ret;
	}

	static ArrEveEleInAnother(arr1, arr2) {
		if (!arr1.length || !arr2.length) {
			return false
		}
		let ret = true;
		for (let i = 0, len = arr1.length; i < len; i++) {
			if (arr2.indexOf(arr1[i]) === -1) {
				ret = false;
				break;
			}
		}
		return ret;
	}

    static priceFormat(price) {
      Util.isType(price, String) || (price = String(price));
      let inte = "0";
      let deci = ".00";
      if (price) {
        if (price.indexOf(".") !== -1) {
          let arr = price.split(".");
          inte = arr[0];
          deci = "." + arr[1];
        } else {
          inte = price;
        }
      }
      return [inte, deci];
    }

    static tempObj2redirectParam(options) {
    	if(Util.isEmptyObject(options)) {
    		return null;
    	}

    	let equalSign = '1ssss1';
    	let semiSign = '1mmmm1';

    	let arr = [];
    	Object.keys(options).map((key) => {
    		arr.push(key+equalSign+options[key]);
    	});
    	return arr.join(semiSign);
    }

    static tempRedirectParam2Obj(str) {
    	let ret = null;
    	let equalSign = '1ssss1';
    	let semiSign = '1mmmm1';

    	if (str != null) {
    		let arr = [];
    		ret = {};

    		if (str.indexOf(semiSign) >= 0) {
    			arr =  str.split(semiSign);
    			arr.map((kv, index) => {
    				if (kv.indexOf(equalSign)) {
    					let kvArray = kv.split(equalSign);
    					ret[kvArray[0]] = kvArray[1]; 
    				}
    			});
    		} else {
    			if (str.indexOf(equalSign)) {
					let kvArray = str.split(equalSign);
					ret[kvArray[0]] = kvArray[1]; 
				}
    		}
    	}

    	return ret;
    }
    
	/**
	 * [OnlyInt 仅能输入数字]
	 * @param {[type]} text [判断的字符串]
	 * @param {[type]} text [数字要求长度]
	 */
    static OnlyInt(text,len) {
		let rtn = text.replace(/[^0-9]/g, "");
		if(rtn.length > len){
			rtn = rtn.substring(0,len);
		}
		return rtn;
	}

	static DomInView(el) {
		var rule = {
			left: 0,
			right: 0,
			top: 0,
			bottom: 0
		};
		let bcr = el.getBoundingClientRect();
		let mw = el.offsetWidth;
		let mh = el.offsetHeight;
		let w = window.innerWidth;
		let h = window.innerHeight;
		let boolX = (!((bcr.right - rule.left) <= 0 && ((bcr.left + mw) - rule.left) <= 0) && !((bcr.left + rule.right) >= w && (bcr.right + rule.right) >= (mw + w))); //���·�������
		let boolY = (!((bcr.bottom - rule.top) <= 0 && ((bcr.top + mh) - rule.top) <= 0) && !((bcr.top + rule.bottom) >= h && (bcr.bottom + rule.bottom) >= (mh + h))); //���·�������
		if (el.width != 0 && el.height != 0 && boolX && boolY) {
			return true;
		} else {
			return false;
		}
	}
}