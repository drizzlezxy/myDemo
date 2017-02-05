import Util from 'extend/common/util';
import config from 'extend/config/config.json';

export default class RedirectUtil {

	static redirectPage({pageName, options}) {
		let targetUrl = RedirectUtil.getPageUrlByPageName(pageName);


		Object.keys(options).map((key) => {
			let value = options[key];
			targetUrl = Util.appendParam4Url(targetUrl, key, value);
		});

		location.href = targetUrl;
		//return targetUrl;
	}

	static getPageUrlByPageName(pageName) {
		let currentEnv = config.current;
		if (currentEnv === 'test') {
			let currentPrefix = `http://sjyxtest.yiqiguang.com/sjyxweb/build/sijiPages/${pageName}/index.html`;
			return currentPrefix;
		} else if (currentEnv === 'online') {
			let currentPrefix = `http://sjyxtest.yiqiguang.com/sjyxweb/build/sijiPages/${pageName}/index.html`;
			return currentPrefix;
		} else if (currentEnv === 'master') {
			let currentPrefix = `http://sjyx.xinguang.com/build/sijiPages/${pageName}/index.html`;
			return currentPrefix;
		}
	} 
}