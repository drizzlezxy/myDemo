import RequestUtil from 'extend/common/RequestUtil';
export default class PayUtil {
	static wxPay(json, callback) {
		let {payParam} = json;
		let onBridgeReady = function (){
			   WeixinJSBridge.invoke(
		       'getBrandWCPayRequest', {
		           "appId" : payParam.appId,     //公众号名称，由商户传入     
		           "timeStamp" : payParam.timeStamp,    //时间戳，自1970年以来的秒数     
		           "nonceStr" : payParam.nonceStr, //随机串     
		           "package" : payParam.packageStr,     
		           "signType" : "MD5",         //微信签名方式：     
		           "paySign" : payParam.paySign //微信签名 
		       },
		       function(res){
		       	    let returnCode,
		       	        tradeSerialId = payParam.tradeSerialId;

		           if(res.err_msg == "get_brand_wcpay_request:ok" ) {
		           	  // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。 
		           	  returnCode = 'SUCCESS';
		           	  // alert('weixin支付成功, tradeSerialId::' + tradeSerialId);
		           } else if (res.err_msg == 'get_brand_wcpay_request:cancel') {
		           	  returnCode = 'CANCEL';
		           }else {
		           	  // alert('weixin支付失败');
		           	  returnCode = 'FAILED';
		           }

		           callback && callback(returnCode, json);
		           
		       })
		};
			
		if (typeof WeixinJSBridge == "undefined"){
		   if( document.addEventListener ){
		       document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
		   }else if (document.attachEvent){
		       document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
		       document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
		   }
		}else{
		   onBridgeReady();
		}
	}

	static doPostPay(errorCode, option, callback) {
		//callback && callback(data.result);
		let postPayParam = {
			url: 'syncNotify/weixinPageSynPayResult',
			method: 'POST',
			data: {
		      "transactionId": null,   //微信交易单号  与payId填其一
		      "returnCode": errorCode,
		      "payId": option.payParam.orderPayId,   //订单号
		      "payType": "weixinPage",
		      "payClient": "YG03",
		    },
		    isAbsolute: true,
		    absUrl: 'http://pay.xinguang.com/syncNotify/weixinPageSynPayResult',
		    successFn: (data) => {
		    	if (RequestUtil.isResultSuccessful(data)) {
		    		 callback && callback(data.result);
		    	} else {
		    		 callback && callback(data.result);
		    	}
		    },
		    errorFn: () => {
		    	//alert('网络异常，请检查网络');
		    },
		};
		RequestUtil.fetch(postPayParam);

		// let lmPayParam = {
		// 	url: 'group/afterpay',
		// 	method: 'get',
		// 	data: {
		//       orderId: option.orderId,
		//     },
		//     successFn: (data) => {

		    	
		//     },
		//     errorFn: () => {
		//     	let errorParam = [];
		//     	for (var attr in arguments) {
		//     		errorParam.push(attr + ':' + arguments[attr]);
		//     	}
		//     	//alert(errorParam.join('$'));
		//     },
		// };
		// RequestUtil.fetch(lmPayParam);
	}
}