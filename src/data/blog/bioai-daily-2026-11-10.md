---
title: '生物年龄估算和知道自己多健康，不是一件事'
pubDatetime: 2026-11-10T01:00:00.000Z
modDatetime: 2026-11-10T01:00:00.000Z
description: '[](https://longevity.technology/news/insilicoopensourcesalongevityaithatkeepsscore/)'
tags:
  - bioai-daily
  - ai
  - biotech
draft: false
---

[![来源配图：Insilico open-sources a longevity AI that keeps score](https://longevity.technology/wp-content/uploads/2026/11/insilico-open-sources-a-longevity-ai-that-keeps-score-hero-1200x800-1-1024x683.png)](https://longevity.technology/news/insilico-open-sources-a-longevity-ai-that-keeps-score/)

有一类产品现在越来越多，思路大概是这样：把你的血检报告、睡眠数据、血糖曲线都输进去，系统给你算出一个数，告诉你"你的身体实际上像 X 岁"。听起来很直接，像是把衰老这件抽象的事变成了一个可以看的分数。

Insilico Medicine 和哈佛遗传学家 David Sinclair 合作推出的 Longevity Grok，做的就是这件事。它将血液检测结果、连续血糖监测曲线、甲基化数据（可以理解为 DNA 上的一种化学标记，研究者用它来估算细胞层面的年龄）和可穿戴设备的导出记录汇在一起，计算几个衍生指标，其中包括 PhenoAge 和 HOMA-IR。

PhenoAge 是一种基于血液指标的生物年龄估算方式，它不看你的出生年份，而是看白细胞、白蛋白、血糖等多个血液参数，用统计模型算出一个"表现型年龄"，意思是你的这组指标在统计上更接近多少岁的人群。HOMA-IR 则是胰岛素抵抗指标，简单说就是你的细胞对胰岛素的响应灵不灵，不灵意味着血糖更难被有效利用，与代谢健康密切相关。

这两个指标不是这个系统发明的，它们在衰老研究领域已有一定积累。这个系统做的事，是把来自不同来源的数据整合进一份纵向记录，让这些指标能随时间追踪，而不只是看单次结果。这一点是值得注意的设计思路：单次血检结果的意义其实很有限，同一个人的指标在不同状态下可能差很多；有了前后对比，才能看出趋势。

我更在意的是这里面一个容易滑过去的区别：**生物年龄估算，和你真实的健康状态，不是同一件事。** 这不是在贬低这类工具，而是这个区别如果不说清，很容易让人用错。

PhenoAge 是一个统计估算值，它的含义是"你的这组血液指标，在统计上与 X 岁人群的平均值接近"。这个数字低，意味着你的某几项血液指标在同龄人里偏好；但它不能直接告诉你某个器官的实际状态，也不能预测你个人接下来会发生什么。模型是在群体数据上训练的，落到某一个具体的人身上，它的结论就只能是参考，而不是诊断。

这个系统还会根据汇入的数据提出生活方式建议，据媒体报道，代码已经公开。但具体的建议质量、模型在不同人群上的表现，目前只有媒体层面的描述，没有独立核查的结果可以参考。这不是说它没用，而是说现阶段它更接近一个可以持续记录和参考的个人数据工具，而不是一个能告诉你"你的衰老被逆转了"的系统。

这类工具真正有用的地方，可能正是它最不显眼的部分：纵向记录。很多人做完体检就把报告压箱底，下次再做时已经不记得上次的数字了。把历次数据放在一起、算出趋势，本身就比看一次孤立的数值要有信息量。这个逻辑是站得住的，和用什么模型算、谁来合作无关。

## 参考资料

- [Insilico open-sources a longevity AI that keeps score — Longevity.Technology](https://longevity.technology/news/insilico-open-sources-a-longevity-ai-that-keeps-score/)

---

> 完整版日报请看 [BioAI 生命科学日报](https://news.aibioo.cn/2026-11/2026-11-10/)
