const url = $request.url;
const method = $request.method;
const notifyTitle = "meituan-json";

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
    if (url.includes("api/v6/home/dynamic/tab")) {
        if (!body.data.dynamic_tab_list) {
            console.log('数据无dynamic_tab_list字段');
        } else {
            body.data.dynamic_tab_list = body.data.dynamic_tab_list.filter(i => {
                if(i.name === '会员'){
                    console.log('去除会员');
                    return false;
                }
            })
        }
    }
    if (url.includes("entry/indexTab")) {
        console.log('tabArea修改');
        if (!body.data.tabArea) {
            console.log(`body:${$response.body}`);
        } else {
            body.data.tabArea = body.data.tabArea.filter(item => {
                if (item.tabNameCN === '优选') {
                    console.log('去除botton优选');
                    return false;
                }
                if (item.tabNameCN === '视频赚') {
                    console.log('去除botton视频赚');
                    return false;
                }
                return true;
            });
        }
        
    }
        else {
            $notification.post(notifyTitle, "路径匹配错误:", url);
    }
}

body = JSON.stringify(body);
$done({
    body
});