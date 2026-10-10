/* ==========================================================================
   中国铁路12306网站 - 首页数据
   车站库格式：[车站名, 全拼, 简拼]
   ========================================================================== */
window.DATA = (function () {
  "use strict";

  /* ---------- 车站库（按客流量选取的主要车站） ---------- */
  var stations = [
    ["北京", "beijing", "bj"], ["北京南", "beijingnan", "bjn"], ["北京西", "beijingxi", "bjx"],
    ["北京北", "beijingbei", "bjb"], ["北京朝阳", "beijingchaoyang", "bjcy"], ["北京丰台", "beijingfengtai", "bjft"],
    ["上海", "shanghai", "sh"], ["上海虹桥", "shanghaihongqiao", "shhq"], ["上海南", "shanghainan", "shn"],
    ["广州", "guangzhou", "gz"], ["广州南", "guangzhounan", "gzn"], ["广州东", "guangzhoudong", "gzd"],
    ["广州北", "guangzhoubei", "gzb"], ["深圳", "shenzhen", "sz"], ["深圳北", "shenzhenbei", "szb"],
    ["深圳东", "shenzhendong", "szd"], ["珠海", "zhuhai", "zh"], ["东莞", "dongguan", "dg"],
    ["佛山", "foshan", "fs"], ["中山", "zhongshan", "zs"], ["惠州", "huizhou", "hz"],
    ["汕头", "shantou", "st"], ["湛江", "zhanjiang", "zj"], ["天津", "tianjin", "tj"],
    ["天津西", "tianjinxi", "tjx"], ["重庆", "chongqing", "cq"], ["重庆北", "chongqingbei", "cqb"],
    ["重庆西", "chongqingxi", "cqx"], ["成都", "chengdu", "cd"], ["成都东", "chengdudong", "cdd"],
    ["成都南", "chengdunan", "cdn"], ["杭州", "hangzhou", "hz"], ["杭州东", "hangzhoudong", "hzd"],
    ["杭州西", "hangzhouxi", "hzx"], ["宁波", "ningbo", "nb"], ["温州", "wenzhou", "wz"],
    ["温州南", "wenzhounan", "wzn"], ["南京", "nanjing", "nj"], ["南京南", "nanjingnan", "njn"],
    ["苏州", "suzhou", "sz"], ["苏州北", "suzhoubei", "szb"], ["无锡", "wuxi", "wx"],
    ["无锡东", "wuxidong", "wxd"], ["常州", "changzhou", "cz"], ["徐州", "xuzhou", "xz"],
    ["徐州东", "xuzhoudong", "xzd"], ["扬州", "yangzhou", "yz"], ["镇江", "zhenjiang", "zjj"],
    ["南通", "nantong", "nt"], ["盐城", "yancheng", "yc"], ["泰州", "taizhou", "tz"],
    ["淮安", "huaian", "ha"], ["连云港", "lianyungang", "lyg"], ["宿迁", "suqian", "sq"],
    ["武汉", "wuhan", "wh"], ["汉口", "hankou", "hk"], ["武昌", "wuchang", "wc"],
    ["宜昌东", "yichangdong", "ycd"], ["襄阳", "xiangyang", "xy"], ["十堰", "shiyan", "sy"],
    ["荆州", "jingzhou", "jz"], ["黄石", "huangshi", "hs"], ["恩施", "enshi", "es"],
    ["西安", "xian", "xa"], ["西安北", "xianbei", "xab"], ["郑州", "zhengzhou", "zz"],
    ["郑州东", "zhengzhoudong", "zzd"], ["洛阳", "luoyang", "ly"], ["洛阳龙门", "luoyanglongmen", "lylm"],
    ["开封", "kaifeng", "kf"], ["安阳", "anyang", "ay"], ["新乡", "xinxiang", "xx"],
    ["南阳", "nanyang", "ny"], ["信阳", "xinyang", "xy"], ["商丘", "shangqiu", "sq"],
    ["长沙", "changsha", "cs"], ["长沙南", "changshanan", "csn"], ["株洲", "zhuzhou", "zz"],
    ["衡阳", "hengyang", "hy"], ["岳阳", "yueyang", "yy"], ["常德", "changde", "cd"],
    ["张家界", "zhangjiajie", "zjj"], ["济南", "jinan", "jn"], ["济南西", "jinanxi", "jnx"],
    ["青岛", "qingdao", "qd"], ["青岛北", "qingdaobei", "qdb"], ["烟台", "yantai", "yt"],
    ["潍坊", "weifang", "wf"], ["淄博", "zibo", "zb"], ["济宁", "jining", "jn"],
    ["临沂", "linyi", "ly"], ["日照", "rizhao", "rz"], ["威海", "weihai", "wh"],
    ["德州", "dezhou", "dz"], ["聊城", "liaocheng", "lc"], ["菏泽", "heze", "hz"],
    ["沈阳", "shenyang", "sy"], ["沈阳北", "shenyangbei", "syb"], ["大连", "dalian", "dl"],
    ["大连北", "dalianbei", "dlb"], ["长春", "changchun", "cc"], ["长春西", "changchunxi", "ccx"],
    ["哈尔滨", "haerbin", "heb"], ["哈尔滨西", "haerbinxi", "hebx"], ["吉林", "jilin", "jl"],
    ["石家庄", "shijiazhuang", "sjz"], ["保定", "baoding", "bd"], ["唐山", "tangshan", "ts"],
    ["秦皇岛", "qinhuangdao", "qhd"], ["邯郸", "handan", "hd"], ["张家口", "zhangjiakou", "zjk"],
    ["太原", "taiyuan", "ty"], ["太原南", "taiyuannan", "tyn"], ["大同", "datong", "dt"],
    ["呼和浩特", "huhehaote", "hhht"], ["呼和浩特东", "huhehaotedong", "hhhtd"], ["包头", "baotou", "bt"],
    ["鄂尔多斯", "eerduosi", "eeds"], ["兰州", "lanzhou", "lz"], ["兰州西", "lanzhouxi", "lzx"],
    ["西宁", "xining", "xn"], ["银川", "yinchuan", "yc"], ["乌鲁木齐", "wulumuqi", "wlmq"],
    ["拉萨", "lasa", "ls"], ["贵阳", "guiyang", "gy"], ["贵阳北", "guiyangbei", "gyb"],
    ["昆明", "kunming", "km"], ["昆明南", "kunmingnan", "kmn"], ["大理", "dali", "dl"],
    ["丽江", "lijiang", "lj"], ["西双版纳", "xishuangbanna", "xsbn"], ["曲靖", "qujing", "qj"],
    ["南宁", "nanning", "nn"], ["南宁东", "nanningdong", "nnd"], ["桂林", "guilin", "gl"],
    ["桂林北", "guilinbei", "glb"], ["海口", "haikou", "hk"], ["三亚", "sanya", "sy"],
    ["福州", "fuzhou", "fz"], ["福州南", "fuzhounan", "fzn"], ["厦门", "xiamen", "xm"],
    ["厦门北", "xiamenbei", "xmb"], ["泉州", "quanzhou", "qz"], ["莆田", "putian", "pt"],
    ["漳州", "zhangzhou", "zz"], ["龙岩", "longyan", "ly"], ["南昌", "nanchang", "nc"],
    ["南昌西", "nanchangxi", "ncx"], ["九江", "jiujiang", "jj"], ["赣州", "ganzhou", "gz"],
    ["上饶", "shangrao", "sr"], ["合肥", "hefei", "hf"], ["合肥南", "hefeinan", "hfn"],
    ["芜湖", "wuhu", "wh"], ["蚌埠", "bengbu", "bb"], ["阜阳", "fuyang", "fy"],
    ["黄山", "huangshan", "hs"], ["安庆", "anqing", "aq"], ["六安", "luan", "la"],
    ["金华", "jinhua", "jh"], ["义乌", "yiwu", "yw"], ["绍兴", "shaoxing", "sx"],
    ["嘉兴", "jiaxing", "jx"], ["湖州", "huzhou", "hz"], ["台州", "taizhou", "tz"],
    ["丽水", "lishui", "ls"], ["绵阳", "mianyang", "my"], ["宜宾", "yibin", "yb"],
    ["泸州", "luzhou", "lz"], ["遵义", "zunyi", "zy"], ["乐山", "leshan", "ls"],
    ["西昌", "xichang", "xc"], ["宝鸡", "baoji", "bj"], ["咸阳", "xianyang", "xy"],
    ["渭南", "weinan", "wn"], ["延安", "yanan", "ya"], ["榆林", "yulin", "yl"]
  ];

  /* ---------- 主导航 ---------- */
  var nav = [
    { name: "首页", href: "index.html", active: true },
    { name: "车票", cols: [
      { tit: "购买", items: ["单程", "往返", "中转换乘", "计次•定期票"] },
      { tit: "变更", items: ["退票", "改签", "变更到站"] },
      { tit: "更多", items: ["中铁银通卡", "国际列车", "团购服务", "务工人员", "学生团体"] }
    ]},
    { name: "团购服务" },
    { name: "会员服务", cols: [
      { tit: "会员", items: ["会员管理", "积分账户", "积分兑换"] },
      { tit: "专享", items: ["会员专享", "会员中心"] }
    ]},
    { name: "站车服务", cols: [
      { tit: "站车服务", items: ["特殊重点旅客", "便民托运", "约车服务", "车站引导", "遗失物品查找", "动车组介绍", "站车风采"] }
    ]},
    { name: "商旅服务", cols: [
      { tit: "商旅服务", items: ["餐饮•特产", "保险", "雪具快运"] }
    ]},
    { name: "出行指南", cols: [
      { tit: "常见问题", items: ["车票", "购票", "改签", "退票", "更多>>"], lighter: ["更多>>"] },
      { tit: "旅客须知", items: ["身份核验", "更多>>"], lighter: ["更多>>"] },
      { tit: "相关章程", items: ["铁路旅客运输规程", "广深港高速铁路跨境旅客运输组织规则", "铁路旅客禁止、限制携带和托运物品目录"] }
    ]},
    { name: "信息查询", cols: [
      { tit: "常用查询", items: ["正晚点", "时刻表", "公布票价", "检票口", "起售时间", "天气", "交通查询", "代售点", "客服电话", "列车状态"] },
      { tit: "", items: ["最新发布", "信用信息"] }
    ]}
  ];

  /* ---------- 头部右侧菜单 ---------- */
  var headerMenu = [
    { text: "无障碍", href: "javascript:;" },
    { line: true },
    { text: "敬老版", href: "javascript:;" },
    { line: true },
    { text: "English", caret: true, list: [
      { text: "简体中文", href: "index.html" },
      { text: "English", href: "index_en.html" }
    ]},
    { line: true },
    { text: "我的12306", caret: true, list: [
      "火车票订单", "候补订单", "计次•定期票订单", "约号订单", "电子发票", "待补票订单", "本人车票",
      "-", "我的餐饮•特产", "我的保险", "我的会员", "-", "查看个人信息", "账户安全", "乘车人", "地址管理", "温馨服务查询"
    ]},
    { text: "登录", href: "javascript:;" },
    { text: "注册", href: "javascript:;" }
  ];

  /* ---------- 首页轮播（真实banner图，来自12306官网） ---------- */
  var slides = [
    { img: "images/banner1.jpg", alt: "江西 风景独好" },
    { img: "images/banner2.jpg", alt: "中国铁路旅游" },
    { img: "images/banner3.jpg", alt: "铁路12306" },
    { img: "images/banner4.jpg", alt: "客运服务" },
    { img: "images/banner5.jpg", alt: "铁路旅游" },
    { img: "images/banner6.jpg", alt: "美好出行" }
  ];

  /* ---------- 便捷服务 ---------- */
  var services = [
    { icon: "i-s1", name: "重点旅客预约" },
    { icon: "i-s2", name: "遗失物品查找" },
    { icon: "i-s3", name: "约车服务" },
    { icon: "i-s4", name: "便民托运" },
    { icon: "i-s5", name: "车站引导" },
    { icon: "i-s6", name: "站车风采" },
    { icon: "i-s7", name: "用户反馈" }
  ];

  /* ---------- 最新发布（title 标题，date 发布日期） ---------- */
  var news = [
    { title: "关于铁路12306网站系统维护的公告", date: "10-08" },
    { title: "2026年国庆假期旅客运输方案公布", date: "09-30" },
    { title: "铁路12306推出学生预约购票服务", date: "09-26" },
    { title: "关于优化调整部分旅客列车运行图的公告", date: "09-22" },
    { title: "铁路电子发票服务全面上线通知", date: "09-18" },
    { title: "关于儿童优惠票购票标准的公告", date: "09-12" },
    { title: "铁路旅客禁止、限制携带和托运物品目录更新", date: "09-08" },
    { title: "12306候补购票功能使用说明", date: "09-03" },
    { title: "关于广深港跨境旅客列车开行方案的公告", date: "08-29" },
    { title: "关于开展铁路旅客身份信息核验的公告", date: "08-25" }
  ];

  /* ---------- 铁路旅游 / 热门服务推荐（2列大卡，用12306官网宣传图） ---------- */
  var travels = [
    { img: "images/abanner1.jpg", title: "会员服务" },
    { img: "images/abanner2.jpg", title: "便民服务" },
    { img: "images/abanner3.jpg", title: "站车服务" },
    { img: "images/abanner4.jpg", title: "商旅服务" }
  ];

  /* ---------- 常见问题 ---------- */
  var faq = [
    "实名制车票", "售票窗口购票", "互联网购票", "互联网退票", "随身携带品",
    "进出站", "丢失购票时使用的有效身份证件", "使用居民身份证直接检票乘车", "广深港跨境列车"
  ];

  /* ---------- 信用信息 ---------- */
  var discredit = {
    left: [
      "张某某　案号(2025)京01执1234号",
      "李某某　案号(2025)沪02执5678号",
      "王某某　案号(2025)粤03执9012号",
      "赵某某　案号(2025)川04执3456号"
    ],
    right: [
      "陈某　已履行完毕", "刘某　已履行完毕", "孙某　已履行完毕", "周某　已履行完毕"
    ]
  };

  /* ---------- 页脚友情链接 ---------- */
  var footLinks = [
    "中国国家铁路<br>集团有限公司",
    "中国铁路财产保险<br>自保有限公司",
    "中国铁路<br>95306网",
    "中铁快运<br>股份有限公司"
  ];

  /* ---------- 页脚二维码 ---------- */
  var footCode = [
    { tit: "中国铁路官方微信", qr: "wechat", brand: "i-wechat", width: 140 },
    { tit: "中国铁路官方微博", qr: "weibo", brand: "i-weibo", width: 140 },
    { tit: "12306 公众号", qr: "official", width: 110 },
    { tit: "铁路12306", qr: "app", width: 110, tips: "官方APP下载，目前铁路未授权其他网站或APP开展类似服务内容，敬请广大用户注意。" }
  ];

  /* ---------- 搜索提示 ---------- */
  var searchTips = [
    { icon: "i-ticket", text: "车票" },
    { icon: "i-query", text: "正晚点" },
    { icon: "i-query", text: "时刻表" },
    { icon: "i-query", text: "公布票价" },
    { icon: "i-query", text: "检票口" },
    { icon: "i-query", text: "起售时间" },
    { icon: "i-food", text: "餐饮•特产" },
    { icon: "i-ticket", text: "常旅客会员" },
    { icon: "i-s7", text: "相关规章" }
  ];

  return {
    stations: stations,
    nav: nav,
    headerMenu: headerMenu,
    slides: slides,
    services: services,
    news: news,
    travels: travels,
    faq: faq,
    discredit: discredit,
    footLinks: footLinks,
    footCode: footCode,
    searchTips: searchTips
  };
})();
