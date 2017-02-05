import CacheManager from './CacheManager';
export default class CacheController {

	static isInCache (key) {
		return CacheManager.getInstance().get(key) != null;
	}

	static storeInCache (key,value) {
		value = JSON.stringify(value);
		CacheManager.getInstance().set(key,value);
	}

	static getFromCache (key) {
		return JSON.parse(CacheManager.getInstance().get(key));
	}

	
}