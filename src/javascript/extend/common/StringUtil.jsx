import Util from 'extend/common/util';
import UrlUtil from 'extend/common/UrlUtil';

export default class StringUtil {

	/**
	 * [padZeroLeft Use '0' to pad with given string]
	 * @Author   JohnNong
	 * @Email    overkazaf@gmail.com
	 * @Github   https://github.com/overkazaf
	 * @DateTime 2016-10-30T23:20:01+0800
	 * @param    {[type]}                     str [description]
	 * @param    {[type]}                     len [description]
	 * @return   {[type]}                         [description]
	 */
	static padZeroLeft(str, len) {
		if (str === null) return str;
		if (typeof str !== 'string') {
			try {
				str = String(str);
			} catch(e) {
				throw e;
			}
		}

		if (str.length < len) {
			str = StringUtil.repeat('0', len - str.length) + str;
		}

		return str;
	}

	/**
	 * [repeat 使用矩阵快速幂来处理字符串连接]
	 * @Author   JohnNong
	 * @Email    overkazaf@gmail.com
	 * @Github   https://github.com/overkazaf
	 * @DateTime 2016-10-30T23:18:45+0800
	 * @param    {[type]}                     ch    [description]
	 * @param    {[type]}                     times [description]
	 * @return   {[type]}                           [description]
	 */
	static repeat(ch, times) {
		if (typeof ch !== 'string') throw new Error('Input must be a legal string');

		if (times <= 0) return '';

		if (times % 2 === 0) {
			return StringUtil.repeat(ch + ch, parseInt(times/2, 10));
		} else {
			return ch + StringUtil.repeat(ch, times-1);
		}
	}

	static trim(str) {
    	return str.replace(/(^\s*)|(\s*$)/g, '');
	}

	static parseQueryString (url) {
	    let reg_url =/^[^\?]+\?([\w\W]+)$/,
	        reg_para=/([^&=]+)=([\w\W]*?)(&|$)/g, //g is very important
	        arr_url = reg_url.exec( url ),
			ret = {};
	    if( arr_url && arr_url[1] ){
	        let str_para = arr_url[1],result;
	        while((result = reg_para.exec(str_para)) != null){
	            ret[result[1]] = result[2];
	        }
	    }

    	let newRet = {};
	    if(ret.state) {
	    	newRet = UrlUtil.tempRedirectParam2Obj(ret.state);
	    }

    	for(let k in ret){
    		if(k != 'state') newRet[k] = ret[k];
    	}

	    return newRet;
	};
}