const url = $request.url;
const method = $request.method;
const notifyTitle = 'ebike json'
const itemsToExclude = ['充值特惠', '卡券商城', '编号开锁', '客服中心', '消息中心']; // 添加需要去除的项目名称

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
    if (url.includes("client/helpConfig/getHomeNavByServiceId")) {
        if (!body.data) {
            console.log(`body:${$response.body}`);
        } else {
            //console.log(`body:${body.data}`);
            body.data = body.data.filter(item => {
                //console.log(`item:${item}`);
                if (itemsToExclude.includes(item.name)) {
                    console.log(`去除item:${item.name}`);
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