export default class PromiseFactory {


	static toPromise(option) {
		let {success, fail, fn} = option;
		return new Promise((resolve, reject) => {
			fn(resolve(success), reject(fail));
		});
	}
}