/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = 'www.fredy.cn';

var config = {

    // 下面的地址配合云端 Demo 工作
    service: {
        host,

        // 登录地址，用于建立会话
        loginUrl: `https://${host}/site/login`,

        // 测试的请求地址，用于测试会话
        requestUrl: `https://${host}/info/get-ssxx`,

        apiUrl: `https://${host}/site/api-config`
        // 测试的信道服务地址
        //tunnelUrl: `https://${host}/tunnel`,

       // classUrl: `https://${host}/classTest`,
    }
};

module.exports = config;