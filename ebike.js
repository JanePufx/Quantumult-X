# 重写规则配置片段包含若干条重写规则，并可以包含若干作用于 MitM 的主机名；可通过资源引用的方式使用。
# 片段文件将保存在 Quantumult X 目录下的 Profiles 子目录中。
# 样例可参见 https://raw.githubusercontent.com/crossutility/Quantumult-X/master/sample-import-rewrite.snippet

# 小鱼
hostname = ebike-client.xiaoantech.com

# 优化界面元素

# -> 计费标准
^https:\/\/ebike-client\.xiaoantech\.com\/client\/helpConfig\/getHomeScrollerMsgByServiceId url reject-dict

# -> 计费说明
^https:\/\/ebike-client\.xiaoantech\.com\/client\/fence\/config\/protocol\/default url reject-dict

# -> 购卡更划算 - 购卡后可享折扣 - 更多
# 7天骑行周卡 30天骑行周卡 
^https:\/\/ebike-client\.xiaoantech\.com\/client\/helpConfig\/getCardPromoteConfigByServiceId url reject-dict

# -> 充值特惠 | 卡券商城 | 编号开锁 | 客服中心 | 消息中心
^https:\/\/ebike-client\.xiaoantech\.com\/client\/helpConfig\/getHomeNavByServiceId url reject-dict

# -> 超值骑行卡套餐 | 充值骑行更省心
^https:\/\/ebike-client\.xiaoantech\.com\/client\/fence\/resource\/management\/appList url reject-dict
