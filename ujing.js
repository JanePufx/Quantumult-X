const url = $request.url;
const method = $request.method;
const notifyTitle = "ujing-json";

if (!$response.body) {
    console.log(`$response.body为undefined:${url}`);
    $done({});
}
let body = JSON.parse($response.body);


if (!body.data) {
    console.log(url);
    console.log(`body:${$response.body}`);
    $notification.post(notifyTitle, url, "data字段错误");
} else {
    if (url.includes("api/v1.1/ads/placement")) {
        if (!body.data.admin) {
            console.log('数据无body.data.admin字段');
        } else {
            body.data.home = body.data.home.filter(i => {
                if(i.name === "Ujing - iOS - 首页 - 福利中心"){
                    console.log('去除Ujing - iOS - 首页 - 福利中心');
                    return false;
                }
            })
        }
    } else {
            $notification.post(notifyTitle, "路径匹配错误:", url);
    }
}

body = JSON.stringify(body);
$done({
    body
});