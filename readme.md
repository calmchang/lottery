## 启动方式
* npm install
* sh dev.sh 或者 gulp dev

## 打包
* sh package.sh 或 gulp dev --env production

## 使用方法

### 按键用途
* 1~9：分别进入 1-9种不同抽奖方式 
* 回车：进入抽奖滚动状态，再次按回车抽出一批奖项，然后继续回车后继续开始滚动进入下一轮
* 0：回到首屏待机画面
* 进入 admin.html 查看中奖名单以及重置的功能


### 打开站点
URL后参数 auto 代表自适应模式，如果没有auto就默认使用了css内 screen1920配置
根据实际屏幕情况可以设置分辨率



# 配置方法
* user.js内配置抽奖名单，pid为唯一识别ID,name为姓名,dep为所属部门(4个字内)

* 修改index.js内 lotteryPageInfo 属性，具体属性作用看代码
  其中 lotteryLevel 为奖项数组，可以根据需求删除或者增加，对应数字键盘上的 1~9键
