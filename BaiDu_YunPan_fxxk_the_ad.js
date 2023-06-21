# 重写规则配置片段包含若干条重写规则，并可以包含若干作用于 MitM 的主机名；可通过资源引用的方式使用。
# 片段文件将保存在 Quantumult X 目录下的 Profiles 子目录中。
# 样例可参见 https://raw.githubusercontent.com/crossutility/Quantumult-X/master/sample-import-rewrite.snippet
 
 ## 百度网盘广告屏蔽(会员卖卡赚钱)       hostname = sofire.baidu。com,ndstatic.cdn。bcebos。com,pan.baidu。com,staticsns.cdn。bcebos。com,issuecdn.baidupcs。com
^https:\/\/pan\.baidu\.com\/pmall\/order\/privilege\/info url reject
^https:\/\/pan\.baidu\.com\/rest\/.+\/pcs\/adx url reject
^https:\/\/pan\.baidu\.com\/api\/useractivity\/activity url reject
^http:\/\/pan\.baidu\.com\/act\/.+\/bchannel\/list url reject
^https:\/\/pan\.baidu\.com\/component\/view\/1510\?from url reject
^https:\/\/sofire\.baidu\.com\/ios\/.+ url reject
^https:\/\/ndstatic\.cdn\.bcebos\.com\/activity\/welfare\/js\/.+\.js url reject
^https:\/\/ndstatic\.cdn\.bcebos\.com\/activity\/welfare\/index\.html url reject
^https:\/\/pan\.baidu\.com\/pmall\/order\/privilege\/info url reject
^https:\/\/staticsns\.cdn\.bcebos\.com\/amis\/.+/banner.png url reject
^http:\/\/rp\.hpplay\.cn\/logouts url reject
https:\/\/issuecdn\.baidupcs\.com\/issue\/netdisk\/ts_ad\/ url reject
https:\/\/pan\.baidu\.com\/rest\/2.0\/pcs\/adv\? url reject
# https://pan\.baidu\.com\/act\/api\/activityentry\? - reject
https:\/\/pan\.baidu\.com\/component\/view\/(1510|1130)\?vip url reject
^https:\/\/update\.pan\.baidu\.com\/statistics\? url reject-dict


 
;^http://example.com/resource1/4/ url reject-dict
