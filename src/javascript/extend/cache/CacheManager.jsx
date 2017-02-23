
export default class CacheManager {

	constructor() {
		this.instance = null;
	}

	static getInstance() {
		if (!this.instance) {
			this.instance = new LRUCache();
		}
		return this.instance;
	}

	
}

// 采用LRU算法实现的一个缓存类
class LRUCache {
	static MAX_CACHE_CAPACITY = 100; // 最大的缓存键数量
	constructor() {
		this.cache = {};
		this.queue = [];
		this.capacity = LRUCache.MAX_CACHE_CAPACITY;
	}

	get(key) {
		if (key in this.cache) {
			this.deleteGivenKeyInQueue(key);

			this.queue.unshift(key);
			return this.cache[key];
		}
	}


	set(key, value) {
		if (key in this.cache) {
			this.deleteGivenKeyInQueue(key);
		}

		while(this.queue.length >= this.capacity) {
			let currentKey = this.queue.pop();
			delete this.cache[currentKey];
		}

		this.queue.unshift(key);
		this.cache[key] = value;
	}


	/**
	 * [deleteGivenKeyInQueue 根据给定的key删除键队列中的项]
	 * @param  {[type]} key [description]
	 * @return {[type]}     [description]
	 */
	deleteGivenKeyInQueue(key) {
		for(let i = this.queue.length - 1; i >= 0; i--) {
			if (this.queue[i] === key) {
				this.queue.splice(i, 1);
				break;
			}
		}
	}


	list() {
		console.log('=============== start listing cache =================');
		let that = this;
		this.queue.map(function(key) {
			console.log(key, that.cache[key]);
		});
		console.log('=============== end listing cache =================\n\n\n');
	}

	/**
	 * [store 持久化缓存对象]
	 * @return {[type]} [description]
	 */
	static store() {
		this.write2LocalStorage();
	}

	/**
	 * [gc 缓存类的gc策略, mark and sweep]
	 * @return {[type]} [description]
	 */
	static gc() {
		
	}


	write2LocalStorage() {
		if (Util.supportLocalStorage()) {

		}
	}
}