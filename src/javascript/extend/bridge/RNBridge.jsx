import Util from 'extend/common/util';
export default
class RNBridge {

	/**
	 * Request format:
	 * 	{
	 * 		name: String,
	 * 		param: String,
	 * 		requestID: String
	 * 	}
	 */
	
	/**
	 * Response format:
	 * 	{
	 * 		code: Integer,
	 * 		message: String,
	 * 		data: String,
	 * 		requestID: String
	 * 	}
	 */
	
	/**
	 *	Bridge Interactions
	 *
	 * 	JS  ->  RN  -> Server
	 * 	    <-      <-
	 * 
	 */

	constructor() {

		const ctx = this;
		this.callbacks = {};
		this.queue = [];
		this.calledQueue = [];

		if (window.addEventListener) {
			document.addEventListener('message', function(event) {
				// if (event.origin !== RN.getSafeOriginDomain()) {
				// 	throw new Error('domain is invalid');
				// }
				// 
				console.log('receieve message from RN');
				let parsedObj = JSON.parse(event.data);
				let {
					code,
					message,
					data,
					requestID,
				} = parsedObj;
				let cmd = RNBridge.fetchCommandById(parsedObj);

				RNBridge.dispatchCommand(cmd, ctx);
			});
		} else {
			// Other broswers, not tackle yet
		}

	  return this;
	}

	static isResultSuccessful(code) {
		return code == 0;
	}

	static getSafeOriginDomain() {
		return 'http://localhost:8090';
	}

	static dispatchCommand({
		code,
		message,
		data,
		requestID,
	}, bridgeInstance) {

		let callback = bridgeInstance.callbacks[requestID];
		let {
			success,
			error,
		} = callback;

		callback.called = true;

		RNBridge.enqueueCalledCMD(callback, bridgeInstance);

		if (RNBridge.isResultSuccessful(code)) {
			success && success(data);
		} else {
			error && error(code, message, data);
		}
	}

	/**
	 * [generateNextId 回调的ID生成算法]
	 * @Author   JohnNong
	 * @Email    overkazaf@gmail.com
	 * @Github   https://github.com/overkazaf
	 * @DateTime 2016-12-22T16:54:08+0800
	 * @return   {[type]}                     [description]
	 */
	static generateNextId() {
		return parseInt(new Date().getTime(), 10);
	}

	static fetchCommandById(id) {
		return this.callbacks[id];
	}

	static nextId() {
		return RNBridge.generateNextId();
	}

	/**
	 * [call call function is globally implemented to validate call params, also use postMessage to build a bridge for communication between native and js]
	 * @Author   JohnNong
	 * @Email    overkazaf@gmail.com
	 * @Github   https://github.com/overkazaf
	 * @DateTime 2016-12-20T11:31:44+0800
	 * @param    {[type]}                     option [description]
	 * @return   {[type]}                            [description]
	 */
	call(option) {
		if (!RNBridge.validateCallParam(option)) {
			throw new Error('param error occurs at method call');
		}

		let targetOption = Util.deepClone(option);


		targetOption.requestId = RNBridge.nextId();
		targetOption.called = false;

		RNBridge.enqueueCommand(targetOption, this);

		// send request to RN without called flag and callback functions
		delete targetOption.called;
		delete targetOption.success;
		delete targetOption.error;
		delete targetOption.type;

		let callParam = JSON.stringify(targetOption);

		console.log('post message', callParam);
		window.postMessage(callParam, RNBridge.getSafeOriginDomain());
	}

	listCommandQueue() {
		console.log('this.queue', this.queue);
		return this.queue;
	}

	/**
	 * [validateCallParam 调用前校验一些必填的字段]
	 * @Author   JohnNong
	 * @Email    overkazaf@gmail.com
	 * @Github   https://github.com/overkazaf
	 * @DateTime 2016-12-20T12:01:53+0800
	 * @param    {[type]}                     option [description]
	 * @return   {[type]}                            [description]
	 */
	static validateCallParam(option) {
		return true;
	}

	callJS(option) {
		let callParam = RNBridge.buildCallParam('callJS', option);
		
		this.call(callParam);
	}

	callRN(option) {
		let callParam = RNBridge.buildCallParam('callRN', option);

		this.call(callParam);
	}

	getToken(option) {
		this.callRN(option);
	}


	/**
	 * [enqueueCalledCMD 把已经调用过的命令加入队列中，等待回收]
	 * @Author   JohnNong
	 * @Email    overkazaf@gmail.com
	 * @Github   https://github.com/overkazaf
	 * @DateTime 2016-12-22T16:59:59+0800
	 * @param    {[type]}                     cmd     [description]
	 * @param    {[type]}                     context [description]
	 * @return   {[type]}                             [description]
	 */
	static enqueueCalledCMD(cmd, context) {
		context.calledQueue.push(cmd);

		return void 0;
	}

	static buildCallParam(type, option) {

		let {
			name,
			param,
			success,
			error,
		} = option;

		let callParam = {
			type,
			name,
			param: Util.deepClone(param),
			success,
			error,
		};

		return callParam;
	}

	static enqueueCommand(option, context) {
		context.queue.push(option);
		context.callbacks[option.id] = option;

		RNBridge.gc();
	}

	/**
	 * [gc 定期做一个垃圾回收, 目前只根据两个策略去处理
	 *   1. 是否达到了最大的栈深度
	 *   2. 是否已经被标记了called = true这个标志位]
	 * @Author   JohnNong
	 * @Email    overkazaf@gmail.com
	 * @Github   https://github.com/overkazaf
	 * @DateTime 2016-12-20T12:01:13+0800
	 * @return   {[type]}                     [description]
	 */
	static gc() {

		return void 0;
	}
}