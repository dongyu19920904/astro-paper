---
title: '40% 不可成药蛋白，AI 绕过结构直接预测结合位点'
pubDatetime: 2026-10-02T01:00:00.000Z
modDatetime: 2026-10-03T04:00:00.000Z
description: '从无序蛋白质模型、衰老生物标志物到小鼠实验，记录 AI 生命科学的新线索与尚待验证的问题。动物结果和工具演示不能直接转化为人体健康承诺。'
topics:
  - ai-longevity
tags:
  - bioai-daily
  - ai
  - biotech
draft: true
---

我一直在想一个问题：AI 制药到底能走多远？

本文依据公开报道进行 AI 辅助整理，并非作者的临床实践或客户案例。文中模型表现、会议观点与小鼠实验属于不同类型的线索，不能视为已证实的人体疗效。

这两年 AlphaFold 把蛋白质结构预测卷到接近物理极限，但药厂真正头疼的不是"能不能预测结构"，而是有 40% 的蛋白质压根就没有稳定结构。这些"无序蛋白质"在细胞里像软体动物一样扭来扭去，传统药物设计对它们束手无策。

今天看到 Talus Bio 发布的 [Ptarmigan-1 模型](https://www.genengnews.com/topics/artificial-intelligence/talus-bios-structure-free-ai-model-targets-unstructured-proteins-in-their-native-cellular-context/)，直接绕过结构预测，在高维数学空间里匹配化合物和蛋白质。验证实验里，它对从没见过的 STAT6 蛋白筛选准确度超过基于结构的方法，速度还快 5000 倍。

这个思路其实很野：不是让 AI 去理解蛋白质长什么样，而是让 AI 在细胞原生状态下看蛋白质"干了什么"，然后反推哪些化合物能影响它。

## 卖账号的人为什么关心无序蛋白质

说实话，看到这条新闻我第一反应不是"技术多厉害"，而是：这会不会改变 AI 制药赛道的工具需求？

我在 [爱窝啦](https://www.aivora.cn/) 经营 AI 账号业务，也长期关注 AI 生命科学。对生物信息学团队或药企研发这样的潜在使用者，可以提出两个工具需求问题，而不是将他们写成已有客户：

1. 它需要什么算力和 API？
2. 用户会不会因为这个工具切换平台？

报道提到 Talus 提供有限的试用机会，大规模筛选需要合作。这个商业模式可以作为观察线索，但不能直接等同于编程工具订阅，也没有材料支持不同用户群的付费意愿比较。

如果这类方法逐步成熟，值得关注的是工具是否开放、许可条件、使用门槛和数据边界，而不是预设已经存在中转服务或账号需求。

这是我这种"卖铲子的人"天然的思维方式：看到新技术，先想能不能变成生意。

## 表观时钟标准化：从"能测"到"能信"

同一天看到的另一条新闻更实际：[哈佛医学院主办的衰老生物标志物大会](https://lifespan.io/global-leaders-in-geroscience-convene-for-biomarkers-of-aging/)，把开发时钟的人、验证时钟的人、用时钟做试验的人和审批时钟的人放在同一间会议室。

这件事对我来说意义很大。

我长期关注 AI 生命延续学。一个需要继续研究的问题是：Horvath、Hannum、DunedinPACE、GrimAge 等时钟使用不同指标和定义，怎样比较它们的验证对象、用途与限制？这里不是个人检测或用户咨询经历。

这次大会邀请了 Steve Horvath（泛组织表观时钟）、Dan Belsky（DunedinPACE 时钟）、FDA 代表和 ARPA-H 代表。我的理解是，他们要回答一个更根本的问题：什么叫"测准了衰老"？

如果标准化真的推进了，对普通人的意义是：
- 商业化检测服务不再各说各话
- 抗衰老干预的临床试验有了统一终点
- 保险公司和体检机构可能会接受生物学年龄作为风险评估指标

但坦白说，我不确定这个标准化能走多快。生物标志物这种东西，既有科学问题（哪个时钟更能预测死亡风险），也有商业问题（谁愿意承认自己的时钟不够好）。

## 运动延缓卵巢衰老，但机制比我想的复杂

还有一条新闻让我印象深刻：[小鼠运动通过脂联素延缓卵巢衰老](https://lifespan.io/physical-activity-delays-ovarian-aging-in-mice/)，研究团队用脂联素受体激动剂 AdipoRon 治疗中年小鼠，老年期生育能力仍然显著高于对照组。

这个研究有意思的地方在于，它不是简单地说"运动好"，而是把机制拆开了：运动提升脂联素，脂联素抑制 mTOR，mTOR 抑制保留了更多原始卵泡。

但同时，研究也显示，效果在脂联素缺陷小鼠中减弱 76%——换句话说，脂联素是核心中介，但不是唯一路径。

这让我想起一个长期困扰我的问题：AI 生命延续学到底能不能落地到普通人？

这条报道提供的是小鼠研究线索。不能因为存在研究用受体激动剂，就推断其人体有效性、安全性或监管路径已经明确；这些问题需要各自的证据。

如果它真的进入临床试验，我会非常关注两个问题：
1. 是否有公开的人体试验、安全性和有效性资料？
2. 测量指标与临床结局之间是否经过验证？

我的长期方向是关注可靠资料和工具，不将这一探索目标写成已经实现的健康管理闭环。

## 来源与边界

本文依据 2026 年 10 月 2 日 BioAI 日报整理，主要引用以下来源：
- [Talus Bio's Structure-Free AI Model Targets Unstructured Proteins in Their Native Cellular Context](https://www.genengnews.com/topics/artificial-intelligence/talus-bios-structure-free-ai-model-targets-unstructured-proteins-in-their-native-cellular-context/)
- [Physical Activity Delays Ovarian Aging in Mice](https://lifespan.io/physical-activity-delays-ovarian-aging-in-mice/)
- [Global Leaders in Geroscience Convene for Biomarkers of Aging](https://lifespan.io/global-leaders-in-geroscience-convene-for-biomarkers-of-aging/)

本文是个人观察与判断，不是医疗建议。无序蛋白质 AI 模型、脂联素受体激动剂和表观时钟标准化均处于研究或早期应用阶段，尚未在临床流程中验证；动物实验结果不等于人体效果。AI 生命延续学是作者长期探索方向,不提供具体实现时间预测或治疗承诺。

---

> 完整版日报请看 [BioAI 生命科学日报](https://news.aibioo.cn/2026-10/2026-10-02/)
