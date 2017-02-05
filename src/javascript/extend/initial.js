import NEJsbridge from 'extend/jsBridge.js'
import Util from 'extend/Util/Util.jsx'
var head = "";
var queryObj = {};
var userObj = {};
var isComplete = false;
var contentLoaded = 0;
var loaded = 0;

document.addEventListener("DOMContentLoaded", function() {
    contentLoaded = (new Date()).getTime();
})

window.addEventListener("load", function() {
    loaded = (new Date()).getTime();
})


window.rpc_SetExtraHttpHeader = function (data) {
};

window.rpc_SetUserInfo = function(data) {
    userObj = Util.formatData(data);
    if (userObj.isLogin) {
        Util.createCookie("token", userObj.token)
    } else {
        Util.eraseCookie("token")
    }
};

window.rpc_setUrlParam = function(data) {
    queryObj = (data && data !== "") ? Util.deparam(data) : {};
    isComplete = true;
};


$(function() {
    var NEJsbridge = window.NEJsbridge;
    if (!Util.isLocalLoad()) {
        var data = {
            isLogin: true,
            token: 'e1fef5fc-aa15-4401-a2bd-744c920ddea4'
        }
        var url = location.search;
        if (url.indexOf('?') > -1) {
            url = url.substr(1)
        }
        window.rpc_SetUserInfo(JSON.stringify(data));
        window.rpc_setUrlParam(url);
    } else {
        NEJsbridge.sendJSEvent('rpc_OnJSEvent', {
            'event': 'ondidload'
        });
        NEJsbridge.observeNativeEvent('login', function(e) {
            window.rpc_SetUserInfo(e.detail);
        })
    }
});
export {
    head,
    queryObj,
    userObj,
    isComplete,
    contentLoaded,
    loaded
}