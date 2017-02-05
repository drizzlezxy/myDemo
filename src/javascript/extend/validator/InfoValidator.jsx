import Util from "extend/common/util";
import StringUtil from "extend/common/StringUtil"

export default class InfoValidator {
	constructor (options) {
		this.options = options;
	}

	/**
	 * [validateByRule 提供了常用的校验规则]
	 * @param  {[type]} option [description]
	 * @return {[type]}        [description]
	 */
	static validateByRule (option) {
		let rules = {
			'notNull': function (value, opt) {
				return typeof value != 'undefined' && StringUtil.trim(value) != '';
			},
			'isMobile': function (value, opt) {
				let reMobile = /^1[3-8]\d{9}$/;
				return reMobile.test(value);
			},
			'isID': function (value, opt) {
				let reID = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
				return reID.test(value);
			},
			'isVerifyCode': function (value, opt) {
				let reID = /(^\d{6}$)/;
				return reID.test(value);
			}
		};


		let {
			type, param, errorMessage, data
		} = option;


		let successFlag = rules[type](data.currentValue, data);
		return {
			success: successFlag,
			message: successFlag?'':errorMessage
		}
	}


	static validInfoByFormatedForm (form) {
		for (let i = 0, el; el = form[i++];) {
			let rules = el.validateRules;

			if (!el.isRequired) continue;

			for (let j = 0, rule; rule = rules[j++];) {
				let currentResult = InfoValidator.validateByRule({
					type: rule.rule,
					param: rule.param,
					errorMessage: rule.errorMessage,
					data: el
				});

				if (!currentResult.success) {
					return currentResult;
				}
			}
		}

		return {
			success: true,
			message: '校验通过'
		};
	}


	static validatePersonInfo (personInfo) {
		let composePersonForm = function (info){
			let arr = [];

			// 依待校验的格式处理人员信息
			arr.push({
				currentValue: info.name,
				isRequired: true,
				validateRules: [
					{ "rule": "notNull","param":{}, "errorMessage": "姓名不能为空", data: {"currentValue": info.name}},
				]
			});

			// 依待校验的格式处理联系电话
			arr.push({
				currentValue: info.phone,
				isRequired: true,
				validateRules: [
					{ "rule": "notNull","param":{}, "errorMessage": "手机号码不能为空", data: {"currentValue": info.phone}},
					{ "rule": "isMobile","param":{}, "errorMessage": "手机号码格式非法", data: {"currentValue": info.phone}}
				]
			});

			return arr;
		};
		return InfoValidator.validInfoByFormatedForm(composePersonForm(personInfo));
	}

	static validatePlaceInfo (placeInfo) {
		let composePlaceForm = function (info){
			let arr = [];

			// 依待校验的格式处理人员信息
			arr.push({
				currentValue: info.area,
				isRequired: true,
				validateRules: [
					{ "rule": "notNull","param":{}, "errorMessage": "所在区域不能为空", data: {"currentValue": info.area}},
				]
			});

			// 依待校验的格式处理联系电话
			arr.push({
				currentValue: info.detail,
				isRequired: true,
				validateRules: [
					{ "rule": "notNull","param":{}, "errorMessage": "详细地址不能为空", data: {"currentValue": info.detail}},
				]
			});

			return arr;
		};
		return InfoValidator.validInfoByFormatedForm(composePlaceForm(placeInfo));
	}

	validate() {
		let {person, place} = this.options;

		let personInfoResult = InfoValidator.validatePersonInfo(person);
		if (!personInfoResult.success){
			return personInfoResult;
		}

		let placeInfoResult = InfoValidator.validatePlaceInfo(place);
		if (!placeInfoResult.success){
			return placeInfoResult;
		}

		return {
			success: true,
			message: '校验通过'
		};
	}
}