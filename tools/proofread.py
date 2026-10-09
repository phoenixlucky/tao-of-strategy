# -*- coding: utf-8 -*-
"""格言校对：把 quotes.json 的每条格言在 daizhigev20 古籍原文里定位。

用法:
    python tools/proofread.py                 # 全量 599 条
    python tools/proofread.py sunzi wuzi      # 只跑指定人物
产出（均不改动数据）:
    tools/audit-report.csv    机器可读
    tools/audit-report.md     人工审阅
    tools/audit-report.json   带反查建议
"""
import os, re, csv, sys, json, pickle, glob
import zhconv

CORPUS = r"E:\home\daizhigev20"
PROJECT = r"E:\home\tao-of-strategy"
OUT = os.path.join(PROJECT, "tools")
CACHE = os.path.join(OUT, "normcache.pkl")

# personId -> 首选古籍原文（相对 CORPUS；第一个为主文本）
LIB = {
    "sunzi":       ["子藏/兵家/孙子.txt", "子藏/兵家/孙子兵法.txt"],
    "wuzi":        ["子藏/兵家/吴子.txt", "子藏/兵家/吴子兵法.txt"],
    "sunbin":      ["子藏/兵家/孙膑兵法.txt"],
    "weiliao":     ["子藏/兵家/尉缭子.txt"],
    "caocao":      ["子藏/兵家/孙子注.txt", "子藏/兵家/孙子集注.txt"],
    "lijing":      ["子藏/兵家/李卫公问对.txt", "子藏/兵家/卫公兵法辑本.txt"],
    "hanxin":      ["史藏/正史/史记.txt"],
    "simarangju":  ["子藏/兵家/司马法.txt"],
    "jiangziya":   ["子藏/兵家/六韬.txt", "子藏/兵家/太公兵法.txt"],
    "yuefei":      ["集藏/四库别集/岳武穆遗文.txt"],
    "qi-jiguang":  ["子藏/兵家/纪效新书.txt", "子藏/兵家/练兵实纪.txt"],
    "baiqi":       ["史藏/正史/史记.txt"],
    "laozi":       ["道藏/藏外/老子道德经（晋王弼）.txt", "道藏/正统道藏洞神部/本文类/道德经古本篇.txt"],
    "zhuangzi":    ["道藏/藏外/庄子.txt"],
    "liezi":       ["道藏/藏外/列子.txt"],
    "wenzi":       ["道藏/藏外/文子.txt"],
    "heshanggong": ["道藏/藏外/老子道德经河上公章句.txt", "道藏/藏外/老子道德经（河上公撰）.txt"],
    "guanyinzi":   ["道藏/藏外/关尹子.txt"],
    "gehong":      ["道藏/藏外/抱朴子内外篇.txt"],
    "taoyuanming": ["集藏/四库别集/陶渊明集.txt"],
    "jikang":      ["集藏/四库别集/嵇中散集.txt"],
    "fanli":       ["子藏/诸子/范子计然.txt"],
    "zhangliang":  ["史藏/正史/史记.txt"],
    "zhugeliang":  ["子藏/兵家/诸葛亮集.txt"],
    "liubowen":    ["子藏/诸子/郁离子.txt", "子藏/兵家/百战奇略.txt"],
    "wangyangming": ["儒藏/语录/传习录.txt"],
    "zeng-guofan": ["子藏/兵家/曾胡治兵语录.txt"],
    "guoziyi":     ["史藏/正史/旧唐书.txt", "史藏/正史/新唐书.txt"],
    "xunzi":       ["子藏/诸子/荀子.txt"],
    "huangdi":     ["道藏/正统道藏洞真部/本文类/黄帝阴符经.txt"],
    "huangshigong": ["子藏/兵家/黄石公三略.txt", "子藏/兵家/黄石公素书.txt"],
    "guiguzi":     ["子藏/诸子/鬼谷子.txt"],
    "tanqiao":     ["子藏/诸子/化书.txt"],
    "sanshiliuji": ["子藏/兵家/三十六计.txt"],
    "liquan":      ["子藏/兵家/太白阴经.txt"],
    "xudong":      ["子藏/兵家/虎钤经.txt"],
    "hequfei":     ["子藏/兵家/何博士备论.txt"],
    "zhaorui":     ["子藏/诸子/长短经.txt"],
    "wunengzi":    ["子藏/诸子/无能子.txt"],
    "heguanzi":    ["子藏/诸子/鹖冠子.txt"],
    "liuan":       ["子藏/诸子/淮南子.txt"],
    "jiexuan":     ["子藏/兵家/兵经百言.txt"],
    "liushao":     ["子藏/诸子/人物志.txt"],
    "kangcangzi":  ["子藏/诸子/亢仓子.txt"],
    "shijiao":     ["子藏/诸子/尸子.txt"],
    "shenzi":      ["子藏/诸子/慎子.txt"],
    "wangyuyou":   ["子藏/兵家/乾坤大略.txt"],
    "zihuazi":     ["子藏/诸子/子华子.txt"],
}

# 反查用大语料（在首选未命中时用整句对齐找真正的出处）
GLOBAL_DIRS = ["子藏/兵家", "子藏/诸子", "子藏/法家", "子藏/农家"]
GLOBAL_FILES = [
    "史藏/正史/史记.txt", "史藏/正史/旧唐书.txt", "史藏/正史/新唐书.txt",
    "史藏/别史/国语.txt", "史藏/载记/吴越春秋.txt", "史藏/载记/越绝书.txt",
    "集藏/四库别集/陶渊明集.txt", "集藏/四库别集/嵇中散集.txt", "集藏/四库别集/岳武穆遗文.txt",
    "儒藏/语录/传习录.txt",
]

CJK = re.compile(r"[^\u3400-\u9fff\uf900-\ufaff]")
_chap = re.compile(r"[·.][\u4e00-\u9fff]{1,6}$")

# 四库异体/古字 -> 通用字（zhconv 不处理）
VARIANT = str.maketrans({
    "逺": "远", "巻": "卷", "呉": "吴", "悳": "德", "徳": "德", "髙": "高", "冨": "富",
    "敎": "教", "歩": "步", "曁": "暨", "冝": "宜", "隷": "隶", "皁": "皂",
    "説": "说", "甯": "宁", "冩": "写", "畱": "留", "畧": "略", "嵗": "岁",
    "眞": "真", "㫖": "旨", "縂": "总", "搃": "总", "甞": "尝", "㑹": "会",
    "茍": "苟", "㧛": "揽", "恵": "惠", "覩": "睹", "眀": "明", "愽": "博",
    "麄": "粗", "煖": "暖", "熈": "熙", "貎": "貌", "覊": "羁", "邉": "边",
    "闗": "关", "曽": "曾", "冦": "寇", "鼌": "晁", "徴": "征", "黙": "默",
    "枏": "楠", "椶": "棕", "悮": "误", "縁": "缘", "龎": "庞", "逹": "达",
})

_charmap = None


def abspath(rel):
    return os.path.join(CORPUS, rel.replace("/", os.sep))


def _save(path, obj):
    try:
        pickle.dump(obj, open(path, "wb"))
    except OSError:
        pass


def build_charmap(files):
    """扫描语料全部单字，一次性建立 繁/异体 -> 简体 映射（之后 translate 极快）。"""
    global _charmap
    cache_p = os.path.join(OUT, "charmap.pkl")
    if os.path.exists(cache_p):
        try:
            _charmap = pickle.load(open(cache_p, "rb"))
            return _charmap
        except (OSError, EOFError):
            pass
    chars = set()
    for rel in files:
        try:
            chars.update(open(abspath(rel), encoding="utf-8", errors="ignore").read())
        except OSError:
            pass
    m = {}
    for ch in chars:
        if "\u3400" <= ch <= "\ufaff":
            c = zhconv.convert(ch, "zh-cn").translate(VARIANT)
            if c != ch:
                m[ord(ch)] = c
    _charmap = m
    _save(cache_p, m)
    return m


def norm(s):
    return CJK.sub("", s or "").translate(_charmap or {})


_normcache = None


def load_norm(rel):
    """读取并归一化语料（内存 + 磁盘缓存）。"""
    global _normcache
    if _normcache is None:
        try:
            _normcache = pickle.load(open(CACHE, "rb"))
        except (OSError, EOFError):
            _normcache = {}
    if rel not in _normcache:
        _normcache[rel] = norm(open(abspath(rel), encoding="utf-8", errors="ignore").read())
        _save(CACHE, _normcache)
    return _normcache[rel]


def declared_chapter(source):
    m = _chap.search(source or "")
    if not m:
        return ""
    return re.sub(r"[上下]?[一二三四五六七八九十百\d]+$", "", m.group()[1:])


def seeds(qn):
    n = len(qn)
    if n <= 8:
        return [qn]
    L = min(12, n)
    pos = sorted({0, n // 4, n // 2, 3 * n // 4, n - L})
    return [qn[p:p + L] for p in pos if len(qn[p:p + L]) >= 6]


def align(qn, lo, hi, cn):
    from difflib import SequenceMatcher
    win = cn[max(0, lo):min(len(cn), hi)]
    sm = SequenceMatcher(None, qn, win, autojunk=False)
    return sum(b.size for b in sm.get_matching_blocks()) / len(qn)


def locate(qn, cn):
    """快速定位：先子串，再 12/8/6 元种子定位窗口对齐。返回 (kind,ratio,lo,hi)。"""
    i = cn.find(qn)
    if i >= 0:
        return "EXACT", 1.0, i, i + len(qn)
    for L in (12, 8, 6):
        for p in range(0, max(1, len(qn) - L + 1), max(1, (len(qn) - L) // 3 or 1)):
            s = qn[p:p + L]
            if len(s) < 6:
                continue
            j = cn.find(s)
            if j >= 0:
                lo, hi = j - len(qn), j + L + len(qn)
                return "ALIGN", align(qn, lo, hi, cn), lo, hi
    return "NONE", 0.0, 0, 0


def status(ratio):
    if ratio >= 0.95:
        return "VERBATIM"
    if ratio >= 0.75:
        return "VARIANT"
    if ratio >= 0.5:
        return "EDITED"
    return "MISS"


def build_global():
    files = list(GLOBAL_FILES)
    for d in GLOBAL_DIRS:
        files += [os.path.relpath(p, CORPUS).replace(os.sep, "/")
                  for p in glob.glob(os.path.join(abspath(d), "*.txt"))]
    files = sorted(set(files))
    return files


def run(people=None):
    data = json.load(open(os.path.join(PROJECT, "quotes", "quotes.json"), encoding="utf-8"))
    quotes = [q for q in data["quotes"] if not people or q["personId"] in people]
    primary = sorted({f for q in quotes for f in LIB.get(q["personId"], [])})
    gfiles = build_global()
    build_charmap(sorted(set(primary + gfiles)))
    gindex = [(f, load_norm(f)) for f in gfiles if os.path.exists(abspath(f))]

    rows, stat = [], {}
    for q in quotes:
        pid, qn = q["personId"], None
        qn = norm(q["text"])
        files = LIB.get(pid, [])
        best = (0.0, "NO_LIB", "", 0, 0)
        for rel in files:
            if not os.path.exists(abspath(rel)):
                continue
            k, r, lo, hi = locate(qn, load_norm(rel))
            if r > best[0] or (best[1] == "NO_LIB" and r == best[0]):
                best = (1.0 if k == "EXACT" else r, k, rel, lo, hi)
        ratio, kind, rel, lo, hi = best
        st = "EXACT" if kind == "EXACT" else status(ratio)
        ctx = load_norm(rel)[lo:hi][:140] if rel else ""

        gfile, gratio, gctx = "", 0.0, ""
        if st not in ("EXACT", "VERBATIM"):
            for grel, gcn in gindex:
                if grel == rel:
                    continue
                gk, gr, glo, ghi = locate(qn, gcn)
                if gr > gratio:
                    gfile, gratio, gctx = grel, (1.0 if gk == "EXACT" else gr), gcn[glo:ghi][:140]
        chap = declared_chapter(q["source"])
        chap_hit = "Y" if chap and chap in load_norm(rel) else ("n/a" if not chap else "N")
        stat[st] = stat.get(st, 0) + 1
        rows.append({
            "id": q["id"], "person": pid, "face": q["face"], "source": q["source"],
            "status": st, "ratio": round(ratio, 2), "chapter_ok": chap_hit,
            "file": rel, "ctx": ctx,
            "suggest_file": gfile, "suggest_ratio": round(gratio, 2), "suggest_ctx": gctx,
            "text": q["text"],
        })

    with open(os.path.join(OUT, "audit-report.csv"), "w", encoding="utf-8-sig", newline="") as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        w.writeheader(); w.writerows(rows)
    json.dump(rows, open(os.path.join(OUT, "audit-report.json"), "w", encoding="utf-8"),
              ensure_ascii=False, indent=1)
    write_md(rows, stat)
    print(json.dumps({"rows": len(rows), "stat": stat}, ensure_ascii=False))


def write_md(rows, stat):
    import collections
    order = ["EXACT", "VERBATIM", "VARIANT", "EDITED", "MISS"]
    clean = stat.get("EXACT", 0) + stat.get("VERBATIM", 0)
    L = ["# 格言校对报告", "",
         "> 语料：daizhigev20（四库全书等，繁体无标点，已繁简+异体归一）",
         "> 本次不改动任何数据，仅出报告。", "",
         "## 总览", "",
         f"- 共 {len(rows)} 条，**完全/近似逐字命中 {clean} 条（{clean*100//len(rows)}%）**",
         f"- 需人工确认 {len(rows)-clean} 条", "",
         "| 等级 | 数量 | 含义 |", "|---|---|---|",
         f"| EXACT | {stat.get('EXACT',0)} | 原文逐字命中 |",
         f"| VERBATIM | {stat.get('VERBATIM',0)} | 对齐后相似度≥0.95 |",
         f"| VARIANT | {stat.get('VARIANT',0)} | 异体/个别用字差异，多可保留 |",
         f"| EDITED | {stat.get('EDITED',0)} | 有增删/拼接，需逐条确认 |",
         f"| MISS | {stat.get('MISS',0)} | 标注出处找不到 |", ""]

    per = collections.defaultdict(collections.Counter)
    for r in rows:
        per[r["person"]][r["status"]] += 1
    L += ["## 按人物", "", "| 人物 | 干净 | VARIANT | EDITED | MISS |", "|---|---|---|---|---|"]
    for p in sorted(per):
        c = per[p]
        L.append(f"| {p} | {c['EXACT']+c['VERBATIM']} | {c['VARIANT']} | {c['EDITED']} | {c['MISS']} |")
    L.append("")

    bad = [r for r in rows if r["status"] not in ("EXACT", "VERBATIM")]
    bad.sort(key=lambda r: (order.index(r["status"]), r["person"]))
    L += ["## 需确认明细", ""]
    for r in bad:
        L.append(f"### {r['id']} [{r['status']} {r['ratio']}] {r['source']}")
        L.append(f"- 现文：{r['text']}")
        L.append(f"- 标注出处近邻：{r['ctx'] or '（未定位到）'}")
        if r["suggest_file"] and r["suggest_ratio"] >= 0.6:
            L.append(f"- 反查建议：`{r['suggest_file']}`（{r['suggest_ratio']}） {r['suggest_ctx']}")
        else:
            L.append("- 反查建议：**全语料无命中 → 疑似改写/非原文，或该文献不在语料库**")
        L.append("")
    open(os.path.join(OUT, "audit-report.md"), "w", encoding="utf-8").write("\n".join(L))


if __name__ == "__main__":
    run(sys.argv[1:] or None)
