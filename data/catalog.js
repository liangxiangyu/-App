(function (g) {
  const MODULES = [
    { key: "problem", title: "问题" },
    { key: "supervision", title: "督察" },
    { key: "map", title: "地图" },
    { key: "support", title: "支持" }
  ];

  /** @type {Array<object>} */
  const NODES = [
    {
      id: "wb-list",
      parentId: null,
      module: "problem",
      title: "清单问题列表",
      role: "列表",
      sourceHint: "pages/new/workbench/index.vue + WorkbenchListPanel.vue（tab=list）",
      screenshot: "assets/screens/screen_14.jpg",
      layout: ["搜索", "工作台切换", "列表", "列表操作"],
      fields: ["问题标题", "问题编码", "整改责任单位", "行业主管部门", "问题来源", "发生领域", "督导状态", "整改状态", "临期/超期情况", "督导后风险", "整改期限", "办结时间"],
      filterFields: [
        "搜索：问题标题/描述/问题编码",
        "督导单位",
        "问题来源",
        "发生领域",
        "整改状态",
        "临期超期情况",
        "督导状态",
        "督导后风险"
      ],
      actions: [
        { label: "问题管理", targetId: "problem-mgmt", targetHint: "problemManagement.vue", firstExpand: true },
        { label: "发起督导", targetId: "sup-form", targetHint: "supervision_form.vue", firstExpand: true }
      ],
      emptyStates: ["列表为空；获取失败 toast"],
      mockKey: "wbList"
    },
    {
      id: "wb-list-filter",
      parentId: "wb-list",
      module: "problem",
      title: "更多查询条件（清单）",
      role: "筛选",
      sourceHint: "WorkbenchListMoreFiltersPopup.vue",
      screenshot: null,
      note: "无单独截图；字段来自 WorkbenchListMoreFiltersPopup",
      layout: ["标题", "条件字段", "取消/重置/确定"],
      fields: ["督导单位", "问题来源", "发生领域", "整改状态", "临期超期情况", "督导状态", "督导后风险"],
      actions: [],
      emptyStates: [],
      mockKey: null,
      note: "筛选页不单独提供模拟数据；字典可选值见字段表备注列"
    },
    {
      id: "problem-mgmt",
      parentId: "wb-list",
      module: "problem",
      title: "问题管理（详情）",
      role: "详情",
      sourceHint: "pages/new/workbench/problemManagement.vue",
      screenshot: "assets/screens/screen_04.jpg",
      screenshotsExtra: ["assets/screens/screen_06.jpg", "assets/screens/screen_03.jpg", "assets/screens/screen_05.jpg", "assets/screens/screen_02.jpg"],
      layout: ["标题「问题详情」", "信息分区", "可返回"],
      fields: ["问题详情", "整改信息", "督导信息", "案例信息", "位置信息"],
      actions: [
        { label: "返回", targetId: null, targetHint: "navigateBack", firstExpand: false },
        { label: "分块查看", targetId: null, targetHint: "scrollToCard", firstExpand: false }
      ],
      emptyStates: ["区块可「暂无…」"],
      mockKey: "problemMgmt"
    },
    {
      id: "sup-form",
      parentId: "wb-list",
      module: "problem",
      title: "督导表单",
      role: "表单",
      sourceHint: "pages/supervision/supervision_form.vue",
      screenshot: "assets/screens/screen_01.jpg",
      layout: ["表单字段", "提交审核/保存"],
      fields: ["督导日期", "督导人员", "督导方式", "是否交办", "督导对象", "核查总体评价", "市级例行督察", "核查情况"],
      actions: [
        { label: "提交审核", targetId: null, targetHint: "表单内提交", firstExpand: false },
        { label: "保存", targetId: null, targetHint: "表单内保存", firstExpand: false }
      ],
      emptyStates: [],
      mockKey: "supForm",
      note: "业务上亦属督察模块；说明书按「首次展开」挂在清单发起督导下，督导列表等仅回链"
    },
    {
      id: "wb-clue",
      parentId: null,
      module: "problem",
      title: "线索问题列表",
      role: "列表",
      sourceHint: "pages/new/workbench/index.vue + WorkbenchCluePanel.vue（tab=clue）",
      screenshot: "assets/screens/screen_13.jpg",
      layout: ["搜索", "工作台切换", "列表", "列表操作", "新增入口"],
      fields: ["线索标题", "编号", "行政区划", "领域", "来源", "发现时间", "发现情况", "状态", "是否已形成问题"],
      filterFields: ["搜索：线索标题/编号/发现情况", "行政区划", "领域", "来源"],
      actions: [
        { label: "查看", targetId: "clue-detail", targetHint: "pages/clue/details.vue", firstExpand: false },
        { label: "修改", targetId: "clue-form", targetHint: "pages/new/workbench/clue_form.vue", firstExpand: false },
        { label: "删除", targetId: null, targetHint: "草稿可操作", firstExpand: false },
        { label: "提交", targetId: null, targetHint: "草稿可操作", firstExpand: false },
        { label: "撤回", targetId: null, targetHint: "已提交可撤回", firstExpand: false },
        { label: "现场核查", targetId: "sup-form", targetHint: "supervision_form.vue；始终新增督导", firstExpand: false },
        { label: "新增线索", targetId: "clue-form", targetHint: "pages/new/workbench/clue_form.vue", firstExpand: false }
      ],
      emptyStates: ["列表为空"],
      mockKey: "wbClue"
    },
    {
      id: "clue-detail",
      parentId: "wb-clue",
      module: "problem",
      title: "线索详情",
      role: "详情",
      sourceHint: "pages/clue/details.vue",
      screenshot: null,
      layout: ["标题", "信息分区", "线索/舆情信息", "督导信息", "附件", "线索照片"],
      fields: ["线索编号", "提交状态", "发现日期", "行政区划", "领域", "来源", "标题", "发现情况", "督导信息"],
      actions: [{ label: "返回", targetId: "wb-clue", targetHint: "navigateBack", firstExpand: false }],
      emptyStates: ["附件/照片可暂无"],
      mockKey: "clueDetail"
    },
    {
      id: "clue-form",
      parentId: "wb-clue",
      module: "problem",
      title: "线索表单",
      role: "表单",
      sourceHint: "pages/new/workbench/clue_form.vue",
      screenshot: null,
      layout: ["导航", "来源切换", "表单区", "附件/照片", "保存并提交/保存"],
      fields: ["线索标题", "发现情况", "行政区划", "领域", "来源", "发现日期", "定位数据"],
      actions: [
        { label: "保存并提交", targetId: null, targetHint: "表单内提交", firstExpand: false },
        { label: "保存", targetId: null, targetHint: "表单内保存", firstExpand: false }
      ],
      emptyStates: [],
      mockKey: "clueForm"
    },
    {
      id: "wb-inspection",
      parentId: null,
      module: "problem",
      title: "督察问题列表",
      role: "列表",
      sourceHint: "pages/new/workbench/index.vue + WorkbenchInspectionPanel.vue（tab=inspection）",
      screenshot: "assets/screens/screen_12.jpg",
      layout: ["搜索", "工作台切换", "类型筛选", "列表", "列表操作"],
      fields: ["类型/编号标签", "问题名称", "整改主体", "问题内容", "整改措施", "问题编号", "整改状态", "督导状态", "督导后风险", "整改时限"],
      filterFields: [
        "搜索：具体内容/编号/问题编码",
        "督导单位/责任单位",
        "整改完成情况",
        "自查完成情况",
        "自查风险情况",
        "督导状态",
        "督导后风险状态",
        "回访满意度(中央投诉)",
        "RIS/市级第二轮另有条件组"
      ],
      moreFilterScreenshot: "assets/screens/screen_11.jpg",
      actions: [
        { label: "查看", targetId: "dcb-detail", targetHint: "pages/new/workbench/dcbDetail/*", firstExpand: false },
        { label: "发起督导", targetId: "sup-form", targetHint: "supervision_form.vue", firstExpand: false }
      ],
      emptyStates: ["列表为空"],
      mockKey: "wbInspection"
    },
    {
      id: "dcb-detail",
      parentId: "wb-inspection",
      module: "problem",
      title: "督察问题详情（按类型）",
      role: "详情",
      sourceHint: "pages/new/workbench/dcbDetail/*",
      screenshot: null,
      layout: ["导航", "信息分区", "基础信息", "整改进度/自查/督导/回访/遥感/位置"],
      fields: ["按类型：央督7类 / 市级第二轮 / 例行督察举报投诉"],
      actions: [{ label: "返回", targetId: "wb-inspection", targetHint: "navigateBack", firstExpand: false }],
      emptyStates: ["反馈摘要可暂无"],
      mockKey: "dcbDetail"
    },
    {
      id: "sup-list",
      parentId: null,
      module: "supervision",
      title: "督导列表",
      role: "列表",
      sourceHint: "pages/supervision/index.vue",
      screenshot: "assets/screens/screen_10.jpg",
      layout: ["搜索", "业务切换（督导/交办/督办/资料调阅/问责；仅督导写全，其它同督导）", "列表", "列表操作", "新增入口"],
      fields: ["处室", "督导日期", "督导人员", "督导方式", "市级例行督察", "问题名称", "业务类型", "审核状态", "核查情况", "是否交办"],
      filterFields: ["与督导同一套筛选"],
      note: "交办/督办/资料调阅/问责的列表与详情均按督导同一套实现，不另建节点",
      actions: [
        { label: "详情", targetId: "sup-form", targetHint: "见督导表单（回链）", firstExpand: false },
        { label: "编辑", targetId: "sup-form", targetHint: "见督导表单（回链）", firstExpand: false },
        { label: "提交审核", targetId: null, targetHint: "列表内提交", firstExpand: false },
        { label: "删除", targetId: null, targetHint: "列表内删除", firstExpand: false },
        { label: "新增", targetId: "sup-form", targetHint: "见督导表单（回链）", firstExpand: false }
      ],
      emptyStates: ["业务列表为空占位"],
      mockKey: "supList"
    },
    {
      id: "map-main",
      parentId: null,
      module: "map",
      title: "督察地图",
      role: "地图",
      sourceHint: "pages/map/index-irs.vue",
      screenshot: "assets/screens/screen_15.jpg",
      layout: ["类型筛选", "搜索", "地图展示", "定位"],
      fields: ["类型", "编号/序号/标题/描述关键词"],
      actions: [
        { label: "点选点位", targetId: "map-detail", targetHint: "打开详情", firstExpand: true },
        { label: "筛选", targetId: null, targetHint: "类型/关键词筛选", firstExpand: false },
        { label: "定位", targetId: null, targetHint: "定位", firstExpand: false }
      ],
      emptyStates: ["无点位时仅底图"],
      mockKey: "mapMain"
    },
    {
      id: "map-detail",
      parentId: "map-main",
      module: "map",
      title: "地图详情",
      role: "详情",
      sourceHint: "pages/map/index-irs.vue（详情）",
      screenshot: "assets/screens/screen_09.jpg",
      layout: ["标题与关闭", "详情字段", "导航入口"],
      fields: ["编号", "类型标签", "内容", "批次", "整改完成情况", "责任单位", "坐标类型"],
      actions: [
        { label: "关闭", targetId: "map-main", targetHint: "回地图", firstExpand: false },
        { label: "导航", targetId: null, targetHint: "源码未完整展开则写源码未体现", firstExpand: false }
      ],
      emptyStates: [],
      mockKey: "mapDetail"
    },
    {
      id: "support-files",
      parentId: null,
      module: "support",
      title: "督察支持 · 资源",
      role: "列表",
      sourceHint: "pages/new/inspectorSupport/index.vue",
      screenshot: "assets/screens/screen_08.jpg",
      layout: ["标题「督察支持」", "搜索", "分类筛选", "文件列表"],
      fields: ["文件名", "文件类型"],
      actions: [
        { label: "搜索", targetId: null, targetHint: "ES 开：名称或内容；关：仅文件名", firstExpand: false },
        { label: "分类筛选", targetId: null, targetHint: "分类筛选", firstExpand: false }
      ],
      emptyStates: ["加载失败 toast；空列表"],
      mockKey: "supportFiles"
    }
  ];

  function getNodeById(id) {
    return NODES.find((n) => n.id === id) || null;
  }

  g.DUCHA_AS_IS = { MODULES, NODES, getNodeById };
})(typeof globalThis !== "undefined" ? globalThis : this);
