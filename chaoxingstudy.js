/***********************************
> 应用名称：超星学习通
> 脚本功能：去除不必要的元素
> 脚本作者：5.Jan1
> 更新时间：2023-8-12

[rewrite_local]
# 超星学习通去界面元素
^https:\/\/apps\.chaoxing\.com\/apis\/subscribe\/getAppCataInfo\.jspx\? url script-response-body https://raw.githubusercontent.com/JanePufx/Quantumult-X/main/chaoxinglab.js
^https:\/\/learn\.chaoxing\.com\/apis\/service\/config\? url script-response-body https://raw.githubusercontent.com/JanePufx/Quantumult-X/main/chaoxinglab.js

[mitm]
hostname = apps.chaoxing.com
***********************************/

const url = $request.url;
const method = $request.method;
const notifyTitle = 'chaoxingstudy json'

if (!$response.body) {
    console.log(`$response.body为undefined:${url}`);
    $done({});
}
let body = JSON.parse($response.body);

if (!body) {
    console.log(url);
    console.log(`body:${$response.body}`);
} else if (url.includes("apis/service/appConfig")) {
        if (!body.data.ad) {
            console.log(`body:${$response.body}`);
        } else {
            body.data.ad = body.data.ad.filter((i) => {
            if (i.duration = '3000'){
                // 去除开屏广告
                return false
            }
            });
        }
    } 
    // else if (url.includes("apis/recent/getRecord.jspx")) {
    //     if (!body.list) {
    //         console.log(`body:${$response.body}`);
    //     } else {
    //         body.list = body.list.filter((i) => {
    //         if (i.duration = '3000'){
    //             // 去除开屏广告
    //             return false
    //         }
    //         });
    //     }
    // }

body = JSON.stringify(body);
$done({
    body
});