---
title: '衰老细胞的两种信号：囊泡传染与炎症路径为何要分开看'
pubDatetime: 2026-10-09T01:00:00.000Z
modDatetime: 2026-10-09T01:00:00.000Z
description: '发表在 Aging 期刊的一项细胞实验，让我重新思考一个一直被混用的概念：衰老细胞的"毒性"到底从哪里来。'
tags:
  - bioai-daily
  - ai
  - biotech
draft: false
---

发表在 *Aging* 期刊的一项细胞实验，让我重新思考一个一直被混用的概念：衰老细胞的"毒性"到底从哪里来。

[![来源配图：Epigenetics Underlies Comparatively Accelerated Molecular Aging in Larger and Male Dogs](https://www.genengnews.com/wp-content/uploads/2026/10/low-res-3-300x169.jpeg)](https://www.genengnews.com/topics/omics/epigenetics-underlies-comparatively-accelerated-molecular-aging-in-larger-and-male-dogs/)

过去几年，抗衰老研究的一条主线是清除衰老细胞（senescent cells）。衰老细胞会分泌一批有害物质，统称 SASP，即衰老相关分泌表型。大多数人印象里，SASP 的主角是炎症因子，比如 IL-1β，它们在组织里制造慢性炎症，带动周围细胞加速老化。这个图景是真实的，但这项研究指出它不完整。

## SASP 不只有炎症因子这一张脸

实验使用的是 IMR-90 人肺成纤维细胞。研究者区分了两类衰老细胞：一类由复制压力诱导，另一类由 p16 生物标志物驱动。关键发现是，p16 阳性的衰老细胞几乎不分泌经典炎症因子，但会大量释放小型细胞外囊泡（sEV）。这些囊泡是细胞之间传递物质的纳米级"包裹"，正常细胞也会产生，只是内容物不同。

实验中，将老年人成纤维细胞产生的 sEV 暴露给婴儿成纤维细胞，后者的衰老标志物 SA-β-gal 出现升高。换句话说，衰老状态通过囊泡从老细胞传递到了年轻细胞，而这个过程不需要炎症因子参与。

这个区分有实际意义。现有的 senolytic 药物（用于清除衰老细胞）以及部分针对 SASP 炎症成分的干预策略，如果只盯着可溶性炎症因子（sSASP），就可能完全忽略囊泡路径（evSASP）。两条路径分开走，就需要两种不同的干预思路。

## 结果能说明什么，不能说明什么

研究的限制值得单独列出来，因为这直接决定这个发现处于研究链条的哪个位置。

目前全部实验在 IMR-90 细胞株上完成，属于体外细胞实验。囊泡的具体"有效成分"是什么，研究没有给出答案，致衰老机制是否涉及遗传毒性也是推测而非确认。这个结果在动物体内是否可重复，还没有数据支持。

所以这个研究回答的问题是"存在一条不依赖炎症的囊泡传染路径吗"，答案是在这批细胞实验里，是的。它没有回答"清除或阻断这些囊泡能减缓整体衰老吗"，那是下一步的问题。

我的判断是：这项研究最有价值的地方不是给了一个干预靶点，而是在概念层面做了一次必要的拆分，将 SASP 从一个笼统的标签细化为至少两条可以独立测量的路径。这对后续研究设计的影响比任何单个实验结果都更持久。

## 与犬类表观遗传研究的连接点

同期还有一项亚利桑那州立大学对 894 只狗的全基因组 DNA 甲基化研究，发表于 *Science*。该研究发现大型犬的分子衰老速度更快，机制集中在转座元件区域的甲基化丢失。转座元件是 DNA 中可以移动位置的片段，与基因组稳定性密切相关。

这两项研究用的是完全不同的测量层次，一个在细胞信号水平，一个在全基因组甲基化水平，但都在指向同一个方向：衰老不是一个均匀的过程，不同的分子路径以不同的速度、在不同条件下运作。将它们混在一起讨论或者用单一指标代表"衰老程度"，都会丢失这种内部结构。

> [!NOTE]
> 犬类研究是动物观察性研究，转座元件在人类衰老中的作用需独立验证，不能从这项研究直接推论人类机制。

## 如果想继续核查

囊泡研究的第一手论文在 *Aging* 期刊，实验数据和局限在方法与讨论部分有明确记录。想验证"p16 阳性细胞是否真的不分泌 IL-1β"或"sEV 转移后 SA-β-gal 升高的幅度"，都可以在原论文方法部分找到对应数据，不需要依赖报道的转述。

犬类研究的原始数据来自 *Science*，genengnews.com 的报道提供了较好的入口摘要，但转座元件的具体机制描述建议对照原论文确认，因为二手报道在这类技术细节上容易丢失边界条件。

---

[![来源配图：Untangling Differences in Senescent Cellular Signaling](https://lifespan.io/wp-content/uploads/2026/10/Proteins-or-extracellular-vesicles-262x187.jpg)](https://lifespan.io/untangling-differences-in-senescent-cellular-signaling/)

## 参考资料

- [Untangling Differences in Senescent Cellular Signaling](https://lifespan.io/untangling-differences-in-senescent-cellular-signaling/) — *Aging* 期刊，体外细胞实验
- [Epigenetics Underlies Comparatively Accelerated Molecular Aging in Larger and Male Dogs](https://www.genengnews.com/topics/omics/epigenetics-underlies-comparatively-accelerated-molecular-aging-in-larger-and-male-dogs/) — *Science*，动物观察性研究

---

> 完整版日报请看 [BioAI 生命科学日报](https://news.aibioo.cn/2026-10/2026-10-09/)
