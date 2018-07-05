var constants = require('./constants');
var utils = require('./utils');
var Session = require('./session');
var loginLib = require('./login');

var noop = function noop() {};

var buildAuthHeader = function buildAuthHeader(session) {
    var header = {};

    if (session && session.id && session.skey) {
        header[constants.WX_HEADER_ID] = session.id;
        header[constants.WX_HEADER_SKEY] = session.skey;
    }

    return header;
};

/***
 * @class
 * 表示请求过程中发生的异常
 */
var RequestError = (function () {
    function RequestError(type, message) {
        Error.call(this, message);
        this.type = type;
        this.message = message;
    }

    RequestError.prototype = new Error();
    RequestError.prototype.constructor = RequestError;

    return RequestError;
})();

function request(options) {
    if (typeof options !== 'object') {
        var message = '请求传参应为 object 类型，但实际传了 ' + (typeof options) + ' 类型';
        throw new RequestError(constants.ERR_INVALID_PARAMS, message);
    }

    var requireLogin = options.login === false ? false : true;
    var success = options.success || noop;
    var fail = options.fail || noop;
    var complete = options.complete || noop;
    var originHeader = options.header || {};

    // 成功回调
    var callSuccess = function (res) {
        success.apply(null, arguments);
        //console.log(res);
        complete.apply(null, arguments);
    };

    // 失败回调
    var callFail = function (error) {
        fail.call(null, error);
        complete.call(null, error);
    };

    // 是否已经进行过重试
    var hasRetried = false;
    var token;

    if (requireLogin) {
        doRequestWithLogin();
    } else {
        doRequest();
    }

    // 登录后再请求  post 不在本地验证
    function doRequestWithLogin(post = false) {
        loginLib.login({ success: doRequest, fail: callFail, post: post});
    }

    // 实际进行请求的方法
    function doRequest() {
        //var authHeader = buildAuthHeader(Session.get());
        var session = Session.get();
        if (requireLogin) originHeader.token = session.token;
        
        wx.request(utils.extend({}, options, {
            header: originHeader,
            url: options.url,
            //header: utils.extend({}, originHeader, authHeader),

            success: function (response) {
                var data = response.data;

                // 如果响应的数据里面包含 SDK Magic ID，表示被服务端 SDK 处理过，此时一定包含登录态失败的信息
                // if (data && data[constants.WX_SESSION_MAGIC_ID]) {
                    // 清除登录态
                    //Session.clear();

                    var error, message;
                    if (data.code === constants.ERR_INVALID_SESSION) {
                        // 如果是登录态无效，并且还没重试过，会尝试登录后刷新凭据重新请求
                        if (!hasRetried) {
                            hasRetried = true;
                            doRequestWithLogin(true);
                            return;
                        }

                        message = '登录态已过期';
                        error = new RequestError(data.error, message);
                        callFail(error);
                    } 
                    // 
                    // return;
                //}
                //console.log(data)
                callSuccess.apply(null, arguments);
            },

            fail: callFail,
            complete: noop,
        }));
    };

};

module.exports = {
    RequestError: RequestError,
    request: request,
};