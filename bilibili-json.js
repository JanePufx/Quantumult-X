const url = $request.url;
const method = $request.method;
const notifyTitle = "bilibili-json";
console.log(`b站json-2023.03.24`);
if (!$response.body) {
    // 有undefined的情况
    console.log(`$response.body为undefined:${url}`);
    $done({});
}
if (method !== "GET") {
    $notification.post(notifyTitle, "method错误:", method);
}
let body = JSON.parse($response.body);


if (!body.data) {
    console.log(url);
    console.log(`body:${$response.body}`);
    $notification.post(notifyTitle, url, "data字段错误");
} else {
    if (url.includes("x/v2/splash")) {
        console.log('开屏页' + (url.includes("splash/show") ? 'show' : 'list'));
        if (!body.data.show) {
            // 有时候返回的数据没有show字段
            console.log('数据无show字段');
        } else {
            delete body.data.show;
            console.log('成功');
        }
    } else if (url.includes("resource/show/tab/v2")) {
        console.log('tab修改');
        // 顶部右上角
        if (!body.data.top) {
            console.log(`body:${$response.body}`);
            $notification.post(notifyTitle, 'tab', "top字段错误");
        } else {
            body.data.top = body.data.top.filter(item => {
                if (item.name === '游戏中心') {
                    console.log('去除右上角游戏中心');
                    return false;
                }
                return true;
            });
            fixPos(body.data.top);
        }
        // 底部tab栏
        if (!body.data.bottom) {
            console.log(`body:${$response.body}`);
            $notification.post(notifyTitle, 'tab', "bottom字段错误");
        } else {
            body.data.bottom = body.data.bottom.filter(item => {
                if (item.name === '发布') {
                    console.log('去除发布');
                    return false;
                } else if (item.name === '会员购') {
                    console.log('去除会员购');
                    return false;
                }
                return true;
            });
            fixPos(body.data.bottom);
        }
    } else if (url.includes("x/v2/feed/index")) {
        console.log('推荐页');
        if (!body.data.items?.length) {
            console.log(`body:${$response.body}`);
            $notification.post(notifyTitle, '推荐页', "items字段错误");
        } else {
            body.data.items = body.data.items.filter(i => {

                console.log(`up:${i.args.up_name}`);
                // 屏蔽up uid方式
                const up_uid = ['6574487', '450882837', '37119626', '476993587', '3493277586164423', '385105236', '13972445', '43707221', '390461123', '630721866', '6087825', '1428923', '170801610', '317839021', '602664449', '443462760', '255508156', '1213489275', '204408558', '1985025', '314298412', '251569233', '1939319', '382953284', '163637592', '446430908', '8366990', '1192648858'];
                if(!i.args){
                  // console.log(`body:${$response.body}`);
                }  else if (up_uid.includes(i.args.up_id)) {
                  console.log(`屏蔽up:${i.args.up_name}`);
                  return false;
                }
                
                // 屏蔽视频 关键字方式
                const key_word = ['TFBOYS','波奇','孤独'];
                if(!i.title){
                  console.log(`body:${$response.body}`);
                }  else if (key_word.includes(i.title)) {
                  console.log(`屏蔽视频:${i.title}`);
                  return false;
                }

                const {card_type: cardType, card_goto: cardGoto} = i;
                if (cardType && cardGoto) {
                    if (cardType === 'banner_v8' && cardGoto === 'banner') {
                        if (!i.banner_item) {
                            console.log(`body:${$response.body}`);
                            $notification.post(notifyTitle, '推荐页', "banner_item错误");
                        } else {
                            for (const v of i.banner_item) {
                                if (!v.type) {
                                    console.log(`body:${$response.body}`);
                                    $notification.post(notifyTitle, '推荐页', "type错误");
                                } else {
                                    if (v.type === 'ad') {
                                        console.log('banner广告');
                                        return false;
                                    }
                                }
                            }
                        }
                    } else if (cardType === 'cm_v2' && ['ad_web_s', 'ad_av', 'ad_web_gif', 'ad_player', 'ad_inline_3d', 'ad_inline_eggs'].includes(cardGoto)) {
                        // ad_player大视频广告 ad_web_gif大gif广告 ad_web_s普通小广告 ad_av创作推广广告 ad_inline_3d  上方大的视频3d广告 ad_inline_eggs 上方大的视频广告
                        console.log(`${cardGoto}广告去除)`);
                        return false;
                    } else if (cardType === 'small_cover_v10' && cardGoto === 'game') {
                        console.log('游戏广告去除');
                        return false;
                    } else if (cardType === 'cm_double_v9' && cardGoto === 'ad_inline_av') {
                        console.log('创作推广-大视频广告');
                        return false;
                    }
                } else {
                    console.log(`body:${$response.body}`);
                    $notification.post(notifyTitle, '推荐页', "无card_type/card_goto");
                }
                return true;
            });
        }
    } else {
        $notification.post(notifyTitle, "路径匹配错误:", url);
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