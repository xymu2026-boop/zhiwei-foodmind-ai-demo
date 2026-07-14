# 知味 · 连锁餐饮 AI 经营参谋 Demo

这是一个用于客户拜访的前端演示项目，包含：

- 旧版客户拜访 Demo：产品 Demo + 15 页介绍 PPT，发布在 GitHub Pages 根路径。
- 新版经营 OS 场景 Demo：PC 场景工作台、移动端任务闭环和模拟数据中心，独立发布在 `ops-demo-v2/` 子路径。

## 对外链接

- 旧版 Demo：`https://xymu2026-boop.github.io/zhiwei-foodmind-ai-demo/`
- 新版 Demo：`https://xymu2026-boop.github.io/zhiwei-foodmind-ai-demo/ops-demo-v2/#/scene/home/overview`

两套 Demo 是不同版本，请不要把新版文件混入根目录旧版 Demo。

## 本地运行

```bash
npm ci
npm run dev
```

## 构建

```bash
npm run build
```

## 部署

推送到 `main` 后，GitHub Actions 会自动构建并发布到 GitHub Pages。
