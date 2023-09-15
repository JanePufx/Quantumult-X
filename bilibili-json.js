// 2023-09-11 21:15

const url = $request.url;
if (!$response.body) $done({});
let obj = JSON.parse($response.body);

// 强制设置的皮肤
if (url.includes("/x/resource/show/skin")) {
  if (obj.data?.common_equip) {
    delete obj.data.common_equip;
  }
} else if (url.includes("/x/resource/show/tab/v2")) {
  // 标签页
  if (obj.data?.tab) {
    obj.data.tab = obj.data.tab.filter(
      (item) =>
        item.name === "推荐" ||
        item.name === "热门" ||
        item.name === "动画" ||
        item.name === "影视"
    );
    fixPos(obj.data.tab);
  }
  if (obj.data?.top) {
    obj.data.top = [
      {
        id: 176,
        icon: "http://i0.hdslb.com/bfs/archive/d43047538e72c9ed8fd8e4e34415fbe3a4f632cb.png",
        tab_id: "消息Top",
        name: "消息",
        uri: "bilibili://link/im_home",
        pos: 1
      }
    ];
  }
  if (obj.data?.bottom) {
    obj.data.bottom = obj.data.bottom.filter(
      (item) =>
        !(
          item.name === "发布" ||
          item.name === "会员购" ||
          item.name === "節目"
        )
    );
    fixPos(obj.data.bottom);
  }
} else if (url.includes("/x/resource/top/activity")) {
  // 右上角活动入口
  obj = {
    code: -404,
    message: "啥都木有",
    ttl: 1,
    data: null
  };
} else if (url.includes("/x/v2/account/mine?")) {
  // 我的页面
  // 标准版：
  // 396离线缓存 397历史记录 398我的收藏 399稍后再看 171个性装扮 172我的钱包 407联系客服 410设置
  // 港澳台：
  // 534离线缓存 8历史记录 4我的收藏 428稍后再看
  // 352离线缓存 1历史记录 405我的收藏 402个性装扮 404我的钱包 544创作中心
  // 概念版：
  // 425离线缓存 426历史记录 427我的收藏 428稍后再看 171创作中心 430我的钱包 431联系客服 432设置
  // 国际版：
  // 494离线缓存 495历史记录 496我的收藏 497稍后再看 741我的钱包 742稿件管理 500联系客服 501设置
  // 622为会员购中心 425开始为概念版id
  const itemList = new Set([
    396, 397, 398, 399, 407, 410, 494, 495, 496, 497, 500, 501
  ]);
  if (obj.data?.sections_v2) {
    obj.data.sections_v2.forEach((element, index) => {
      let items = element.items.filter((e) => itemList.has(e.id));
      obj.data.sections_v2[index].button = {};
      obj.data.sections_v2[index].tip_icon = "";
      obj.data.sections_v2[index].be_up_title = "";
      obj.data.sections_v2[index].tip_title = "";
      if (
        obj.data.sections_v2[index].title === "推荐服务" ||
        obj.data.sections_v2[index].title === "更多服务" ||
        obj.data.sections_v2[index].title === "创作中心"
      ) {
        obj.data.sections_v2[index].title = "";
        obj.data.sections_v2[index].type = "";
      }
      obj.data.sections_v2[index].items = items;
      obj.data.vip_section_v2 = "";
      obj.data.vip_section = "";
      if (obj.data?.live_tip) {
        obj.data.live_tip = "";
      }
      if (obj.data?.answer) {
        obj.data.answer = "";
      }
      // 开启本地会员标识
      if (obj.data?.vip) {
        if (obj.data.vip.status === 1) {
          return false;
        } else {
          obj.data.vip_type = 2;
          obj.data.vip.type = 2;
          obj.data.vip.status = 1;
          obj.data.vip.vip_pay_type = 1;
          obj.data.vip.due_date = 2208960000; // Unix 时间戳 2040-01-01 00:00:00
          obj.data.vip.role = 3;
        }
      }
    });
  }
} else if (url.includes("/x/v2/account/mine/ipad")) {
  if (obj.data?.ipad_upper_sections) {
    // 投稿 创作首页 稿件管理 有奖活动
    delete obj.data.ipad_upper_sections;
  }
  if (obj.data?.ipad_recommend_sections) {
    // 789我的关注 790我的消息 791我的钱包 792直播中心 793大会员 794我的课程 2542我的游戏
    const itemList = [789, 790];
    obj.data.ipad_recommend_sections = obj.data.ipad_recommend_sections.filter(
      (i) => itemList.includes(i.id)
    );
  }
  if (obj.data?.ipad_more_sections) {
    // 797我的客服 798设置 1070青少年守护
    const itemList = [797, 798];
    obj.data.ipad_more_sections = obj.data.ipad_more_sections.filter((i) =>
      itemList.includes(i.id)
    );
  }
} else if (url.includes("/x/v2/account/myinfo")) {
  // 会员清晰度
  if (obj.data?.vip) {
    if (obj.data.vip.status === 1) {
      $done({});
    } else {
      obj.data.vip.type = 2;
      obj.data.vip.status = 1;
      obj.data.vip.vip_pay_type = 1;
      obj.data.vip.due_date = 2208960000; // Unix 时间戳 2040-01-01 00:00:00
      obj.data.vip.role = 3;
    }
  }
} else if (url.includes("/x/v2/feed/index?")) {
    // 推荐广告
    if (obj.data?.items) {
      /*
      过滤规则仅自用，不对任何作者及其视频有恶意
      keywordsToMatch 视频title中包含的关键字
      up_name 视频作者名字
      up_id 视频作者uid
      */  
      // Define an array of keywords to match in the title
      const keywordsToMatch = ["Python游戏脚本", "唐家三少", "唐三", "唐门", "IDM", "今日话题", "曲率引擎", "七彩虹", "纪晓岚", "姿态", "小米平板", "万大卡", "小白必看", "分钟注册", "华莱士", "李佳琦", "花西子", "蒋小鱼", "龙队", "iPhone15", "电棍", "otto", "宋焰", "许沁", "我的人间烟火", "小太妹", "周姐", "超级小桀", "桀割", "桀哥", "小桀", "崩坏3", "Infuse", "命运石之门", "变形重组器", "iPhone 15", "Mate60", "Mate 60", "王者荣耀", "A17", "asmr", "alist", "周淑怡", "pgone", "MMORPG", "星穹铁道", "mate60", "Procreate Dreams", "海贼王", "路飞", "凯多", "EVA", "卡贴机", "小超梦", "伍佰", "悬溺", "博人传", "无畏契约", "YJJ", "网红积分", "游戏王", "oi", "华晨宇", "丁真", "Uzi", "TikTok", "魔兽世界", "Dota2", "overlord", "彩虹六号", "吕子乔", "爱情公寓", "曾小贤", "王传君", "岳云鹏", "一口气看完", "pg", "司空震", "进击的巨人", "APEX", "预制菜", "哈哟", "明日香", "野球帝", "逃离塔科夫", "汪苏泷", "神超", "CS2", "狗头萝莉", "FGO", "炉石传说", "B760", "JOJO", "碧蓝航线", "明日方舟", "王源", "王俊凯", "易烊千玺", "四字", "二字", "金河田电源", "绫波丽", "星际争霸", "辛普森一家", "神棍老师", "衣锦夜行", "死神来了", "赛马娘", "皮城", "唐家三少", "李二牛", "何晨光", "王艳兵", "机械猎手", "红警日冕", "福音战士", "宝哥", "旭旭宝宝", "warframe", "星际战甲", "皮城", "vTuber", "CLANNAD", "雌小鬼", "IOS神器", "小米手环", "Apex", "华强北", "专升本", "范闲", "庆余年", "公主连结", "姜云升", "蓝甲虫", "奥迪", "网红卖货", "德云色", "岳云鹏", "小岳", "苹果发布会", "典韦", "蜡笔小新", "恶魔契约", "对冲基金", "球王", "金铲铲", "夜吹", "魔兽争霸", "传奇", "云顶之弈", "周婌怡", "星铁", "显眼包", "分钟带你看完", "小时全面了解", "秒带你看完", "冒死上传", "凡人真仙降世", "碧蓝档案", "马娘", "TFBOYS", "tfboys", "tfboy", "Tfboy", "AI变现", "分钟入门", "分钟赚", "狗头吧", "凡人修仙", "咒术回战", "SpaceX", "UFO", "新卡速递", "炎拳", "零基础自制", "程序员教你", "家有儿女", "注册ChatGPT", "榴莲", "命运的齿轮开始转动", "一个视频了解", "魔法禁书目录", "文森特", "Steam会员", "一人之下", "李佳琪", "python自动化办公", "0编程经验", "李佳棋", "超级小丑"]; // Add more keywords as needed
      const upnamekeywordsToMatch = ["金铲铲", "野球帝", "漫剪", "JOJO", "Python", "漫威", "爱动漫", "说动漫", "说考研", "华强北", "神超"]
      obj.data.items = obj.data.items.filter((i) => {
        const { card_type: cardType, card_goto: cardGoto, title, args, cover_left_text_2: pop, cover_left_text_1: video } = i;
        const { up_id, up_name } = args;
        if (cardType && cardGoto) {
          if (
            keywordsToMatch.some((keyword) => title && title.includes(keyword)) ||
            (up_name && ["云顶之弈\-套路王\-七七", "白粥不黑不白", "LPL梗百科", "李不白磨针", "PT健身华哥", "小红毛来辣", "云顶芝士", "炉石Kimmy", "狂野saiwei", "矮矮的桔子", "o冷月追风oO", "小凌漆漆", "大大怪怪怪将军", "我是TOO", "硬汉形象26", "黑黑黑黑莲", "佐助Sama", "炉石萌萌哒的狗贼", "uTools", "老实憨厚的笑笑", "莴苣某人", "22林酱", "小鱼一图流", "林小北Lindo", "鲁大能", "牛牛牛牛牛牛弟", "炉石传说瓦莉拉", "兰林汉的粉丝", "一数", "云顶王天师", "我是小河灵", "阿助今天有工资吗", "小紧张的虫虫", "往往老布", "云顶丶小白", "单走一张六", "你的影月月", "炉石涛妹", "柳岩LIUYAN", "何胜0423", "云顶魔术师黄莲", "铠甲勇士-奥飞", "文森特", "我是瑞斯拜", "空卡空卡空空卡", "考研竞赛凯哥", "黑马程序员", "考研数学武忠祥老师", "姜云升", "高冷难神衣锦夜行", "炉石东少", "犬狐狸", "哔哩哔哩英雄联盟赛事", "云顶小莫", "春哥再就业", "图灵学院教程", "学过石油的语文老师", "幻灭究极老粉", "张圣叹Yo", "痞大菠萝派", "Roy大表哥", "IGN中国", "阿泽u稻草人", "谁让我是白泽呢", "笛木清", "剑客范十三", "芜湖小佐助", "佰鹤羽" /* Add more up_name values here */].includes(up_name)) ||
            (up_id && [/* Add more up_id values here */].includes(up_id)) ||
            upnamekeywordsToMatch.some((keyword) => up_name && up_name.includes(keyword)) 
          ) {
            // Filter out items with any of the specified keywords in the title or specified up_id values
            console.log(`\n屏蔽视频title:${title}\n屏蔽视频作者:${up_name}\n屏蔽视频作者uid:${up_id}\n屏蔽视频播放量:${video}\n屏蔽视频弹幕量:${pop}`);
            return false;
          } else if (cardType.includes("banner") && cardGoto.includes("banner")) {
            // 去除判断条件 首页横版内容全部去掉
            return false;
          } else if (
            ["cm_v1", "cm_v2"].includes(cardType) &&
            [
              "ad_av",
              "ad_inline_3d",
              "ad_inline_eggs",
              "ad_player",
              "ad_web_gif",
              "ad_web_s"
            ].includes(cardGoto)
          ) {
            return false;
          } else if (cardType === "small_cover_v9" && cardGoto === "live") {
            // 直播内容
            return false;
          } else if (cardType === "small_cover_v10" && cardGoto === "game") {
            // 游戏广告
            return false;
          } else if (cardType === "cm_double_v9" && cardGoto === "ad_inline_av") {
            // 创作推广 大视频广告
            return false;
          } else if (cardType === "ogv_small_cover" && cardGoto === "bangumi") {
            // 纪录片
            return false;
          } else if (cardType === "small_cover_v2" && cardGoto === "pgc") {
            // 纪录片
            return false;
          }
        }
        return true;
      });
    }
} else if (url.includes("/x/v2/feed/index/story")) {
  if (obj.data?.items) {
    // vertical_live 直播内容
    // vertical_pgc 大会员专享
    obj.data.items = obj.data.items.filter(
      (i) =>
        !(
          i.hasOwnProperty("ad_info") ||
          i.hasOwnProperty("story_cart_icon") ||
          ["ad", "vertical_live", "vertical_pgc"].includes(i.card_goto)
        )
    );
  }
} else if (url.includes("/x/v2/search/square")) {
  // 热搜广告
  if (obj.data) {
    obj.data = {
      type: "history",
      title: "搜索历史",
      search_hotword_revision: 2
    };
  }
} else if (url.includes("/x/v2/splash")) {
  // 开屏广告
  const item = ["account", "event_list", "preload", "show"];
  if (obj.data) {
    item.forEach((i) => {
      delete obj.data[i];
    });
    if (obj.data?.max_time) {
      obj.data.max_time = 0;
    }
    if (obj.data?.min_interval) {
      obj.data.min_interval = 31536000;
    }
    if (obj.data?.pull_interval) {
      obj.data.pull_interval = 31536000;
    }
    if (obj.data?.list) {
      for (let i of obj.data.list) {
        i.duration = 0;
        i.enable_pre_download = false;
        i.end_time = 2209046399; // Unix 时间戳 2040-01-01 23:59:59
        i.begin_time = 2208960000; // Unix 时间戳 2040-01-01 00:00:00
      }
    }
  }
} else if (
  url.includes("/pgc/page/bangumi") ||
  url.includes("/pgc/page/cinema/tab")
) {
  // 观影页广告
  if (obj.result?.modules) {
    obj.result.modules.forEach((i) => {
      if (i.style.startsWith("banner")) {
        i.items = i.items.filter((ii) => ii.link.includes("play"));
      } else if (i.style.startsWith("function")) {
        i.items = i.items.filter((ii) => ii.blink.startsWith("bilibili"));
      } else if ([241, 1283, 1284, 1441].includes(i.module_id)) {
        i.items = [];
      } else if (i.style.startsWith("tip")) {
        i.items = [];
      }
    });
  }
} else if (url.includes("/xlive/app-room/v1/index/getInfoByRoom")) {
  // 直播广告
  if (obj.data?.activity_banner_info) {
    obj.data.activity_banner_info = null;
  }
  if (obj.data?.shopping_info) {
    obj.data.shopping_info = {
      is_show: 0
    };
  }
  if (obj.data?.new_tab_info?.outer_list?.length > 0) {
    obj.data.new_tab_info.outer_list = obj.data.new_tab_info.outer_list.filter(
      (i) => i.biz_id !== 33
    );
  }
}

$done({ body: JSON.stringify(obj) });

// 修复pos
function fixPos(arr) {
  for (let i = 0; i < arr.length; i++) {
    arr[i].pos = i + 1;
  }
}