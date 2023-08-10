# 重写规则配置片段包含若干条重写规则，并可以包含若干作用于 MitM 的主机名；可通过资源引用的方式使用。
# 片段文件将保存在 Quantumult X 目录下的 Profiles 子目录中。
# 样例可参见 https://raw.githubusercontent.com/crossutility/Quantumult-X/master/sample-import-rewrite.snippet

#小鱼
hostname = ebike-client.xiaoantech.com

^https:\/\/ebike-client\.xiaoantech\.com\/client\/helpConfig\/getHomeNavByServiceId url reject-dict

^https:\/\/ebike-client\.xiaoantech\.com\/client\/fence\/resource\/management\/appList url reject-dict