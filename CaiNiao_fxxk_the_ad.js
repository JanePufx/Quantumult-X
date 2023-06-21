# 重写规则配置片段包含若干条重写规则，并可以包含若干作用于 MitM 的主机名；可通过资源引用的方式使用。
# 片段文件将保存在 Quantumult X 目录下的 Profiles 子目录中。
# 样例可参见 https://raw.githubusercontent.com/crossutility/Quantumult-X/master/sample-import-rewrite.snippet
 
 ## 菜鸟              
hostname = amdc.m。taobao。com, cn-acs.m。cainiao。com
;^http:\/\/amdc\.m\.taobao\.com\/amdc\/mobileDispatch$ Cainiao4iPhone url-and-header reject-dict
## 菜鸟首页          今日好物推荐,底部商品推广,底部标签页,问卷调查,主页图标 //cn-acs.m.cainiao.com
^https:\/\/cn-acs\.m\.cainiao\.com\/gw\/mtop\.cainiao\.adkeyword\.get\.cn\/1\.0\? url reject-dict
^https:\/\/cn-acs\.m\.cainiao\.com\/gw\/mtop\.cainiao\.guoguo\.nbnetflow\.ads\.index\.cn\/1\.0\? url reject-dict
^https:\/\/cn-acs\.m\.cainiao\.com\/gw\/mtop\.cainiao\.guoguo\.nbnetflow\.ads\.m?show\.cn\/1\.0\? url script-response-body https://raw.githubusercontent。com/RuCu6/QuanX/main/Scripts/cainiao.js
^https:\/\/cn-acs\.m\.cainiao\.com\/gw\/mtop\.cainiao\.nbmensa\.research\.researchservice\.(acquire|event|close)\.cn\/1\.0\? url reject-dict


 
;^http://example.com/resource1/4/ url reject-dict
