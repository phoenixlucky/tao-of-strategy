# -*- coding: utf-8 -*-
"""从语料抽取候选格言句（供人工筛选）。用法: python tools/extract.py"""
import os, re, sys
sys.path.insert(0, os.path.dirname(__file__))
import proofread as P

BOOKS = {
    "bingjing":   "子藏/兵家/兵经百言.txt",
    "hanfei":     "子藏/法家/韩非子.txt",
    "renwuzhi":   "子藏/诸子/人物志.txt",
    "kangcangzi": "子藏/诸子/亢仓子.txt",
    "wenzhongzi": "子藏/诸子/文中子中说.txt",
    "shenzi":     "子藏/诸子/慎子.txt",
    "zihuazi":    "子藏/诸子/子华子.txt",
    "shizi":      "子藏/诸子/尸子.txt",
}
BAD = re.compile(r"钦定|四库|提要|卷第|臣等谨案|一作|音释|篇第|目录")


def clauses(text):
    t = text.replace("\n", "")
    if any(c in text for c in "。！？"):
        parts = re.split(r"[。！？]", t)
    else:
        t = re.sub(r"(?<=[也矣乎哉焉耶耳])", "|", t)
        t = re.sub(r"(?=(夫|故曰|故|是以|是故|然则|何则|凡|所谓))", "|", t)
        parts = t.split("|")
    out = []
    for p in parts:
        if "一作" in p or "音" in p[:1]:
            p = p.split("一作")[0]
        p = p.strip("，、；： ")
        if 8 <= len(p) <= 46:
            out.append(p)
    return out


def main():
    os.makedirs(os.path.join(P.OUT, "_cand"), exist_ok=True)
    files = list(BOOKS.values())
    P.build_charmap(files)
    for key, rel in BOOKS.items():
        raw = open(P.abspath(rel), encoding="utf-8", errors="ignore").read()
        simp = P.norm(raw)
        seen, keep = set(), []
        for c in clauses(simp):
            if BAD.search(c) or c in seen:
                continue
            seen.add(c)
            keep.append(c)
        open(os.path.join(P.OUT, "_cand", key + ".txt"), "w", encoding="utf-8").write("\n".join(keep[:70]))
        print(key, len(keep))


if __name__ == "__main__":
    main()
