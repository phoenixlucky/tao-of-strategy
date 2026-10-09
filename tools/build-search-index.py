# -*- coding: utf-8 -*-
"""从 daizhigev20 生成前端全文检索索引。

产出（纯静态，零依赖）:
    search/index.json     书目清单（很小，先加载）
    search/<group>.json   分组全文（按需加载）
"""
import os, re, json, sys

sys.path.insert(0, os.path.dirname(__file__))
import proofread as P

CORPUS, OUT = P.CORPUS, os.path.join(P.PROJECT, "search")

GROUPS = {
    "兵家": ["子藏/兵家"],
    "诸子": ["子藏/诸子"],
    "道家": [
        "道藏/藏外/老子道德经（晋王弼）.txt", "道藏/正统道藏洞神部/本文类/道德经古本篇.txt",
        "道藏/藏外/庄子.txt", "道藏/藏外/列子.txt", "道藏/藏外/文子.txt",
        "道藏/藏外/关尹子.txt", "道藏/藏外/抱朴子内外篇.txt",
        "道藏/正统道藏洞真部/本文类/黄帝阴符经.txt",
    ],
}

_ws = re.compile(r"[ \t\u3000]+")


def paras(text):
    out = []
    for ln in text.splitlines():
        ln = _ws.sub("", ln).strip()
        if len(ln) >= 8:
            out.append(P.norm(ln))
    return out


def collect():
    """返回 [(group, rel)] 全部待索引文件。"""
    items = []
    for group, specs in GROUPS.items():
        for spec in specs:
            if spec.endswith(".txt"):
                items.append((group, spec))
            else:
                d = P.abspath(spec)
                for f in sorted(os.listdir(d)):
                    if f.endswith(".txt"):
                        items.append((group, os.path.relpath(os.path.join(d, f), CORPUS).replace(os.sep, "/")))
    return items


def main():
    os.makedirs(OUT, exist_ok=True)
    items = collect()
    P.build_charmap([rel for _, rel in items])
    index = []
    for group in GROUPS:
        books = []
        for g, rel in items:
            if g != group:
                continue
            try:
                raw = open(P.abspath(rel), encoding="utf-8", errors="ignore").read()
            except OSError:
                continue
            title = os.path.splitext(os.path.basename(rel))[0]
            books.append({"title": title, "file": rel, "paras": paras(raw)})
        payload = {"group": group, "books": books}
        json.dump(payload, open(os.path.join(OUT, f"{group}.json"), "w", encoding="utf-8"),
                  ensure_ascii=False, separators=(",", ":"))
        index.append({"group": group, "books": len(books),
                      "paras": sum(len(b["paras"]) for b in books)})
    json.dump({"groups": index}, open(os.path.join(OUT, "index.json"), "w", encoding="utf-8"),
              ensure_ascii=False)
    for g in index:
        p = os.path.join(OUT, g["group"] + ".json")
        print(f"{g['group']}: {g['books']} 本 {g['paras']} 段 {os.path.getsize(p)//1024} KB")


if __name__ == "__main__":
    main()
