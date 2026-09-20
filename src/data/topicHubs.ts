export const TOPIC_HUBS = [
  {
    slug: "ai-one-person-company",
    title: "AI 一人公司",
    shortTitle: "AI 一人公司",
    description:
      "记录 yuyu 如何把内容生产、资料整理、项目维护和重复运营工作交给 AI 协作，同时保留人工判断与验收。",
    scope:
      "这里收录真实的工作流、自动化尝试和复盘，不把尚未运行的想法包装成成熟方法。",
    questions: [
      "哪些重复工作值得先自动化？",
      "怎样让多个 AI 任务稳定协作并能人工验收？",
      "一人公司如何在效率、质量与维护成本之间取舍？",
    ],
    links: [
      { label: "个人项目", href: "/projects/" },
      { label: "全部文章", href: "/posts/" },
    ],
  },
  {
    slug: "ai-longevity",
    title: "AI 生命延续学",
    shortTitle: "AI 生命延续学",
    description:
      "围绕 AI 与衰老研究、脑健康、数字生物标志物和生命科学工具，整理来源、项目实验与可验证的阶段性认识。",
    scope:
      "内容用于信息整理和项目探索，不构成医疗建议；涉及研究结论时应回到论文、机构或临床注册来源核验。",
    questions: [
      "AI 能怎样帮助理解和测量衰老？",
      "哪些 BioAI 开源项目值得复现或产品化？",
      "如何区分研究证据、商业信号与个人判断？",
    ],
    links: [
      { label: "BioAI 日报", href: "https://news.aibioo.cn" },
      { label: "BioAI 导航", href: "https://nav.aibioo.cn" },
      { label: "多维衰老时钟地图", href: "/projects/aging-clock-atlas/" },
    ],
  },
  {
    slug: "ai-account-business",
    title: "AI 账号店与经营",
    shortTitle: "AI 账号经营",
    description:
      "整理 AI 工具账号经营、产品变化、客服效率、货源观察和售后流程中的公开经验与项目记录。",
    scope:
      "文章反映发布时点的产品与经营观察；价格、功能和平台规则可能变化，应以当前商品页和官方规则为准。",
    questions: [
      "怎样减少客服和重复售后的时间消耗？",
      "如何追踪 AI 产品、货源与平台规则变化？",
      "哪些经营环节适合工具化，哪些必须人工判断？",
    ],
    links: [
      { label: "AI 账号小店", href: "https://www.aivora.cn/" },
      { label: "货源与商家经营", href: "https://supply.aivora.cn/" },
      { label: "AI 日报", href: "https://news.aivora.cn" },
    ],
  },
] as const;

export type TopicHub = (typeof TOPIC_HUBS)[number];
export type TopicSlug = TopicHub["slug"];

export function getTopicHub(slug: string) {
  return TOPIC_HUBS.find(topic => topic.slug === slug);
}
