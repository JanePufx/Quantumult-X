const url = $request.url;
const method = $request.method;
const notifyTitle = 'ebike json'

if (!$response.body) {
    // 有undefined的情况
    console.log(`$response.body为undefined:${url}`);
    $done({});
}
if (method !== "GET") {
    console.log(`${notifyTitle}method错误:${method}`);
}
let body = JSON.parse($response.body);


if (!body) {
    console.log(url);
    console.log(`body:${$response.body}`);
} else {
    if (url.includes("client/helpConfig/getHomeNavByServiceId")) {
        if (!body.data) {
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
        }
    } 
}

body = JSON.stringify(body);
$done({
    body
});