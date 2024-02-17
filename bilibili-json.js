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
        item.name === "首页" ||
        item.name === "动态" ||
        item.name === "我的"
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
    const keywordsToMatch = ["魔兽争霸3", "IGN", "Official", "Official", "史上最变态", "单通", "庆余年", "一分钟看完", "虚拟偶像", "jojo", "饥荒", "散兵", "大张伟", "星铁", "钵钵鸡", "云顶计算器", "恶堕", "MBTI", "第五人格", "据说", "Galgame", "铁道", "每日", "高达", "MAD", "神棍", "考研", "一个视频看懂", "代肝", "战争雷霆", "大型纪录片", "万智牌", "大 背 头", "绝区零", "开拓者", "Git源宝", "不眠之夜", "符玄", "浙江大佬", "超级碗", "一口气看完", "MMD", "爆肝", "hanser", "符华", "种语言", "塔科夫", "chapa", "chipi", "一首歌的时间", "银狼", "剧透警告", "强风大背头", "手书", "启 动", "流萤", "CSOL", "JOJO", "深渊", "星穹铁道", "崩铁", "蔚蓝档案", "此，", "DC", "今日", "导演", "已成艺术", "艺术已成", "小潮", "小潮院长", "老番茄", "EPIC", "建议收藏", "微信输入法", "张艺谋", "王力宏", "不大，创造神话", "MrBeast", "真探唐仁杰", "绝区", "虎扑评分", "智能手环", "汗流浃背", "更有性价比", "送胯", "全网首发", "月圆时刻", "科目三", "手帐", "心一跳", "今日话题", "扩容", "微软官方", "创意广告", "Mac Mini", "黑苹果", "itx", "电子书网站", "仙王", "免费无损音乐播放器", "手把手教你", "高中大学衔接", "PANDAER", "专杀", "理塘", "带背", "2023最新", "全新编程语言", "小米MiPush", "自媒体必备神器", "花 西 子", "手写二叉树", "手写红黑树", "联想小新", "终于找到", "PS教程", "PR教程", "AE教程", "Apple钱包", "长城电源", "山连着山外山", "分钟速通", "EXO", "山丘", "米哈游", "日推歌单", "当年售价", "考研期间", "一个动作", "附源码", "MATX", "分钟告诉你", "秒钟告诉你", "国产手机", "邓紫棋", "动画讲解", "一万的电脑", "iPadmini", "内存散热器", "腿姐", "百兽战队", "歌荒", "精通C++", "JAVA项目", "小爱同学", "圣杯战争", "在校创业", "ITX", "保姆级教程", "Vision Pro", "全免费", "自动写代码", "画质越来越清晰", "代肝", "LOL新装备", "以绪塔尔", "新版英雄联盟", "乌！蒙！山！", "分猪肉", "磁吸类纸膜", "手把手简单粗暴教你", "监管机", "李 佳 琦", "Java小知识", "乌蒙山", "中东土豪", "逆水寒", "李不白", "电容笔", "小米妙享", "微信分身", "2048", "营 销 号", "Mac mini", "部落冲突", "何同学", "for ya", "酷态科电能卡片", "Adobe2023全家桶", "java面试题", "终于明白", "手动抢火车票", "天天酷跑", "iphone15pro", "原装笔", "勇次郎", "原装笔", "强风大背头", "原神启动", "Java面试题", "说四川话", "FatFox", "胖狐", "原装笔", "薄膜键盘", "流浪汉", "iPad Air5", "iPad Air6", "原装笔", "考研日常", "iphone15", "tvOS", "鬼背", "刃牙", "凄美地", "酷态科", "油管", "15pro", "二狗很忙", "催吐", "假吃播", "低代码", "MacMini", "880", "全程干货", "Zotero", "zotero", "Java项目教程", "墨水屏", "分钟就让你懂", "macmini", "Macmini", "全民K歌", "神之眼", "造梦无双", "notion", "apex", "小时让你", "分钟让你", "星闪", "风暴之门", "Mac mini", "清华大佬", "MateX5", "安信可", "考研网站", "纳粹", "希特勒", "考研英语", "考研政治", "考研数学", "复仇者联盟", "哈佛", "洛丽塔", "Lolita", "高中数学", "一个人去", "因为一个片段", "小灵通", "狼人杀", "甄嬛传", "樱桃小丸子", "mate 60", "cs3", "天背完", "萝卜刀", "地球online", "黑群晖", "nas", "NAS", "QGIS", "CS2", "cs2", "cs 2", "CS 2", "CSGO", "草帽团", "手游", "大英博物馆", "DNF", "炉石", "SCP", "影刀", "用户晒", "一口气看爽", "无拼接", "私教", "奢香夫人", "游山恋", "花木兰", "免费连点器", "孙笑川", "抓紧收藏", "Zlibrary", "极域", "秒沉沦", "IDM", "Motrix", "王天一", "假面骑士", "分钟动画演示", "百万好评", "印度", "神兵小将", "拯救者", "完美世界", "小傲", "高斯", "苦涩如歌", "免费听歌", "营销号", "第五人格", "飞哥与小佛", "Notion", "吴京", "最值得学习", "杨洋", "吃不饱三战士", "张圣叹", "悬 溺", "iPad壳", "斐济杯", "你管这叫", "男女慎入", "Python游戏脚本", "唐家三少", "唐三", "唐门", "IDM", "今日话题", "曲率引擎", "七彩虹", "纪晓岚", "姿态", "小米平板", "万大卡", "小白必看", "分钟注册", "华莱士", "李佳琦", "花西子", "蒋小鱼", "龙队", "iPhone15", "电棍", "otto", "宋焰", "许沁", "我的人间烟火", "小太妹", "周姐", "超级小桀", "桀割", "桀哥", "小桀", "崩坏3", "Infuse", "命运石之门", "变形重组器", "iPhone 15", "Mate60", "Mate 60", "王者荣耀", "A17", "asmr", "alist", "周淑怡", "pgone", "MMORPG", "星穹铁道", "mate60", "Procreate Dreams", "海贼王", "路飞", "凯多", "EVA", "卡贴机", "小超梦", "伍佰", "悬溺", "博人传", "无畏契约", "YJJ", "网红积分", "游戏王", "oi", "华晨宇", "丁真", "Uzi", "TikTok", "魔兽世界", "Dota2", "overlord", "彩虹六号", "吕子乔", "爱情公寓", "曾小贤", "王传君", "岳云鹏", "一口气看完", "pg", "司空震", "进击的巨人", "APEX", "预制菜", "哈哟", "明日香", "野球帝", "逃离塔科夫", "汪苏泷", "神超", "CS2", "狗头萝莉", "FGO", "炉石传说", "B760", "JOJO", "碧蓝航线", "明日方舟", "王源", "王俊凯", "易烊千玺", "四字", "二字", "金河田电源", "绫波丽", "星际争霸", "辛普森一家", "神棍老师", "衣锦夜行", "死神来了", "赛马娘", "皮城", "唐家三少", "李二牛", "何晨光", "王艳兵", "机械猎手", "红警日冕", "福音战士", "宝哥", "旭旭宝宝", "warframe", "星际战甲", "皮城", "vTuber", "CLANNAD", "雌小鬼", "IOS神器", "小米手环", "Apex", "华强北", "专升本", "范闲", "庆余年", "公主连结", "姜云升", "蓝甲虫", "奥迪", "网红卖货", "德云色", "岳云鹏", "小岳", "苹果发布会", "典韦", "蜡笔小新", "恶魔契约", "对冲基金", "球王", "金铲铲", "夜吹", "魔兽争霸", "传奇", "云顶之弈", "周婌怡", "星铁", "显眼包", "分钟带你看完", "小时全面了解", "秒带你看完", "冒死上传", "凡人真仙降世", "碧蓝档案", "马娘", "TFBOYS", "tfboys", "tfboy", "Tfboy", "AI变现", "分钟入门", "分钟赚", "狗头吧", "凡人修仙", "咒术回战", "SpaceX", "UFO", "新卡速递", "炎拳", "零基础自制", "程序员教你", "家有儿女", "注册ChatGPT", "榴莲", "命运的齿轮开始转动", "一个视频了解", "魔法禁书目录", "文森特", "Steam会员", "一人之下", "李佳琪", "python自动化办公", "0编程经验", "李佳棋", "超级小丑", "-欣小萌-"]; // Add more keywords as needed
    const upnamekeywordsToMatch = ["程序员", "程序猿", "预告", "指法芬芳张大仙", "MBTI", "official", "漫威", "科幻", "动画官方", "金铲铲", "数学教师", "Excel", "星穹铁道", "Official", "补番", "微软", "明天", "EPIC", "Epic", "epic", "一纸荒唐言", "飓多多", "话题", "小砍", "每日", "今日", "MrBeast", "黑科技", "徐涛", "考研", "金铲铲", "野球帝", "漫剪", "JOJO", "Python", "漫威", "爱动漫", "说动漫", "说考研", "华强北", "神超"]
    obj.data.items = obj.data.items.filter((i) => {
      const { card_type: cardType, card_goto: cardGoto, title, args, cover_left_text_2: pop, cover_left_text_1: video } = i;
      const { up_id, up_name } = args;
      if (cardType && cardGoto) {
        if (
          keywordsToMatch.some((keyword) => title && title.includes(keyword)) ||
          (up_name && ["乌鸦预告片", "葡萄的叮当猫", "DV现场", "浑元Rysn", "游戏BBQ", "芊芊老猫的日常", "小傲想睡觉", "Meetfood觅食", "毕的二阶导", "UGREEN绿联", "九三的耳朵不是特别好", "粤知一二", "老师好我叫何同学", "何同学工作室", "高斯Goh", "小潮院长", "Upspeed盛嘉成", "吃不饱仨战士", "犀利有话说", "Miss_韩懿莹", "胖龙的小生活", "指法芬芳张大仙", "今日话题君", "网不红萌叔Joey", "今日话题酱", "华为", "兔叭咯", "蒸気火鸡", "上汽大众", "敬汉卿", "你果汁分我一半", "jova_h", "-欣小萌有点亏-", "宋浩老师官方", "原神", "徐涛政治课堂", "子源动漫", "吃不饱三战士", "云顶之弈\-套路王\-七七", "白粥不黑不白", "LPL梗百科", "李不白磨针", "PT健身华哥", "小红毛来辣", "云顶芝士", "炉石Kimmy", "狂野saiwei", "矮矮的桔子", "o冷月追风oO", "小凌漆漆", "大大怪怪怪将军", "我是TOO", "硬汉形象26", "黑黑黑黑莲", "佐助Sama", "炉石萌萌哒的狗贼", "uTools", "老实憨厚的笑笑", "莴苣某人", "22林酱", "小鱼一图流", "林小北Lindo", "鲁大能", "牛牛牛牛牛牛弟", "炉石传说瓦莉拉", "兰林汉的粉丝", "一数", "云顶王天师", "我是小河灵", "阿助今天有工资吗", "小紧张的虫虫", "往往老布", "云顶丶小白", "单走一张六", "你的影月月", "炉石涛妹", "柳岩LIUYAN", "何胜0423", "云顶魔术师黄莲", "铠甲勇士-奥飞", "文森特", "我是瑞斯拜", "空卡空卡空空卡", "考研竞赛凯哥", "黑马程序员", "考研数学武忠祥老师", "姜云升", "高冷难神衣锦夜行", "炉石东少", "犬狐狸", "哔哩哔哩英雄联盟赛事", "云顶小莫", "春哥再就业", "图灵学院教程", "学过石油的语文老师", "幻灭究极老粉", "张圣叹Yo", "痞大菠萝派", "Roy大表哥", "IGN中国", "阿泽u稻草人", "谁让我是白泽呢", "笛木清", "剑客范十三", "芜湖小佐助", "佰鹤羽", "-欣小萌-", "王师傅和小毛毛", "侯翠翠" /* Add more up_name values here */].includes(up_name)) ||
          (up_id && [/* Add more up_id values here */].includes(up_id)) ||
          upnamekeywordsToMatch.some((keyword) => up_name && up_name.includes(keyword)) ||
          pop <= 250 ||
          pop == "-" ||
          video <= 100
        )
        {
          // Filter out items with any of the specified keywords in the title or specified up_id values
          console.log(`\n屏蔽视频title:${title}\n屏蔽视频作者:${up_name}\n屏蔽视频作者uid:${up_id}\n屏蔽视频播放量:${video}\n屏蔽视频弹幕量:${pop}`);
          return false;
        } 
          
          else if (cardType.includes("banner") && cardGoto.includes("banner")) {
          // 去除判断条件 首页横版内容全部去掉
          // if (i.banner_item) {
          // for (const v of i.banner_item) {
          //   if (v.type) {
          //     if (v.type === "ad") return false;
          //   }
          // }
          // return false;
          // }
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