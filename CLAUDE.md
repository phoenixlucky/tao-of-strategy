# 韬略之道 · Tao of Strategy — 项目记忆

## 项目概述

兵家与道家格言汇编，以"一体两面"为核心理念——同一句格言从进取面（兵家）和避世面（道家）各解读一遍。

- 副标题：The one coin with two sides: Wuwei & War
- 定位：格言知识库 + 静态展示网站

## 项目结构

```
/
├── index.html              # 格言浏览主页（标签筛选、随机卡片、每日一面）
├── comparison.html         # 反者道之动对比页（兵家 vs 道家并列）
├── about.md                # 项目哲学与标签体系
├── overview.md             # 数据总览与 Roadmap（Jekyll 编译为 overview.html）
├── _config.yml             # Jekyll 配置
├── _layouts/default.html   # Jekyll 布局模板（所有 .md 编译页共用）
├── people/
│   ├── bingjia/            # 兵家人物（8人 × 10条）
│   ├── daojia/             # 道家人物（5人 × 10条）
│   └── crossover/          # 跨界人物（5人 × 10条）
├── topics/                 # 6个主题聚合
├── quotes/quotes.json      # 180条结构化格言数据
└── assets/
    ├── css/style.css       # 全局样式
    ├── css/comparison.css  # 对比页样式
    ├── css/markdown.css    # Jekyll 编译页样式
    └── js/app.js           # 首页交互逻辑
```

## 核心约定

### 格言格式
每条格言在 `.md` 文件中有五个要素：
1. **原文**（必需）— 中文原典
2. **出处**（必需）— 《书名·篇名》
3. **译文**（建议）— 现代白话
4. **一面解读**（核心）— 1-2 句点明进取面或避世面
5. **标签**（必需）— 按标签系统归类

### 标签系统
- **进取面**（兵家）：谋攻、奇正、速决、形势、诡道、用间、任势、庙算、全胜
- **避世面**（道家）：无为、不争、守柔、知足、逍遥、归根、玄同
- **转化面**（融合）：功成身退、大智若愚、以退为进、后发先至、阴阳相生

### 页面路由
- 静态 `.html` 页面直接访问（index, comparison, 分类索引）
- 所有 `.md` 文件由 Jekyll 编译为 `.html`（路径同，扩展名变）
- 导航使用绝对路径 `/tao-of-strategy/xxx.html`

### 部署
- GitHub Pages 自动构建
- Jekyll 编译 markdown → HTML
- 根目录为 `/tao-of-strategy/`（项目页）

## 关键设计决策

1. 中文文件名曾导致 Jekyll 渲染失败 → 全部改用英文名
2. `<base>` 标签破坏子目录相对路径 → 移除，改用绝对路径 `/tao-of-strategy/`
3. Jekyll `defaults` 配置未生效 → 在每个 `.md` 文件显式声明 `layout: default`
4. 分类导航硬编码为单一人名 → 创建 `index.html` 索引页

## 常用操作

- **新增人物**：在 `people/{bingjia,daojia,crossover}/` 下创建 `.md` 文件 + 在前端 `app.js` 的 `personDisplayName` 映射中添加
- **新增主题**：在 `topics/` 下创建 `.md` 文件 + 更新 `overview.md` 表格
- **新增格言**：在对应人物 `.md` 中按模板增补 + 更新 `quotes.json`
- **本地测试**：`python -m http.server` 或直接打开 `index.html`
