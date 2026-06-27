/**
 * 导航卡片配置文件
 * ================
 * 在这里维护首页和 /projects 页面的导航卡片数据
 *
 * 如何添加新项目：
 * 1. 在 NAV_PROJECTS 数组中添加一个新对象
 * 2. 填写 title(标题)、desc(描述)、url(链接)、tag(标签)
 * 3. icon 可选，留空则使用默认图标
 *
 * 示例：
 * {
 *   title: "我的新项目",
 *   desc: "这是项目描述",
 *   url: "https://example.com",
 *   tag: "工具",
 *   icon: "🚀", // 可选
 * }
 */

export interface NavProject {
  title: string;
  desc: string;
  url: string;
  tag: string;
  icon?: string;
}

/** 首页导航区块 - 主要入口（显示在首页顶部） */
export const NAV_LINKS: NavProject[] = [
  {
    title: "AI 账号小店",
    desc: "Cursor / Claude / ChatGPT，低价秒发",
    url: "https://aivora.cn",
    tag: "搞钱",
    icon: "🛒",
  },
  {
    title: "AI 日报",
    desc: "每天 5 分钟，追上 AI 圈最新瓜",
    url: "https://news.aivora.cn",
    tag: "资讯",
    icon: "📰",
  },
  {
    title: "BioAI 日报",
    desc: "AI × 生命科学，追踪长寿赛道",
    url: "https://news.aibioo.cn",
    tag: "生命科学",
    icon: "🧬",
  },  {
    title: "脑健康成分地图",
    desc: "麦角硫因 × 脑健康互动工具",
    url: "https://dongyu19920904.github.io/Brain-Nutrient-Map-Web/",
    tag: "延续学实验",
    icon: "🧠",
  },
  {
    title: "BioAI 导航",
    desc: "生命科学 AI 工具一站式入口",
    url: "https://nav.aibioo.cn",
    tag: "导航",
    icon: "🧭",
  },
  {
    title: "博客",
    desc: "我的学习笔记和碎碎念",
    url: "/posts",
    tag: "博客",
    icon: "📝",
  },
];

/** 项目列表 - 显示在 /projects 页面（与首页导航一致） */
export const PROJECTS: NavProject[] = [
  {
    title: "AI 账号小店",
    desc: "Cursor / Claude / ChatGPT 等 AI 工具账号，低价秒发，售后无忧",
    url: "https://aivora.cn",
    tag: "搞钱",
    icon: "🛒",
  },
  {
    title: "AI 日报",
    desc: "每日精选 AI 领域最新动态，5 分钟追上 AI 圈",
    url: "https://news.aivora.cn",
    tag: "资讯",
    icon: "📰",
  },
  {
    title: "BioAI 日报",
    desc: "AI × 生命科学每日资讯，追踪长寿赛道前沿进展",
    url: "https://news.aibioo.cn",
    tag: "生命科学",
    icon: "🧬",
  },  {
    title: "脑健康成分地图",
    desc: "从 AI 延续学商机日报落地的互动科普工具：围绕麦角硫因、饮食来源和脑健康行动，生成可分享卡片，为后续资料包和报告转化做验证",
    url: "https://dongyu19920904.github.io/Brain-Nutrient-Map-Web/",
    tag: "延续学实验",
    icon: "🧠",
  },
  {
    title: "BioAI 导航",
    desc: "生命科学 AI 工具、论文、教程一站式导航",
    url: "https://nav.aibioo.cn",
    tag: "导航",
    icon: "🧭",
  },
];
