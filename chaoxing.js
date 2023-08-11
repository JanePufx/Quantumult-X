# 重写规则配置片段包含若干条重写规则，并可以包含若干作用于 MitM 的主机名；可通过资源引用的方式使用。
# 片段文件将保存在 Quantumult X 目录下的 Profiles 子目录中。
# 样例可参见 https://raw.githubusercontent.com/crossutility/Quantumult-X/master/sample-import-rewrite.snippet


# 学习通清爽界面
hostname = apps.chaoxing.com

^https:\/\/apps\.chaoxing\.com\/apis\/subscribe\/getAppCataInfo\.jspx\? url script-response-body https://raw.githubusercontent.com/JanePufx/Quantumult-X/main/chaoxinglab.js

^https:\/\/learn\.chaoxing\.com\/apis\/service\/config\? url script-response-body https://raw.githubusercontent.com/JanePufx/Quantumult-X/main/chaoxinglab.js