/**
 * 站点核心配置
 * ============
 * 修改这里的值来自定义你的站点信息
 *
 * website: 你的域名（必须以 https:// 开头，结尾带 /）
 * author: 你的名字
 * profile: 你的个人主页链接
 * desc: 站点描述（SEO 用）
 * title: 站点标题
 */
export const SITE = {
  // ===== 👇 修改这里的域名 =====
  website: "https://yuyu.aivora.cn/", // 你的自定义域名
  // ===== 👇 修改这里的个人信息 =====
  author: "yuyu", // 你的名字
  profile: "https://yuyu.aivora.cn/about", // 个人简介页面
  desc: "yuyu 的个人主页 | 白天卖 AI 账号，晚上研究 AI 长生", // 站点描述
  title: "yuyu", // 站点标题
  ogImage: "astropaper-og.jpg", // 默认 OG 图片
  lightAndDarkMode: true,
  postPerIndex: 6, // 首页显示的文章数量
  postPerPage: 6, // 列表页每页文章数
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true,
  editPost: {
    enabled: false, // 如需启用"编辑此页"功能，改为 true 并更新下方 url
    text: "编辑此页",
    url: "https://github.com/dongyu19920904/astro-paper/edit/main/",
  },
  dynamicOgImage: true,
  dir: "ltr",
  lang: "zh-CN", // 中文站点
  timezone: "Asia/Shanghai", // 中国时区
} as const;
