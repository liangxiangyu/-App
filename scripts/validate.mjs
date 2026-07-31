import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
function load(file) {
  const sandbox = {};
  sandbox.globalThis = sandbox;
  vm.runInNewContext(readFileSync(join(root, file), "utf8"), sandbox);
  return sandbox;
}

const errors = [];
const cat = load("data/catalog.js");
const mock = load("data/mock.js");
const { MODULES, NODES } = cat.DUCHA_AS_IS || {};
const MOCK = mock.DUCHA_AS_IS_MOCK || {};

if (!MODULES || MODULES.length !== 4) errors.push("MODULES must have 4 items");
if (MODULES && MODULES.some((m) => m.key === "mine")) errors.push("mine forbidden");
if (!NODES || !NODES.length) errors.push("NODES empty");

const ids = new Set();
let firstProblemMgmt = 0;
let firstSupForm = 0;
const roots = [];

for (const n of NODES || []) {
  for (const k of ["id", "module", "title", "role"]) {
    if (!n[k]) errors.push(`node missing ${k}`);
  }
  if (ids.has(n.id)) errors.push(`dup ${n.id}`);
  ids.add(n.id);

  const needsMock = ["列表", "详情", "表单", "地图", "浮层"].includes(n.role);
  if (needsMock) {
    if (!n.mockKey) errors.push(`${n.id} (${n.role}) missing mockKey`);
    else if (!(n.mockKey in MOCK)) errors.push(`mock missing ${n.mockKey}`);
  } else if (n.mockKey) {
    if (!(n.mockKey in MOCK)) errors.push(`mock missing ${n.mockKey}`);
  }

  if (n.parentId != null && !NODES.some((x) => x.id === n.parentId)) {
    errors.push(`${n.id} bad parentId`);
  }
  if (n.parentId == null) {
    roots.push(n);
    if (!Array.isArray(n.actions) || !n.actions.length) {
      errors.push(`root ${n.id} needs actions`);
    }
  }
  if (n.screenshot) {
    const p = join(root, n.screenshot.replace(/^\.\//, ""));
    if (!existsSync(p)) errors.push(`missing file ${n.screenshot}`);
  }
  for (const a of n.actions || []) {
    if (!a.label) errors.push(`${n.id} action without label`);
    if (a.targetId && !NODES.some((x) => x.id === a.targetId)) {
      errors.push(`${n.id} action target missing ${a.targetId}`);
    }
    if (a.firstExpand && a.targetId === "problem-mgmt") firstProblemMgmt++;
    if (a.firstExpand && a.targetId === "sup-form") firstSupForm++;
  }
}

if (firstProblemMgmt !== 1) errors.push(`firstExpand problem-mgmt count=${firstProblemMgmt} want 1`);
if (firstSupForm !== 1) errors.push(`firstExpand sup-form count=${firstSupForm} want 1`);

const mapExpand = (NODES.find((n) => n.id === "map-main")?.actions || []).filter((a) => a.firstExpand && a.targetId === "map-detail");
if (mapExpand.length !== 1) errors.push("map-main must firstExpand map-detail once");

for (const f of ["index.html", "styles.css", "app.js"]) {
  if (existsSync(join(root, f))) errors.push(`HTML shell must be deleted: ${f}`);
}

const requireFilled = process.argv.includes("--require-mock-filled");
if (requireFilled) {
  for (const n of NODES || []) {
    if (!["列表", "详情", "表单", "地图", "浮层"].includes(n.role)) continue;
    const v = MOCK[n.mockKey];
    const empty = v == null || (Array.isArray(v) && !v.length) || (typeof v === "object" && !Array.isArray(v) && !Object.keys(v).length);
    if (empty) errors.push(`mock empty: ${n.mockKey}`);
  }
}

if (process.argv.includes("--require-md")) {
  const reqPath = join(root, "requirements.md");
  if (!existsSync(reqPath)) errors.push("requirements.md missing");
  else {
    const md = readFileSync(reqPath, "utf8");
    for (const s of ["问题管理", "发起督导", "现场核查", "字典 `", "督导表单", "模拟数据", "线索详情"]) {
      if (!md.includes(s)) errors.push(`requirements.md missing phrase: ${s}`);
    }
    // 列表 / 详情 / 表单均须挂模拟数据键
    for (const key of [
      "wbList", "wbClue", "wbInspection", "supList", "supportFiles", "mapMain",
      "problemMgmt", "mapDetail", "supForm", "clueDetail", "clueForm", "dcbDetail"
    ]) {
      if (!md.includes(`mock.${key}`)) errors.push(`requirements.md missing mock.${key}`);
    }
    // 筛选字典不得再塞进模拟数据块；禁止「不展开」占位
    for (const banned of ["mock.wbFilter", "mock.wbClueFilter", "mock.wbInspectionFilter", "mock.supListFilter", "mock.supportFilter", "字典_", "本说明书不展开", "督导审核", "mock.supervisionAudit", "§4.1.4"]) {
      if (md.includes(banned)) errors.push(`requirements.md must not include: ${banned}`);
    }
    const formFull = (md.match(/mock\.supForm/g) || []).length;
    if (formFull !== 1) errors.push(`督导表单全文 mock.supForm 应只出现 1 次，实际=${formFull}`);
    if (!md.includes("§4.1.3")) errors.push("requirements.md missing shared-page link §4.1.3");
    if (md.includes("【首次全文】") || /\*\*角色\*\*/.test(md) || /\*\*源码\*\*/.test(md)) {
      errors.push("requirements.md must not show 首次全文 / 角色 / 源码 labels");
    }
  }
}

if (errors.length) {
  console.error("VALIDATE FAIL\n" + errors.join("\n"));
  process.exit(1);
}
console.log(`VALIDATE OK: ${NODES.length} nodes, ${roots.length} roots`);
