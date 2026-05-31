# 韬略之道 · AGENTS 项目知识

## 身份

你是这个知识库的维护助手。项目"韬略之道"汇集兵家与道家格言，以"一体两面"为核心理念。

**核心规则：每一句格言都必须从两面去看——进取（兵家）和避世（道家）。**

## 文件导航

| 你想做什么 | 去哪个文件 |
|-----------|----------|
| 改首页设计 | `index.html` + `assets/css/style.css` |
| 改对比页 | `comparison.html` + `assets/js/comparison.js` |
| 改样式 | `assets/css/style.css`（全局）/ `comparison.css`（对比页）/ `markdown.css`（Jekyll 编译页）|
| 改交互逻辑 | `assets/js/app.js`（首页）/ `comparison.js`（对比页）|
| 增删人物格言 | `people/{bingjia,daojia,crossover}/xxx.md` |
| 增删主题 | `topics/xxx.md` |
| 更新统计数据 | `overview.md` |
| 更新结构化数据 | `quotes/quotes.json` |
| 改 Jekyll 布局 | `_layouts/default.html` |
| 改网站配置 | `_config.yml` |

## 技术栈

- 纯前端静态网站（零依赖，无框架）
- GitHub Pages 部署（Jekyll 编译 markdown）
- CSS 自定义属性（variables）做主题
- 原生 JS，无第三方库
- 数据源：`quotes/quotes.json`（180条）

## 导航一致性规则

所有 HTML 页面必须使用相同的导航栏结构：

```
🏠 首页 | 🏯 兵家 | ☯️ 道家 | 🔄 跨界 | 🪙 对比 | 📚 主题 | 📖 关于
```

导航链接使用**绝对路径** `/tao-of-strategy/xxx.html`（除首页用相对路径 `index.html`）。

维护以下文件的导航一致性：
1. `index.html`（静态首页）
2. `comparison.html`（对比页）
3. `_layouts/default.html`（Jekyll 布局，所有 .md 编译页用）
4. `people/bingjia/index.html`
5. `people/daojia/index.html`
6. `people/crossover/index.html`

## 格言数据字段

`quotes.json` 中每条格言的结构：

| 字段 | 必需 | 说明 |
|------|------|------|
| `id` | 是 | `{personId}-{N}` |
| `personId` | 是 | 人物标识（如 `sunzi`） |
| `text` | 是 | 原文 |
| `source` | 是 | 出处 |
| `face` | 是 | `jin`（进取）/ `bi`（避世）/ `zhuan`（转化） |
| `tags` | 是 | 标签数组 |
| `interp` | 是 | 一面解读（网页展示用） |
| `titleEn` | 否 | 英文标题 |

## 常见问题排查

1. **页面 404** → 检查 nav 链接是 `.html` 而非 `.md`
2. **样式丢失** → 检查路径是 `/tao-of-strategy/assets/css/style.css`
3. **表格不渲染** → 检查 `.md` 文件有 frontmatter（`---`）且有 `layout: default`
4. **中文乱码** → 确保文件保存为 UTF-8
