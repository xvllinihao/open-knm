# Contributing to Open KNM / 参与贡献

**[中文]** | [English](#english)

---

## 🇨🇳 中文指南

首先，感谢你考虑为 Open KNM 做出贡献！正是像你这样的贡献者让这个开源项目成为每个人都能受益的工具。

### 如何参与？

你可以通过多种方式参与贡献：

1. **报告问题 (Reporting Issues)**：
   - 如果你发现了网站 Bug、内容错误或过时的信息，请直接提交 [GitHub Issue](https://github.com/xvllinihao/open-knm/issues)。
   - 请清楚描述问题所在，如果可能的话，附上截图。

2. **贡献内容 (Contributing Content)**：
   - 我们非常欢迎你撰写新的 KNM 知识点或生活指南。
   - 文章元数据位于 `src/lib/articles.ts`，正文内容位于 `src/data/articles/*.mdx`（一篇知识点通常有中/英或荷/中各一份）。
   - 建议从 `src/data/articles/_template.en.mdx` 与 `src/data/articles/_template.zh.mdx` 复制模板开始写，以保持左右两栏布局一致。
   - 提交内容时，请尽量提供 **中英双语** 版本，并在文末根据需要加一个简短的 **Wikipedia 延伸阅读区块**（2–5 个相关英文 Wikipedia 链接，参考现有文章写法）。

3. **改进代码 (Code Improvements)**：
   - 如果你懂前端开发 (React/Next.js)，欢迎优化我们的 UI/UX 或修复技术问题。

### 开发流程

1. **Fork 本仓库**：点击右上角的 "Fork" 按钮。
2. **克隆到本地**：
   ```bash
   git clone https://github.com/你的用户名/open-knm.git
   cd open-knm
   ```
3. **创建新分支**：
   ```bash
   git checkout -b my-new-feature
   ```
4. **进行修改并提交**：
   ```bash
   git commit -m "feat: 添加了关于家庭医生的文章"
   ```
5. **推送到 GitHub**：
   ```bash
   git push origin my-new-feature
   ```
6. **提交 Pull Request (PR)**：回到我们的仓库页面，点击 "Compare & pull request"。

### 行为准则

请保持友善和尊重。我们希望创建一个包容、互助的社区环境。

---

<a id="english"></a>

## 🇬🇧 English Guide

First off, thank you for considering contributing to Open KNM! Contributors like you make this open-source project a valuable resource for everyone.

### How Can I Contribute?

You can contribute in several ways:

1. **Reporting Issues**:
   - If you find a bug, factual error, or outdated information, please submit a [GitHub Issue](https://github.com/xvllinihao/open-knm/issues).
   - Please describe the issue clearly and include screenshots if possible.

2. **Contributing Content**:
   - We welcome new articles on KNM topics or daily life guides.
   - Articles are managed in `src/lib/articles.ts` (metadata) and MDX files under `src/data/articles/`.
   - Please start from the templates `src/data/articles/_template.en.mdx` and `src/data/articles/_template.zh.mdx` so that the two‑column layout (Dutch on the left, explanation on the right) stays consistent.
   - When submitting content, please try to provide **both Chinese and English** versions and, at the bottom of each article, optionally add a short **“Further reading on Wikipedia”** block (2–5 links to relevant English Wikipedia pages, similar to the existing articles).

3. **Code Improvements**:
   - If you are a developer (React/Next.js), feel free to improve our UI/UX or fix technical issues.

### Development Workflow

1. **Fork the repository**: Click the "Fork" button at the top right.
2. **Clone to local**:
   ```bash
   git clone https://github.com/your-username/open-knm.git
   cd open-knm
   ```
3. **Create a branch**:
   ```bash
   git checkout -b my-new-feature
   ```
4. **Commit your changes**:
   ```bash
   git commit -m "feat: add article about GP"
   ```
5. **Push to GitHub**:
   ```bash
   git push origin my-new-feature
   ```
6. **Submit a Pull Request (PR)**: Go back to our repo page and click "Compare & pull request".

### Code of Conduct

Please be kind and respectful. We aim to create an inclusive and helpful community environment.

