# -*- coding: utf-8 -*-
"""吸收 phoenixlucky/weiliaozi 权威版：为「主题聚合」补入尉缭子格言。
- 追加到 quotes.json（personId=weiliao, id=weiliao-21..38）
- 追加到 people/bingjia/weiliao.md（格言二十一..）
用法: python tools/absorb-weiliao.py
"""
import os, json, io, re

PROJECT = r"E:\home\tao-of-strategy"
QP = os.path.join(PROJECT, "quotes", "quotes.json")
MD = os.path.join(PROJECT, "people", "bingjia", "weiliao.md")

# (序号, 原文, 出处, face, tags, 译文, 英文, 一面解读)
Q = [
(21,"胜兵似水。夫水至柔弱者也，然所以触，丘陵必为之崩，无异也，性专而触诚也。","《尉缭子·武议》","zhuan",["转化","守柔","形势"],
 "胜利的军队像水。水是最柔弱的，但它所冲击的地方，丘陵也必定崩坏，没有别的原因，是它专一而冲击真诚。",
 "A victorious army is like water — the softest thing, yet what it strikes, even hills collapse; because it is single-minded and its impact is sincere.",
 "转化面——进取面：以柔克刚、专一而诚则无坚不摧。避世面：水至柔而胜刚，正是老子「天下莫柔弱于水」。"),
(22,"故善将者，爱与威而已。","《尉缭子·攻权》","zhuan",["转化","修身","治国"],
 "所以善于做将帅的，不过是爱与威罢了。",
 "Thus the skilled general has nothing but love and authority.",
 "转化面——进取面：爱与威（柔与刚）并用。避世面：爱近于慈、威近于法，刚柔一体。"),
(24,"故正兵贵先，奇兵贵后，或先或后，制敌者也。","《尉缭子·勒卒令》","zhuan",["转化","奇正","形势"],
 "所以正兵贵在先动，奇兵贵在后动，或先或后，都是为了制敌。",
 "The regular force values going first; the extraordinary force values going after — first or after, both serve to master the enemy.",
 "转化面——进取面：先后之择在于制敌。避世面：不固定先后，随时而变。"),
(25,"兵贵先胜于此，则胜彼矣；弗胜于此，则弗胜彼矣。","《尉缭子·战权》","jin",["进取","庙算","全胜"],
 "用兵贵在先在自身立于胜，才能胜敌；自身不能立于胜，就不能胜敌。",
 "In war, first win where you stand; then you win over the enemy. Fail to win here, and you will not win there.",
 "进取面——先胜于己。避世面：先为不可胜。"),
(27,"兵胜于朝廷，胜于丧纪，胜于土功，胜于市井。","《尉缭子·兵谈》","zhuan",["转化","治国","全胜"],
 "用兵的胜利在于朝廷（庙算），在于丧纪，在于土功，在于市井。",
 "Victory in arms is won in the court, in mourning rites, in public works, in the marketplace.",
 "转化面——进取面：胜负早在庙堂、制度、民生中决定。避世面：不战而胜，近于无为。"),
(28,"治兵者，若秘于地，若邃于天，生于无。","《尉缭子·兵谈》","bi",["避世","无为","归根"],
 "治理军队，像秘藏于地、深邃如天，生于「无」。",
 "He who governs troops is hidden as in the earth, deep as heaven — born of nothing.",
 "避世面——「生于无」，近于老子「有生于无」。进取面：无形而不可测。"),
(30,"百战百胜，非善之善者也；不战而胜，善之善者也。","《尉缭子·兵谈》","zhuan",["转化","不争","全胜"],
 "百战百胜，不是最好的；不战而胜，才是最好的。",
 "A hundred victories in a hundred battles is not the best; to win without fighting is the best.",
 "转化面——进取面：以不战为最高。避世面：与老子「善胜敌者不与」相合。"),
(31,"凡兵不攻无过之城，不杀无罪之人。","《尉缭子·武议》","zhuan",["转化","全胜","修身"],
 "凡用兵不攻打无过之城，不杀害无罪之人。",
 "The army never attacks a guiltless city nor kills the innocent.",
 "转化面——避世面：仁及无辜，兵所以诛乱禁不义。进取面：义兵乃能全胜。"),
(33,"兵以静固，以专胜。力分者弱，心疑者背。","《尉缭子·攻权》","bi",["避世","形势","守柔"],
 "军队靠静而稳固，靠专一而取胜。力量分散就弱，心怀疑虑就背离。",
 "The army is made firm by stillness and victorious by singleness of purpose. Divided strength is weak; a doubting heart turns away.",
 "避世面——以静以专，近于老子「清静」「抱一」。进取面：专一则胜。"),
(34,"矢射未交，长刃未接，先噪者虚，后噪谓之实，不噪谓之闭，虚实者兵之体也。","《尉缭子·兵令上》","jin",["进取","虚实","诡道"],
 "箭未交锋、刃未相接，先鼓噪的为虚，后鼓噪的为实，不鼓噪的为闭——虚实是用兵的根本。",
 "Before arrows fly and blades meet: those who shout first are empty, those who shout later are full, those who do not shout are closed — emptiness and fullness are the very body of war.",
 "进取面——虚实示形。避世面：有无相生。"),
(36,"今以莫邪之利，犀兕之坚，三军之众，有所奇正，则天下莫当其战矣。","《尉缭子·武议》","jin",["进取","奇正","形势"],
 "如今凭莫邪的锋利、犀兕的坚固、三军之众，再加上奇正的运用，天下就没有能抵挡它的了。",
 "With the keenness of Moye, the toughness of rhino-hide, the host of the three armies, and the use of the regular and the extraordinary, nothing under heaven can withstand it.",
 "进取面——奇正相配则无敌。避世面：奇正相生，如环无端。"),
(37,"善御敌者，正兵先合，而后振之，此必胜之术也。","《尉缭子·兵令上》","jin",["进取","奇正","全胜"],
 "善于抵御敌人的人，正兵先交合，然后振起（奇兵），这是必胜之术。",
 "He who handles the enemy well joins with the regular force first, then rouses it — this is the art of certain victory.",
 "进取面——以正合、以奇胜。避世面：先后有序。"),
(38,"鼓之前如霆，动如风雨，莫敢当其前，莫敢蹑其后。","《尉缭子·经卒令》","jin",["进取","速决","形势"],
 "鼓声一响前进如雷霆，行动如风雨，没有人敢挡在前，也没有人敢追在后。",
 "At the drum they advance like thunder, move like wind and rain; none dare block their front, none dare tread their rear.",
 "进取面——进不可当、退不可追。避世面：动如风雨、静如止水。"),
(39,"战胜其国，则攻其都；不胜其国，不攻其都。","《尉缭子·兵谈》","jin",["进取","庙算","全胜"],
 "能战胜其国，才攻它的都城；不能战胜其国，就不攻它的都城。",
 "If you can prevail over the state, attack its capital; if you cannot prevail over the state, do not attack its capital.",
 "进取面——量力而进。避世面：知止不进。"),
(40,"兵者凶器也，争者逆德也，将者死官也。故不得已而用之。","《尉缭子·武议》","bi",["避世","不争"],
 "兵是凶器，争是逆德，将帅是死官。所以只有不得已才用它。",
 "Weapons are inauspicious instruments, contention a contrary virtue, and the general an office of death — hence used only when there is no alternative.",
 "避世面——兵为凶器、争为逆德，近于老子。进取面：不得已而用之。"),
(41,"兵起，非可以忿也，见胜则兴，不见胜则止。","《尉缭子·兵谈》","zhuan",["转化","不争","庙算"],
 "起兵不可以因愤怒，见到能胜才发动，见不到能胜就停止。",
 "War must not be raised in anger: if victory is foreseeable, rise; if not, stop.",
 "转化面——进取面：见胜则兴。避世面：不见胜则止，近于知止。"),
(42,"故知道者，必先图不知止之败。","《尉缭子·战权》","bi",["避世","知足","庙算"],
 "所以懂得道的人，必先谋划「不知止」的失败。",
 "Thus one who knows the Way first reckons the defeat that comes of not knowing when to stop.",
 "避世面——知止则不殆。进取面：先图其败而后进。"),
(43,"夫将者，上不制于天，下不制于地，中不制于人。","《尉缭子·兵谈》","jin",["进取","任势","庙算"],
 "将帅，上不受制于天，下不受制于地，中不受制于人。",
 "The general is bound by neither heaven above, nor earth below, nor men in between.",
 "进取面——独立自主、择势而行。避世面：不倚外物。"),
]


def main():
    data = json.load(open(QP, encoding="utf-8"))
    existing = {q["id"] for q in data["quotes"]}
    added = 0
    for n, text, source, face, tags, trans, en, interp in Q:
        qid = f"weiliao-{n}"
        if qid in existing:
            continue
        data["quotes"].append({
            "text": text, "source": source, "interp": interp, "tags": tags,
            "face": face, "personId": "weiliao", "id": qid, "translation": trans,
        })
        added += 1
    data["meta"]["total"] = len(data["quotes"])
    json.dump(data, open(QP, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    print(f"quotes.json: +{added} -> total {len(data['quotes'])}")

    md = io.open(MD, encoding="utf-8").read()
    # 幂等：先移除已有的数字编号块（### 格言21 …）
    md = re.sub(r"### 格言\d+\n\n(?:- .*\n)+\n?", "", md)
    blocks = []
    for n, text, source, face, tags, trans, en, interp in Q:
        blocks.append(f"### 格言{n}\n\n"
                      f"- **原文**：{text}\n"
                      f"- **出处**：{source}\n"
                      f"- **译文**：{trans}\n"
                      f"- **英文翻译**：{en}\n"
                      f"- **一面解读**：{interp}\n"
                      f"- **标签**：{' '.join('`'+t+'`' for t in tags)}\n")
    insert = "\n".join(blocks)
    marker = "\n---\n\n## 后世评注与关联"
    if marker in md:
        md = md.replace(marker, "\n" + insert + marker, 1)
        io.open(MD, "w", encoding="utf-8").write(md)
        print("weiliao.md updated")
    else:
        print("!! marker not found, md unchanged")


if __name__ == "__main__":
    main()
