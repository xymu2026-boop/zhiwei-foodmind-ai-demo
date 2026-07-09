import { useEffect, useMemo, useRef, useState } from "react";

const demoNavItems = [
  { id: "boundary", label: "定位对比", icon: "ri-scales-3-line", subtitle: "和 SaaS 的区别" },
  { id: "overview", label: "AI 经营指挥台", icon: "ri-home-5-line", subtitle: "老板今日重点" },
  { id: "flow", label: "AI 加工流", icon: "ri-flow-chart", subtitle: "数据到行动" },
  { id: "alerts", label: "AI 巡店预警", icon: "ri-alarm-warning-line", subtitle: "AI 自动巡店", badge: 5 },
  { id: "report", label: "AI 经营日报", icon: "ri-article-line", subtitle: "可转发日报" },
  { id: "dishes", label: "毛利审计", icon: "ri-pie-chart-2-line", subtitle: "真实毛利分析" },
  { id: "reviews", label: "评论到 SOP", icon: "ri-chat-3-line", subtitle: "差评转任务" },
  { id: "delivery", label: "外卖与备货", icon: "ri-truck-line", subtitle: "算账与预测" },
  { id: "pilot", label: "7 天试点", icon: "ri-database-2-line", subtitle: "低门槛验证" },
];

const pptSlides = [
  {
    id: 1,
    type: "cover",
    eyebrow: "客户拜访版 · Demo 后讲 PPT",
    title: "知味 · 连锁餐饮 AI 经营参谋",
    subtitle: "把分散在收银、外卖、评论、成本和备货里的经营信号，转成老板当天就能处理的判断和动作。",
    highlight: "让老板每天先看最该处理的事，而不是每天打开一堆后台找问题。",
    chips: ["当天发现风险", "算清利润影响", "派给门店执行", "复盘整改结果"],
  },
  {
    id: 2,
    type: "islands",
    eyebrow: "开场判断",
    title: "问题不是没数据，而是发现得太晚",
    subtitle: "当 POS、外卖、评论、成本和库存各看一套，真正吞利润的问题往往过几天才浮出来。",
    islands: ["POS", "外卖", "评论", "菜品成本", "库存净菜", "店长群"],
    questions: ["今天先盯哪家店？", "哪个菜卖得多却不赚钱？", "哪个活动正在吞利润？", "整改后到底有没有改善？"],
  },
  {
    id: 3,
    type: "compare",
    eyebrow: "差异定位",
    title: "知味补的是经营判断层，不替代原系统",
    subtitle: "已有系统继续负责记录经营，知味把记录过的数据转成老板能用的判断、任务和复盘。",
    rows: [
      ["老板得到什么", "看到交易、订单、会员、库存记录", "看到今天最该处理的经营问题"],
      ["问题怎么出现", "人去各个后台翻数据、做判断", "AI 每天巡店，主动把异常排出来"],
      ["能不能解释", "知道指标下降，但原因要继续查", "定位门店、时段、菜品、活动和执行原因"],
      ["有没有结果", "常常停在看见问题", "生成负责人、截止时间、验收指标和复盘"],
    ],
  },
  {
    id: 4,
    type: "loop",
    eyebrow: "AI 价值闭环",
    title: "从发现问题到复盘结果，才叫经营闭环",
    subtitle: "餐饮老板要的不是多一张报表，而是问题被看见、被安排、被验收。",
    steps: ["发现异常", "估算影响", "找到证据", "判断原因", "派发任务", "验收结果", "沉淀打法"],
    quote: "AI 不是说“全店下滑”，而是指出“滨江宝龙店午市工作餐曝光下降”，并给出调整推荐位和午后复盘的动作。",
  },
  {
    id: 5,
    type: "case",
    eyebrow: "真实数据推理",
    title: "用一组门店数据，把问题追到可处理的原因",
    subtitle: "老板不需要再猜是菜品、门店还是活动问题，AI 先把异常和证据串起来。",
    stores: [
      ["滨江宝龙店", "8,842", "10,870", "-18.6%", "午市营收异常"],
      ["湖滨银泰店", "12,351", "13,624", "-9.3%", "口碑异常"],
      ["武林旗舰店", "16,782", "16,440", "+2.1%", "正常"],
      ["城西银泰店", "11,209", "11,627", "-3.6%", "观察"],
      ["西溪印象城店", "9,654", "9,539", "+1.2%", "正常"],
    ],
    reasoning: ["同类写字楼店未同步下滑", "评论没有明显新增差评", "午市缺口约 2,028 元", "预计可修复 800-1200 元/日"],
    verdict: "优先处理滨江宝龙店午市：先恢复曝光，再复盘订单恢复。",
  },
  {
    id: 6,
    type: "demo",
    eyebrow: "对应 Demo：首页",
    title: "首页只回答一个问题：今天先处理哪件事",
    subtitle: "老板进入系统不该先看几十个指标，而是先看到会影响收入、毛利和口碑的关键事件。",
    zones: ["先排序", "讲证据", "给动作"],
    card: ["滨江宝龙店午市下滑", "不是全店下滑，而是午市单时段下滑", "预计可修复：800-1200 元/日"],
  },
  {
    id: 7,
    type: "alerts",
    eyebrow: "对应 Demo：异常预警",
    title: "总部每天先看优先级，不等门店汇报",
    subtitle: "AI 按影响金额、证据完整度和可执行性排序，帮总部把今天该管的事排在前面。",
    alerts: [
      ["营收异常", "8 项", "最严重：滨江宝龙店午市 -18.6%"],
      ["毛利异常", "6 项", "重点：小炒黄牛肉成本率 +6.9pp"],
      ["评论异常", "12 项", "重点：湖滨银泰店漏汤 7 条"],
      ["备货异常", "5 项", "重点：青椒预计多备 8kg"],
    ],
  },
  {
    id: 8,
    type: "report",
    eyebrow: "对应 Demo：AI 经营日报",
    title: "老板看结论，店长拿动作，日报当天能执行",
    subtitle: "日报不是把数据重新写一遍，而是把证据、判断、任务和复盘打包成团队当天能执行的版本。",
    sections: ["证据摘要", "老板结论", "店长任务", "复盘口径"],
    message: "昨日不是全盘下滑，重点处理三件事：滨江宝龙店午市修复、湖滨银泰店漏汤整改、小炒黄牛肉成本复核。",
  },
  {
    id: 9,
    type: "profit",
    eyebrow: "对应 Demo：菜品毛利",
    title: "爆品也可能吞利润，AI 要算真实毛利",
    subtitle: "菜品卖得好不代表值得继续推，老板真正关心的是扣掉成本、佣金、包装和满减以后还剩多少。",
    cost: [
      ["售价", "38.0 元"],
      ["食材成本", "-16.5 元"],
      ["平台佣金", "-7.8 元"],
      ["包装费", "-1.2 元"],
      ["满减核销", "-3.4 元"],
      ["单份真实毛利", "9.1 元"],
      ["目标毛利", "12.9 元"],
      ["差距", "-3.8 元"],
    ],
    conclusion: "小炒黄牛肉仍是招牌菜，不建议下架；先暂停深度满减，再复核出成率和门店克重。",
  },
  {
    id: 10,
    type: "review",
    eyebrow: "对应 Demo：评论整改",
    title: "差评不是情绪，是可以验收的整改任务",
    subtitle: "老板不需要一堆情绪标签，需要知道问题归因、谁去处理、什么时候验收。",
    review: "外卖漏汤，包装袋都是湿的，饭还能吃但体验太差。",
    tags: ["漏汤", "包装湿", "外卖订单", "湖滨银泰店", "晚高峰", "2 星评价"],
    task: "今日 18:00 前复训汤品双层袋和封口检查；未来 3 天漏汤差评不超过 2 条。",
  },
  {
    id: 11,
    type: "delivery",
    eyebrow: "对应 Demo：外卖与备货",
    title: "外卖和备货都要算真实账",
    subtitle: "外卖看订单利润，备货看损耗风险；两件事都直接影响老板口袋里的钱。",
    left: ["满 45 减 8", "单均真实毛利 11.5 元", "先停止继续加大满减"],
    right: ["青椒预计多备 8kg", "建议减少采购 8kg", "预计少报损 120-200 元/日"],
  },
  {
    id: 12,
    type: "trust",
    eyebrow: "信任机制",
    title: "让老板相信 AI，关键是把证据讲清楚",
    subtitle: "AI 不应该只给结论，还要告诉老板判断来自哪里、哪些确定、哪些还需要补数据。",
    trustCard: [
      ["AI 判断", "小炒黄牛肉销量未降，但真实毛利低于目标"],
      ["关键证据", "成本率 58.8%，高于目标 6.9pp"],
      ["数据来源", "POS、成本卡、外卖活动、平台佣金规则"],
      ["可信度", "82%，足够用于经营排序"],
      ["不确定项", "部分门店实际领料缺失，净菜损耗为估算"],
    ],
  },
  {
    id: 13,
    type: "pilot",
    eyebrow: "低门槛启动",
    title: "不改系统，先用 4 张表跑 7 天验证",
    subtitle: "先用客户自己的真实数据跑出经营诊断，再决定要不要进入接口和长期系统合作。",
    tables: ["门店销售日报", "菜品销售明细", "菜品成本卡", "评论样本"],
    days: ["字段映射", "经营诊断", "菜品四象限", "评论归因", "日报样稿", "任务跟踪", "试点复盘"],
  },
  {
    id: 14,
    type: "deliver",
    eyebrow: "合作交付",
    title: "试点交付的是经营诊断，不是演示截图",
    subtitle: "客户最容易被说服的不是功能列表，而是从自己门店数据里跑出来的真实问题和改进动作。",
    deliverables: ["数据质量评估", "门店异常清单", "菜品真实毛利", "评论整改任务", "AI 日报样稿", "3 个经营动作", "效果复盘", "系统接入建议"],
    focus: ["当天能看懂", "门店能执行", "老板能决策"],
  },
  {
    id: 15,
    type: "close",
    eyebrow: "下一步",
    title: "先拿真实数据验证，再决定是否长期合作",
    subtitle: "不一开始就谈大系统。先选 1-3 家门店，导出 4 张基础表，7 天跑出一版 AI 经营诊断。",
    actions: ["确认 1-3 家试点门店", "确认数据对接人", "导出 4 张基础表", "约定 7 天后复盘会"],
    highlight: "如果诊断结果老板不认可，就不进入长期合作。",
  },
];

const pptTakeaways = {
  cover: "老板买的不是 AI 功能，而是每天更早知道哪里在亏、谁该处理、结果有没有回来。",
  islands: "数据越分散，老板越依赖人的经验；知味要补上的，是每天稳定发生的经营判断。",
  compare: "知味不抢原系统的位置，它把原系统里的记录变成老板能直接用的决策线索。",
  loop: "AI 只有走到任务、验收和复盘，才会真正进入门店经营，而不是停在报表里。",
  case: "让客户相信的不是“AI 很聪明”，而是每个判断都能回到数据、证据和动作。",
  demo: "首页的价值不是展示指标，而是帮老板节省判断时间，直接进入今天最该处理的事。",
  alerts: "预警必须排序，否则只是另一堆消息；老板需要的是今天先抓哪几个关键问题。",
  report: "一份好日报，要让老板能决策、店长能执行、总部能第二天复盘。",
  profit: "餐饮利润藏在成本、佣金、包装和活动里，AI 要把这些隐形账一起算清楚。",
  review: "评论的价值不在于分类，而在于把差评变成门店可以执行、可以验收的整改动作。",
  delivery: "订单、活动、备货和损耗要放在一张经营账里看，老板才知道该加码还是该收手。",
  trust: "AI 越敢讲清证据和不确定项，老板越敢把它放进日常经营判断。",
  pilot: "先用 4 张表跑 7 天，让客户用自己的真实问题验证价值。",
  deliver: "试点要交付能推动决策的诊断材料，而不是只能演示的功能截图。",
  close: "先小范围验证，结果认可再谈长期合作，降低客户决策成本。",
};

const saasComparisonRows = [
  ["交易系统", "收银、点餐、支付、接单", "不做，也不替代"],
  ["经营报表", "告诉你发生了什么", "判断先处理什么"],
  ["数据范围", "单系统数据最强", "跨 POS、外卖、评论、成本、库存"],
  ["经营动作", "通常停在报表或待办", "直接生成任务、验收和复盘"],
];

const boundaryTriples = [
  ["已有系统", "负责记录", "POS、外卖、会员、供应链系统继续用。"],
  ["知味 AI", "负责判断", "跨系统找出吞利润的门店、菜品、活动和执行动作。"],
  ["门店团队", "负责执行", "店长、督导、后厨按任务做，系统自动复盘结果。"],
];

const dataSources = [
  ["POS / 收银", "门店、时段、实收、订单、客单"],
  ["外卖平台", "曝光、活动、佣金、骑手等待、退款"],
  ["评论口碑", "差评原文、标签、平台、菜品、时段"],
  ["菜品成本卡", "标准用量、目标毛利、原料成本"],
  ["库存 / 净菜", "库存、领料、报损、配送计划"],
  ["巡店 / SOP", "照片、抽检、培训记录、整改证据"],
];

const aiPipelineSteps = [
  ["清洗口径", "统一门店、菜名、时段、渠道和活动口径"],
  ["识别事件", "发现异常门店、低利菜、差评聚集和备货偏差"],
  ["解释原因", "关联销售、评论、成本、库存和执行证据"],
  ["生成动作", "输出负责人、截止时间、验收标准和复盘时间"],
];

const aiOutputs = [
  ["经营事件", "今日必须处理 3 件，其他进入本周观察"],
  ["证据链", "每个判断都能查看来源、对比和缺失数据"],
  ["任务队列", "店长、督导、后厨、运营各自收到动作"],
  ["效果复盘", "看订单、毛利、差评、报损是否真的改善"],
];

const pilotFitItems = [
  "3 家以上门店，已有 POS 或外卖订单数据",
  "能提供菜品明细、成本卡或评论样本",
  "有店长、督导或总部运营负责执行",
  "愿意先用真实数据验证，不急着替换现有系统",
];

const reviewEffectRows = [
  ["滨江午市套餐", "订单 +13.5%", "有效，继续试跑 3 天"],
  ["湖滨打包 SOP", "漏汤差评 7 到 2", "有效，推广到外卖高占比店"],
  ["小炒黄牛肉核查", "成本率 58.8% 到 55.2%", "有改善，继续看称重记录"],
  ["青椒备货调整", "报损减少 116 元", "有效，纳入净菜计划"],
];

const ownerMap = {
  1: "滨江宝龙店店长",
  2: "湖滨银泰店店长 + 晚班组长",
  3: "王厨长 + 区域督导",
  4: "外卖运营",
  5: "供应链计划",
};

const issues = [
  {
    id: 1,
    title: "滨江宝龙店午市明显下滑",
    severity: "高",
    severityClass: "high",
    type: "营收异常",
    store: "滨江宝龙店",
    image: null,
    priority: "今日必须处理",
    evidence: [
      "午市实收 8,842 元，较近 4 个周四均值 -18.6%",
      "堂食订单基本持平，外卖工作餐曝光 -23%",
      "11:30-12:30 订单缺口 52 单",
    ],
    sources: ["POS 销售", "外卖曝光", "同商圈对比"],
    impact: "预计营收修复空间 800-1200 元/日",
    metric: "营收 -18.6%",
    aiJudgment: "不是全店下滑，问题集中在午市外卖工作餐，高峰时段仍有当天修复空间。",
    reason: "25-35 元工作餐曝光下降，堂食翻台没有明显异常，不建议临时增加堂食人手。",
    action: "将 29.9 元工作餐调整到外卖午市推荐位，并检查 11:00 前备餐完成情况。",
    amountBasis: "近 4 周周四午市均值 236 单，昨日 184 单，缺口 52 单；按客单价 28.6 元、恢复 60%-80% 估算。",
    compare: "对比：近 4 个周四午市均值",
    task: "滨江宝龙店午市订单修复",
    taskDetails: {
      owner: ownerMap[1],
      due: "今日 10:50",
      action: "调整 29.9 元工作餐排序，11:00 前完成备餐检查",
      acceptance: "11:00-13:00 外卖套餐曝光恢复至昨日 90%，午市订单较昨日 +10%",
      review: "今日 13:30 自动复盘",
      status: "待确认",
    },
  },
  {
    id: 2,
    title: "湖滨银泰店漏汤差评反复",
    severity: "高",
    severityClass: "high",
    type: "评论异常",
    store: "湖滨银泰店",
    image: "/assets/soup-bowl.png",
    priority: "今日必须处理",
    evidence: [
      "近 3 天漏汤 / 包装湿相关差评 7 条",
      "18:00-19:30 外卖高峰占 6 条",
      "萝卜排骨汤和双人套餐关联度最高",
    ],
    sources: ["美团评论", "外卖订单", "封包抽检"],
    impact: "预计口碑修复空间 600-1000 元/日",
    metric: "差评 7 条",
    aiJudgment: "问题不是口味，而是高峰期封包和出餐交接 SOP 变形。",
    reason: "当班封包照片缺失，骑手等待超过 12 分钟订单占比上升，漏汤差评集中在晚高峰。",
    action: "晚高峰汤品全部双层袋，封包台拍照留证，抽检 20 单。",
    amountBasis: "按近 30 日差评后复购下降、汤品套餐客单价和同类门店评分变化估算。",
    compare: "对比：同类门店近 30 日漏汤标签均值",
    task: "湖滨银泰店打包 SOP 复训",
    taskDetails: {
      owner: ownerMap[2],
      due: "今日 18:00",
      action: "晚高峰汤品双层袋，封包台上传 3 张照片，抽检 20 单",
      acceptance: "未来 3 日漏汤差评不超过 2 条，骑手等待超 12 分钟占比下降",
      review: "3 天后自动复查",
      status: "进行中",
    },
  },
  {
    id: 3,
    title: "小炒黄牛肉毛利异常",
    severity: "中",
    severityClass: "medium",
    type: "毛利异常",
    store: "9 家门店",
    image: "/assets/beef-pepper.png",
    priority: "今日必须处理",
    evidence: [
      "真实毛利 9.1 元，目标毛利 12.9 元，低于目标 3.8 元",
      "黄牛肉净菜出成率 86%，低于标准 6pp",
      "5 家门店晚高峰称重记录缺失",
    ],
    sources: ["菜品销售", "成本卡", "净菜领料"],
    impact: "预计毛利改善空间 1200-1800 元/日",
    metric: "成本率 +6.9pp",
    aiJudgment: "不是卖得不好，而是卖得越多，毛利越容易被成本和活动吃掉。",
    reason: "销量未下降但成本率上升，更可能来自净菜出成率和门店克重执行，不建议先下架或涨价。",
    action: "保留招牌定位，暂停深度满减，异常门店上传晚高峰 10 份出品称重照片。",
    amountBasis: "按近 7 日销量 327 份、单份低于目标 3.8 元、异常门店恢复 60%-80% 估算。",
    compare: "对比：目标毛利率 34% 与近 7 日实际",
    task: "小炒黄牛肉成本核查",
    taskDetails: {
      owner: ownerMap[3],
      due: "今日 21:00",
      action: "复核采购价、出成率和出品克重，暂停外卖大额满减",
      acceptance: "异常门店上传称重照片，次日成本率回落 3pp 以上",
      review: "明日 12:00 自动复盘",
      status: "待派发",
    },
  },
  {
    id: 4,
    title: "外卖套餐越卖越低利",
    severity: "中",
    severityClass: "medium",
    type: "外卖异常",
    store: "美团 / 饿了么",
    image: null,
    priority: "本周建议处理",
    evidence: [
      "活动后单均真实毛利 9.7 元",
      "满减、红包、佣金合计吃掉 17.8 元",
      "近 7 天低毛利套餐占比升至 63%",
    ],
    sources: ["外卖结算", "活动规则", "菜品成本"],
    impact: "预计毛利改善空间 900-1400 元/日",
    metric: "毛利率 21.6%",
    aiJudgment: "订单量增加不等于赚钱，当前活动应先控补贴而不是继续加投流。",
    reason: "满 45 减 8 叠加商家红包、平台佣金、包装成本后，招牌双拼套餐真实毛利低于目标。",
    action: "满减试降 2 元，保留曝光，改推辣椒炒肉 + 外婆菜炒蛋组合。",
    amountBasis: "按近 7 日低毛利套餐 442 单、单均毛利差 3.1 元、活动试降影响估算。",
    compare: "对比：活动前毛利与当前活动后毛利",
    task: "外卖满减活动毛利优化",
    taskDetails: {
      owner: ownerMap[4],
      due: "周五 18:00",
      action: "试跑满 45 减 6，替换一个高毛利配菜组合",
      acceptance: "订单量下降不超过 3%，单均真实毛利提升 3 元以上",
      review: "试跑 3 天后复盘",
      status: "待确认",
    },
  },
  {
    id: 5,
    title: "明日青椒预计多备 8kg",
    severity: "低",
    severityClass: "low",
    type: "备货异常",
    store: "7 家门店",
    image: "/assets/green-peppers.png",
    priority: "观察即可",
    evidence: [
      "预测需求 42kg，当前库存 + 已订货 50kg",
      "小炒黄牛肉套餐曝光下调，青椒用量同步下降",
      "若不调整预计报损 160 元",
    ],
    sources: ["净菜计划", "销量预测", "库存"],
    impact: "预计节省 120-200 元/日",
    metric: "多备 8kg",
    aiJudgment: "备货计划没有同步外卖活动调整，属于可提前避免的小额报损。",
    reason: "近 4 周周四销量、当前库存、明日天气和外卖套餐曝光下调后，青椒需求低于采购计划。",
    action: "青椒采购下调 8kg，优先调给晚市销量高门店，黄牛肉保留 3kg 安全库存。",
    amountBasis: "按青椒预估多备 8kg、历史净菜损耗率和采购单价估算。",
    compare: "对比：近 4 周同星期销量 + 明日预测",
    task: "明日净菜配送量微调",
    taskDetails: {
      owner: ownerMap[5],
      due: "今日 17:00",
      action: "下调青椒采购 8kg，检查黄牛肉安全库存",
      acceptance: "明日青椒报损不超过 2kg，黄牛肉不断货",
      review: "明日晚市后复盘",
      status: "观察",
    },
  },
];

const stores = [
  { name: "滨江宝龙店", sales: 8842, change: -18.6, rank: 5, trend: "down" },
  { name: "湖滨银泰店", sales: 12351, change: -9.3, rank: 3, trend: "down" },
  { name: "武林旗舰店", sales: 16782, change: 2.1, rank: 1, trend: "up" },
  { name: "城西银泰店", sales: 11209, change: -3.6, rank: 2, trend: "down" },
  { name: "西溪印象城店", sales: 9654, change: 1.2, rank: 4, trend: "up" },
];

const tasksSeed = [
  {
    title: "湖滨银泰店漏汤整改",
    owner: "李主管",
    due: "今日 18:00",
    status: "进行中",
    priority: "高",
    acceptance: "3 日内漏汤差评不超过 2 条",
  },
  {
    title: "小炒黄牛肉成本核查",
    owner: "王厨长",
    due: "今日 21:00",
    status: "待上传证据",
    priority: "高",
    acceptance: "异常门店上传 10 份称重照片",
  },
  {
    title: "外卖满减活动优化",
    owner: "外卖运营",
    due: "周五 18:00",
    status: "待确认",
    priority: "中",
    acceptance: "单均真实毛利提升 3 元以上",
  },
];

const salesSeries = [2, 4, 7, 11, 18, 28, 36, 52, 84, 118, 162, 208, 256];
const baselineSeries = [3, 5, 9, 14, 26, 42, 68, 108, 164, 236, 292, 316, 322];

function formatNumber(value) {
  return value.toLocaleString("zh-CN");
}

function imageAlt(issue) {
  if (issue.type === "评论异常") return "外卖汤品包装";
  if (issue.type === "毛利异常") return "小炒黄牛肉菜品";
  if (issue.type === "备货异常") return "青椒净菜";
  return "";
}

function trustForIssue(issue) {
  const trustMap = {
    营收异常: ["86%", "POS + 外卖 + 同星期历史数据", "暂未接入实时排班"],
    评论异常: ["91%", "评论原文 + 外卖订单 + 封包抽检", "封包照片不完整"],
    毛利异常: ["82%", "菜品销售 + 成本卡 + 净菜领料", "实际报损仍需试点补充"],
    外卖异常: ["88%", "外卖结算 + 活动规则 + 菜品成本", "竞品活动为间接推测"],
    备货异常: ["79%", "销量预测 + 库存 + 净菜计划", "天气和临时团餐未完全接入"],
  };
  return trustMap[issue.type] || ["80%", "多源经营数据", "部分字段待校准"];
}

function CanvasLineChart({ primary = salesSeries, secondary = baselineSeries, compact = false }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, rect.width, rect.height);

    const pad = compact ? 8 : 28;
    const all = [...primary, ...secondary];
    const max = Math.max(...all) * 1.12;
    const min = Math.min(...all) * 0.4;
    const w = rect.width - pad * 2;
    const h = rect.height - pad * 2;

    if (!compact) {
      ctx.strokeStyle = "#ece6de";
      ctx.lineWidth = 1;
      for (let i = 0; i < 5; i += 1) {
        const y = pad + (h / 4) * i;
        ctx.beginPath();
        ctx.moveTo(pad, y);
        ctx.lineTo(rect.width - pad, y);
        ctx.stroke();
      }
    }

    const draw = (data, color, width, dash = []) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.setLineDash(dash);
      ctx.beginPath();
      data.forEach((point, index) => {
        const x = pad + (w / (data.length - 1)) * index;
        const y = pad + h - ((point - min) / (max - min)) * h;
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.setLineDash([]);
    };

    draw(secondary, "#aeb4bd", compact ? 1.6 : 2, [5, 5]);
    draw(primary, "#f36a18", compact ? 2 : 3);
  }, [primary, secondary, compact]);

  return <canvas className={compact ? "mini-chart" : "line-chart"} ref={canvasRef} />;
}

function DataSourceChips({ items }) {
  return (
    <div className="source-chips">
      {items.map((item) => <span key={item}>{item}</span>)}
    </div>
  );
}

function TaskSpec({ task }) {
  return (
    <div className="task-spec">
      <div><span>负责人</span><strong>{task.owner}</strong></div>
      <div><span>截止</span><strong>{task.due}</strong></div>
      <div><span>动作</span><strong>{task.action}</strong></div>
      <div><span>验收</span><strong>{task.acceptance}</strong></div>
      <div><span>复盘</span><strong>{task.review}</strong></div>
    </div>
  );
}

function Sidebar({ activePage, setActivePage }) {
  const [demoOpen, setDemoOpen] = useState(true);
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark"><i className="ri-leaf-line" /></div>
        <div>
          <strong>知味 · 餐饮连锁</strong>
          <span>AI 经营参谋</span>
        </div>
      </div>
      <nav className="nav-list">
        <div className="nav-section">
          <button className="nav-section-toggle" type="button" onClick={() => setDemoOpen((value) => !value)}>
            <span><i className="ri-layout-grid-line" /> 产品 Demo</span>
            <i className={demoOpen ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"} />
          </button>
          {demoOpen ? (
            <div className="nav-section-items">
              {demoNavItems.map((item) => (
                <button
                  type="button"
                  className={`nav-item ${activePage === item.id ? "active" : ""}`}
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  title={item.subtitle}
                >
                  <i className={item.icon} />
                  <span>{item.label}</span>
                  {item.badge ? <em>{item.badge}</em> : null}
                </button>
              ))}
            </div>
          ) : null}
        </div>
        <div className="nav-section ppt-nav-section">
          <button
            type="button"
            className={`nav-item ppt-nav-item ${activePage === "presentation" ? "active" : ""}`}
            onClick={() => setActivePage("presentation")}
            title="15 页客户拜访 PPT"
          >
            <i className="ri-slideshow-3-line" />
            <span>介绍 PPT</span>
            <em>15</em>
          </button>
          <p>Demo 后用于推进客户试点合作</p>
        </div>
      </nav>
      <div className="sidebar-footer">
        <button className="ghost-button" type="button"><i className="ri-robot-2-line" /> AI 助理</button>
        <div className="operator">
          <div className="avatar">张</div>
          <div>
            <strong>张总</strong>
            <span>总部运营</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

function Topbar({ onGenerate, generating, activePage }) {
  if (activePage === "presentation") {
    return (
      <header className="topbar presentation-topbar">
        <div className="select-like"><i className="ri-slideshow-3-line" /> 介绍 PPT</div>
        <div className="topbar-controls">
          <div className="select-like">客户拜访版 · 15 页</div>
          <div className="select-like">建议：Demo 后讲 10-12 分钟</div>
          <div className="select-like">定位：AI 经营参谋层</div>
        </div>
        <div className="topbar-user">
          <div className="user-mini"><div className="avatar dark">PPT</div><span>商务演示</span></div>
        </div>
      </header>
    );
  }

  return (
    <header className="topbar">
      <div className="select-like">湘味小炒连锁 <i className="ri-arrow-down-s-line" /></div>
      <div className="topbar-controls">
        <div className="select-like"><i className="ri-calendar-line" /> 2026-07-09 周四</div>
        <div className="select-like">对比：近 4 周同星期均值</div>
        <div className="select-like">天气：小雨 / 商圈无活动</div>
        <div className="segmented">
          <button className="active" type="button">老板视角</button>
          <button type="button">运营视角</button>
          <button type="button">店长视角</button>
        </div>
        <button className={`primary-action ${generating ? "loading" : ""}`} onClick={onGenerate} type="button">
          <i className="ri-sparkling-2-line" />
          {generating ? "AI 分析中" : "生成 AI 经营日报"}
        </button>
      </div>
      <div className="topbar-user">
        <button className="icon-button" type="button"><i className="ri-notification-3-line" /><span>12</span></button>
        <div className="user-mini"><div className="avatar dark">张</div><span>张总</span></div>
      </div>
    </header>
  );
}

function IssueCard({ issue, active, onSelect }) {
  const [trust] = trustForIssue(issue);
  return (
    <button type="button" className={`issue-card ${active ? "active" : ""}`} onClick={() => onSelect(issue)}>
      <div className="issue-index severity-bg">{issue.id}</div>
      {issue.image ? <img src={issue.image} alt={imageAlt(issue)} className="issue-thumb" /> : null}
      <div className="issue-content">
        <div className="issue-heading">
          <strong>{issue.title}</strong>
          <span className={`severity ${issue.severityClass}`}>{issue.severity}</span>
        </div>
        <p className="ai-line">AI 判断：{issue.aiJudgment}</p>
        <p>{issue.evidence[0]}</p>
        <div className="issue-tags">
          <span>{issue.priority}</span>
          <span>{issue.type}</span>
          <span>{issue.metric}</span>
          <span>可信度 {trust}</span>
        </div>
        <b>{issue.impact}</b>
      </div>
      <i className="ri-arrow-right-s-line issue-arrow" />
    </button>
  );
}

function MetricStrip() {
  const metrics = [
    { label: "今日实收", value: "256,420", change: "-6.8%" },
    { label: "午市订单缺口", value: "52", change: "滨江宝龙店" },
    { label: "待确认建议", value: "5", change: "3 项今日处理" },
    { label: "已改善问题", value: "2", change: "近 7 天" },
  ];

  return (
    <div className="metric-strip">
      {metrics.map((metric) => (
        <div key={metric.label}>
          <span>{metric.label}</span>
          <strong>{metric.value}</strong>
          <em>{metric.change}</em>
        </div>
      ))}
    </div>
  );
}

function StoreComparison() {
  return (
    <div className="surface store-table">
      <div className="section-title">
        <div>
          <h3>门店对比</h3>
          <p>今日午市 vs 近 4 个周四均值</p>
        </div>
        <button className="mini-button" type="button">指标：实收金额</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>排名</th>
            <th>门店</th>
            <th>实收金额</th>
            <th>差异</th>
            <th>同商圈排名</th>
          </tr>
        </thead>
        <tbody>
          {stores.map((store, index) => (
            <tr key={store.name}>
              <td>{index + 1}</td>
              <td>{store.name}</td>
              <td>{formatNumber(store.sales)}</td>
              <td className={store.change < 0 ? "negative" : "positive"}>{store.change > 0 ? "+" : ""}{store.change}%</td>
              <td>{store.rank}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function WordCloud() {
  return (
    <div className="surface word-cloud">
      <div className="section-title compact">
        <h3>当前问题相关评论</h3>
        <button className="link-button" type="button">查看原文</button>
      </div>
      <div className="cloud">
        <span className="xl red">漏汤</span>
        <span className="lg">包装湿</span>
        <span>等太久</span>
        <span className="green">味道可以</span>
        <span>骑手等待</span>
        <span className="orange">晚高峰</span>
        <span>封包照片缺失</span>
        <span>汤品双人套餐</span>
      </div>
    </div>
  );
}

function CurrentIssueEvidence({ issue, onOpenEvidence }) {
  return (
    <div className="surface current-evidence">
      <div className="section-title">
        <div>
          <h3>当前分析：{issue.title}</h3>
          <p>{issue.compare}</p>
        </div>
        <div className="button-row">
          <span className={`severity ${issue.severityClass}`}>{issue.severity}</span>
          <button className="secondary-action small" type="button" onClick={() => onOpenEvidence(issue)}>查看证据链</button>
        </div>
      </div>
      <div className="evidence-grid">
        {issue.evidence.map((item) => (
          <div key={item}>
            <span>关键证据</span>
            <strong>{item}</strong>
          </div>
        ))}
      </div>
      <DataSourceChips items={issue.sources} />
    </div>
  );
}

function AdvisorPanel({ selectedIssue, onCreateTask, taskCreated, onOpenEvidence }) {
  const [trust, source, gap] = trustForIssue(selectedIssue);
  return (
    <aside className="advisor-panel">
      <div className="advisor-head">
        <div>
          <span className="advisor-step">第四步：派任务</span>
          <h2>AI 经营参谋</h2>
          <span>{selectedIssue.priority}</span>
        </div>
        <i className="ri-sparkling-2-fill" />
      </div>
      <div className="advisor-card alert">
        <div className="advisor-issue-title">
          <span>{selectedIssue.id}</span>
          <strong>{selectedIssue.title}</strong>
          <em className={`severity ${selectedIssue.severityClass}`}>{selectedIssue.severity}</em>
        </div>
        <section>
          <h4>AI 判断</h4>
          <p>{selectedIssue.aiJudgment}</p>
        </section>
        <section>
          <h4>关键证据</h4>
          <ul>
            {selectedIssue.evidence.map((item) => <li key={item}>{item}</li>)}
            <li>{selectedIssue.reason}</li>
          </ul>
          <DataSourceChips items={selectedIssue.sources} />
        </section>
        <section className="action-box">
          <h4>建议任务</h4>
          <TaskSpec task={selectedIssue.taskDetails} />
        </section>
        <section>
          <h4>测算口径</h4>
          <p>{selectedIssue.amountBasis}</p>
        </section>
        <section>
          <h4>可信度</h4>
          <div className="mini-trust">
            <strong>{trust}</strong>
            <span>{source}</span>
            <em>缺失：{gap}</em>
          </div>
        </section>
        <section>
          <h4>预计影响</h4>
          <div className="impact-grid">
            <div><i className="ri-money-cny-circle-line" /><strong>{selectedIssue.impact.replace("预计", "")}</strong><span>经营改善</span></div>
            <div><i className="ri-check-double-line" /><strong>{selectedIssue.taskDetails.acceptance.split("，")[0]}</strong><span>验收指标</span></div>
            <div><i className="ri-timer-line" /><strong>{selectedIssue.taskDetails.review}</strong><span>复盘时间</span></div>
          </div>
        </section>
        <div className="advisor-actions">
          <button className="primary-action full" type="button" onClick={() => onCreateTask(selectedIssue)}>
            {taskCreated ? "已生成任务" : `生成任务（${selectedIssue.id}）`}
          </button>
          <button className="secondary-action" type="button" onClick={() => onOpenEvidence(selectedIssue)}>查看证据链</button>
        </div>
      </div>
      <div className="saas-diff-card">
        <strong>传统 SaaS 告诉你：{selectedIssue.metric}</strong>
        <p>知味 AI 告诉你：{selectedIssue.aiJudgment}并给出任务、验收和复盘时间。</p>
      </div>
      <p className="panel-note"><i className="ri-information-line" /> 当前结论用于经营诊断和优先级排序，不替代财务核算。</p>
    </aside>
  );
}

function SaasBoundaryPage() {
  return (
    <div className="boundary-page">
      <section className="surface boundary-compact-hero">
        <div>
          <span className="page-kicker">产品边界</span>
          <h1>不替换收银系统，只补上“经营判断层”</h1>
          <p>传统 SaaS 把数据记下来；知味把分散数据变成今天该处理的经营动作。</p>
        </div>
        <div className="boundary-answer">
          <span>老板常问</span>
          <strong>我已经有美团、客如云、收银系统了，为什么还要知味？</strong>
          <p>因为这些系统告诉你数据，知味告诉你：先管哪件事、为什么、谁去做、做到什么算有效。</p>
        </div>
      </section>

      <section className="boundary-triples">
        {boundaryTriples.map(([title, verb, text]) => (
          <div className="surface boundary-step" key={title}>
            <span>{title}</span>
            <strong>{verb}</strong>
            <p>{text}</p>
          </div>
        ))}
      </section>

      <section className="surface boundary-panel compact">
        <div className="section-title">
          <div>
            <h3>一句话对比</h3>
            <p>不讲概念，直接讲边界。</p>
          </div>
          <span className="trust high">不抢交易入口</span>
        </div>
        <div className="boundary-compare-simple">
          {saasComparisonRows.map(([dimension, saas, ai]) => (
            <div key={dimension}>
              <span>{dimension}</span>
              <p><b>餐饮 SaaS：</b>{saas}</p>
              <p><b>知味 AI：</b>{ai}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="surface boundary-decision">
        <h3>这页要让客户记住的只有三句话</h3>
        <div>
          <strong>原系统不用换</strong>
          <strong>先用 4 张表跑 7 天</strong>
          <strong>用真实问题决定是否买单</strong>
        </div>
      </section>
    </div>
  );
}

function DataFlowPage() {
  return (
    <div className="flow-page">
      <div className="page-heading wide-heading">
        <span className="page-kicker">多源数据加工</span>
        <h1>从分散数据到每日经营动作</h1>
        <p>把 POS、外卖、评论、成本、库存和 SOP 记录汇入同一个 AI 加工流，输出老板能判断、店长能执行、总部能复盘的结果。</p>
      </div>

      <section className="surface flow-stage sources">
        <div className="section-title">
          <div>
            <h3>1. 数据源进入</h3>
            <p>先接客户已有系统导出的数据，不要求一开始开发接口。</p>
          </div>
          <span className="trust high">4 张表可启动</span>
        </div>
        <div className="source-node-grid">
          {dataSources.map(([title, text], index) => (
            <div className="flow-source-node" style={{ animationDelay: `${index * 0.12}s` }} key={title}>
              <i className={["ri-store-2-line", "ri-motorbike-line", "ri-message-3-line", "ri-restaurant-2-line", "ri-box-3-line", "ri-clipboard-line"][index]} />
              <strong>{title}</strong>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="surface ai-engine-stage">
        <div className="engine-orbit">
          <div className="engine-core">
            <i className="ri-sparkling-2-fill" />
            <strong>知味 AI 引擎</strong>
            <span>统一口径 · 归因 · 算账 · 派任务</span>
          </div>
          <span className="orbit-dot dot-a" />
          <span className="orbit-dot dot-b" />
          <span className="orbit-dot dot-c" />
        </div>
        <div className="pipeline-steps">
          {aiPipelineSteps.map(([title, text], index) => (
            <div className="pipeline-step" key={title}>
              <span>{index + 1}</span>
              <strong>{title}</strong>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="surface flow-stage outputs">
        <div className="section-title">
          <div>
            <h3>3. 经营产出</h3>
            <p>不是生成一堆图表，而是形成可以推进门店的动作。</p>
          </div>
          <span className="trust medium">按影响排序</span>
        </div>
        <div className="output-card-grid">
          {aiOutputs.map(([title, text], index) => (
            <div className="flow-output-card" style={{ animationDelay: `${0.15 + index * 0.12}s` }} key={title}>
              <strong>{title}</strong>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="flow-line one" />
      <div className="flow-line two" />
    </div>
  );
}

function EvidenceDrawer({ issue, onClose, onCreateTask }) {
  if (!issue) return null;
  const [trust, source, gap] = trustForIssue(issue);
  const reasoning = [
    `先确认异常是否显著：${issue.evidence[0]}。`,
    `再判断是否全局问题：${issue.reason}`,
    `再看证据来源：${issue.sources.join("、")} 已能支撑经营判断。`,
    `最后转成动作：${issue.action}`,
  ];

  return (
    <div className="drawer-backdrop" role="presentation" onMouseDown={onClose}>
      <aside className="evidence-drawer" role="dialog" aria-modal="true" aria-label="AI 证据链" onMouseDown={(event) => event.stopPropagation()}>
        <div className="drawer-head">
          <div>
            <span className="page-kicker">AI 证据链</span>
            <h2>{issue.title}</h2>
            <p>{issue.compare} · {issue.store}</p>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="关闭证据链"><i className="ri-close-line" /></button>
        </div>

        <section className="drawer-section verdict">
          <h3>AI 结论</h3>
          <p>{issue.aiJudgment}</p>
          <div className="drawer-impact"><strong>{issue.impact}</strong><span>{issue.amountBasis}</span></div>
        </section>

        <section className="drawer-section">
          <h3>关键证据</h3>
          {issue.evidence.map((item) => (
            <div className="drawer-evidence-row" key={item}><i className="ri-focus-3-line" /><span>{item}</span></div>
          ))}
          <DataSourceChips items={issue.sources} />
        </section>

        <section className="drawer-section">
          <h3>推理过程</h3>
          <div className="drawer-steps">
            {reasoning.map((step, index) => (
              <div key={step}><span>{index + 1}</span><p>{step}</p></div>
            ))}
          </div>
        </section>

        <section className="drawer-section">
          <h3>可信度与缺失数据</h3>
          <div className="trust-grid">
            <div><strong>{trust}</strong><span>数据可信度</span></div>
            <div><strong>{source}</strong><span>已接入证据</span></div>
            <div><strong>{gap}</strong><span>仍需补充</span></div>
          </div>
        </section>

        <section className="drawer-section">
          <h3>建议任务</h3>
          <TaskSpec task={issue.taskDetails} />
          <button className="primary-action full" type="button" onClick={() => onCreateTask(issue)}>确认生成任务</button>
        </section>
      </aside>
    </div>
  );
}

function OverviewPage({ selectedIssue, setSelectedIssue, onCreateTask, taskCreated, onOpenEvidence }) {
  return (
    <div className="page-grid overview-grid">
      <section className="surface command-summary">
        <div>
          <span className="page-kicker">老板今日重点</span>
          <h1>AI 经营指挥台</h1>
          <p>先看今日总判断，再点开事件查看证据和任务。这里不是完整报表，而是老板早上要决定的三件事。</p>
        </div>
        <div className="command-kpis">
          <div><strong>3</strong><span>今日必须处理</span></div>
          <div><strong>2,900-4,200</strong><span>预计改善空间 / 日</span></div>
          <div><strong>5</strong><span>待确认任务</span></div>
        </div>
      </section>
      <section className="issue-column">
        <div className="page-heading">
          <span className="page-kicker">第一步：选事件</span>
          <h1>今日必须处理 <b>3</b> 件经营事件</h1>
          <p>按影响金额、可控性、证据完整度和复盘难度排序</p>
        </div>
        <div className="triage-strip">
          <div><strong>3</strong><span>今日必须处理</span></div>
          <div><strong>1</strong><span>本周建议处理</span></div>
          <div><strong>1</strong><span>观察即可</span></div>
        </div>
        <div className="issues-list">
          {issues.map((issue) => (
            <IssueCard
              issue={issue}
              key={issue.id}
              active={selectedIssue.id === issue.id}
              onSelect={setSelectedIssue}
            />
          ))}
        </div>
      </section>
      <section className="center-column">
        <div className="section-flow-label"><span>第二步：看证据</span><span>第三步：看趋势</span></div>
        <CurrentIssueEvidence issue={selectedIssue} onOpenEvidence={onOpenEvidence} />
        <div className="surface sales-overview">
          <div className="section-title">
            <div>
              <h3>今日经营摘要</h3>
              <p>全部门店，今日 vs 近 4 个周四均值</p>
            </div>
            <span className="freshness">更新 08:30</span>
          </div>
          <MetricStrip />
          <div className="chart-title"><span>实收金额趋势</span><em>今日 / 同星期均值</em></div>
          <CanvasLineChart />
        </div>
        <StoreComparison />
        <WordCloud />
      </section>
      <AdvisorPanel selectedIssue={selectedIssue} onCreateTask={onCreateTask} taskCreated={taskCreated} onOpenEvidence={onOpenEvidence} />
    </div>
  );
}

function AlertsPage({ selectedIssue, setSelectedIssue, onCreateTask, onOpenEvidence }) {
  const alertCats = [
    { rank: "01", group: "销售层", label: "营收异常", count: 8, impact: "近 7 日累计影响 18.7 万", highlight: "最严重：滨江宝龙店午市 -18.6%", icon: "ri-money-cny-circle-line", tone: "danger" },
    { rank: "02", group: "利润层", label: "毛利异常", count: 6, impact: "近 7 日累计影响 12.3 万", highlight: "重点：小炒黄牛肉成本率 +6.9pp", icon: "ri-pie-chart-line", tone: "warning" },
    { rank: "03", group: "口碑层", label: "评论异常", count: 12, impact: "待处理差评 23 条", highlight: "重点：湖滨银泰店漏汤 7 条", icon: "ri-message-3-line", tone: "blue" },
    { rank: "04", group: "渠道层", label: "外卖异常", count: 7, impact: "低毛利套餐占比 63%", highlight: "重点：满 45 减 8 后毛利承压", icon: "ri-motorbike-line", tone: "orange" },
    { rank: "05", group: "供应层", label: "备货异常", count: 5, impact: "预计报损风险 640 元", highlight: "重点：青椒预计多备 8kg", icon: "ri-box-3-line", tone: "green" },
    { rank: "06", group: "执行层", label: "人效异常", count: 4, impact: "晚市人效低于目标", highlight: "重点：未来科技城店 -22%", icon: "ri-team-line", tone: "neutral" },
  ];

  const scanSteps = [
    ["先排影响", "把营收、毛利、差评和报损统一折算成经营影响"],
    ["再查证据", "看 POS、外卖、评论、成本和备货是否互相印证"],
    ["最后派任务", "只把可当天处理、能验收的问题推给对应负责人"],
  ];

  const chain = [
    ["异常发现", selectedIssue.metric, selectedIssue.title],
    ["影响测算", selectedIssue.impact, "按历史同期、订单缺口、客单价或成本差估算"],
    ["证据定位", selectedIssue.sources.join(" + "), selectedIssue.evidence[0]],
    ["原因判断", selectedIssue.type, selectedIssue.reason],
    ["任务派发", selectedIssue.taskDetails.owner, selectedIssue.taskDetails.acceptance],
  ];

  return (
    <div className="page-stack">
      <div className="page-heading horizontal">
        <div>
          <span className="page-kicker">总部运营视角</span>
          <h1>AI 巡店预警中心</h1>
          <p>不是把六类数据并排展示，而是让 AI 按影响、证据和可执行性决定今天先处理什么。</p>
        </div>
        <button className="secondary-action" type="button">AI 推荐预警规则</button>
      </div>
      <div className="alert-scan-summary">
        {scanSteps.map(([title, text], index) => (
          <div className="surface scan-step" key={title}>
            <span>{index + 1}</span>
            <div>
              <strong>{title}</strong>
              <p>{text}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="alert-category-head">
        <div>
          <h3>今日预警按经营影响排序</h3>
          <p>先看红黄问题，再看口碑、渠道、供应和执行风险。</p>
        </div>
        <em>AI 已合并 6 类数据源</em>
      </div>
      <div className="alert-categories">
        {alertCats.map((cat) => (
          <div className={`surface alert-cat ${cat.tone}`} key={cat.label}>
            <div className="alert-cat-top">
              <span>{cat.rank}</span>
              <em>{cat.group}</em>
            </div>
            <i className={cat.icon} />
            <div className="alert-cat-main">
              <b>{cat.label}</b>
              <strong>{cat.count}<small>个预警</small></strong>
            </div>
            <p className="alert-impact">{cat.impact}</p>
            <p>{cat.highlight}</p>
          </div>
        ))}
      </div>
      <div className="rule-note">
        <i className="ri-magic-line" />
        <span>AI 已根据近 30 天数据推荐 6 条规则，例如午市营收低于近 4 周同星期均值 12% 触发预警，单菜成本率连续 3 天高于目标 5pp 触发预警。</span>
      </div>
      <div className="alert-layout">
        <section className="surface alert-list-panel">
          <span className="section-flow-label">第一步：选预警</span>
          <div className="tabs"><button className="active">按严重程度</button><button>按影响金额</button><button>未处理</button></div>
          {issues.map((issue) => (
            <button className={`alert-row ${selectedIssue.id === issue.id ? "active" : ""}`} key={issue.id} onClick={() => setSelectedIssue(issue)} type="button">
              <span className={`dot ${issue.severityClass}`} />
              <strong>{issue.title}</strong>
              <em>{issue.impact}</em>
              <b>{issue.severity}</b>
            </button>
          ))}
        </section>
        <section className="surface root-cause-panel">
          <span className="section-flow-label">第二步：看判断链</span>
          <div className="section-title">
            <div>
              <h3>{selectedIssue.title}</h3>
              <p>{selectedIssue.type} · {selectedIssue.store} · 预警时间 08:15 · {selectedIssue.compare}</p>
            </div>
            <div className="button-row">
              <button className="primary-action small" onClick={() => onCreateTask(selectedIssue)} type="button">生成整改任务</button>
              <button className="secondary-action small" type="button" onClick={() => onOpenEvidence(selectedIssue)}>查看证据链</button>
            </div>
          </div>
          <div className="root-chain compact-chain">
            {chain.map(([step, headline, content], index) => (
              <div className="chain-node" key={step}>
                <span>{index + 1}</span>
                <h4>{step}</h4>
                <strong>{headline}</strong>
                <p>{content}</p>
              </div>
            ))}
          </div>
          <TaskSpec task={selectedIssue.taskDetails} />
          <StoreComparison />
        </section>
        <section className="surface task-queue">
          <span className="section-flow-label">第三步：派任务</span>
          <h3>待办任务队列</h3>
          {tasksSeed.map((task) => <TaskCard task={task} key={task.title} />)}
        </section>
      </div>
    </div>
  );
}

function ReportPage({ generating, reportGenerated, onGenerate, onCreateTask }) {
  const actionStates = ["待确认", "已派发", "店长已确认", "已上传证据"];
  const reportEvidenceRows = [
    ["销售依据", "滨江宝龙午市", "-18.6%", "POS + 外卖曝光", "用于判断：不是全盘下滑，而是午市外卖工作餐掉量。"],
    ["口碑依据", "湖滨漏汤反复", "7 条", "评论标签 + 订单", "用于判断：问题不是口味，而是晚高峰打包 SOP 变形。"],
    ["毛利依据", "小炒黄牛肉", "-3.8 元", "成本卡 + 领料", "用于判断：招牌菜不用下架，先复核成本和克重。"],
    ["备货依据", "青椒多备风险", "160 元", "净菜计划 + 预测", "用于判断：外卖活动调整后，明日采购需要同步下调。"],
  ];
  return (
    <div className="report-layout">
      <section className="surface report-canvas">
        <div className="report-head">
          <div>
            <h1>AI 经营日报</h1>
            <p>先给老板看结论，再把支撑结论的数据放在同一张日报里，方便追问“为什么这么判断”。</p>
            <span className={generating ? "status-chip running" : "status-chip"}>{generating ? "正在生成" : reportGenerated ? "08:30 已生成" : "待生成"}</span>
          </div>
          <div className="button-row">
            <button className="secondary-action small" type="button"><i className="ri-file-copy-line" /> 复制店长群版</button>
            <button className="secondary-action small" type="button"><i className="ri-download-2-line" /> 导出 PDF</button>
            <button className="primary-action small" type="button" onClick={onGenerate}>重新生成日报</button>
          </div>
        </div>
        {generating ? (
          <div className="generation-state">
            <div className="scan-ring"><i className="ri-sparkling-2-line" /></div>
            <h2>AI 正在交叉校验 12 家门店数据</h2>
            <p>销售、菜品、评论、外卖结算和净菜计划正在生成同一份经营结论。</p>
            <div className="scan-steps"><span />销售数据<span />菜品毛利<span />评论标签<span />备货预测</div>
          </div>
        ) : (
          <div className="report-sections">
            <ReportSection title="老板版结论" className="report-summary-section">
              <p>昨日不是全盘下滑，问题集中在三件事：滨江宝龙店午市外卖工作餐掉量、湖滨银泰店汤品漏汤差评反复、小炒黄牛肉成本率异常上升。今天先处理这三件，其他问题暂不扩大。</p>
              <div className="evidence-chips"><span>滨江宝龙店午市 -18.6%</span><span>漏汤差评 7 条</span><span>小炒黄牛肉低于目标 3.8 元</span><span>青椒报损风险 160 元</span></div>
            </ReportSection>
            <ReportSection title="本日报引用的 4 组证据" className="report-evidence-section">
              <div className="report-evidence-grid">
                {reportEvidenceRows.map(([title, subject, value, source, usage]) => (
                  <div className="report-evidence-card" key={title}>
                    <div><span>{title}</span><em>{source}</em></div>
                    <strong>{value}</strong>
                    <b>{subject}</b>
                    <p>{usage}</p>
                  </div>
                ))}
              </div>
            </ReportSection>
            <ReportSection title="店长群版任务" className="report-half-section">
              <div className="group-message">
                <p>今日重点：</p>
                <p>1. 滨江宝龙店 10:50 前调整午市工作餐排序，13:30 前反馈午市订单。</p>
                <p>2. 湖滨银泰店晚高峰汤品全部双层袋，抽检 20 单并上传封包照片。</p>
                <p>3. 各店小炒黄牛肉按标准克重复核，晚班前上传称重照片。</p>
              </div>
            </ReportSection>
            <ReportSection title="督导版验收" className="report-half-section">
              <div className="ops-brief">
                <div><strong>滨江宝龙店</strong><span>13:30 查午市套餐曝光、订单和备餐照片</span></div>
                <div><strong>湖滨银泰店</strong><span>晚高峰抽检 20 单，封包台照片需留档</span></div>
                <div><strong>小炒黄牛肉</strong><span>异常门店上传 10 份称重照片，明日复核成本率</span></div>
              </div>
            </ReportSection>
            <ReportSection title="重点问题与证据" className="report-wide-section">
              {issues.slice(0, 3).map((issue) => (
                <div className="report-issue" key={issue.id}>
                  <span>{issue.id}</span>
                  <div>
                    <strong>{issue.title}</strong>
                    <p>{issue.aiJudgment}</p>
                  </div>
                  <em>{issue.type}</em>
                </div>
              ))}
            </ReportSection>
            <ReportSection title="菜品与毛利" className="report-half-section">
              <div className="dish-report-row">
                <img src="/assets/beef-pepper.png" alt="小炒黄牛肉" />
                <div><strong>小炒黄牛肉</strong><span>不下架，先复核成本</span></div>
                <b>327 份</b><b className="negative">真实毛利 9.1 元</b><b className="negative">目标差距 3.8 元</b>
              </div>
            </ReportSection>
            <ReportSection title="评论与整改" className="report-half-section">
              <div className="review-proof"><div className="avatar">客</div><p>汤洒了一半，饭盒外面都是油，味道其实可以，但送到办公室没法吃。</p><span>美团外卖 · 湖滨银泰店 · 18:42 · 老客第 4 单</span></div>
              <div className="ai-root"><i className="ri-lightbulb-flash-line" /> AI 判断：高峰打包 SOP 变形，不是口味问题。任务已绑定封包照片、抽检 20 单和 3 天复盘。</div>
            </ReportSection>
            <ReportSection title="近 7 天 AI 建议效果复盘" className="report-wide-section">
              <div className="effect-table">
                {reviewEffectRows.map(([suggestion, result, verdict]) => (
                  <div key={suggestion}>
                    <strong>{suggestion}</strong>
                    <span>{result}</span>
                    <p>{verdict}</p>
                  </div>
                ))}
              </div>
            </ReportSection>
          </div>
        )}
      </section>
      <aside className="surface action-list">
        <h3>今日行动清单</h3>
        {issues.slice(0, 4).map((issue, index) => (
          <div className="action-task" key={issue.id}>
            <div><span>{issue.id}</span><strong>{issue.task}</strong><em className={`severity ${issue.severityClass}`}>{issue.severity}</em></div>
            <p>负责人：{issue.taskDetails.owner}</p>
            <p>验收：{issue.taskDetails.acceptance}</p>
            <em className="task-state">{actionStates[index]}</em>
            <button className="outline-action" onClick={() => onCreateTask(issue)} type="button">{index === 0 ? "确认派发" : "查看任务"}</button>
          </div>
        ))}
        <div className="review-results">
          <h4>近 7 天 AI 建议效果复盘</h4>
          <div><strong>+13.5%</strong><span>午市订单</span></div>
          <div><strong>7 到 2</strong><span>漏汤差评</span></div>
          <div><strong>-116 元</strong><span>报损金额</span></div>
          <div><strong>+3pp</strong><span>外卖毛利率</span></div>
        </div>
      </aside>
    </div>
  );
}

function ReportSection({ title, children, className = "" }) {
  return (
    <section className={`report-section ${className}`}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function DishesPage() {
  const [selectedDish, setSelectedDish] = useState("小炒黄牛肉");
  const dishes = [
    {
      name: "小炒黄牛肉",
      type: "高销量毛利承压",
      tone: "danger",
      sales: "327 份",
      price: "38.0 元",
      foodCost: "-16.5 元",
      commission: "-7.8 元",
      packageCost: "-1.2 元",
      subsidy: "-3.4 元",
      waste: "-0.8 元",
      netProfit: "9.1 元",
      margin: "23.9%",
      target: "34.0%",
      gap: "-3.8 元/份",
      action: "暂停深度满减，复核出成率",
      reason: "销量高，但成本、佣金和活动补贴叠加后拖低毛利。",
    },
    {
      name: "酸辣土豆丝",
      type: "引流菜",
      tone: "warning",
      sales: "286 份",
      price: "16.0 元",
      foodCost: "-4.3 元",
      commission: "-3.2 元",
      packageCost: "-0.8 元",
      subsidy: "-2.5 元",
      waste: "-0.2 元",
      netProfit: "5.0 元",
      margin: "32.5%",
      target: "36.0%",
      gap: "-0.6 元/份",
      action: "保留引流，不单独投流",
      reason: "点单多但客单低，适合搭配套餐，不适合继续加补贴。",
    },
    {
      name: "招牌辣椒炒肉",
      type: "明星菜",
      tone: "good",
      sales: "241 份",
      price: "36.0 元",
      foodCost: "-10.8 元",
      commission: "-6.9 元",
      packageCost: "-1.1 元",
      subsidy: "-1.8 元",
      waste: "-0.4 元",
      netProfit: "15.0 元",
      margin: "56.8%",
      target: "45.0%",
      gap: "+4.2 元/份",
      action: "继续主推，做套餐核心菜",
      reason: "销量稳定且毛利健康，是当前更适合承接流量的主菜。",
    },
    {
      name: "农家一碗香",
      type: "利润菜",
      tone: "good",
      sales: "118 份",
      price: "32.0 元",
      foodCost: "-8.4 元",
      commission: "-5.8 元",
      packageCost: "-1.0 元",
      subsidy: "-1.2 元",
      waste: "-0.3 元",
      netProfit: "15.3 元",
      margin: "61.4%",
      target: "45.0%",
      gap: "+3.9 元/份",
      action: "加入双人套餐，提高曝光",
      reason: "毛利好但销量偏低，可以用套餐位提升点单。",
    },
    {
      name: "外婆菜炒蛋",
      type: "利润菜",
      tone: "stable",
      sales: "156 份",
      price: "26.0 元",
      foodCost: "-7.2 元",
      commission: "-4.9 元",
      packageCost: "-0.9 元",
      subsidy: "-1.1 元",
      waste: "-0.3 元",
      netProfit: "11.6 元",
      margin: "52.1%",
      target: "42.0%",
      gap: "+2.6 元/份",
      action: "午市套餐搭配",
      reason: "毛利稳定，适合和高流量菜搭配抬高套餐毛利。",
    },
  ];
  const selectedDishData = dishes.find((dish) => dish.name === selectedDish) || dishes[0];
  const costChecks = [
    ["黄牛肉净菜克重", "120g", "132g", "+10%"],
    ["出成率", "92%", "86%", "-6pp"],
    ["青椒配比", "80g", "76g", "正常"],
    ["门店称重记录", "每日 2 次", "5 店缺失", "风险"],
  ];
  const strategies = [
    ["保留", "小炒黄牛肉仍是招牌菜，不下架，先控制活动和成本。"],
    ["暂停", "暂停外卖大额满减主推，保留堂食招牌位。"],
    ["复核", "异常门店上传晚高峰 10 份出品称重照片。"],
    ["替代", "午市主推辣椒炒肉 + 外婆菜炒蛋组合，提高套餐毛利。"],
  ];
  const dishStrategyRows = [
    ["小炒黄牛肉", "高销量毛利承压", "成本率高于目标", "暂停深度满减，复核出成率", "毛利 +3-5pp"],
    ["招牌辣椒炒肉", "明星菜", "表现稳定", "继续作为主推套餐核心菜", "保持销量"],
    ["农家一碗香", "利润菜", "毛利高但曝光不足", "加入双人套餐搭配", "销量 +8%-12%"],
    ["酸辣土豆丝", "引流菜", "毛利低但点单高", "保留引流，不单独投流", "控制亏损"],
    ["汤品套餐", "口碑风险菜", "漏汤差评关联", "检查包材与打包 SOP", "差评下降"],
  ];

  return (
    <div className="dishes-layout">
      <div className="page-heading wide-heading">
        <span className="page-kicker">真实毛利审计</span>
        <h1>菜品真实毛利审计</h1>
        <p>把售价、食材成本、外卖佣金、满减补贴、包装成本和损耗放在一起，判断哪些菜正在吞利润</p>
      </div>
      <section className="surface dish-rank-panel">
        <div className="section-title">
          <div>
            <h3>菜品毛利榜</h3>
            <p>按“销量、真实毛利、目标差距、是否能当天处理”排序，不用看象限。</p>
          </div>
          <button className="mini-button" type="button">堂食 + 外卖</button>
        </div>
        <div className="dish-segment-strip">
          <span><strong>2</strong> 今日要处理</span>
          <span><strong>2</strong> 可加曝光</span>
          <span><strong>1</strong> 保持观察</span>
        </div>
        <div className="dish-rank-table">
          <div className="dish-rank-head">
            <span>处理顺序</span><span>菜品和标签</span><span>关键毛利数据</span><span>建议动作</span>
          </div>
          {dishes.map((dish) => (
            <button
              className={`dish-rank-row ${dish.tone} ${selectedDish === dish.name ? "active" : ""}`}
              key={dish.name}
              onClick={() => setSelectedDish(dish.name)}
              type="button"
            >
              <span className="rank-index">{String(dishes.indexOf(dish) + 1).padStart(2, "0")}</span>
              <div><strong>{dish.name}</strong><em>{dish.type}</em></div>
              <div className="rank-metrics"><b>{dish.sales}</b><b>{dish.margin}</b><strong className={dish.gap.startsWith("-") ? "negative" : "positive"}>{dish.gap}</strong></div>
              <p>{dish.action}</p>
            </button>
          ))}
        </div>
        <div className="dish-rank-explain">
          <i className="ri-information-line" />
          <span>点选任意菜品，右侧会切换成该菜的真实毛利拆账。排序靠前不等于要下架，而是说明它今天最值得先查。</span>
        </div>
      </section>
      <section className="surface profit-card">
        <div className="section-title compact"><h3>真实毛利测算</h3><span className="trust medium">估算可信度 82%</span></div>
        <div className="dish-hero"><img src="/assets/beef-pepper.png" alt="小炒黄牛肉" /><div><strong>{selectedDishData.name}</strong><p>{selectedDishData.reason}</p></div></div>
        <div className="cost-lines">
          {[
            ["近 7 日销量", selectedDishData.sales],
            ["售价", selectedDishData.price],
            ["食材标准成本", selectedDishData.foodCost],
            ["平台佣金", selectedDishData.commission],
            ["包装成本", selectedDishData.packageCost],
            ["活动补贴", selectedDishData.subsidy],
            ["预估损耗摊销", selectedDishData.waste],
            ["真实毛利率", selectedDishData.margin],
            ["目标毛利率", selectedDishData.target],
          ].map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}
        </div>
        <div className={`net-profit ${selectedDishData.gap.startsWith("-") ? "danger" : ""}`}><span>真实毛利</span><strong>{selectedDishData.netProfit}</strong><em>目标差距 {selectedDishData.gap}</em></div>
        <div className="trust-note">当前毛利为经营估算值：已含售价、标准成本、平台佣金、包装费和活动补贴；实际领料与损耗接入后可升级为精细核算值。</div>
      </section>
      <section className="surface recommendation-panel">
        <h3>成本异常来源</h3>
        <div className="cost-audit-table">
          {costChecks.map(([label, standard, actual, status]) => (
            <div key={label}><span>{label}</span><strong>{standard}</strong><strong>{actual}</strong><em>{status}</em></div>
          ))}
        </div>
        <h3>AI 菜品动作建议</h3>
        {strategies.map(([label, text], index) => (
          <div className={`recommendation ${index === 1 || index === 2 ? "warn" : ""}`} key={label}><b>{label}</b><p>{text}</p></div>
        ))}
        <h3>菜品策略清单</h3>
        <div className="strategy-table">
          {dishStrategyRows.map(([name, category, issue, action, impact]) => (
            <div key={name}>
              <strong>{name}</strong>
              <span>{category}</span>
              <p>{issue}</p>
              <p>{action}</p>
              <em>{impact}</em>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function ReviewsPage({ onCreateTask }) {
  const [filter, setFilter] = useState("漏汤");
  const tags = ["漏汤", "包装湿", "等太久", "骑手等待", "汤品", "晚高峰"];
  const reviews = [
    {
      text: "汤洒了一半，饭盒外面都是油，味道其实可以，但送到办公室没法吃。",
      meta: "美团外卖 · 湖滨银泰店 · 18:42 · 老客第 4 单 · 2 星",
      tags: ["漏汤", "包装湿", "汤品"],
    },
    {
      text: "中午等了快 40 分钟，骑手到店还在等，汤也洒出来了。",
      meta: "饿了么 · 湖滨银泰店 · 18:57 · 外卖订单 · 2 星",
      tags: ["等太久", "骑手等待", "漏汤"],
    },
    {
      text: "味道不错，但是包装不稳，双人套餐里的萝卜排骨汤少了一半。",
      meta: "美团外卖 · 湖滨银泰店 · 19:12 · 双人套餐 · 3 星",
      tags: ["包装湿", "汤品", "晚高峰"],
    },
  ];

  return (
    <div className="reviews-layout">
      <div className="page-heading wide-heading">
        <span className="page-kicker">非结构化经营问题</span>
        <h1>评论到 SOP 整改</h1>
        <p>AI 从评论原文中识别门店执行问题，并生成整改任务、验收指标和复盘结果</p>
      </div>
      <section className="surface review-overview">
        <div className="section-title"><div><h3>评论问题归因与整改</h3><p>AI 从差评中识别门店执行问题，并生成整改任务</p></div><span className="freshness">近 3 天</span></div>
        <div className="review-kpis">
          <div><strong>4.28</strong><span>综合评分</span></div>
          <div><strong className="negative">12</strong><span>新增差评</span></div>
          <div><strong>76%</strong><span>已识别原因</span></div>
          <div><strong className="positive">3</strong><span>可整改任务</span></div>
        </div>
        <div className="tag-filter">
          {tags.map((tag) => <button className={filter === tag ? "active" : ""} onClick={() => setFilter(tag)} key={tag} type="button">{tag}</button>)}
        </div>
        <div className="review-list">
          {reviews.map((review) => (
            <div className="review-item" key={review.text}>
              <div className="avatar">客</div>
              <p>{review.text}</p>
              <span>{review.meta}</span>
              <div className="review-tags">{review.tags.map((tag) => <em key={tag}>{tag}</em>)}</div>
              <div className="review-ai-note">AI 判断：非口味问题，属于打包和出餐交接 SOP 问题。</div>
            </div>
          ))}
        </div>
      </section>
      <section className="surface review-root">
        <h3>AI 归因链</h3>
        <div className="root-chain vertical">
          <div><span>1</span><strong>评论集中</strong><p>近 3 天湖滨银泰店新增 7 条“{filter} / 包装湿”相关差评，占该店差评 58%。</p></div>
          <div><span>2</span><strong>时段集中</strong><p>18:00-19:30 占 6 条，晚高峰打包压力明显。</p></div>
          <div><span>3</span><strong>商品集中</strong><p>萝卜排骨汤和双人套餐关联度最高，不是全品类口味问题。</p></div>
          <div><span>4</span><strong>证据缺口</strong><p>当班封包照片缺失，骑手等待超过 12 分钟订单占比上升。</p></div>
          <div><span>5</span><strong>AI 判断</strong><p>高峰打包 SOP 变形，应先整改封包和出餐交接。</p></div>
        </div>
        <button className="primary-action full" type="button" onClick={() => onCreateTask(issues[1])}>生成整改任务</button>
      </section>
      <section className="surface task-queue">
        <h3>整改任务</h3>
        <TaskCard task={{ title: "湖滨银泰店打包 SOP 复训", owner: "李主管 + 晚班组长", due: "今日 18:00", status: "待上传证据", priority: "高", acceptance: "上传封包台照片 3 张，抽检 20 单" }} />
        <TaskCard task={{ title: "3 天漏汤差评复盘", owner: "区域督导", due: "3 天后 10:00", status: "自动复查", priority: "中", acceptance: "漏汤差评不超过 2 条" }} />
        <div className="sop-checklist">
          <h3>验收证据</h3>
          <p>封包台照片 3 张，晚高峰抽检 20 单，未来 3 天漏汤差评不超过 2 条。</p>
        </div>
        <div className="review-results large">
          <h4>整改有效性复盘</h4>
          <div><strong>7 到 2</strong><span>漏汤差评 / 3 天</span></div>
          <div><strong>5 到 1</strong><span>包装湿标签 / 3 天</span></div>
          <div><strong>4.12 到 4.28</strong><span>门店评分</span></div>
          <div><strong>有效</strong><span>建议保留 SOP</span></div>
        </div>
      </section>
    </div>
  );
}

function DeliveryPage() {
  const [discount, setDiscount] = useState(8);
  const price = 45;
  const redPacket = 2;
  const commission = 7.8;
  const packageIncome = 1;
  const packageCost = 1.2;
  const cost = 16.5;
  const loss = 0.8;
  const profit = useMemo(
    () => (price - discount - redPacket - commission + packageIncome - packageCost - cost - loss).toFixed(1),
    [discount],
  );
  const lowerProfit = (price - Math.max(discount - 2, 0) - redPacket - commission + packageIncome - packageCost - cost - loss).toFixed(1);
  const higherProfit = (price - (discount + 2) - redPacket - commission + packageIncome - packageCost - cost - loss).toFixed(1);

  const inventory = [
    ["青椒", "预测需求 42kg", "当前库存 + 已订货 50kg", "减少采购 8kg，优先调给晚市销量高门店", "/assets/green-peppers.png"],
    ["黄牛肉", "预测需求 36kg", "当前可用 33kg", "从湖滨银泰店调货 3kg，保留安全库存", "/assets/beef-pepper.png"],
    ["汤品包材", "晚高峰风险偏高", "双层袋库存仅够 1.3 天", "今日 17:00 前补足包材并抽检封包", "/assets/soup-bowl.png"],
  ];
  const discountScenarios = [
    ["满 45 减 6", "-2%", "11.7 元", "+6.8%", "建议试跑"],
    ["满 45 减 8", "基准", "9.7 元", "基准", "当前方案"],
    ["满 45 减 10", "+6%", "7.7 元", "-4.2%", "不建议加码"],
    ["满 50 减 8", "-4%", "11.0 元", "+2.5%", "可测试"],
  ];

  return (
    <div className="delivery-layout">
      <div className="page-heading wide-heading">
        <span className="page-kicker">活动不是越补越好</span>
        <h1>外卖活动审计与备货预测</h1>
        <p>把平台佣金、满减补贴、包装成本、食材成本和库存预测放在一起，判断活动是否真赚钱</p>
      </div>
      <section className="surface profit-simulator">
        <div className="section-title"><div><h3>外卖真实毛利诊断</h3><p>调整满减力度，AI 实时测算订单量、客单价、平台佣金和真实毛利变化</p></div><span className="trust high">可信度 88%</span></div>
        <div className="slider-block">
          <label>当前活动：满 45 减 {discount}</label>
          <input type="range" min="0" max="16" value={discount} onChange={(event) => setDiscount(Number(event.target.value))} />
          <p>若改为满 45 减 {Math.max(discount - 2, 0)}，预计订单 -2%，但每单毛利升至 {lowerProfit} 元；若加码到满 45 减 {discount + 2}，预计订单 +6%，但每单毛利降至 {higherProfit} 元。</p>
        </div>
        <div className="cost-lines">
          <div><span>菜品原价</span><strong>{price.toFixed(1)} 元</strong></div>
          <div><span>满减摊销</span><strong>-{discount.toFixed(1)} 元</strong></div>
          <div><span>商家红包 / 配送补贴</span><strong>-{redPacket.toFixed(1)} 元</strong></div>
          <div><span>平台佣金</span><strong>-{commission.toFixed(1)} 元</strong></div>
          <div><span>包装费收入</span><strong>+{packageIncome.toFixed(1)} 元</strong></div>
          <div><span>包装成本</span><strong>-{packageCost.toFixed(1)} 元</strong></div>
          <div><span>食材成本</span><strong>-{cost.toFixed(1)} 元</strong></div>
          <div><span>预估损耗摊销</span><strong>-{loss.toFixed(1)} 元</strong></div>
        </div>
        <div className={`net-profit ${Number(profit) < 10 ? "danger" : ""}`}><span>每单实际毛利</span><strong>{profit} 元</strong><em>{Number(profit) < 10 ? "不建议继续加码投流" : "可保留活动，试跑 3 天"}</em></div>
        <div className="scenario-table">
          {discountScenarios.map(([plan, order, unitProfit, totalProfit, advice]) => (
            <div key={plan}>
              <strong>{plan}</strong>
              <span>订单 {order}</span>
              <span>单毛利 {unitProfit}</span>
              <span>总毛利 {totalProfit}</span>
              <em>{advice}</em>
            </div>
          ))}
        </div>
        <div className="trust-note">当前毛利为经营估算值，已含平台规则和包材成本；实际损耗接入后可进一步校准。</div>
      </section>
      <section className="surface inventory-panel">
        <h3>相关备货影响</h3>
        {inventory.map(([name, status, desc, action, img]) => (
          <div className="inventory-row" key={name}>
            <img src={img} alt={`${name}备货`} />
            <div><strong>{name}</strong><p>{status}</p><p>{desc}</p><em>{action}</em></div>
          </div>
        ))}
        <div className="inventory-basis">
          <strong>预测依据</strong>
          <p>近 4 周同星期销量、明日天气、外卖活动、当前库存、历史损耗和净菜配送计划。</p>
        </div>
      </section>
      <section className="surface recommendation-panel">
        <h3>AI 外卖与备货建议</h3>
        <div className="recommendation warn"><b>控补贴</b><p>不建议把满减加到 10 元，先试跑满 45 减 6，观察 3 天订单量和真实毛利。</p></div>
        <div className="recommendation"><b>调备货</b><p>青椒下调 8kg，黄牛肉通过门店调货补 3kg，避免断货。</p></div>
        <div className="recommendation"><b>看约束</b><p>预测依据：近 4 周周四销量、明日天气、外卖活动、当前库存和历史损耗。</p></div>
        <div className="back-kitchen-card">
          <h3>后厨标准化联动</h3>
          <p>净菜配送、理论用量、炒菜机参数和出品照片可以一起校验，帮助总部判断是活动策略问题，还是门店执行变形。</p>
          <div><span>净菜计划</span><span>炒菜机参数</span><span>出品抽检</span><span>报损风险</span></div>
        </div>
      </section>
    </div>
  );
}

function PilotPage() {
  const [uploaded, setUploaded] = useState(false);
  const starterTables = [
    ["门店销售日报", "近 30-90 天，含门店、日期、时段、实收、订单数"],
    ["菜品销售明细", "菜品、份数、金额、渠道、活动核销"],
    ["菜品成本卡", "标准成本或估算成本，字段不全也能先跑"],
    ["评论样本", "近 300-1000 条，含平台、门店、时间、评分、原文"],
  ];
  const qualities = [
    ["门店销售", "已匹配", "可生成门店异常和日报", 98],
    ["菜品明细", "已匹配", "可生成菜品四象限", 92],
    ["评论文本", "已匹配", "可生成差评归因", 86],
    ["成本卡", "部分缺失", "毛利先按经营估算值计算", 64],
    ["净菜损耗", "试点补充", "备货预测可先跑，损耗优化后续校准", 52],
  ];
  const timeline = [
    ["第 1 天", "导出 4 张表", "字段映射与数据质量报告"],
    ["第 2 天", "确认门店和菜品口径", "首版经营诊断"],
    ["第 3 天", "补充成本或估算口径", "菜品四象限"],
    ["第 4 天", "提供评论样本", "评论归因与整改任务"],
    ["第 5 天", "选择日报接收人", "AI 经营日报"],
    ["第 6 天", "店长执行 3 个动作", "效果追踪"],
    ["第 7 天", "参加复盘会议", "试点复盘 PPT 与下一阶段方案"],
  ];

  return (
    <div className="pilot-layout">
      <div className="page-heading wide-heading">
        <h1>不用改系统，先用数据跑 7 天试点</h1>
        <p>客户先给 4 张表，知味输出经营诊断、日报、整改任务和试点复盘</p>
      </div>
      <section className="surface pilot-card">
        <div className="section-title"><div><h3>不用改系统，先用数据跑 7 天试点</h3><p>支持 Excel / CSV / 后台导出数据，先跑经营日报、菜品分析和评论整改</p></div><button className="primary-action small" type="button" onClick={() => setUploaded(true)}>模拟上传数据</button></div>
        <div className={`upload-zone ${uploaded ? "done" : ""}`}>
          <i className={uploaded ? "ri-check-line" : "ri-upload-cloud-2-line"} />
          <strong>{uploaded ? "样本数据已上传" : "第一步不用开发接口，先上传 4 张表"}</strong>
          <span>{uploaded ? "已识别 12 家门店、30 个菜品、428 条评论" : "门店销售、菜品明细、成本卡和评论样本即可生成首版诊断"}</span>
        </div>
        <div className="starter-table-grid">
          {starterTables.map(([title, desc]) => (
            <div key={title}><strong>{title}</strong><p>{desc}</p></div>
          ))}
        </div>
        <div className="data-quality">
          {qualities.map(([label, status, impact, score]) => (
            <div className="quality-row rich" key={label}>
              <span>{label}</span><div><b style={{ width: `${score}%` }} /></div><em>{status}</em><p>{impact}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="surface timeline-card">
        <h3>7 天试点交付物</h3>
        {timeline.map(([day, customer, deliverable], index) => (
          <div className="timeline-row rich" key={day}><span>{index + 1}</span><p><strong>{day}</strong><br />客户配合：{customer}<br />我们交付：{deliverable}</p></div>
        ))}
      </section>
      <section className="surface trust-panel">
        <h3>成本与毛利可信度</h3>
        <table>
          <tbody>
            <tr><td>菜品售价</td><td><span className="trust high">已接入 POS</span></td></tr>
            <tr><td>标准成本卡</td><td><span className="trust high">已上传</span></td></tr>
            <tr><td>实际领料</td><td><span className="trust medium">部分门店缺失</span></td></tr>
            <tr><td>净菜损耗</td><td><span className="trust medium">试点门店补充</span></td></tr>
            <tr><td>平台佣金</td><td><span className="trust high">按规则估算</span></td></tr>
          </tbody>
        </table>
        <p>当前毛利为经营估算值，可用于发现异常和排序；接入实际领料和损耗后，可升级为精细核算值。</p>
        <div className="trial-boundary">
          <strong>7 天试点不承诺直接提升多少营业额。</strong>
          <p>承诺交付门店诊断、菜品毛利诊断、评论归因、3 个可执行任务、一次效果复盘和下一阶段接入建议。</p>
        </div>
        <h3>最适合试点的客户</h3>
        <div className="fit-list compact">
          {pilotFitItems.map((item) => (
            <div className="fit-row" key={item}><i className="ri-checkbox-circle-line" /><span>{item}</span></div>
          ))}
        </div>
      </section>
    </div>
  );
}

function PresentationPage() {
  const [slideIndex, setSlideIndex] = useState(0);
  const slide = pptSlides[slideIndex];

  const goToSlide = (index) => {
    const nextIndex = Math.max(0, Math.min(pptSlides.length - 1, index));
    setSlideIndex(nextIndex);
  };

  useEffect(() => {
    const handleKeydown = (event) => {
      if (event.key === "ArrowRight" || event.key === "PageDown") goToSlide(slideIndex + 1);
      if (event.key === "ArrowLeft" || event.key === "PageUp") goToSlide(slideIndex - 1);
    };
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [slideIndex]);

  return (
    <div className="presentation-page">
      <main className="ppt-workbench">
        <section className={`ppt-slide-card ${slide.type}`}>
          <div className="ppt-slide-number">{String(slide.id).padStart(2, "0")}</div>
          <header className="ppt-slide-head">
            <span>{slide.eyebrow}</span>
            <h2>{slide.title}</h2>
            <p>{slide.subtitle}</p>
          </header>
          <div className="ppt-slide-body">
            <PptVisual slide={slide} />
          </div>
          <div className="ppt-takeaway">{pptTakeaways[slide.type]}</div>
        </section>

        <div className="ppt-footer-controls">
          <div className="ppt-progress">
            <div><b style={{ width: `${((slideIndex + 1) / pptSlides.length) * 100}%` }} /></div>
            <span>{slideIndex + 1} / {pptSlides.length}</span>
          </div>
          <div className="button-row">
            <button className="secondary-action small" type="button" onClick={() => goToSlide(slideIndex - 1)} disabled={slideIndex === 0}>上一页</button>
            <button className="primary-action small" type="button" onClick={() => goToSlide(slideIndex + 1)} disabled={slideIndex === pptSlides.length - 1}>下一页</button>
          </div>
        </div>
      </main>
    </div>
  );
}

function PptVisual({ slide }) {
  if (slide.type === "cover") {
    return (
      <div className="ppt-hero-map">
        <div className="ppt-orbit">
          {["收银", "外卖", "评论", "成本", "备货", "巡店"].map((item, index) => (
            <span className={`orbit-node node-${index + 1}`} key={item}>{item}</span>
          ))}
          <strong>AI<br />经营参谋</strong>
        </div>
        <div className="hero-result">
          <b>{slide.highlight}</b>
          <div>{slide.chips.map((chip) => <span key={chip}>{chip}</span>)}</div>
        </div>
      </div>
    );
  }

  if (slide.type === "islands") {
    return (
      <div className="ppt-system-map">
        <div className="system-side source-side">
          <strong>数据分散</strong>
          <div>{slide.islands.map((item) => <span key={item}>{item}</span>)}</div>
        </div>
        <div className="system-core">
          <span>AI 判断层</span>
          <b>统一口径<br />识别异常<br />生成动作</b>
        </div>
        <div className="system-side question-side">
          <strong>老板关心</strong>
          <div>{slide.questions.map((item) => <span key={item}>{item}</span>)}</div>
        </div>
      </div>
    );
  }

  if (slide.type === "compare") {
    return (
      <div className="ppt-compare-flow">
        <div className="compare-column muted">
          <strong>传统 SaaS</strong>
          {slide.rows.map(([label, left]) => <p key={label}><b>{label}</b>{left}</p>)}
        </div>
        <div className="compare-divider">
          <span>经营记录</span>
          <i>→</i>
          <span>经营判断</span>
        </div>
        <div className="compare-column emphasis">
          <strong>知味 AI</strong>
          {slide.rows.map(([label, , right]) => <p key={label}><b>{label}</b>{right}</p>)}
        </div>
      </div>
    );
  }

  if (slide.type === "loop") {
    return (
      <div className="ppt-loop-system">
        <div className="loop-ring">
          {slide.steps.map((step, index) => (
            <div className={`loop-node loop-${index + 1}`} key={step}><span>{index + 1}</span><strong>{step}</strong></div>
          ))}
          <div className="loop-center">经营闭环</div>
        </div>
        <blockquote>{slide.quote}</blockquote>
      </div>
    );
  }

  if (slide.type === "case") {
    return (
      <div className="ppt-evidence-pack">
        <div className="ppt-store-table">
          <div><span>门店</span><span>昨日午市</span><span>同星期均值</span><span>差异</span><span>AI 初判</span></div>
          {slide.stores.map((row) => <div key={row[0]}>{row.map((cell) => <span key={cell}>{cell}</span>)}</div>)}
        </div>
        <div className="evidence-arrow">异常数据 → 证据链 → 修复动作</div>
        <div className="ppt-reasoning-chain">{slide.reasoning.map((item, index) => <div key={item}><span>{index + 1}</span><p>{item}</p></div>)}</div>
        <div className="case-verdict">{slide.verdict}</div>
      </div>
    );
  }

  if (slide.type === "demo") {
    return (
      <div className="ppt-product-screen">
        <div className="screen-shell">
          <aside />
          <main>
            <div className="screen-toolbar"><span /><span /><span /></div>
            <section className="event-priority">
              <b>今日必须处理 3 件事</b>
              <p>按影响金额、证据完整度和可执行性排序</p>
            </section>
            <section className="event-card-main">{slide.card.map((item) => <p key={item}>{item}</p>)}</section>
          </main>
        </div>
        <div className="screen-zones">{slide.zones.map((zone, index) => <span key={zone}><b>{index + 1}</b>{zone}</span>)}</div>
      </div>
    );
  }

  if (slide.type === "alerts") {
    return (
      <div className="ppt-priority-map">
        <div className="priority-core">今日<br />优先级</div>
        {slide.alerts.map(([title, count, text], index) => (
          <div className={`priority-card priority-${index + 1}`} key={title}>
            <strong>{title}</strong><b>{count}</b><p>{text}</p>
          </div>
        ))}
      </div>
    );
  }

  if (slide.type === "report") {
    return (
      <div className="ppt-report-flow">
        <div className="report-line">
          {slide.sections.map((section, index) => <div key={section}><span>{index + 1}</span><strong>{section}</strong></div>)}
        </div>
        <div className="report-audience">
          <span>老板版：看结论和影响金额</span>
          <span>店长版：看任务和验收标准</span>
        </div>
        <p>{slide.message}</p>
      </div>
    );
  }

  if (slide.type === "profit") {
    return (
      <div className="ppt-profit-equation">
        <div className="ppt-cost-list">{slide.cost.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>
        <div className="profit-verdict"><strong>AI 经营判断</strong><p>{slide.conclusion}</p></div>
      </div>
    );
  }

  if (slide.type === "review") {
    return (
      <div className="ppt-review-pipeline">
        <blockquote>{slide.review}</blockquote>
        <div className="review-tags">{slide.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        <div className="review-task"><strong>可验收任务</strong><p>{slide.task}</p></div>
      </div>
    );
  }

  if (slide.type === "delivery") {
    return (
      <div className="ppt-two-ledgers">
        <div><strong>外卖真实利润</strong>{slide.left.map((item) => <p key={item}>{item}</p>)}</div>
        <div className="ledger-core">算清<br />真实账</div>
        <div><strong>备货损耗风险</strong>{slide.right.map((item) => <p key={item}>{item}</p>)}</div>
      </div>
    );
  }

  if (slide.type === "trust") {
    return (
      <div className="ppt-trust-map">
        <div className="trust-center">AI 判断<br /><small>可解释、可追溯</small></div>
        {slide.trustCard.map(([label, value], index) => (
          <div className={`trust-node trust-${index + 1}`} key={label}><span>{label}</span><strong>{value}</strong></div>
        ))}
      </div>
    );
  }

  if (slide.type === "pilot") {
    return (
      <div className="ppt-pilot-path">
        <div className="pilot-inputs">{slide.tables.map((item) => <span key={item}>{item}</span>)}</div>
        <div className="pilot-arrow">4 张表 → 7 天试点 → 复盘决策</div>
        <div className="pilot-days">{slide.days.map((item, index) => <span key={item}><b>{index + 1}</b>{item}</span>)}</div>
      </div>
    );
  }

  if (slide.type === "deliver") {
    return (
      <div className="ppt-deliver-map">
        <div className="deliver-core">客户自己的<br />经营诊断</div>
        <div className="ppt-deliver-grid">{slide.deliverables.map((item) => <span key={item}>{item}</span>)}</div>
        <div className="ppt-focus-row">{slide.focus.map((item) => <strong key={item}>{item}</strong>)}</div>
      </div>
    );
  }

  if (slide.type === "close") {
    return (
      <div className="ppt-close-steps">
        <div className="ppt-highlight">{slide.highlight}</div>
        <div className="ppt-action-list">{slide.actions.map((item, index) => <div key={item}><span>{index + 1}</span><strong>{item}</strong></div>)}</div>
      </div>
    );
  }

  return null;
}

function TaskCard({ task }) {
  return (
    <div className="task-card">
      <div>
        <strong>{task.title}</strong>
        <span className={`severity ${task.priority === "高" ? "high" : "medium"}`}>{task.priority}</span>
      </div>
      <p>负责人：{task.owner}</p>
      <p>截止：{task.due}</p>
      {task.acceptance ? <p>验收：{task.acceptance}</p> : null}
      <em>{task.status}</em>
    </div>
  );
}

export function App() {
  const [activePage, setActivePage] = useState("presentation");
  const [selectedIssue, setSelectedIssue] = useState(issues[0]);
  const [evidenceIssue, setEvidenceIssue] = useState(null);
  const [tasks, setTasks] = useState(tasksSeed);
  const [generating, setGenerating] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(true);
  const [toast, setToast] = useState("");

  const currentTaskCreated = tasks.some((task) => task.title === selectedIssue.task);

  const createTask = (issue) => {
    if (!tasks.some((task) => task.title === issue.task)) {
      setTasks((prev) => [
        {
          title: issue.task,
          owner: issue.taskDetails.owner,
          due: issue.taskDetails.due,
          status: "已派发",
          priority: issue.severity,
          acceptance: issue.taskDetails.acceptance,
        },
        ...prev,
      ]);
    }
    setToast(`已生成任务：${issue.task}`);
    window.setTimeout(() => setToast(""), 2400);
  };

  const generateReport = () => {
    setActivePage("report");
    setGenerating(true);
    setReportGenerated(false);
    window.setTimeout(() => {
      setGenerating(false);
      setReportGenerated(true);
      setToast("AI 经营日报已生成，可复制店长群版");
      window.setTimeout(() => setToast(""), 2400);
    }, 2200);
  };

  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <main className="workspace">
        <Topbar onGenerate={generateReport} generating={generating} activePage={activePage} />
        <div className="content">
          {activePage === "presentation" ? <PresentationPage /> : null}
          {activePage === "boundary" ? <SaasBoundaryPage /> : null}
          {activePage === "overview" ? <OverviewPage selectedIssue={selectedIssue} setSelectedIssue={setSelectedIssue} onCreateTask={createTask} taskCreated={currentTaskCreated} onOpenEvidence={setEvidenceIssue} /> : null}
          {activePage === "flow" ? <DataFlowPage /> : null}
          {activePage === "alerts" ? <AlertsPage selectedIssue={selectedIssue} setSelectedIssue={setSelectedIssue} onCreateTask={createTask} onOpenEvidence={setEvidenceIssue} /> : null}
          {activePage === "report" ? <ReportPage generating={generating} reportGenerated={reportGenerated} onGenerate={generateReport} onCreateTask={createTask} /> : null}
          {activePage === "dishes" ? <DishesPage /> : null}
          {activePage === "reviews" ? <ReviewsPage onCreateTask={createTask} /> : null}
          {activePage === "delivery" ? <DeliveryPage /> : null}
          {activePage === "pilot" ? <PilotPage /> : null}
        </div>
      </main>
      {toast ? <div className="toast"><i className="ri-checkbox-circle-line" /> {toast}</div> : null}
      <EvidenceDrawer issue={evidenceIssue} onClose={() => setEvidenceIssue(null)} onCreateTask={createTask} />
    </div>
  );
}
