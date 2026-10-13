"use client";

import { useMemo, useState } from "react";
import "./reference-portfolio.css";
import "./portrait.css";
import "./bilingual.css";
import "./school-logos.css";
import "./experience-timeline.css";
import "./project-stories.css";
import "./portfolio-showcase.css";
import "./responsive-motion.css";
import "./portfolio-interaction.css";
import "./steam-vr-case.css";
import "./contact-card.css";

type Lang = "zh" | "en";
type View =
  "about" | "education" | "work" | "portfolio" | "steamCase" | "contact";
type Localized = Record<Lang, string>;

// Public files need the repository prefix when the portfolio runs at
// username.github.io/repository-name/ rather than at a domain root.
const staticAsset = (path: string) =>
  path.startsWith("/")
    ? `${import.meta.env.BASE_URL}${path.slice(1)}`
    : path;

const text = {
  zh: {
    nav: {
      about: "关于我",
      education: "教育背景",
      work: "工作经历",
      projects: "项目经历",
      portfolio: "作品集",
    },
    contact: "联系我 ↗",
    contactLead: "如果你正在做内容、数据或产品相关的项目，欢迎和我聊聊。",
    emailLabel: "邮箱",
    phoneLabel: "电话",
    hello: "01 / HELLO, I'M LI QIANCHENG",
    hero: (
      <>
        把洞察
        <br />
        <em>变成可行动的</em>
        <br />
        传播方案。
      </>
    ),
    role: "数据传播 × 内容运营",
    bio: "数据传播方向研究生，拥有新媒体运营、用户研究、视觉制作与项目协同经验。擅长在内容表达与数据洞察之间找到清晰的连接。",
    browse: "浏览作品集 →",
    matcher: "AI 岗位匹配器",
    matcherHint: "粘贴岗位 JD，快速查看我与岗位的匹配情况",
    match: "开始匹配 →",
    privacy: "本地关键词匹配 · 不会上传或保存 JD 内容",
    shell: {
      education: "学习过的地方，塑造了我。",
      work: "在真实现场，完成真实工作。",
      projects: "从问题出发，把研究做成结果。",
      portfolio: "用不同媒介，说清不同故事。",
    },
    campus: "校园经历",
    campusLead: "在课堂之外，持续练习表达、组织与传播。",
    all: "全部",
    viewWork: "查看作品 ↗",
    available: "可按需展示",
    close: "关闭",
    score: "综合匹配度",
    report: "岗位匹配结果",
    instant: "即时分析",
    reportDesc: "基于 JD 的岗位关键词与公开履历的相关性生成。",
    strengths: "匹配亮点",
    strengthsText: "内容运营、用户研究、数据分析与可视化能力可形成直接迁移。",
    focus: "建议沟通重点",
    focusText: "突出跨平台内容策略、项目协同与从洞察到落地的完整链路。",
    disclaimer: "仅作初步匹配参考；JD 内容仅在当前浏览器会话中用于计算。",
    categories: {
      vibe: "Vibe Coding 作品",
      visualization: "数据分析与可视化",
      case: "策略分析",
      wechat: "公众号作品",
    },
    signals: {
      insight: "数据洞察",
      content: "内容运营",
      project: "项目协同",
      visual: "视觉表达",
    },
  },
  en: {
    nav: {
      about: "About",
      education: "Education",
      work: "Experience",
      projects: "Projects",
      portfolio: "Portfolio",
    },
    contact: "Contact ↗",
    contactLead: "For content, data, and product projects, I would love to hear from you.",
    emailLabel: "Email",
    phoneLabel: "Phone",
    hello: "01 / HELLO, I'M LI QIANCHENG",
    hero: (
      <>
        Turning insights
        <br />
        into <em>actionable</em>
        <br />
        communication.
      </>
    ),
    role: "Data Communication × Content Operations",
    bio: "A Data Communication graduate student with experience in new-media operations, user research, visual production, and project coordination. I connect clear storytelling with data-driven insight.",
    browse: "View portfolio →",
    matcher: "AI Role Matcher",
    matcherHint:
      "Paste a job description to see how my profile aligns with the role",
    match: "Match role →",
    privacy: "Local keyword matching · Your JD is never uploaded or stored",
    shell: {
      education: "The places where I learned shaped how I work.",
      work: "Making real work happen in real contexts.",
      projects: "Starting with questions, turning research into outcomes.",
      portfolio: "Telling different stories through different media.",
    },
    campus: "Campus experience",
    campusLead:
      "Outside the classroom, I kept practising communication, organisation, and storytelling.",
    all: "All",
    viewWork: "View work ↗",
    available: "Available on request",
    close: "Close",
    score: "Overall match",
    report: "Role match report",
    instant: "Live analysis",
    reportDesc:
      "Generated from the relationship between JD keywords and my public profile.",
    strengths: "Match highlights",
    strengthsText:
      "Content operations, user research, data analysis, and visualisation transfer directly across roles.",
    focus: "What to discuss",
    focusText:
      "Focus on cross-platform content strategy, project coordination, and a full insight-to-execution workflow.",
    disclaimer:
      "For preliminary reference only; the JD is used only in this browser session.",
    categories: {
      vibe: "Vibe Coding",
      visualization: "Data Analysis & Visualisation",
      case: "Strategy & Case Study",
      wechat: "WeChat Official Account",
    },
    signals: {
      insight: "Data insight",
      content: "Content operations",
      project: "Project coordination",
      visual: "Visual communication",
    },
  },
} as const;

const NAV: {
  id: Exclude<View, "steamCase" | "contact">;
  no: string;
  en: string;
}[] = [
  { id: "about", no: "01", en: "ABOUT" },
  { id: "education", no: "02", en: "EDUCATION" },
  { id: "work", no: "03", en: "WORK EXPERIENCE" },
  { id: "portfolio", no: "04", en: "SELECTED PORTFOLIO" },
];
const EDU = [
  {
    school: { zh: "清华大学", en: "Tsinghua University" },
    degree: { zh: "数据传播硕士", en: "M.A. in Data Communication" },
    dates: "2025.09 — 2028.06",
    courses: {
      zh: "数据传播、人工智能与社会计算",
      en: "Data Communication, AI & Social Computing",
    },
    mark: "THU",
    logo: "/school-logos/thu-seal.png",
    gpa: "GPA 4.0 / 4.0",
  },
  {
    school: {
      zh: "南加州大学新闻与传播学院",
      en: "University of Southern California, School of Journalism and Communication",
    },
    degree: {
      zh: "数据传播硕士联合培养",
      en: "Joint M.A. in Data Communication",
    },
    dates: "2025.09 — 2028.06",
    courses: {
      zh: "社会计算 · 社会网络分析",
      en: "Social Computing · Social Network Analysis",
    },
    mark: "USC",
    logo: "/school-logos/usc.png",
    gpa: null,
  },
  {
    school: { zh: "中国人民大学", en: "Renmin University of China" },
    degree: {
      zh: "信息资源管理与传播学双学位",
      en: "Dual Degree in Information Resource Management & Communication",
    },
    dates: "2021.09 — 2025.06",
    courses: {
      zh: "数据分析方法（94）· 人工智能原理与方法（95）· 数据库原理（90）",
      en: "Data Analysis Methods (94) · AI Principles & Methods (95) · Database Principles (90)",
    },
    mark: "RUC",
    logo: "/school-logos/ruc.png",
    gpa: "GPA 3.68 / 4.0",
  },
  {
    school: { zh: "哥本哈根商学院", en: "Copenhagen Business School" },
    degree: { zh: "交换生", en: "Exchange Student" },
    dates: "2023.08 — 2023.12",
    courses: {
      zh: "平台商业管理（A）· 变革性问题解决（A）",
      en: "Platform Business Management (A) · Transformative Problem Solving (A)",
    },
    mark: "CBS",
    logo: "/school-logos/cbs.png",
    gpa: null,
  },
];
const CAMPUS = [
  {
    label: "Tsinghua Debate Team",
    dates: "2025.09 — 2028.06",
    role: { zh: "清华大学辩论队成员", en: "Member, Tsinghua Debate Team" },
    skill: { zh: "辩论 · 表达 · 团队协作", en: "Debate · Communication · Collaboration" },
    desc: {
      zh: "参与校队训练与高校赛事实践，持续训练研究、论证和临场协作能力。",
      en: "Participate in structured team training and collegiate debate events, developing research, argumentation, and live collaboration.",
    },
  },
  {
    label: "RUC Media Center",
    dates: "2022.09 — 2023.06",
    role: {
      zh: "信息资源管理学院媒体中心网络新闻中心",
      en: "Network News Center, School of Information Resource Management",
    },
    skill: { zh: "视频剪辑 · 影像采集 · 公众号运营", en: "Video Editing · Visual Production · WeChat Operations" },
    desc: {
      zh: "负责视频剪辑、公众号文章撰写与排版、专业设备摄影摄像；统筹重要活动后续宣传方案，整理并投递宣传材料。",
      en: "Edited videos, wrote and laid out WeChat Official Account articles, and photographed events with professional equipment; planned post-event publicity and organised promotional materials.",
    },
  },
  {
    label: "RUC Student Union",
    dates: "2022.09 — 2023.06",
    role: {
      zh: "中国人民大学学生会外联部部长",
      en: "Head of External Relations, RUC Student Union",
    },
    skill: { zh: "活动策划 · 跨组织协调", en: "Event Planning · Cross-organisation Coordination" },
    desc: {
      zh: "统筹“春日来信”摄影大赛、2022 年“五四”主题团日等学院大型活动，并协调学生会各部门与其他学生组织的沟通协作。",
      en: "Planned college-scale events including the Spring Letters Photography Contest and the 2022 May Fourth Youth Day programme; coordinated communication across union departments and student organisations.",
    },
  },
  {
    label: "RUC Zongheng Debate Society",
    dates: "2022.09 — 2023.06",
    role: { zh: "中国人民大学纵横辩论社社员", en: "Member, RUC Zongheng Debate Society" },
    skill: { zh: "赛事辩论 · 论证表达", en: "Competitive Debate · Argumentation" },
    desc: {
      zh: "代表学校多次参与全国性赛事，获第十六届华夏杯（国家级）季军。",
      en: "Represented the university in national competitions and placed third in the 16th Huaxia Cup, a national competition.",
    },
  },
];
const RUC_HONORS = [
  { year: "2022", zh: "三好学生", en: "Merit Student" },
  { year: "2023", zh: "三好学生", en: "Merit Student" },
  {
    year: "2023",
    zh: "学习优秀三等奖学金",
    en: "Third-Class Academic Excellence Scholarship",
  },
  {
    year: "2023",
    zh: "优秀共青团员",
    en: "Outstanding Communist Youth League Member",
  },
  {
    year: "2023",
    zh: "首届全国信息资源管理案例大赛一等奖",
    en: "First Prize, 1st National Information Resource Management Case Competition",
  },
  {
    year: "2023",
    zh: "第二十五届“创新杯”学生课外学术科技作品竞赛一等奖",
    en: "First Prize, 25th Innovation Cup Student Academic & Technology Competition",
  },
  {
    year: "2023",
    zh: "第十四届“薪火杯”学生课外学术科技作品竞赛学术类一等奖",
    en: "First Prize, 14th Xinhuo Cup Student Academic & Technology Competition",
  },
];
const JOBS = [
  {
    company: "Miracle Plus",
    logo: "/company-logos/miracle-plus.png",
    role: {
      zh: "校友社区运营实习生",
      en: "Alumni Community Operations Intern",
    },
    dates: "2025.09 — 2026.06",
    desc: {
      zh: [
        "调研校友需求并制定运营方案，提升社群参与度。",
        "对接创业者、内外部合作伙伴与行业专家，提供活动及资源链接的全流程支持。",
      ],
      en: [
        "Researched alumni needs and developed operational proposals to enhance community engagement.",
        "Connected startup founders with internal and external partners and domain experts, delivering end-to-end event and resource support.",
      ],
    },
  },
  {
    company: "渤海信托",
    logo: "/company-logos/bohai-trust.png",
    role: { zh: "新媒体运营实习生", en: "New Media Operations Intern" },
    dates: "2025.03 — 2025.06",
    desc: {
      zh: [
        "参与官方账号多平台图文撰写与视频策划，支持品牌内容生产与传播。",
        "开展跨部门访谈、梳理业务需求，输出包含两阶段目标的 AI 管理提升方案。",
      ],
      en: [
        "Managed multi-platform content and video planning for the official Bohai Trust account.",
        "Led cross-departmental interviews, distilled business needs, and developed an AI management-improvement proposal with two implementation phases.",
      ],
    },
  },
  {
    company: "Magic Tavern",
    logo: "/company-logos/magic-tavern.png",
    role: {
      zh: "新媒体运营与市场营销实习生",
      en: "New Media Operations & Marketing Intern",
    },
    dates: "2024.09 — 2024.11",
    desc: {
      zh: [
        "负责“麦吉庄园”多平台图文内容撰写与视频剪辑，支持游戏账号日常内容运营。",
        "持续追踪 3 个游戏竞品账号的选题、内容形式与运营动态，为内容规划和迭代提供参考。",
      ],
      en: [
        "Created cross-platform editorial content and video edits for Magic Manor, supporting daily operations of the game account.",
        "Tracked the topics, formats, and operating activity of three competing game accounts to inform content planning and iteration.",
      ],
    },
  },
  {
    company: "Yoorich 工作室",
    logo: "/company-logos/yoorich.png",
    role: { zh: "市场运营与策划", en: "Marketing Operations & Planning" },
    dates: "2022.09 — 2023.05",
    desc: {
      zh: [
        "参与网易《天谕》微信、微博、小红书内容运营，结合不同平台用户兴趣策划选题与分发策略。",
        "累计撰写 10+ 篇公众号推文，平均阅读量 4,000+，覆盖游戏内容选题、文案撰写与矩阵分发。",
      ],
      en: [
        "Operated WeChat, Weibo, and Xiaohongshu content for NetEase Tianyu, tailoring editorial themes and distribution to each platform’s audience.",
        "Wrote 10+ WeChat Official Account articles averaging 4,000+ reads, covering game-content ideation, copywriting, and cross-channel distribution.",
      ],
    },
  },
];
const RESEARCH_EXPERIENCE = [
  {
    dates: "2023.04 — 2024.04",
    tag: { zh: "大数据治理 × 多主体协同", en: "Big Data Governance × Multi-stakeholder Collaboration" },
    title: {
      zh: "面向大数据治理的多元主体协同参与与模式创新",
      en: "Multi-stakeholder Participation and Model Innovation for Big Data Governance",
    },
    role: { zh: "项目负责人", en: "Project Lead" },
    actions: {
      zh: [
        "完成项目团队组建、研究过程设计，撰写并整合形成 50+ 页项目立项书；设计并发布 2 份公众大数据治理感知度问卷，均回收 300+ 份并完成数据分析。",
        "领导团队完成 40+ 页案例报告及分析，形成 2 篇 5 万+ 字微案例及其教学笔记。",
      ],
      en: [
        "Built the project team and research process, and consolidated a 50+ page proposal; designed and released two public-perception surveys on big-data governance, each returning 300+ responses for analysis.",
        "Led the team to produce a 40+ page case report and analysis, plus two 50,000+ word micro-cases with teaching notes.",
      ],
    },
    outputs: {
      zh: ["50+ 页项目立项书", "40+ 页案例报告", "2 篇 5 万+ 字微案例与教学笔记"],
      en: ["50+ page project proposal", "40+ page case report", "Two 50,000+ word micro-cases with teaching notes"],
    },
    awards: {
      zh: ["北京市级大创立项", "全国首届信息资源管理案例大赛一等奖（唯一）"],
      en: ["Beijing Municipal Innovation Project", "First Prize, 1st National Information Resource Management Case Competition (sole award)"],
    },
  },
  {
    dates: "2022.12 — 2023.03",
    tag: {
      zh: "信息资源管理 × 数据产品原型",
      en: "Information Management × Data Product Prototype",
    },
    title: {
      zh: "面向档案开放审核算法设计的多维敏感语料库建设研究",
      en: "Multidimensional Sensitive Corpus Research for Archive-access Review Algorithms",
    },
    role: { zh: "项目成员", en: "Project Member" },
    actions: {
      zh: [
        "设计项目系统架构及元数据架构，形成支持自定义上传元数据方案的多维度元数据系统。",
        "完成语料库网页界面的前端开发，实现上传、下载、标注标签及检索等功能。",
      ],
      en: [
        "Designed the project system and metadata architecture, resulting in a multidimensional metadata system with custom metadata-upload schemes.",
        "Delivered the corpus site's front end with upload, download, tagging, and search functions.",
      ],
    },
    outputs: {
      zh: ["多维元数据体系", "上传 / 下载 / 标注 / 检索功能"],
      en: ["Multidimensional metadata framework", "Upload, download, annotation, and search features"],
    },
    awards: {
      zh: ["小创一等奖", "薪火杯一等奖"],
      en: ["Xiaochuang First Prize", "Xinhuo Cup First Prize"],
    },
  },
  {
    dates: "2023.03 — 2023.06",
    tag: { zh: "数据研究 × 指数构建", en: "Data research × index design" },
    title: {
      zh: "数据要素市场化推进力指数",
      en: "Data Factor Marketisation Advancement Index",
    },
    role: { zh: "学生研究员", en: "Student Researcher" },
    actions: {
      zh: [
        "深度调研 2 个省份的数字经济发展水平与数据要素市场发展状况。",
        "搜集包含两省 34 个指标在内的数百条数据，并深度梳理两省地方政策走势。",
      ],
      en: [
        "Conducted in-depth research into digital-economy development and data-factor markets across two provinces.",
        "Collected hundreds of records across 34 indicators and synthesised regional policy trends in both provinces.",
      ],
    },
    outputs: {
      zh: ["两省数百条数据", "34 个指标维度", "地方政策趋势梳理"],
      en: ["Hundreds of cross-province records", "34 indicator dimensions", "Regional policy-trend synthesis"],
    },
    awards: { zh: [], en: [] },
  },
  {
    dates: "2023.04 — 2023.09",
    tag: {
      zh: "文化传播 × 田野调研",
      en: "Cultural Communication × Field Research",
    },
    title: {
      zh: "中希数字博物馆建设现状比较",
      en: "Comparing Digital Museum Development in China and Greece",
    },
    role: { zh: "独立完成", en: "Independent Researcher" },
    actions: {
      zh: [
        "入选校级中希文明互鉴研学项目，前往希腊 5+ 家博物馆开展线下深度调研。",
        "梳理国内外数字博物馆建设案例与相关理论文献，依据数字博物馆建设的四项指标进行比较研究，形成 10+ 页调研成果（论文）。",
      ],
      en: [
        "Selected for a university China–Greece cultural-exchange research programme and conducted in-person fieldwork at 5+ museums in Greece.",
        "Synthesised digital-museum cases and literature from China and abroad, compared them through four development indicators, and produced a 10+ page research paper.",
      ],
    },
    outputs: {
      zh: ["5+ 家博物馆实地调研", "四项比较指标", "10+ 页调研成果（论文）"],
      en: ["5+ museum field visits", "Four comparison dimensions", "10+ page research paper"],
    },
    awards: { zh: [], en: [] },
  },
];
type WorkCategory = keyof typeof text.zh.categories;
const WORKS: {
  category: WorkCategory;
  title: Localized;
  href: string;
  repo?: string;
  cover?: string;
  role?: Localized;
  period?: Localized;
  desc?: Localized;
  highlights: Localized;
  tools: Localized;
}[] = [
  {
    category: "case",
    title: {
      zh: "Steam VR：网络效应增长策略",
      en: "Steam VR: Network-Effect Growth Strategy",
    },
    period: { zh: "2023.09 — 2023.12", en: "Sep — Dec 2023" },
    desc: {
      zh: "围绕“5 年内增长翻倍”的命题，从玩家—开发者双边市场出发，诊断 Steam VR 的同侧、跨侧网络效应与增长瓶颈。",
      en: "A platform-growth diagnosis for doubling Steam VR in five years, using same-side and cross-side network effects to analyse the player-developer market.",
    },
    highlights: {
      zh: "以问题金字塔将诊断收束为增长飞轮：SteamVR Home 锚定社交留存，VR Workshop 放大 UGC 供给，社媒传播把平台价值带向新增用户。",
      en: "Turns a problem pyramid into a growth flywheel: SteamVR Home anchors retention, VR Workshop expands UGC supply, and social sharing carries platform value to new audiences.",
    },
    tools: {
      zh: "平台战略 · 双边市场 · 网络效应 · 商业案例分析",
      en: "Platform Strategy · Two-sided Markets · Network Effects · Business Case Analysis",
    },
    role: { zh: "平台战略分析", en: "Platform Strategy Analysis" },
    href: "/portfolio-files/steam-vr-platform-growth-strategy.pdf",
    cover: "/vibe-covers/steam-vr.png",
  },
  {
    category: "vibe",
    title: {
      zh: "COC 调查员角色卡生成器",
      en: "COC Investigator Character Card",
    },
    desc: {
      zh: "面向《克苏鲁的呼唤》第七版的中文调查员创建工具，包含属性生成、年龄修正、派生数值与职业技能检索。",
      en: "A Chinese investigator creator for Call of Cthulhu 7th Edition, with attribute generation, age adjustments, derived stats, and searchable occupations and skills.",
    },
    highlights: {
      zh: "将复杂桌游规则拆解为循序完成的创建流程，并在同一界面中提供职业与技能的快速检索。",
      en: "Turns complex tabletop rules into a guided creation flow with instant occupation and skill reference.",
    },
    tools: {
      zh: "React · TypeScript · GitHub Pages",
      en: "React · TypeScript · GitHub Pages",
    },
    role: { zh: "独立开发", en: "Independent Developer" },
    href: "https://sumili-1.github.io/COC-character-card/",
    repo: "https://github.com/SumiLi-1/COC-character-card",
    cover: "/vibe-covers/coc.png",
  },
  {
    category: "vibe",
    title: { zh: "Psionic High：狼人杀战队数据中枢", en: "Psionic High: Werewolf Team Data Hub" },
    desc: {
      zh: "为狼人杀战队打造的资料与战绩站点，集中呈现队伍档案、排行榜、角色资料库与对局录入，让信息从零散记录变为可查询的运营界面。",
      en: "A data hub for a Werewolf team, bringing team profiles, rankings, role records, and match entry into one operational interface.",
    },
    highlights: {
      zh: "以动态数据库驱动站点内容：新增选手、对局或排名后，概览和资料页可随数据同步更新，使网站具备长期维护能力。",
      en: "Uses a dynamic database so new players, matches, and rankings can update the overview and reference pages without rebuilding the site.",
    },
    tools: { zh: "Vue 3 · Vite · Supabase · 动态数据库", en: "Vue 3 · Vite · Supabase · Dynamic database" },
    role: { zh: "独立开发", en: "Independent Developer" },
    href: "https://sumili-1.github.io/Psionic-High/",
    repo: "https://github.com/SumiLi-1/Psionic-High",
    cover: "/vibe-covers/psionic-high.png",
  },
  {
    category: "vibe",
    title: { zh: "WWSI：狼人杀竞技风格测试", en: "WWSI: Werewolf Competitive Style Test" },
    desc: {
      zh: "一项面向狼人杀玩家的竞技风格测试，以 40 道情境题和沉浸式竞技视觉，引导用户识别自己的决策与博弈倾向。",
      en: "A competitive-style test for Werewolf players, using 40 scenario questions and an immersive game-like interface to surface decision-making patterns.",
    },
    highlights: {
      zh: "以低门槛、短时长的测试路径增强传播性；项目已实现 100+ 触达，并用高辨识度的竞技风格提升完成意愿与分享动机。",
      en: "A low-friction, short-form test built for sharing: the project has reached 100+ people, with a distinct competitive visual language that encourages completion and distribution.",
    },
    tools: {
      zh: "HTML · CSS · JavaScript · GitHub Pages",
      en: "HTML · CSS · JavaScript · GitHub Pages",
    },
    role: { zh: "独立开发", en: "Independent Developer" },
    href: "https://sumili-1.github.io/WWSI/",
    repo: "https://github.com/SumiLi-1/WWSI",
    cover: "/vibe-covers/wwsi.png",
  },
  {
    category: "visualization",
    title: {
      zh: "任天堂：经典游戏与发展史数据叙事",
      en: "The Legend of Nintendo: Games & History",
    },
    desc: {
      zh: "以 Tableau 讲述任天堂的发展历程，将经典游戏、关键产品与历史节点放入可交互的时间叙事，呈现品牌如何持续塑造游戏文化。",
      en: "An interactive Tableau history of Nintendo, connecting iconic games, product milestones, and key moments in a single visual narrative.",
    },
    highlights: {
      zh: "将任天堂标志性作品与发展时间线联动，帮助读者在宏观历史与具体游戏之间切换探索，而非只浏览静态年份列表。",
      en: "Links Nintendo's signature games to its development timeline so viewers can move between company history and individual titles instead of reading a static chronology.",
    },
    tools: {
      zh: "Tableau · 数据故事 · 交互式图表",
      en: "Tableau · Data storytelling · Interactive charts",
    },
    role: { zh: "数据可视化 · Tableau", en: "Data Visualisation · Tableau" },
    href: "https://public.tableau.com/app/profile/.14534901/viz/WhoseNamesAreinGameHistoryExploreVideoGameIndustry/thelegendofnintendo",
    cover: "/vibe-covers/tableau-game-history.png",
  },
  {
    category: "visualization",
    title: { zh: "中国高考数据可视化", en: "Gaokao Data Visualisation" },
    desc: {
      zh: "围绕地区、录取与教育机会等维度组织高考数据，将复杂指标转化为更直观的比较与发现。",
      en: "Organises Gaokao data across regions, admissions, and educational opportunity to make complex indicators easier to compare and interpret.",
    },
    highlights: {
      zh: "以比较视图降低阅读门槛，帮助观察不同地区的教育与录取数据差异。",
      en: "Uses comparison views to make regional differences in education and admissions data easier to read.",
    },
    tools: {
      zh: "Tableau · 数据清洗 · 仪表板设计",
      en: "Tableau · Data preparation · Dashboard design",
    },
    role: { zh: "数据分析 · 可视化", en: "Data Analysis · Visualisation" },
    href: "https://public.tableau.com/app/profile/.14534901/viz/_16809736839850/sheet6",
    cover: "/vibe-covers/tableau-gaokao.png",
  },
  {
    category: "visualization",
    title: {
      zh: "电子游戏品类可视化：Top 100",
      en: "Video Game Genres: Top 100",
    },
    desc: {
      zh: "将 Top 100 电子游戏的品类、平台与评分信息转化为可读的结构化视觉叙事，快速识别类型分布与市场偏好。",
      en: "Turns genre, platform, and rating data from the Top 100 games into an accessible visual narrative for spotting distribution and audience preference.",
    },
    highlights: {
      zh: "在一张仪表板中并置品类、平台与年份，便于横向比较并发现市场趋势。",
      en: "Brings genre, platform, and year together in one dashboard for direct comparison and trend finding.",
    },
    tools: {
      zh: "Tableau · 仪表板设计 · 数据可视化",
      en: "Tableau · Dashboard design · Data visualisation",
    },
    role: { zh: "数据可视化 · Tableau", en: "Data Visualisation · Tableau" },
    href: "https://public.tableau.com/app/profile/.14534901/viz/top100_16569492057540/sheet10",
    cover: "/vibe-covers/tableau-top100.png",
  },
];
const SIGNALS = [
  [
    "insight",
    ["数据", "python", "spss", "tableau", "分析", "research", "sql", "excel"],
  ],
  [
    "content",
    ["内容", "文案", "公众号", "社媒", "运营", "传播", "media", "content"],
  ],
  ["project", ["项目", "策划", "活动", "沟通", "管理", "community", "event"]],
  ["visual", ["视频", "摄影", "剪辑", "设计", "visual", "video"]],
] as const;

export function ReferencePortfolio() {
  const [lang, setLang] = useState<Lang>("zh");
  const [view, setView] = useState<View>("about");
  const [jd, setJd] = useState("");
  const [modal, setModal] = useState(false);
  const [type, setType] = useState<"all" | WorkCategory>("all");
  const [activeCard, setActiveCard] = useState(0);
  const [selectedWork, setSelectedWork] = useState<
    (typeof WORKS)[number] | null
  >(null);
  const [dragOrigin, setDragOrigin] = useState<number | null>(null);
  const t = text[lang];
  const score = useMemo(() => {
    const source = jd.toLowerCase();
    const points = SIGNALS.map(
      ([name, words]) =>
        [
          name,
          Math.min(
            96,
            62 + words.filter((word) => source.includes(word)).length * 9,
          ),
        ] as const,
    );
    return {
      points,
      total: Math.round(
        points.reduce((sum, [, value]) => sum + value, 0) / points.length,
      ),
    };
  }, [jd]);
  const categories = Array.from(new Set(WORKS.map((work) => work.category)));
  const shown =
    type === "all" ? WORKS : WORKS.filter((work) => work.category === type);
  return (
    <main className="rp" lang={lang}>
      <header className="rph">
        <div className="brand-group">
          <button className="brand" onClick={() => setView("about")}>
            <b>QL</b>
            <span>PORTFOLIO</span>
          </button>
          <div className="language-switch" aria-label="Language selector">
            <button
              className={lang === "zh" ? "active" : ""}
              onClick={() => setLang("zh")}
            >
              中
            </button>
            <span>/</span>
            <button
              className={lang === "en" ? "active" : ""}
              onClick={() => setLang("en")}
            >
              EN
            </button>
          </div>
        </div>
        <nav>
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={
                view === item.id ||
                (view === "steamCase" && item.id === "portfolio")
                  ? "on"
                  : ""
              }
            >
              {t.nav[item.id]}
            </button>
          ))}
        </nav>
        <button
          className="contact-nav"
          onClick={() => setView("contact")}
        >
          {t.contact}
        </button>
      </header>
      {view === "about" && (
        <section className="hero page-enter">
          <div className="copy">
            <p>{t.hello}</p>
            <h1>{t.hero}</h1>
            <h2>{t.role}</h2>
            <article>{t.bio}</article>
            <div className="actions">
              <button onClick={() => setView("portfolio")}>{t.browse}</button>
              <button onClick={() => setView("contact")}>
                {t.contact.replace(" ↗", "")}
              </button>
            </div>
          </div>
          <div className="visual" aria-label={lang === "zh" ? "个人形象工牌" : "Profile ID badge"}>
            <i />
            <b />
            <div className="profile-badge" aria-hidden="true">
              <span className="badge-clip" />
              <img src={staticAsset("/portrait-mii-avatar.png")} alt="" />
            </div>
          </div>
          <div className="matcher">
            <label>
              <b>✦</b> {t.matcher} <small>JD MATCHER</small>
            </label>
            <textarea
              value={jd}
              onChange={(event) => setJd(event.target.value)}
              placeholder={t.matcherHint}
            />
            <button onClick={() => setModal(true)}>{t.match}</button>
            <p>{t.privacy}</p>
          </div>
          <aside
            className="contact-dock"
            aria-label={lang === "zh" ? "联系方式" : "Contact details"}
          >
            <a
              className="contact-email"
              href="mailto:liqiancheng1231@outlook.com"
            >
              <span className="contact-mark" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M3.5 6.5h17v11h-17z" />
                  <path d="m4 7 8 6 8-6" />
                </svg>
              </span>
              <span className="contact-copy">
                <small>{lang === "zh" ? "邮箱" : "Email"}</small>
                <strong>liqiancheng1231@outlook.com</strong>
              </span>
            </a>
            <a
              className="contact-linkedin"
              href="https://www.linkedin.com/in/sumi-li-thu/?isSelfProfile=true"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn profile"
            >
              <span aria-hidden="true">in</span>
              <b>LinkedIn</b>
            </a>
          </aside>
        </section>
      )}
      {view === "contact" && (
        <section
          className="contact-page page-enter"
          aria-labelledby="contact-title"
        >
          <article
            className="contact-card"
            aria-label={lang === "zh" ? "联系方式名片" : "Contact card"}
          >
            <div className="contact-card-photo">
              <img
                src={staticAsset("/contact-mii-avatar.png")}
                alt={
                  lang === "zh"
                    ? "李前程的卡通头像"
                    : "Illustrated avatar of Li Qiancheng"
                }
              />
            </div>
            <div className="contact-card-copy">
              <h1 id="contact-title">LET&apos;S CREATE MORE</h1>
              <p className="contact-card-lead">{t.contactLead}</p>
              <p className="contact-card-name">LI QIANCHENG</p>
              <span className="contact-card-role">
                Content, data and storytelling
              </span>
              <div className="contact-card-details">
                <a href="mailto:liqiancheng1231@outlook.com">
                  <small>{t.emailLabel}</small>
                  <strong>liqiancheng1231@outlook.com</strong>
                </a>
                <a
                  href="https://www.linkedin.com/in/sumi-li-thu/?isSelfProfile=true"
                  target="_blank"
                  rel="noreferrer"
                >
                  <small>LinkedIn</small>
                  <strong>linkedin.com/in/sumi-li-thu</strong>
                </a>
                <a href="tel:3239040605">
                  <small>{t.phoneLabel}</small>
                  <strong>323 904 0605</strong>
                </a>
              </div>
            </div>
          </article>
        </section>
      )}
      {view === "education" && (
        <Shell no="02" en="EDUCATION" title={t.shell.education}>
          <div className="education">
            {EDU.map((item, index) => (
              <article
                key={item.mark}
                className={item.mark === "RUC" ? "ruc-education" : ""}
              >
                <b className={`school-logo logo-${item.mark.toLowerCase()}`}>
                  <img
                    src={staticAsset(item.logo)}
                    alt={`${item.school[lang]} logo`}
                  />
                </b>
                <div>
                  <div className="education-meta">
                    <p>{item.dates}</p>
                    {item.gpa ? <b>{item.gpa}</b> : null}
                  </div>
                  <h2>{item.school[lang]}</h2>
                  <h3>{item.degree[lang]}</h3>
                  <span>{item.courses[lang]}</span>
                </div>
                <i>0{index + 1}</i>
              </article>
            ))}
          </div>
          <section className="education-followup research-block">
            <header className="education-followup-header">
              <div>
                <p>RESEARCH EXPERIENCE</p>
                <h2>{lang === "zh" ? "科研经历" : "Research experience"}</h2>
              </div>
              <span>
                {lang === "zh"
                  ? "从问题界定、田野与数据调研，到可复用的研究产出。"
                  : "From framing questions and fieldwork to reusable research outputs."}
              </span>
            </header>
            <div className="project-stories research-stories">
              {RESEARCH_EXPERIENCE.map((item) => (
                <article key={item.title.zh}>
                  <section>
                    <header className="research-card-header">
                      <time>{item.dates}</time>
                      <p className="research-tag">{item.tag[lang]}</p>
                      <h2>{item.title[lang]}</h2>
                      <h3>{item.role[lang]}</h3>
                    </header>
                    <div className="project-detail research-detail">
                      <article>
                        <small>
                          {lang === "zh" ? "研究内容" : "Research scope"}
                        </small>
                        <ul className="research-actions">
                          {item.actions[lang].map((action) => (
                            <li key={action}>{action}</li>
                          ))}
                        </ul>
                      </article>
                      <article>
                        <small>
                          {lang === "zh" ? "关键产出" : "Key outputs"}
                        </small>
                        <div className="research-output-tags">
                          {item.outputs[lang].map((output) => (
                            <span key={output}>{output}</span>
                          ))}
                        </div>
                      </article>
                    </div>
                    {item.awards[lang].length > 0 ? (
                      <div className="research-awards">
                        <small>
                          {lang === "zh" ? "获奖与认可" : "Awards & recognition"}
                        </small>
                        <div>
                          {item.awards[lang].map((award) => (
                            <span key={award}>{award}</span>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </section>
                </article>
              ))}
            </div>
          </section>
          <section className="education-followup campus-timeline-block">
            <header className="education-followup-header">
              <div>
                <p>CAMPUS EXPERIENCE</p>
                <h2>{t.campus}</h2>
              </div>
              <span>{t.campusLead}</span>
            </header>
            <div className="campus-timeline">
              {CAMPUS.map((campus, index) => (
                <article key={campus.label}>
                  <time>{campus.dates}</time>
                  <span className="campus-timeline-dot" aria-hidden="true" />
                  <div>
                    <small>{campus.label}</small>
                    <h3>{campus.role[lang]}</h3>
                    <p>{campus.desc[lang]}</p>
                    <span className="campus-skill">{campus.skill[lang]}</span>
                  </div>
                  <b>0{index + 1}</b>
                </article>
              ))}
            </div>
          </section>
          <section className="education-followup honors-block">
            <header className="education-followup-header">
              <div>
                <p>HONOURS &amp; CERTIFICATES</p>
                <h2>{lang === "zh" ? "荣誉证书" : "Honours & certificates"}</h2>
              </div>
              <span>
                {lang === "zh"
                  ? "学术表现、竞赛成果与校园荣誉。"
                  : "Academic performance, competition results, and campus recognition."}
              </span>
            </header>
            <div className="honors-list">
              {RUC_HONORS.map((honor) => (
                <article key={`${honor.year}-${honor.zh}`}>
                  <time>{honor.year}</time>
                  <span>{honor[lang]}</span>
                </article>
              ))}
            </div>
          </section>
        </Shell>
      )}
      {view === "work" && (
        <Shell no="03" en="WORK EXPERIENCE" title={t.shell.work}>
          <div className="experience-timeline">
            {JOBS.map((item, index) => (
              <article key={item.company}>
                <time className="timeline-date">{item.dates}</time>
                <div className="timeline-marker">
                  <span>0{index + 1}</span>
                </div>
                <section>
                  <header>
                    <img
                      src={staticAsset(item.logo)}
                      alt={`${item.company} logo`}
                    />
                    <div>
                      <h2>{item.company}</h2>
                    </div>
                    <b>{item.role[lang]}</b>
                  </header>
                  <ul className="experience-points">
                    {item.desc[lang].map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                  <footer>
                    <span>{lang === "zh" ? "内容运营" : "Content ops"}</span>
                    <span>{lang === "zh" ? "用户洞察" : "User insight"}</span>
                    <span>{lang === "zh" ? "协同推进" : "Coordination"}</span>
                  </footer>
                </section>
              </article>
            ))}
          </div>
        </Shell>
      )}
      {view === "steamCase" && (
        <SteamVrCaseStudy lang={lang} onBack={() => setView("portfolio")} />
      )}
      {view === "portfolio" && (
        <Shell no="04" en="SELECTED PORTFOLIO" title={t.shell.portfolio}>
          <div className="filters">
            <button
              className={type === "all" ? "sel" : ""}
              onClick={() => {
                setType("all");
                setActiveCard(0);
                setSelectedWork(null);
              }}
            >
              {t.all}
            </button>
            {categories.map((category) => (
              <button
                key={category}
                className={type === category ? "sel" : ""}
                onClick={() => {
                  setType(category);
                  setActiveCard(0);
                  setSelectedWork(null);
                }}
              >
                {t.categories[category]}
              </button>
            ))}
          </div>
          <div className="album-controls">
            <p>
              {lang === "zh"
                ? "点击卡片查看简介 · 点击右下角入口查看项目或案例"
                : "Click a card for details · Use the lower-right action to open the project or case"}
            </p>
            <div>
              <button
                aria-label="Previous work"
                onClick={() =>
                  setActiveCard(
                    (value) => (value - 1 + shown.length) % shown.length,
                  )
                }
              >
                ←
              </button>
              <span>
                {String(activeCard + 1).padStart(2, "0")} /{" "}
                {String(shown.length).padStart(2, "0")}
              </span>
              <button
                aria-label="Next work"
                onClick={() =>
                  setActiveCard((value) => (value + 1) % shown.length)
                }
              >
                →
              </button>
            </div>
          </div>
          <div
            className={"album-stage" + (selectedWork ? " has-detail" : "")}
            onWheel={(event) => {
              if (Math.abs(event.deltaY) > 55 || Math.abs(event.deltaX) > 55) {
                event.preventDefault();
                setActiveCard((value) =>
                  event.deltaY + event.deltaX > 0
                    ? (value + 1) % shown.length
                    : (value - 1 + shown.length) % shown.length,
                );
              }
            }}
            onPointerDown={(event) => setDragOrigin(event.clientX)}
            onPointerUp={(event) => {
              if (
                dragOrigin !== null &&
                Math.abs(event.clientX - dragOrigin) > 72
              )
                setActiveCard((value) =>
                  event.clientX < dragOrigin
                    ? (value + 1) % shown.length
                    : (value - 1 + shown.length) % shown.length,
                );
              setDragOrigin(null);
            }}
            onPointerCancel={() => setDragOrigin(null)}
          >
            {shown.map((item, index) => {
              const rawOffset = index - activeCard;
              const offset =
                Math.abs(rawOffset) > shown.length / 2
                  ? rawOffset - Math.sign(rawOffset) * shown.length
                  : rawOffset;
              const expanded = selectedWork === item && offset === 0;
              return (
                <article
                  key={item.title.zh}
                  tabIndex={0}
                  className={
                    "album-card " +
                    item.category +
                    (offset === 0 ? " focused" : "") +
                    (expanded ? " expanded" : "")
                  }
                  style={
                    {
                      "--offset": offset,
                      "--lift": Math.abs(offset),
                      "--scale":
                        offset === 0
                          ? 1
                          : Math.max(0.58, 0.8 - Math.abs(offset) * 0.1),
                      "--depth": shown.length - Math.abs(offset),
                    } as React.CSSProperties
                  }
                  onFocus={() => setActiveCard(index)}
                  onClick={() => {
                    setActiveCard(index);
                    setSelectedWork(expanded ? null : item);
                  }}
                >
                  <div className="album-cover">
                    <img
                      src={staticAsset(item.cover ?? "")}
                      alt={`${item.title[lang]} preview`}
                    />
                    {item.category === "case" ? (
                      <button
                        className="album-visit"
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setView("steamCase");
                        }}
                      >
                        {lang === "zh" ? "查看案例 ↗" : "View case ↗"}
                      </button>
                    ) : (
                      <a
                        className="album-visit"
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(event) => event.stopPropagation()}
                      >
                        {lang === "zh" ? "访问项目 ↗" : "Open project ↗"}
                      </a>
                    )}
                  </div>
                  <div className="album-copy">
                    <p className="album-date">
                      {item.period?.[lang] ??
                        (item.category === "vibe"
                          ? lang === "zh"
                            ? "2026.09 · 独立项目"
                            : "Sep 2026 · Independent Project"
                          : lang === "zh"
                            ? "Tableau 可视化作品"
                            : "Tableau Visualisation")}
                    </p>
                    <h2>{item.title[lang]}</h2>
                    {expanded && (
                      <section className="card-detail">
                        <div className="skill-tags">
                          {item.tools[lang].split(" · ").map((tool) => (
                            <span key={tool}>{tool}</span>
                          ))}
                        </div>
                        <article>
                          <small>
                            {lang === "zh" ? "项目简介" : "Overview"}
                          </small>
                          <p>{item.desc?.[lang]}</p>
                        </article>
                        <article>
                          <small>
                            {lang === "zh" ? "项目亮点" : "Highlight"}
                          </small>
                          <p>{item.highlights[lang]}</p>
                        </article>
                      </section>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </Shell>
      )}
      {modal && (
        <div className="veil">
          <section className="result">
            <button className="close" onClick={() => setModal(false)}>
              {t.close}
            </button>
            <p>AI JOB MATCHER / MATCH REPORT</p>
            <header>
              <div>
                <small>{t.score}</small>
                <strong>
                  {score.total}
                  <i>/100</i>
                </strong>
              </div>
              <article>
                <h2>
                  {t.report} <em>{t.instant}</em>
                </h2>
                <span>{t.reportDesc}</span>
              </article>
            </header>
            <main>
              {score.points.map(([name, value]) => (
                <div key={name}>
                  <span>{t.signals[name]}</span>
                  <i>
                    <b style={{ width: value + "%" }} />
                  </i>
                  <strong>{value}</strong>
                </div>
              ))}
            </main>
            <footer>
              <article>
                <h3>{t.strengths}</h3>
                <p>{t.strengthsText}</p>
              </article>
              <article>
                <h3>{t.focus}</h3>
                <p>{t.focusText}</p>
              </article>
            </footer>
            <small>{t.disclaimer}</small>
          </section>
        </div>
      )}
    </main>
  );
}

function Shell({
  no,
  en,
  title,
  children,
}: {
  no: string;
  en: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="shell page-enter">
      <header>
        <p>
          {no} / {en}
        </p>
        <h1>{title}</h1>
      </header>
      {children}
    </section>
  );
}

function SteamVrCaseStudy({
  lang,
  onBack,
}: {
  lang: Lang;
  onBack: () => void;
}) {
  const zh = lang === "zh";
  const content = zh
    ? {
        back: "← 返回作品集",
        eyebrow: "05 / STRATEGY CASE STUDY",
        pdf: "查看完整报告 PDF ↗",
        period: "2023.09 — 2023.12 / PLATFORM STRATEGY",
        title: "Steam VR 增长：从网络效应到增长飞轮",
        lead:
          "以“5 年内增长翻倍”为北极星，围绕 Steam VR 的双边平台结构诊断同侧与跨侧网络效应，并把增长逻辑落到社群、内容和市场触达三段策略。",
        goal: "项目目标",
        goalValue: "5 年内推动 Steam VR 增长翻倍",
        focus: "分析焦点",
        focusValue: "问题金字塔 · 同侧/跨侧网络效应 · 增长飞轮",
        role: "我的角色",
        roleValue: "战略诊断 · 案例建模 · 增长策略",
        frameEyebrow: "PROBLEM FRAME",
        frameTitle: "诊断：增长受制于网络效应未闭环",
        strategyTitle: "策略：留存、供给、触达",
        strategyLead:
          "以 SteamVR Home、VR Workshop 与社媒灵感传播分别牵引用户端留存、内容端创新和跨圈层新增。",
        strategyFlow: "社交留存 → UGC 供给 → 社媒扩散 → 网络效应增强",
        outcomeEyebrow: "EXPECTED IMPACT",
        outcomeTitle: "预期影响：三层网络效应递进",
        pagesEyebrow: "SELECTED REPORT PAGES",
        pagesTitle: "报告中的核心分析路径",
        pagesLead: "报告以问题金字塔定义命题，再将活跃社群拆解为同侧、跨侧、UGC 与市场触达四类网络效应，形成从诊断到策略的完整推导。",
      }
    : {
        back: "← Back to portfolio",
        eyebrow: "05 / STRATEGY CASE STUDY",
        pdf: "View full PDF report ↗",
        period: "SEP — DEC 2023 / PLATFORM STRATEGY",
        title: "Steam VR Growth: From Network Effects to a Flywheel",
        lead:
          "Using a five-year growth-doubling ambition as the North Star, this case diagnoses same-side and cross-side network effects in Steam VR's platform and translates them into community, content, and reach levers.",
        goal: "Project goal",
        goalValue: "Double Steam VR growth within five years",
        focus: "Focus",
        focusValue: "Problem pyramid · Network effects · Growth flywheel",
        role: "My role",
        roleValue: "Strategic diagnosis · Case modelling · Growth strategy",
        frameEyebrow: "PROBLEM FRAME",
        frameTitle: "Diagnosis: an incomplete network-effect loop",
        strategyTitle: "Strategy: retain, create, reach",
        strategyLead:
          "SteamVR Home, VR Workshop, and social discovery each activate retention, UGC supply, and new-audience reach.",
        strategyFlow: "Social retention → UGC supply → Social discovery → stronger network effects",
        outcomeEyebrow: "EXPECTED IMPACT",
        outcomeTitle: "Expected impact: three linked network effects",
        pagesEyebrow: "SELECTED REPORT PAGES",
        pagesTitle: "The report's analytical path",
        pagesLead:
          "The report first frames the strategic question with a problem pyramid, then connects an active community to same-side, cross-side, UGC, and market-reach network effects.",
      };
  const framework = zh
    ? [
        ["S / 基础", "Steam 生态、跨头显兼容与 7,000+ VR 内容，为 Steam VR 形成用户基础与内容优势。"],
        ["C / 瓶颈", "VR 设备渗透仍低、头显竞争加剧；平台需要突破既有玩家边界，并让优质内容持续增长。"],
        ["Q / 命题", "如何把用户社群与内容生态转化为可持续的网络效应，在五年内实现增长翻倍？"],
        ["A / 解法", "建设活跃社群，以社交增强同侧效应、以 UGC 放大跨侧效应，并用分享扩大市场触达。"],
      ]
    : [
        ["S / Starting point", "Steam's ecosystem, cross-headset compatibility, and a catalogue of 7,000+ VR titles create a credible user and content base."],
        ["C / Constraint", "Device penetration remains low and headset competition is intense; Steam VR must grow beyond its existing players while sustaining quality content."],
        ["Q / Strategic question", "How can an active community and content ecosystem become durable network effects that double growth within five years?"],
        ["A / Answer", "Build an active community: strengthen same-side effects through social retention, cross-side effects through UGC, and reach through sharing."],
      ];
  const strategies = zh
    ? [
        ["01", "同侧网络效应", "SteamVR Home", "用头像、语音与轻量互动增强共同游戏与社交关系，让用户因为朋友和社群而持续回到平台。", "留存与社群锚点"],
        ["02", "跨侧网络效应", "VR Workshop", "降低创作和分享门槛，推动用户生成补充内容；更丰富的内容反向吸引玩家与开发者参与。", "UGC 供给与创新"],
        ["03", "市场外溢效应", "灵感传播计划", "将用户创作、VR 活动和社媒分享连接起来，使社区成为触达非核心玩家与潜在合作方的传播节点。", "市场触达与转化"],
      ]
    : [
        ["01", "Same-side network effect", "SteamVR Home", "Use avatars, voice, and lightweight interaction to make shared play and social ties a reason for users to return.", "Retention & social anchoring"],
        ["02", "Cross-side network effect", "VR Workshop", "Reduce friction for creation and sharing so user-generated content enriches the platform and attracts both players and developers.", "UGC supply & innovation"],
        ["03", "Market spillover", "Social discovery", "Connect user creations, VR events, and social sharing so the community becomes a reach channel for new players and potential partners.", "Reach & conversion"],
      ];
  const outcomes = zh
    ? [
        ["01", "用户越多，社交价值越高", "共同游戏、社交关系与知识分享，让 Steam VR 从单次使用变为稳定的社区目的地。"],
        ["02", "内容越多，双边价值越强", "UGC 与玩家反馈持续丰富内容供给，并让平台对开发者和新玩家更具吸引力。"],
        ["03", "社区越活跃，市场触达越广", "用户创作与社媒扩散降低新受众理解 VR 的门槛，也提升平台对潜在合作方的可见度。"],
      ]
    : [
        ["01", "More users, more social value", "Shared play, social ties, and knowledge exchange make Steam VR a recurring community destination rather than a one-off use case."],
        ["02", "More content, stronger two-sided value", "UGC and player feedback enrich supply over time, making the platform more attractive to both developers and new players."],
        ["03", "A more active community, broader reach", "User creations and social distribution lower the barrier for new audiences to understand VR and increase visibility among potential partners."],
      ];
  const pages = zh
    ? [
        ["01", "市场基础与增长命题", "/steam-vr-pages/steam-vr-04.png"],
        ["02", "平台优势与网络效应", "/steam-vr-pages/steam-vr-06.png"],
        ["03", "UGC 如何放大用户价值", "/steam-vr-pages/steam-vr-09.png"],
        ["04", "策略如何形成增长飞轮", "/steam-vr-pages/steam-vr-12.png"],
      ]
    : [
        ["01", "Market base & growth question", "/steam-vr-pages/steam-vr-04.png"],
        ["02", "Platform advantage & network effects", "/steam-vr-pages/steam-vr-06.png"],
        ["03", "How UGC amplifies user value", "/steam-vr-pages/steam-vr-09.png"],
        ["04", "How strategy becomes a growth flywheel", "/steam-vr-pages/steam-vr-12.png"],
      ];

  return (
    <article className="steam-case page-enter">
      <div className="steam-case-topbar">
        <button onClick={onBack}>{content.back}</button>
        <a
          href={staticAsset("/portfolio-files/steam-vr-platform-growth-strategy.pdf")}
          target="_blank"
          rel="noreferrer"
        >
          {content.pdf}
        </a>
      </div>

      <section className="steam-case-hero">
        <div className="steam-case-copy">
          <p>{content.eyebrow}</p>
          <span>{content.period}</span>
          <h1>{content.title}</h1>
          <strong>{content.lead}</strong>
          <div className="steam-case-tags">
            <i>{zh ? "平台战略" : "Platform strategy"}</i>
            <i>{zh ? "网络效应" : "Network effects"}</i>
            <i>{zh ? "商业案例" : "Business case"}</i>
          </div>
        </div>
        <figure>
          <img
            src={staticAsset("/vibe-covers/steam-vr.png")}
            alt={zh ? "Steam VR 研究报告封面" : "Steam VR strategy report cover"}
          />
          <figcaption>STEAM VR / 2023</figcaption>
        </figure>
      </section>

      <section className="steam-case-meta" aria-label={zh ? "项目摘要" : "Project summary"}>
        <article>
          <small>01 / {content.goal}</small>
          <strong>{content.goalValue}</strong>
        </article>
        <article>
          <small>02 / {content.focus}</small>
          <strong>{content.focusValue}</strong>
        </article>
        <article>
          <small>03 / {content.role}</small>
          <strong>{content.roleValue}</strong>
        </article>
      </section>

      <section className="steam-case-section steam-case-frame">
        <header>
          <p>{content.frameEyebrow}</p>
          <h2>{content.frameTitle}</h2>
        </header>
        <div className="steam-case-grid frame-grid">
          {framework.map(([label, description]) => (
            <article key={label}>
              <b>{label}</b>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="steam-case-section steam-case-strategy">
        <header>
          <h2>{content.strategyTitle}</h2>
          <strong>{content.strategyLead}</strong>
        </header>
        <div className="steam-case-grid strategy-grid">
          {strategies.map(([number, label, title, description, impact]) => (
            <article key={title}>
              <span>{number}</span>
              <small>{label}</small>
              <h3>{title}</h3>
              <p>{description}</p>
              <b>{impact}</b>
            </article>
          ))}
        </div>
        <p className="strategy-flow">{content.strategyFlow}</p>
      </section>

      <section className="steam-case-section steam-case-outcomes">
        <header>
          <p>{content.outcomeEyebrow}</p>
          <h2>{content.outcomeTitle}</h2>
        </header>
        <div className="steam-case-grid outcome-grid">
          {outcomes.map(([number, title, description]) => (
            <article key={title}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="steam-case-section steam-case-pages">
        <header>
          <p>{content.pagesEyebrow}</p>
          <h2>{content.pagesTitle}</h2>
          <strong>{content.pagesLead}</strong>
        </header>
        <div className="steam-report-grid">
          {pages.map(([number, title, image]) => (
            <figure key={title}>
          <img src={staticAsset(image)} alt={title} loading="lazy" />
              <figcaption>
                <span>{number}</span>
                <strong>{title}</strong>
              </figcaption>
            </figure>
          ))}
        </div>
        <a
          className="steam-case-report-link"
          href="/portfolio-files/steam-vr-platform-growth-strategy.pdf"
          target="_blank"
          rel="noreferrer"
        >
          {content.pdf}
        </a>
      </section>
    </article>
  );
}
