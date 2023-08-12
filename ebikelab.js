/***********************************
> 应用名称：乐哥骑行
> 脚本功能：去除不必要的元素
> 脚本作者：5.Jan1
> 更新时间：2023-8-12

[rewrite_local]
# 超星学习通去界面元素
^https:\/\/ebike-client\.xiaoantech\.com\/client\/helpConfig\/getHomeNavByServiceId url reject-dict

[mitm]
hostname = apps.chaoxing.com
***********************************/

const url = $request.url;
const method = $request.method;
const notifyTitle = 'ebike json'

if (!$response.body) {
    // 有undefined的情况
    console.log(`$response.body为undefined:${url}`);
    $done({});
}
if (method !== "GET") {
    $notification.post(notifyTitle, "method错误:", method);
}
let body = JSON.parse($response.body);


if (!body) {
    console.log(url);
    console.log(`body:${$response.body}`);
} else {
    if (url.includes("client/helpConfig/getHomeNavByServiceId")) {
        if (!body.cataChannelList) {
            console.log(`body:${$response.body}`);
        } else {
            body.data = body.data.filter(item => {
                if (item.name === '充值特惠') {
                    return false;
                }
                if (item.name === '卡券商城') {
                    return false;
                }
                return true;
            });
            fixPos(body.cataChannelList);
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