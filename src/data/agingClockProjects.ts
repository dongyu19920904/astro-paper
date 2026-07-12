export const AGING_CLOCK_CATEGORIES = [
  "表观遗传年龄时钟",
  "脑龄模型",
  "古 DNA 年龄时钟",
  "数字生物标志物",
  "其他衰老相关计算工具",
] as const;

export const AGING_CLOCK_DIFFICULTIES = ["低", "中", "高"] as const;
export const AGING_CLOCK_LICENSE_STATUSES = [
  "明确",
  "部分明确",
  "待核实",
] as const;
export const AGING_CLOCK_RISK_LEVELS = ["低", "中", "高"] as const;

export type AgingClockCategory = (typeof AGING_CLOCK_CATEGORIES)[number];
export type AgingClockDifficulty = (typeof AGING_CLOCK_DIFFICULTIES)[number];
export type AgingClockLicenseStatus =
  (typeof AGING_CLOCK_LICENSE_STATUSES)[number];
export type AgingClockRiskLevel = (typeof AGING_CLOCK_RISK_LEVELS)[number];

export interface AgingClockSourceDaily {
  title: string;
  date: string;
  repositoryPath: string;
  url: string;
}

export interface AgingClockProject {
  id: string;
  name: string;
  repositoryUrl: string;
  category: AgingClockCategory;
  summary: string;
  inputTypes: string[];
  inputFormat: string[];
  algorithm: string;
  outputs: string[];
  runtime: string;
  offline: boolean;
  offlineNotes: string;
  difficulty: AgingClockDifficulty;
  runCost: string;
  licenseStatus: AgingClockLicenseStatus;
  licenseNotes: string;
  artifactTerms: string;
  riskLevel: AgingClockRiskLevel;
  riskTags: string[];
  suitableFor: string[];
  useCases: string[];
  workflow: string[];
  limitations: string[];
  remixIdeas: string[];
  sourceDaily: AgingClockSourceDaily[];
  lastVerifiedAt: string;
}

function isIsoDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function assertStringArray(
  value: unknown,
  field: string,
  projectId: string
): asserts value is string[] {
  if (
    !Array.isArray(value) ||
    value.length === 0 ||
    value.some(item => typeof item !== "string" || item.trim() === "")
  ) {
    throw new Error(`${projectId}.${field} must be a non-empty string array`);
  }
}

export function validateAgingClockProjects(
  projects: AgingClockProject[]
): AgingClockProject[] {
  if (!Array.isArray(projects) || projects.length === 0) {
    throw new Error("Aging Clock Atlas needs at least one project");
  }

  const ids = new Set<string>();
  for (const project of projects) {
    if (!/^[a-z0-9-]+$/.test(project.id) || ids.has(project.id)) {
      throw new Error(`Invalid or duplicate project id: ${project.id}`);
    }
    ids.add(project.id);

    if (
      !AGING_CLOCK_CATEGORIES.includes(project.category) ||
      !AGING_CLOCK_DIFFICULTIES.includes(project.difficulty) ||
      !AGING_CLOCK_LICENSE_STATUSES.includes(project.licenseStatus) ||
      !AGING_CLOCK_RISK_LEVELS.includes(project.riskLevel)
    ) {
      throw new Error(`${project.id} contains an unsupported enum value`);
    }

    const repositoryUrl = new URL(project.repositoryUrl);
    if (
      repositoryUrl.protocol !== "https:" ||
      repositoryUrl.hostname !== "github.com"
    ) {
      throw new Error(
        `${project.id}.repositoryUrl must be an HTTPS GitHub URL`
      );
    }

    if (!isIsoDate(project.lastVerifiedAt)) {
      throw new Error(`${project.id}.lastVerifiedAt must be YYYY-MM-DD`);
    }

    for (const field of [
      "inputTypes",
      "inputFormat",
      "outputs",
      "riskTags",
      "suitableFor",
      "useCases",
      "workflow",
      "limitations",
      "remixIdeas",
    ] as const) {
      assertStringArray(project[field], field, project.id);
    }

    if (
      !Array.isArray(project.sourceDaily) ||
      project.sourceDaily.length === 0 ||
      project.sourceDaily.some(
        source =>
          !isIsoDate(source.date) ||
          !source.repositoryPath ||
          !source.url.startsWith("https://")
      )
    ) {
      throw new Error(`${project.id}.sourceDaily must contain dated sources`);
    }
  }

  return projects;
}

const projects = [
  {
    id: "epiage-skill",
    name: "epiage-skill",
    repositoryUrl: "https://github.com/gangchen/epiage-skill",
    category: "表观遗传年龄时钟",
    summary:
      "把多种 DNA 甲基化时钟封装成仅依赖 pandas 与 NumPy 的离线技能；当前 README 列出 25 种时钟，日报收录时称 24 种。",
    inputTypes: ["DNA 甲基化 beta 值", "实际年龄", "生物学性别"],
    inputFormat: ["CpG-beta 两列 CSV", "CpG × 样本矩阵 CSV"],
    algorithm:
      "Horvath、Hannum、PhenoAge、GrimAge、DunedinPACE 等线性/复合甲基化时钟与参考归一化",
    outputs: ["各时钟结果", "简单年龄差", "CpG 覆盖率与可靠性标记"],
    runtime: "Python；安装后以 pandas + NumPy 为主",
    offline: true,
    offlineNotes: "依赖、系数和参考文件准备完成后可离线运行。",
    difficulty: "中",
    runCost: "普通电脑；完整甲基化文件和数据解释仍需要专业背景",
    licenseStatus: "部分明确",
    licenseNotes:
      "仓库代码声明 MIT；NOTICE 将部分系数和参考文件追溯到 MIT 的 biolearn。",
    artifactTerms:
      "GrimAge 涉及 UCLA TDG / Clock Foundation 商业使用限制；系数、参考数据与代码授权不能混为一谈。",
    riskLevel: "高",
    riskTags: ["敏感遗传数据", "医疗误读", "商业授权限制"],
    suitableFor: ["表观遗传时钟学习者", "生信开发者", "研究工具评估者"],
    useCases: ["算法目录", "时钟覆盖对比", "离线工作流教学"],
    workflow: [
      "准备合规取得的 CpG beta 值表",
      "选择时钟并检查组织/平台适用性",
      "本地运行并检查覆盖率与插补标记",
      "按研究限制解释输出，禁止当作个人诊断",
    ],
    limitations: [
      "多数时钟依赖特定组织、芯片和训练人群，不能随意跨场景解释。",
      "单人的简单时钟差不等于群体校正后的 AgeAccel。",
      "Atlas 只展示公开元数据，不运行算法也不接收甲基化文件。",
    ],
    remixIdeas: ["衰老时钟术语地图", "算法覆盖对比页", "研究工作流学习卡"],
    sourceDaily: [
      {
        title: "AI生命延续学资讯商机项目 2026/7/9",
        date: "2026-07-09",
        repositoryPath: "content/cn/project-opportunity/2026-07/2026-07-09.md",
        url: "https://github.com/dongyu19920904/BioAI-Daily-Web/blob/main/content/cn/project-opportunity/2026-07/2026-07-09.md",
      },
    ],
    lastVerifiedAt: "2026-07-11",
  },
  {
    id: "coinstac-brainage-fnc",
    name: "coinstac-brainage-fnc",
    repositoryUrl: "https://github.com/trendscenter/coinstac-brainage-fnc",
    category: "脑龄模型",
    summary:
      "面向多中心神经影像研究的 COINSTAC 计算组件，以功能网络连接矩阵为特征，用线性支持向量回归学习脑年龄。",
    inputTypes: ["功能网络连接（FNC）矩阵", "受试者年龄标签", "站点数据"],
    inputFormat: ["GICA / UK Biobank MATLAB 文件", "CSV 或 TXT 协变量文件"],
    algorithm:
      "FNC 上三角特征、MinMaxScaler、LinearSVR，以及站点局部权重聚合后的所有者模型",
    outputs: ["模型权重与截距", "训练/测试 RMSE", "训练/测试 MAE"],
    runtime:
      "COINSTAC / Docker；Python 与旧版 NumPy、pandas、scikit-learn、h5py",
    offline: false,
    offlineNotes:
      "单站脚本可在准备好数据与依赖后本地执行；完整多站 COINSTAC 协作流程需要容器与协调环境。",
    difficulty: "高",
    runCost: "需要预处理后的神经影像连接矩阵、较旧依赖和多站计算知识",
    licenseStatus: "待核实",
    licenseNotes:
      "GitHub API 未识别许可证，仓库树中也未发现 LICENSE；只能引用公开元数据。",
    artifactTerms:
      "示例影像/协变量、COINSTAC 平台与研究数据可能有独立访问和使用条款。",
    riskLevel: "高",
    riskTags: ["脑影像数据", "受试者隐私", "研究模型误读"],
    suitableFor: ["神经影像学习者", "联邦研究工具开发者", "脑龄方法研究者"],
    useCases: ["多中心脑龄研究", "联邦计算教学", "模型评估流程拆解"],
    workflow: [
      "在各站点准备 FNC 矩阵和年龄标签",
      "按输入来源提取连接特征并划分训练/测试集",
      "站点本地训练 LinearSVR 并提交模型参数",
      "所有者站点聚合权重、拟合最终模型并报告误差",
    ],
    limitations: [
      "不是面向普通访客的一键脑龄计算器。",
      "依赖版本较旧，完整流程需要 COINSTAC/Docker 和专业影像预处理。",
      "仓库未声明许可证，不能复制其实现或测试数据。",
    ],
    remixIdeas: ["脑龄算法对比页", "联邦计算流程演示", "神经影像输入格式指南"],
    sourceDaily: [
      {
        title: "AI生命延续学资讯商机项目 2026/7/11",
        date: "2026-07-11",
        repositoryPath: "content/cn/project-opportunity/2026-07/2026-07-11.md",
        url: "https://github.com/dongyu19920904/BioAI-Daily-Web/blob/main/content/cn/project-opportunity/2026-07/2026-07-11.md",
      },
    ],
    lastVerifiedAt: "2026-07-11",
  },
  {
    id: "adna-aging-clocks",
    name: "aDNA_aging_clocks",
    repositoryUrl: "https://github.com/Malaevleo/aDNA_aging_clocks",
    category: "古 DNA 年龄时钟",
    summary:
      "把古 DNA 甲基化 BED 坐标映射到 Illumina CpG，再调用 pyaging 的三个时钟生成样本年龄预测表。",
    inputTypes: ["古 DNA 甲基化 BED", "EPIC 探针清单"],
    inputFormat: [
      "含 chr、pos、beta 的 BED/表格",
      "Illumina EPIC manifest CSV",
    ],
    algorithm:
      "坐标到 CpG 映射后，调用 pyaging 的 Horvath2013、AltumAge 与 ZhangEn 模型",
    outputs: ["Illumina 格式中间 CSV", "逐样本时钟预测 CSV", "多样本汇总表"],
    runtime: "Python；NumPy、pandas、AnnData、pyaging、PyTorch",
    offline: false,
    offlineNotes:
      "准备好依赖、pyaging 模型和外部 EPIC manifest 后可本地处理；仓库本身不附带所需 manifest。",
    difficulty: "高",
    runCost: "古 DNA 数据量、PyTorch 与外部探针清单使准备成本较高",
    licenseStatus: "待核实",
    licenseNotes:
      "GitHub API 未识别许可证，仓库只有 README、脚本和依赖文件，未发现 LICENSE。",
    artifactTerms:
      "GSE138307/Illumina manifest、古 DNA 数据和 pyaging 模型各自可能有独立条款。",
    riskLevel: "中",
    riskTags: ["人类遗传材料", "古人类伦理", "年龄结论误读"],
    suitableFor: ["计算考古学习者", "古 DNA 研究开发者", "衰老时钟方法比较者"],
    useCases: ["古样本方法教学", "时钟适用性比较", "研究管线说明"],
    workflow: [
      "取得合规的古 DNA 甲基化 BED 与 EPIC manifest",
      "按染色体坐标映射到 Illumina CpG",
      "构造 pyaging 的样本矩阵并运行三个时钟",
      "导出逐时钟预测并结合骨组织/古 DNA 局限解释",
    ],
    limitations: [
      "默认 manifest 路径指向作者本地目录，仓库并未提供该文件。",
      "三个现代训练时钟用于古 DNA/骨组织的适用性仍需研究验证。",
      "仓库没有明确许可证，Atlas 不复制脚本或外部资源。",
    ],
    remixIdeas: ["古 DNA 工作流图", "现代/古代时钟差异课", "可复现性检查清单"],
    sourceDaily: [
      {
        title: "AI生命延续学日报 2026/7/11",
        date: "2026-07-11",
        repositoryPath: "content/cn/2026-07/2026-07-11.md",
        url: "https://github.com/dongyu19920904/BioAI-Daily-Web/blob/main/content/cn/2026-07/2026-07-11.md",
      },
    ],
    lastVerifiedAt: "2026-07-11",
  },
  {
    id: "pd-biomarker-challenge-scoring",
    name: "PDbiomarkerChallengeScoring",
    repositoryUrl:
      "https://github.com/Sage-Bionetworks/PDbiomarkerChallengeScoring",
    category: "数字生物标志物",
    summary:
      "Sage Bionetworks 为帕金森数字生物标志物 DREAM Challenge 发布的评分与挑战管理代码，用于复现基准评估而非临床诊断。",
    inputTypes: ["挑战赛预测/特征表", "步态与静息任务数据", "挑战赛标签"],
    inputFormat: ["提交 CSV", "Synapse 托管表与文件"],
    algorithm:
      "特征聚合与集成分类，使用 AUROC、AUPRC、置换 p 值等挑战赛评分逻辑",
    outputs: ["挑战赛分数", "预测表", "提交状态与排行榜数据"],
    runtime: "旧版 Python / R；Synapse 客户端与受控挑战赛数据",
    offline: false,
    offlineNotes:
      "评分函数可阅读，但完整运行依赖 Synapse 凭据、挑战赛数据和旧版运行环境。",
    difficulty: "高",
    runCost: "需要受控数据访问、旧版 Python/R 环境和挑战赛配置",
    licenseStatus: "待核实",
    licenseNotes:
      "GitHub API 未识别许可证，仓库树中未发现 LICENSE；只展示公开事实和来源链接。",
    artifactTerms:
      "Synapse 数据集、参赛提交和 DREAM Challenge 规则具有独立访问、隐私与竞赛条款。",
    riskLevel: "高",
    riskTags: ["患者/受试者数据", "疾病标签", "诊断误用"],
    suitableFor: ["数字健康学习者", "可穿戴算法开发者", "挑战赛评估研究者"],
    useCases: ["数字标志物评分教学", "信号类型导航", "基准评估流程拆解"],
    workflow: [
      "按挑战赛权限取得数据与提交模板",
      "生成规定字段的特征或预测 CSV",
      "使用评分函数计算 AUROC/AUPRC 等指标",
      "写回提交状态或排行榜，并保持研究用途声明",
    ],
    limitations: [
      "这是历史挑战赛评分代码，不是可穿戴设备诊断产品。",
      "完整流程依赖 Synapse 权限、旧版依赖与未随仓库公开的评分数据。",
      "没有明确许可证，不能直接二次分发其实现。",
    ],
    remixIdeas: ["数字标志物信号地图", "挑战赛评分解释器", "评估指标学习页"],
    sourceDaily: [
      {
        title: "AI生命延续学资讯商机项目 2026/7/11",
        date: "2026-07-11",
        repositoryPath: "content/cn/project-opportunity/2026-07/2026-07-11.md",
        url: "https://github.com/dongyu19920904/BioAI-Daily-Web/blob/main/content/cn/project-opportunity/2026-07/2026-07-11.md",
      },
    ],
    lastVerifiedAt: "2026-07-11",
  },
] satisfies AgingClockProject[];

export const AGING_CLOCK_PROJECTS = validateAgingClockProjects(projects);
