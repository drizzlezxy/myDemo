import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Notification from 'components/Notification/Notification.jsx'
import MyCityPicker from "components/CityPicker/CityPicker";
import InfoValidator from 'extend/validator/InfoValidator';
import CookieUtil from "extend/common/CookieUtil";
import Util from "extend/common/util";
import StringUtil from "extend/common/StringUtil";
import RequestUtil from "extend/common/RequestUtil";
import WeixinUtil from "extend/common/WeixinUtil";
import 'scss/base.scss';
import 'scss/DeliveryAddrAdd/index.scss';



class MyComponent extends Component {
	constructor (props) {
		super(props);

		const funcType = Util.fetchParamValueByCurrentURL("funcType");
		//funcType = edit ：从“我的页面”进入，不携带订单信息
		//funcType = select ：从支付流程进入，会携带订单信息
		const userId = CookieUtil.getCookie("userId"),
			uId = CookieUtil.getCookie("uid");
		this.state = {
			userId: userId,
			uId: uId,
			funcType: funcType,
			addrItem: {
				index: -1,	//-1则表示是新增的地址
				data: {
					person: {
						name: "",
						phone: ""
					},
					place: {
						area: "",
						detail: ""
					},
					addrCode: {
						provinceCode: "",
						cityCode: "",
						districtCode: "",
					},
				},
				isDefault: false,
			},
			showCityPicker: false,
			notification: {
				enter: false,
				message: "这里是提示信息"
			},
			canSubmit: false
		}
	}

	componentDidMount() {
		WeixinUtil.hideWeixinMenu();
		
		const that = this,
			addrItemIndex = Util.fetchParamValueByCurrentURL("addrItemIndex");
		if(addrItemIndex != undefined && addrItemIndex > -1){
			//获取原地址信息
			let param = {
				url : 'address/getReceiveAddressById',
				method : 'POST',
				data : {
					// userId: that.state.userId,
					// uid: that.state.uId,
					addressId: addrItemIndex
				},
				successFn : function (result){
					if (result.code == 0) {
						let addrItem = that.addrItemHook(result.result);
						that.setState({
							addrItem: addrItem
						},()=>that.validateAndResetSumbitButton())
					} else {
						console.log("获取原地址信息错误！")
					}
				},
				errorFn : function () {
					console.error(arguments);
				}
			};
			RequestUtil.fetch(param);
		}
	}

	addrItemHook(item) {
		return {
			index: item.addressId,
			"data": {
				"person": {
					"name": item.name,
					"phone": item.phone,
				},
				"place": {
					"area": item.addressString || item["a,ddressString"],
					"detail": item.address
				},
				addrCode: {
					provinceCode: item.provinceCode,
					cityCode: item.cityCode,
					districtCode: item.districtCode,
				},
			},
			"isDefault": !!item.isDefault,
		}
	}

	updateMainInfoValue(areaData) {
		const data = this.state.addrItem.data;
		let addrCode = [data.addrCode.provinceCode, data.addrCode.cityCode, data.addrCode.districtCode],
			areaString = Util.isArray(areaData) ? areaData.map( (item,index)=>{
				addrCode[index] = item.code;
				return item.text;
			}).join('-') : data.place.area;

		const { mainName, mainPhone, mainDetail } = this.refs;
		let addrItem = Util.deepClone(this.state.addrItem);
		addrItem.data = {
			person: {
				name: mainName.value,
				phone: mainPhone.value
			},
			place: {
				area: areaString,
				detail: mainDetail.value
			},
			addrCode: {
				provinceCode: addrCode[0],
				cityCode: addrCode[1],
				districtCode: addrCode[2],
			}
		}

		this.setState({
			addrItem: addrItem
		}, ()=>{
			this.validateAndResetSumbitButton();
		});
	}


	validateAndResetSumbitButton() {
		const validResult = this.validateForm();
		if (validResult.success == true) {
			this.setState({
				canSubmit: true
			});
		} else {
			this.setState({
				canSubmit: false,
			});
		}
	}

	validateForm() {
		let {person, place} = this.state.addrItem.data;
		let infoValidator = new InfoValidator({
			person: person,
			place: place
		});	

		return infoValidator.validate();
	}

	handleSaveClick(){
		this.tryRedirecting2Save(this.validateForm());

	}

	tryRedirecting2Save(validResult) {
		let that = this;
		let redirect2SaveStrategy = {
			'success': function (result) {
				// that.enter("信息校验通过，请稍等...");
			   	// 构造向后台提交的数据结构
			   	const item = that.state.addrItem,
			   		{person, place, addrCode} = item.data;
				let param = {
					url : item.index == -1 ? 'address/addResAddress' : 'address/updateResAddress',
					method : 'POST',
					data : {
						"userId": that.state.userId,
						"uid": that.state.uId,
						"zipcode":"0",
						"addressId": item.index,
						"provinceCode": addrCode.provinceCode,
						"cityCode": addrCode.cityCode,
						"districtCode": addrCode.districtCode,
						"streetCode":0,
						"address": place.detail,
						"name": person.name,
						"phone": person.phone,
						"tel": null,
						"isDefault": item.isDefault ? 1 : 0
					},
					successFn : function (result){
						if (RequestUtil.isResultSuccessful(result)) {
							let params = Util.parseQueryString(location.href);
							location.href = Util.getNewUrlByPageName('DeliveryAddr', Util.cloneObjExceptParam(params, 'addrItemIndex'));

						} else {
							that.setState({
								canSubmit: false,
								notification: {
									enter: true,
									message: "提交错误，请稍后再试！"
								},
							}, () => {
								setTimeout(function (){
									that.setState({
										enter: false
									})
								}, 3000);
							});
						}
					},
					errorFn : function () {
						that.setState({
							canSubmit: false,
							notification: {
								enter: true,
								message: "服务器出错，请稍后再试！"
							},
						}, () => {
							setTimeout(function (){
								that.setState({
									enter: false
								})
							}, 3000);
						});
						console.error(arguments);
					}
				};
				RequestUtil.fetch(param);
			},
			'fail': function (result) {
				this.setState({
					canSubmit: false,
					notification: {
						enter: true,
						message: validResult.message
					},
				}, () => {
					setTimeout(function () {
						this.setState({
							enter: false
						});
					}.bind(this), 3000);
				});
			}
		};

		// 调用
		redirect2SaveStrategy[validResult.success?'success':'fail'].call(this, validResult);
	}

	/**
	 * 提示组件Notification出现，3s后自动消失
	 * @return {[type]} [description]
	 */
	enter(message = "这里是提示信息") {
		this.setState({
			notification: {
				enter: true,
				message: message
			}
		});
		setTimeout(function () {
			this.leave()
		}.bind(this), 3000)
	}

	leave() {
		this.setState({
			notification: {
				enter: false,
				message: ""
			}
		});
	}

	handleGetFoucus(targetRef) {
		if(targetRef == "mainArea"){
			this.setState({
				showCityPicker: true
			});
			return;
		}
		this.refs[targetRef].focus();
	}
	
	hideCityPicker() {
		this.setState({
			showCityPicker: false
		})
	}

	handleIsDefault() {
		let currentData = Util.deepClone(this.state.addrItem);
		currentData.isDefault = !currentData.isDefault;
		this.setState({
			addrItem: currentData
		})
	}

	render () {
		const that = this;

		let currentData = this.state.addrItem,
			{person, place} = currentData.data;
		
		let maxNameLength = 14,
			maxPhoneLength = 11,
			maxDetailLength = 50,
			mainName = person.name,
			mainPhone = person.phone,
			mainArea = StringUtil.trim(place.area) ? place.area.split("-",3).map( item => <i>{item}</i> ) : [,,],
			mainDetail = place.detail;

		let btnSaveClazz = this.state.canSubmit ? " canSubmit" : "",
			btnDefaultClazz = currentData.isDefault ? "default-checkbox is-default" : "default-checkbox";

		return (
			<div className="m-deliveryaddradd">
				<div className="m-fill-info">

					<div className="fill-person">
						<div className="name" onClick={that.handleGetFoucus.bind(that,"mainName")}>
							<label>收货人姓名</label>
							<input ref="mainName" className="name-field" value={mainName} onChange={that.updateMainInfoValue.bind(that)} maxLength={maxNameLength}/>
						</div>
						<div className="phone" onClick={that.handleGetFoucus.bind(that,"mainPhone")}>
							<label>手机号码</label>
							<input ref="mainPhone" className="phone-field" value={mainPhone} onChange={that.updateMainInfoValue.bind(that)} maxLength={maxPhoneLength}/>
						</div>
					</div>

					<div className="fill-place">
						<div className="area" onClick={that.handleGetFoucus.bind(that,"mainArea")}>
							<label><span>省份</span><span>{ mainArea[0] }<b className='icon-arrow'></b></span></label>
							<label><span>城市</span><span>{ mainArea[1] }<b className='icon-arrow'></b></span></label>
							<label><span>区县</span><span>{ mainArea[2] }<b className='icon-arrow'></b></span></label>
						</div>
						<div className="detail" onClick={that.handleGetFoucus.bind(that,"mainDetail")}>
							<label>详细地址</label>
							<textarea ref="mainDetail" className="detail-field" value={mainDetail} onChange={that.updateMainInfoValue.bind(that)} maxLength={maxDetailLength}></textarea>
						</div>
					</div>
				</div>

				<div className="m-btn">
					<div className="btn-default" onClick={that.handleIsDefault.bind(that)}>
						<div className={btnDefaultClazz}></div>
						<span>设为默认</span>
					</div>

					<div className={"btn-save"+btnSaveClazz} onClick={that.handleSaveClick.bind(that)} >保存</div>
				</div>

				<Notification enter={that.state.notification.enter} leave={that.leave.bind(that)}>{that.state.notification.message}</Notification>
			
				<MyCityPicker ref="mainArea" isShow={that.state.showCityPicker} hide={that.hideCityPicker.bind(that)} exportData={that.updateMainInfoValue.bind(that)}/>

			</div>
		)
	}
}


function doRender () {
	ReactDOM.render(<MyComponent /> , document.getElementById("app"));
}

setTimeout(doRender, 16);