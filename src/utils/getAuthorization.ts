
import * as base64 from "base-64";
import CryptoJs from "crypto-js";

//这里是讯飞星火大模型工作台的个人信息
export const APPID = "0f4dc878";
export const APIKey = "934d2502b887854f8f0b375c1d27a17c";
export const APISecret = "M2Q1NjkzZmM4ZDUzMmQxMTc0NzI5OWU2";
/**
 * 大模型版本对照表
 * 官方文档参考：https://www.xfyun.cn/doc/spark/Web.html#_1-%E6%8E%A5%E5%8F%A3%E8%AF%B4%E6%98%8E
 *  Spark4.0 Ultra 请求地址：     domain：4.0Ultra      version：v4.0/chat
 *  Spark Max 请求地址：          domain：generalv3.5   version：v3.5/chat
 *  Spark Pro-128K 请求地址：     domain：pro-128k      version：chat/pro-128k
 *  Spark Pro 请求地址：          domain：generalv3     version：v3.1/chat
 *  Spark V2.0 请求地址：         domain：generalv2     version：v2.1/chat
 *  Spark Lite请求地址：          domain：lite       version：v1.1/chat
 */
export const domain = "lite"
const version = "v1.1/chat"



//获取鉴权url地址
export const getWebsocketUrl = () => {
    //获取鉴权地址
    return new Promise((resolve) => {
        let url = " wss://spark-api.xf-yun.com/" + version;
        let host = "spark-api.xf-yun.com";
        let apiKeyName = "api_key";
        let date = new Date().toUTCString();
        console.log("鉴权url地址", date);
        let algorithm = "hmac-sha256";
        let headers = "host date request-line"
        let signatureOrigin = `host: ${host}\ndate: ${date}\nGET /` + version + ` HTTP/1.1`;
        let signatureSha = CryptoJs.HmacSHA256(
            signatureOrigin,
            APISecret
        );
        let signature = CryptoJs.enc.Base64.stringify(signatureSha);
        let authorizationOrigin = `${apiKeyName}="${APIKey}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`;
        let authorization = base64.encode(authorizationOrigin);

        //将空格编码
        url = `${url}?authorization=${authorization}&date=${encodeURI(
            date
        )}&host=${host}`;

        resolve(url);
        console.log("鉴权url地址2", url);
    });
}