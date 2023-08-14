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
const notifyTitle = 'chaoxing json'
const itemsToExclude = ['微读书', '微应用', '活动']; // 添加需要去除的项目名称

if (!$response.body) {
    console.log(`$response.body为undefined:${url}`);
    $done({});
}
if (method !== "GET") {
    console.log(`${notifyTitle}-method:${method}`);
}
let body = JSON.parse($response.body);

if (!body) {
    console.log(url);
    console.log(`body:${$response.body}`);
} else {
    if (url.includes("subscribe/getAppCataInfo")) {
        if (!body.cataChannelList) {
            console.log(`body:${$response.body}`);
        } else {
            //console.log(`body:${body.cataChannelList}`);
            body.cataChannelList = body.cataChannelList.filter(item => {
                //console.log(`item:${item}`);
                if (itemsToExclude.includes(item.name)) {
                    console.log(`去除item:${item.name}`);
                    return false;
                }
                return true;
            });
            fixPos(body.data);
        }
    } else if (url.includes("service/config")) {
        if (!body.data) {
            console.log(`body:${$response.body}`);
        } else {
            body.data.appconfig.hpConfig.list = body.data.appconfig.hpConfig.list.filter(item => {
                if (item.name === '微应用') {
                    return false;
                }
                return true;
            });
            fixPos(body.cataChannelList);
        }
    }
}

body = JSON.stringify(body);
$done({
    body
});


function fixPos(arr) {
    for (let i = 0; i < arr.length; i++) {
        // 修复pos
        arr[i].pos = i + 1;
    }
}