# F-ZHIZHILIAO-MVP-0001 — 竹知了网页小游戏 MVP Requirement

## 1. Goal

交付一个移动端优先、前端-only 的“竹知了”主题网页小游戏 MVP。主题使用通用虚构竹知了玩具意象，不使用真实公司商标、真实人物形象或误导性现实表述。

玩家在 30 秒回合内通过拖动/摇动式 pointer 手势驱动竹知了获得分数，连续有效操作形成 Combo / streak，并在局内遇到至少一个轻量随机反馈 modifier。回合结束后展示最终分数和称号。

## 2. In Scope

- Vue 3 + TypeScript + Vite 单页前端应用。
- 手机触控优先，同时支持桌面 mouse / pen pointer。
- 明确的开始页、玩法说明、游戏中 HUD 和结算页。
- 固定 30 秒单局时长。
- 基于拖动距离/速度变化的有效“摇动”判定与计分。
- Combo / streak：连续有效摇动提升连击反馈；超时未产生有效摇动则连击中断。
- 至少一个轻量随机 modifier，例如短时“双倍竹鸣/得分倍率”事件；随机源必须可注入或可固定 seed，以支持确定性测试。
- 结束展示分数、最高 Combo 和基于分数区间的虚构称号。
- reduced-motion 和基本 accessibility 支持。
- scoring / timing 的确定性单元测试。
- `npm run typecheck`、`npm run test`、`npm run build` 全部通过。

## 3. Out of Scope

- 后端服务、数据库、登录、排行榜、账号系统。
- 联机或多人模式。
- 真实品牌、公司、人物、新闻事件或现实商业宣传。
- 首版复杂音频系统；可使用视觉/文字反馈表达“竹鸣”等效果，实际音频不是 MVP 必需项。
- 重型物理引擎或 3D 渲染。

## 4. Primary User Flow

1. 用户打开页面，看到游戏标题、简短玩法说明和“开始游戏”按钮。
2. 用户点击开始，进入 30 秒回合。
3. 用户按住竹知了主体并快速来回拖动；touch、mouse、pen 使用统一 Pointer Events 语义。
4. 系统把有效移动样本转换为离散 shake 得分事件；无效微小抖动不计分。
5. 连续有效 shake 在规定窗口内累计 Combo；超出窗口后 Combo 重置。
6. 回合中可能触发短时 modifier，并提供明显但不过度的视觉/文字反馈。
7. 倒计时到 0 后立即停止计分，进入结算。
8. 结算展示最终分数、最高 Combo、称号，并提供“再来一局”。

## 5. Gameplay Requirements

### 5.1 Round timing

- 每局逻辑时长固定为 30,000 ms。
- 游戏逻辑必须基于可注入/显式传入的时间值计算 remaining time，避免核心逻辑依赖不可控的 wall-clock。
- 当 `elapsed >= 30000` 时回合结束；结束之后的输入不得再增加分数或 Combo。
- UI 可按适当频率刷新倒计时，但核心结束判定必须确定性可测试。

### 5.2 Gesture / shake input

- 使用 Pointer Events，兼容 touch / mouse / pen。
- 玩家必须先 pointer down 才进入主动拖动状态；pointer up / cancel 结束当前拖动。
- 核心 gesture 逻辑从 UI 事件中提取时间、位置或移动量，再交由纯逻辑函数判定是否形成有效 shake。
- 应设置最小移动阈值，过滤轻微手指抖动/噪声。
- 鼓励通过方向反转或累计移动距离识别“摇动感”，但最终算法由 Design 阶段确定。

### 5.3 Scoring

- 每个被接受的 shake event 产生基础分。
- Combo 可提供有限、可预测的倍率或额外加分。
- 计分函数必须是纯函数或近似纯函数：相同输入产生相同输出。
- modifier 对分数的影响必须显式作为输入，而不能隐藏在 UI 状态或不可控随机调用中。
- 分数不得为负。

### 5.4 Combo / streak

- 有效 shake 在 combo window 内连续发生时 Combo 增长。
- 超过 combo window 没有新有效 shake 时 Combo 重置。
- UI 至少显示当前 Combo；结算至少展示最高 Combo。
- Combo 阈值/倍率必须在 Design 中固定，并通过测试覆盖边界条件。

### 5.5 Random modifier

MVP 至少实现一种轻量随机事件，推荐：

- “竹鸣加倍”：短时间内有效 shake 得分乘以固定倍率；或
- 等价的纯反馈 modifier，只要对局规则可见且可测试。

约束：

- 随机触发不得影响 30 秒回合时长。
- 随机源必须可以在测试中替换为固定序列/seeded RNG。
- 相同 seed/随机序列和相同输入事件必须得到相同结果。

## 6. UI / UX Requirements

### Start state

- 显示“竹知了”游戏名称或等价虚构名称。
- 一句话说明：按住并快速来回拖动竹知了来得分。
- 明确的开始按钮。

### Playing state

- 主要互动目标足够大，适合单手手机触控。
- 显示剩余时间、当前分数、当前 Combo。
- 有效 shake 后提供即时视觉/文字反馈。
- modifier 激活时必须有可理解的状态提示，而不仅依赖颜色。

### Result state

- 显示最终分数。
- 显示最高 Combo。
- 显示基于分数区间映射的虚构称号。
- 提供“再来一局”。

## 7. Accessibility / Reduced Motion

- 主要操作区域和按钮必须有可读文本或 accessible name。
- 重要状态（倒计时、modifier、结算结果）不能仅依赖颜色表达。
- 触控目标尺寸应适合移动设备。
- 尊重 `prefers-reduced-motion: reduce`：降低/取消大幅摆动、闪烁、粒子或持续动画，但不改变核心游戏规则与得分结果。
- 不要求依赖设备摇一摇传感器；核心玩法必须通过屏幕 pointer 操作完成，避免权限和可访问性问题。

## 8. Determinism and Testability

必须至少对以下核心逻辑进行确定性单元测试：

- 30 秒 timing 边界：开始、29,999 ms、30,000 ms、结束后输入。
- 基础 scoring：有效/无效 shake、基础分、Combo 影响。
- Combo window：窗口内增长、窗口外重置。
- modifier：固定随机序列下的触发和得分效果。
- title mapping：分数边界映射稳定。

测试不得依赖真实等待 30 秒，也不得要求真实 PointerEvent 才能验证 scoring/timing 核心规则。

## 9. Acceptance Criteria

1. 在常见手机视口中可以完成开始 → 游戏 → 结算 → 再来一局完整流程。
2. 一局严格以 30,000 ms 的逻辑时间结束，结束后不再计分。
3. touch 与桌面 pointer 均可驱动同一套拖动/摇动游戏逻辑。
4. 有效 shake 可以稳定增加分数，微小噪声不会持续刷分。
5. Combo / streak 有明确的增长、中断和可见反馈。
6. 至少一个随机 modifier 在实际对局中可触发，并且随机行为可在测试中固定。
7. 结算显示分数、最高 Combo 和虚构称号。
8. reduced-motion 模式降低非必要运动效果，但不改变 scoring/timing 结果。
9. 无真实公司商标、真实人物形象或误导性现实内容。
10. scoring / timing 以及关键边界逻辑具有确定性单元测试。
11. `npm run typecheck` 通过。
12. `npm run test` 通过。
13. `npm run build` 通过。

## 10. Open Design Decisions

以下内容留给 Design 阶段定稿，不阻塞 Requirement：

- shake 最小距离、方向反转识别方式与采样策略。
- 基础分、Combo window、Combo multiplier 上限的具体数值。
- modifier 的触发概率、持续时间和倍率具体数值。
- 称号的具体文案和分数区间。
- 视觉风格、动画细节和组件拆分。
