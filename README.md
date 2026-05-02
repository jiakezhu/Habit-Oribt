<div align="center">

# 🌌 Habit-Orbit

**Build habits. Grow your universe.**
**养成习惯，构建你的星球宇宙。**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)](https://vitejs.dev/)
[![Gemini AI](https://img.shields.io/badge/Gemini-AI-4285F4?logo=google)](https://ai.google.dev/)
[![Status](https://img.shields.io/badge/Status-Active-brightgreen)]()

</div>

---

## Overview · 项目简介

Habit-Orbit is a gamified habit-tracking web app built around a space exploration metaphor. Every task you complete, every focus session you log, and every journal entry you write contributes to the growth of a living planetary universe — six worlds waiting to be unlocked through sustained discipline. The app combines rigorous productivity mechanics (Pomodoro timer, streak tracking, analytics) with AI-powered personalization (Gemini-generated quotes, achievement artwork, journal insights) to make building habits feel like an epic journey across the cosmos.

Habit-Orbit 是一款以太空探索为主题的游戏化习惯追踪 Web 应用。你完成的每一个任务、记录的每一次专注、写下的每一篇日记，都会推动你的行星宇宙不断成长——六颗星球等待着你用持续的自律逐一解锁。本应用将严谨的生产力工具（番茄计时器、连击追踪、数据分析）与 AI 个性化功能（Gemini 生成的励志语录、成就艺术品、日记洞察）融为一体，让习惯养成成为一段史诗般的宇宙之旅。

---

## Features · 核心功能

### 1. Daily Rituals vs. Missions · 日常仪式 vs. 任务

Two distinct task types keep your commitments organized. **Daily Rituals** are fixed recurring habits with streak tracking — missing a day resets your streak, making the cost of breaking a habit tangible. **Missions** are flexible one-time objectives with configurable due dates and priority levels.

两种截然不同的任务类型，让你的承诺井然有序。**日常仪式**是带有连击追踪的固定重复习惯——中断一天即重置连击，让打破习惯的代价变得具体。**任务**是带有可配置截止日期和优先级的一次性弹性目标。

| Attribute | Daily Ritual · 日常仪式 | Mission · 任务 |
|-----------|------------------------|---------------|
| Recurrence · 重复性 | Daily · 每日 | One-time · 一次性 |
| Streak tracking · 连击追踪 | Yes · 是 | No · 否 |
| Due date · 截止日期 | — | Configurable · 可配置 |
| Categories · 类别 | LEARNING / SPORTS / CREATIVE / MINDFULNESS / WORK / OTHER | Same · 相同 |
| Priority · 优先级 | HIGH / MEDIUM / LOW | HIGH / MEDIUM / LOW |

### 2. Planet Universe System · 行星宇宙系统

The centerpiece of Habit-Orbit's gamification is a six-planet progression system. Planets unlock based on cumulative completed tasks and total focus time. Completing tasks in different categories also deposits **planet resources** — feeding a deeper simulation layer that reflects your unique habit profile.

Habit-Orbit 游戏化设计的核心是一个六星球进阶系统。星球依据累计完成任务数和总专注时长解锁。在不同类别中完成任务还会积累**星球资源**——为反映你独特习惯画像的深层模拟层提供养分。

| Planet · 星球 | Theme · 主题 | Unlock Trigger · 解锁条件 |
|--------------|-------------|--------------------------|
| PROTO_EARTH | Origin · 起源 | Starting planet · 初始星球 |
| GREEN_GAIA | Nature & Growth · 自然与成长 | Early task completions · 初期任务完成 |
| AQUA_PRIME | Ocean & Fluidity · 海洋与流动 | Sustained daily habits · 持续日常习惯 |
| CRIMSON_MARS | Challenge & Fire · 挑战与热情 | Significant focus time · 大量专注时长 |
| GOLDEN_CORE | Mastery · 精通 | High streak milestones · 高连击里程碑 |
| CYBER_TRON | Transcendence · 超越 | Elite combined metrics · 顶级综合指标 |

### 3. Pomodoro / Focus Timer · 番茄专注计时器

Two modes: a **Countdown Timer** for classic Pomodoro-style sessions and an **Open-ended Stopwatch** for deep-work flows. Sessions under 1 minute are discarded; all valid sessions update the task's `pomodoroSessions` and `totalTimeSpent` fields and write to the global `focusHistory`, powering the Analytics view.

两种模式：用于经典番茄工作法的**倒计时模式**，以及无固定间隔深度工作流的**开放式秒表模式**。不足 1 分钟的会话将被丢弃；所有有效会话均更新任务数据并向 `focusHistory` 写入记录，为分析视图提供数据支持。

### 4. AI Achievement Gallery · AI 成就画廊

At every **7-day streak milestone**, the app calls the Gemini API to generate a unique achievement card. Achievements carry rarity tiers (CARD or SCULPTURE type) and are displayed in a dedicated Gallery view. The AI is prompted with the streak context, category, and user history — producing personalized artwork that makes hitting milestones feel genuinely rewarding.

每达到 **7 天连击里程碑**，应用会调用 Gemini API 生成一张独特的成就卡片。成就按稀有度分级（CARD 或 SCULPTURE 类型），在专属画廊视图中展示。AI 会根据连击天数、任务类别和用户历史生成个性化艺术品，让达成里程碑真正令人有成就感。

### 5. Evening Journal · 晚间日记

Each journal entry captures **mood**, **free-form content**, the day's **completed task count**, and **location** (via `locationService.ts`). After submission, Gemini generates a personalized reflective insight stored alongside the entry — an AI-augmented diary that grows richer over time.

每篇日记记录**心情**、**自由文本内容**、当天**完成任务数**以及**位置信息**。提交后，Gemini 生成个性化反思洞察并与日记一同存储——一本随时间不断丰富的 AI 增强型日记。

### 6. Inspiration Capture · 灵感捕捉

A lightweight quick-capture modal lets you record ideas the moment they strike, with automatic timestamp and location metadata attached.

轻量级的快速记录弹窗让你在灵感涌现时立刻捕捉想法，自动附加时间戳和位置元数据。

### 7. Analytics · 数据分析

The Analytics view surfaces historical focus data, task completion patterns by category and time period, and journal trends — all computed client-side from `localStorage`.

分析视图呈现历史专注数据、按类别和时间细分的任务完成规律以及日记趋势——全部基于 `localStorage` 在客户端计算完成。

### 8. Daily AI Quote · 每日 AI 语录

A Gemini-generated motivational quote (with attributed author) is fetched once per day and cached in `UserState.dailyQuote`, refreshing at midnight without wasting API quota.

每天从 Gemini 获取一条带作者署名的励志语录并缓存，于午夜刷新，避免重复调用消耗 API 配额。

---

## Tech Stack · 技术栈

| Layer | Technology | Purpose · 用途 |
|-------|-----------|---------------|
| UI Framework | React 18 | Component-driven declarative UI · 组件化声明式界面 |
| Language | TypeScript 5 | End-to-end type safety · 全代码库类型安全 |
| Build Tool | Vite | Fast HMR dev server + optimized build · 快速热更新开发服务器 |
| AI Services | Google Gemini API | Quotes, achievement art, journal insights · 语录、成就艺术品、日记洞察 |
| Location | `locationService.ts` | Geolocation metadata · 地理元数据 |
| Persistence | `localStorage` | Full `UserState` serialized on every change · 每次状态变更全量序列化 |
| Styling | Tailwind CSS | Stone/neutral palette + banana-yellow accents · 中性色调 + 香蕉黄强调色 |

---

## Data Architecture · 数据架构

The entire application state lives in a single `UserState` object, serialized to `localStorage` on every mutation. This zero-backend design means the app works fully offline after initial load, with AI features gracefully degrading when the Gemini API is unavailable.

整个应用状态封装在单一的 `UserState` 对象中，每次变更时序列化至 `localStorage`。零后端设计意味着应用在首次加载后可完全离线运行，Gemini API 不可用时 AI 功能优雅降级。

```typescript
interface Task {
  id: string;
  title: string;
  type: "RITUAL" | "MISSION";
  category: "LEARNING" | "SPORTS" | "CREATIVE" | "MINDFULNESS" | "WORK" | "OTHER";
  priority: "HIGH" | "MEDIUM" | "LOW";
  dueDate?: string;
  isCompleted: boolean;
  streak: number;
  lastCompletedDate?: string;
  pomodoroSessions: number;
  totalTimeSpent: number;    // minutes
}

interface UserState {
  tasks: Task[];
  journalEntries: JournalEntry[];
  inspirations: Inspiration[];
  achievements: Achievement[];
  focusHistory: FocusSession[];
  unlockedPlanets: PlanetType[];
  currentPlanet: PlanetType;
  planetResources: Record<TaskCategory, number>;
  dailyQuote: { text: string; author: string; date: string };
}
```

---

## Project Structure · 项目结构

```
Habit-Oribt/
├── components/
│   ├── FocusStats.tsx        # Analytics view — focus & task history
│   ├── InspirationModal.tsx  # Quick-capture modal for ideas
│   ├── Journal.tsx           # Evening reflection entry form
│   ├── NotebookView.tsx      # Achievement gallery
│   ├── PomodoroTimer.tsx     # Countdown + stopwatch focus timer
│   ├── TaskFormModal.tsx     # Create / edit task modal
│   ├── UniverseDisplay.tsx   # Animated planet universe scene
│   └── VirtualPlanet.tsx     # Individual planet renderer
├── services/
│   ├── geminiService.ts      # Gemini API — quotes, artwork, insights
│   └── locationService.ts   # Geolocation for journals & inspirations
├── App.tsx                   # Root component, state management
├── types.ts                  # Shared TypeScript interfaces & enums
├── constants.ts              # App-wide constants
└── index.tsx                 # Vite entry point
```

---

## Getting Started · 快速开始

**Prerequisites · 前置要求**
- Node.js 18+
- A [Google Gemini API key](https://ai.google.dev/) (free tier available · 提供免费层级)

```bash
# Clone the repository | 克隆仓库
git clone https://github.com/jiakezhu/Habit-Oribt.git
cd Habit-Oribt

# Install dependencies | 安装依赖
npm install

# Configure environment | 配置环境变量
# Create .env.local and add:
# GEMINI_API_KEY=your_key_here

# Start the dev server | 启动开发服务器
npm run dev
```

Open `http://localhost:5173` · 在浏览器中打开 `http://localhost:5173`

---

## Design Philosophy · 设计理念

**Commitment through consequence · 通过后果强化承诺**
Streak resets are intentional — they make the cost of breaking a habit tangible. The planet unlock system applies the same logic at a longer time scale: progress is visible, but it must be earned incrementally.

连击重置是刻意为之——它让打破习惯的代价变得具体。星球解锁系统在更长的时间尺度上应用了同样的逻辑：进度清晰可见，但必须通过持续努力逐步获得。

**AI as companion, not crutch · AI 是伴侣，而非拐杖**
Gemini features are additive: the app works without them. When available, the daily quote, journal insight, and achievement artwork transform rote habit logging into a personalized narrative experience.

Gemini 功能是锦上添花：没有它应用照样运行。当 API 可用时，每日语录、日记洞察和成就艺术品能将枯燥的习惯记录转化为个性化的叙事体验。

**One state object, zero servers · 单一状态对象，零服务器**
The entire user world lives in `localStorage` — no accounts, no sync conflicts, no habit data leaving the device. Privacy by design.

用户的整个世界都存储在 `localStorage` 中——没有账户、没有同步冲突，习惯数据不会离开设备。隐私保护由设计保证。

**Space as metaphor · 太空作为隐喻**
PROTO_EARTH represents where everyone starts — raw, unformed potential. CYBER_TRON represents what sustained discipline can build. The journey between them is the product.

PROTO_EARTH 代表每个人的起点——原始而未成形的潜力。CYBER_TRON 代表持续自律所能构建的成就。两者之间的旅程，就是这款产品本身。

---

<div align="center">

*Made with discipline and a bit of stardust.*
*以自律为燃料，以一点星尘为引。*

</div>
