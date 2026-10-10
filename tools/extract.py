# -*- coding: utf-8 -*-
"""从语料抽取候选格言句（供人工筛选）。用法: python tools/extract.py"""
import os, re, sys
sys.path.insert(0, os.path.dirname(__file__))
import proofread as P

BOOKS = {
    "shoucheng":  "史藏/志存记录/守城录.txt",
    "jianshu":    "子藏/兵家/间书.txt",
    "binglei":    "子藏/兵家/兵垒.txt",
    "yuzi":       "道藏/正统道藏太清部/鬻子.txt",
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
        open(os.path.join(P.OUT, "_cand", key + ".txt"), "w", encoding="utf-8").write("\n".join(keep[:130]))
        print(key, len(keep))


if __name__ == "__main__":
    main()
