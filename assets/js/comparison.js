/* ========================================
   韬略之道 · 反者道之动 — 对比逻辑
   ======================================== */

/* ---- 预置对比对（人工精选） ---- */
const COMPARISONS = [
  {
    title: "水之道：避高趋下 vs 利而不争",
    jin: {
      personId: "sunzi", text: "夫兵形象水，水之形避高而趋下，兵之形避实而击虚。",
      source: "《孙子兵法·虚实篇》", interp: "水流避高就低——兵家的'避实击虚'正是效法水的自然规律。看似柔弱的水，选择最低处走，反而能穿透最坚硬的石头。",
      tags: ["进取", "形势", "守柔"], person: "孙子"
    },
    bi: {
      personId: "laozi", text: "上善若水。水善利万物而不争，处众人之所恶，故几于道。",
      source: "《道德经》第八章", interp: "水不争却利万物——道家的'不争'不是无能，而是选择最低的位置，反而成就了最高的善。",
      tags: ["避世", "不争", "守柔"], person: "老子"
    },
    insight: "同一个'水'的隐喻——兵家取其'形'，道家取其'德'。一用一体，殊途同归。"
  },
  {
    title: "示弱藏锋：能而示之不能 vs 大智若愚",
    jin: {
      personId: "sunzi", text: "能而示之不能，用而示之不用，近而示之远，远而示之近。",
      source: "《孙子兵法·始计篇》", interp: "兵家的诡道核心——制造假象迷惑对手。能打却装作不能，是最重要的战略伪装。",
      tags: ["进取", "诡道", "权变"], person: "孙子"
    },
    bi: {
      personId: "laozi", text: "大直若屈，大巧若拙，大辩若讷。",
      source: "《道德经》第四十五章", interp: "道家的辩证智慧——最正直的看似弯曲，最灵巧的看似笨拙。真正的强大不需要证明。",
      tags: ["避世", "大智若愚", "归根"], person: "老子"
    },
    insight: "'能而示之不能'（兵家主动伪装）与'大巧若拙'（道家本然状态）——一个主动、一个自然，表象同一，动机不同。"
  },
  {
    title: "反者道动：欲擒故纵 vs 微明",
    jin: {
      personId: "sunbin", text: "围魏救赵——批亢捣虚，形格势禁，则自为解耳。",
      source: "《史记·孙子吴起列传》", interp: "不直接救赵，而攻魏国都城——用逆向思维解围。打击敌人的要害，比正面硬拼更有效。",
      tags: ["进取", "奇正", "诡道"], person: "孙膑"
    },
    bi: {
      personId: "laozi", text: "将欲歙之，必固张之；将欲弱之，必固强之；将欲废之，必固兴之；将欲取之，必固与之。是谓微明。",
      source: "《道德经》第三十六章", interp: "想要收缩它，先扩张它——这就是幽微的明觉。一切事物必然走向反面，智者利用这一规律。",
      tags: ["避世", "阴阳相生", "归根"], person: "老子"
    },
    insight: "同一条'反者道之动'规律——兵家用来制敌（围魏救赵），道家用来明理（微明）。同一逻辑，两面应用。"
  },
  {
    title: "不战全胜：不战而屈人 vs 不争而胜",
    jin: {
      personId: "sunzi", text: "不战而屈人之兵，善之善者也。故上兵伐谋，其次伐交，其次伐兵，其下攻城。",
      source: "《孙子兵法·谋攻篇》", interp: "兵家的最高境界——不用打就赢了。谋略、外交优先于武力。这也是兵家最接近道家的一句。",
      tags: ["进取", "全胜", "庙算"], person: "孙子"
    },
    bi: {
      personId: "laozi", text: "夫唯不争，故天下莫能与之争。",
      source: "《道德经》第二十二章", interp: "因为不与人争，所以天下没有人能跟他争。不争是最高级的争——超越竞争本身。",
      tags: ["避世", "不争", "无为"], person: "老子"
    },
    insight: "孙子说'不战'，老子说'不争'——一个是战略选择，一个是处世哲学。在'不动武而达成目的'这一点上，两人殊途同归。"
  },
  {
    title: "无名之功：无智名无勇功 vs 神人无功",
    jin: {
      personId: "sunzi", text: "故善战者之胜也，无智名，无勇功。",
      source: "《孙子兵法·军形篇》", interp: "真正善战的人取胜时没有智谋的名声、没有勇武的战功——因为他在'形'的层面已经赢了。",
      tags: ["进取", "全胜", "大智若愚"], person: "孙子"
    },
    bi: {
      personId: "zhuangzi", text: "至人无己，神人无功，圣人无名。",
      source: "《庄子·逍遥游》", interp: "最高境界的人没有自我，没有功绩，没有名声。彻底的'无'——这是道家理想人格的巅峰。",
      tags: ["避世", "无为", "逍遥"], person: "庄子"
    },
    insight: "孙子与庄子在此处惊人地一致。最高水平的将领没有战功之名——因为他早已在无形中赢了。这正是'至人无己'在军事上的映射。"
  },
  {
    title: "柔弱胜刚：守柔曰强 vs 以柔克刚",
    jin: {
      personId: "lijing", text: "攻是守之机，守是攻之策。同归乎胜而已矣。",
      source: "《唐太宗李卫公问对·卷下》", interp: "攻与守不是对立的——攻中有守的契机，守中有攻的策略。看似柔弱的防守，可能是最强硬的进攻。",
      tags: ["进取", "阴阳相生", "形势"], person: "李靖"
    },
    bi: {
      personId: "liezi", text: "天下有常胜之道，有不常胜之道。常胜之道曰柔，常不胜之道曰强。",
      source: "《列子·黄帝》", interp: "列子以兵家口吻讲道家智慧：常胜的秘诀不是刚强而是柔弱。柔不是弱——柔才是永恒的胜道。",
      tags: ["避世", "守柔", "不争"], person: "列子"
    },
    insight: "李靖说'攻守一体'，列子说'常胜曰柔'——看似一个谈战术、一个谈哲学，但都在说同一个道理：看似对立的两面其实是统一的。"
  },
  {
    title: "功成身退：飞鸟尽良弓藏 vs 从赤松子游",
    jin: {
      personId: "fanli", text: "蜚鸟尽，良弓藏；狡兔死，走狗烹。越王为人长颈鸟喙，可与共患难，不可与共乐。子何不去？",
      source: "《史记·越王勾践世家》", interp: "功成之后最危险。范蠡看透了'功高震主'的规律，选择在巅峰时刻离开——这是兵家对生存的清醒认知。",
      tags: ["进取", "功成身退", "权变"], person: "范蠡"
    },
    bi: {
      personId: "zhangliang", text: "今以三寸舌为帝者师，封万户侯，此布衣之极，于良足矣。愿弃人间事，欲从赤松子游耳。",
      source: "《史记·留侯世家》", interp: "张良在功成名就后选择修仙——不是逃避，而是知道什么时候该结束。'此布衣之极，于良足矣'——知足才是保身之道。",
      tags: ["避世", "功成身退", "逍遥"], person: "张良"
    },
    insight: "范蠡和张良——中国历史上最完美的两次'功成身退'。一个去经商，一个去修仙。路径不同，智慧同一：知道'止'比知道'进'更难。"
  },
  {
    title: "以逸待劳：先为不可胜 vs 不敢为天下先",
    jin: {
      personId: "sunzi", text: "昔之善战者，先为不可胜，以待敌之可胜。不可胜在己，可胜在敌。",
      source: "《孙子兵法·军形篇》", interp: "先确保自己不输，再等待敌人犯错。真正的主动权不在'攻'，而在'不可胜'的防守中。",
      tags: ["进取", "庙算", "无为"], person: "孙子"
    },
    bi: {
      personId: "laozi", text: "我有三宝，持而保之：一曰慈，二曰俭，三曰不敢为天下先。",
      source: "《道德经》第六十七章", interp: "不敢为天下先——不做出头鸟。这不是懦弱，而是知道先动者往往先露出破绽的智慧。",
      tags: ["避世", "不争", "守柔"], person: "老子"
    },
    insight: "孙子说'以待敌之可胜'——等；老子说'不敢为天下先'——等。同样的'等待'，在战场上叫战略忍耐，在生活中叫处世智慧。"
  }
];

/* ---- State ---- */
let currentComparison = null;
let flipped = false;

/* ---- Render ---- */
function renderComparison(idx) {
  flipped = false;
  const pair = COMPARISONS[idx];
  const container = document.getElementById('comparisonContainer');
  container.innerHTML = '';
  container.appendChild(buildPairCard(pair));
  currentComparison = pair;
  document.getElementById('pairCount').textContent = `第 ${idx+1}/${COMPARISONS.length} 组`;
}

function buildPairCard(pair) {
  const card = document.createElement('div');
  card.className = 'pair-card';

  // Header
  const header = document.createElement('div');
  header.className = 'pair-header';
  header.innerHTML = `🪙 ${pair.title}`;
  card.appendChild(header);

  // Body
  const body = document.createElement('div');
  body.className = 'pair-body';

  // Left side
  if (flipped) {
    body.appendChild(buildSide(pair.bi, 'bi', '☯️ 避世面·道家'));
    // Right side
    body.appendChild(buildSide(pair.jin, 'jin', '⚔️ 进取面·兵家'));
  } else {
    body.appendChild(buildSide(pair.jin, 'jin', '⚔️ 进取面·兵家'));
    // Right side
    body.appendChild(buildSide(pair.bi, 'bi', '☯️ 避世面·道家'));
  }

  card.appendChild(body);

  // Insight footer
  const footer = document.createElement('div');
  footer.style.cssText = 'padding:16px 24px;background:#f8f6f2;border-top:1px solid var(--border);font-size:0.88rem;color:var(--text);line-height:1.7;border-radius:0 0 14px 14px;';
  footer.innerHTML = `<strong>💡 一体两面</strong>：${pair.insight}`;
  card.appendChild(footer);

  return card;
}

function buildSide(data, faceClass, labelText) {
  const side = document.createElement('div');
  side.className = `pair-side ${faceClass}-side`;

  const label = document.createElement('span');
  label.className = `pair-side-label label-${faceClass}`;
  label.textContent = labelText;
  side.appendChild(label);

  const text = document.createElement('div');
  text.className = 'pair-quote-text';
  text.textContent = data.text;
  side.appendChild(text);

  const meta = document.createElement('div');
  meta.className = 'pair-quote-meta';
  meta.innerHTML = `${data.person} · ${data.source}`;
  side.appendChild(meta);

  const interp = document.createElement('div');
  interp.className = 'pair-interp';
  interp.textContent = data.interp;
  side.appendChild(interp);

  const tags = document.createElement('div');
  tags.className = 'pair-tags';
  data.tags.forEach(t => {
    const span = document.createElement('span');
    span.textContent = `#${t}`;
    tags.appendChild(span);
  });
  side.appendChild(tags);

  return side;
}

/* ---- Random Comparison ---- */
function randomComparison() {
  flipped = false;
  const idx = Math.floor(Math.random() * COMPARISONS.length);
  renderComparison(idx);
}

/* ---- Flip (swap left/right) ---- */
function flipComparison() {
  if (!currentComparison) return;
  flipped = !flipped;
  const pair = currentComparison;
  // Reset title each time — the visual swap speaks for itself
  pair.title = pair.title.replace(' 🔄 翻转', '');
  if (flipped) pair.title = pair.title + ' 🔄 翻转';
  const container = document.getElementById('comparisonContainer');
  container.innerHTML = '';
  container.appendChild(buildPairCard(pair));
}

/* ---- Auto-generate random pair from quotes.json ---- */
async function autoCompare() {
  flipped = false;
  try {
    const res = await fetch('quotes/quotes.json');
    const data = await res.json();
    const allQuotes = data.quotes;

    const jinQuotes = allQuotes.filter(q => q.face === 'jin');
    const biQuotes = allQuotes.filter(q => q.face === 'bi');

    const jin = jinQuotes[Math.floor(Math.random() * jinQuotes.length)];
    const bi = biQuotes[Math.floor(Math.random() * biQuotes.length)];

    const autoPair = {
      title: `🎲 随机配对：${jin.titleEn || '进取'} ↔ ${bi.titleEn || '避世'}`,
      jin: {
        text: jin.text,
        source: jin.source,
        interp: jin.interp || '（源自兵家格言）',
        tags: jin.tags || [],
        person: getPersonName(jin.personId),
        personId: jin.personId
      },
      bi: {
        text: bi.text,
        source: bi.source,
        interp: bi.interp || '（源自道家格言）',
        tags: bi.tags || [],
        person: getPersonName(bi.personId),
        personId: bi.personId
      },
      insight: '系统自动从进取/避世两库中随机各取一句并列展示。你会发现，很多看似不相关的话，放在一起却能产生新的意味。'
    };

    const container = document.getElementById('comparisonContainer');
    container.innerHTML = '';
    container.appendChild(buildPairCard(autoPair));
    currentComparison = autoPair;
    document.getElementById('pairCount').textContent = '🎲 随机配对';

  } catch (e) {
    document.getElementById('comparisonContainer').innerHTML =
      '<div style="text-align:center;padding:40px;color:var(--text-muted);">数据加载失败</div>';
  }
}

function getPersonName(id) {
  const map = {
    'sunzi': '孙子', 'wuzi': '吴起', 'sunbin': '孙膑', 'weiliao': '尉缭',
    'caocao': '曹操', 'lijing': '李靖', 'hanxin': '韩信', 'simarangju': '司马穰苴',
    'laozi': '老子', 'zhuangzi': '庄子', 'liezi': '列子', 'wenzi': '文子',
    'heshanggong': '河上公',
    'fanli': '范蠡', 'zhangliang': '张良', 'zhugeliang': '诸葛亮',
    'liubowen': '刘伯温', 'wangyangming': '王阳明'
  };
  return map[id] || id;
}

/* ---- Init ---- */
document.addEventListener('DOMContentLoaded', () => {
  renderComparison(0);
});
