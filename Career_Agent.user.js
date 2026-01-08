// ==UserScript==
// @name         Career Agent Template (Audit Only)
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  AI Career Reality Check - Phase 0 Audit Logic
// @author       Felix & Gemini
// @match        *://*.linkedin.com/jobs/search-results/*
// @connect      api.openai.com
// @connect      script.google.com
// @connect      script.googleusercontent.com
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function() {
    'use strict';

    // ==========================================
    // 0. CONFIGURATION (需配置)
    // ==========================================
    // [必填] 你的 Google Apps Script Webhook URL。
    // 如果留空，分析结果将只显示在页面上，不会自动保存到表格。
    const GOOGLE_SHEET_WEBHOOK = "";

    // ==========================================
    // 1. DATA ASSETS (核心资产库)
    // ==========================================
    /*
     * [重要说明 - 为什么不直接放简历？]
     * 简历本质上是为了匹配 JD 而经过修饰的“广告”，往往存在幸存者偏差和过度包装。
     * AI 需要的是你全视角、多维度、未经阉割的“职业资产 (Assets)”。
     * 只有输入最真实的工程细节、哪怕是“肮脏”的技术债或失败尝试，AI 才能客观评估你的真实胜率。
     */
    const ASSET_LIBRARY = `
[CANDIDATE PROFILE]
Name: [Your Name]
Location: [Your Location]
Status: [Your Visa Status, e.g., OPT/H1B]
Links:
- LinkedIn: [URL]
- GitHub/Portfolio: [URL]

[EDUCATION]
1. [Degree], [Major], [University] ([Year])

[CERTIFICATIONS]
- [Cert Name] | [Issuer]
  - Validation: [为什么这个证书有含金量？解决了什么信任问题？]

[ASSET 01: Most Recent Role / Project]
Type: [Internship / Full-time / Founder / Side Project]
Core Product: [一句话描述产品]
Timeline: [Date]
THE ENGINEERING REALITY (Detailed Audit):
- [真实贡献]: 也就是你简历上可能不敢写的细节。
- [Dirty Laundry/Technical Debt]: 项目中不完美的地方，这能证明你真的做过，而不是只看过教程。
- [Architecture]: 具体的某种架构决策 (e.g., ETL pipeline, Microservices)。
- [Impact]: 真实的数字 (e.g., QPS, User count, Revenue)。

[ASSET 02: Previous Role]
Type: ...
THE ENGINEERING REALITY:
- ...

[ASSET 03: Academic / Capstone]
Type: ...
THE ENGINEERING REALITY:
- ...
`;

    // ==========================================
    // 2. PROMPT ARCHITECTURE
    // ==========================================
const SYSTEM_PROMPT_AUDIT = `
You are a **Realistic Hiring Manager / Technical Lead**, not an ATS and not a career coach.

Your task is to evaluate candidate Felix against a given JD and deliver a **grounded, execution-focused hiring judgment**.



You are strict, but not lazy.

You must NOT use vague disqualifiers (e.g. "too senior", "overqualified") unless explicitly justified by role mechanics.




IMPORTANT:

You are producing an internal hiring evaluation log, not a narrative summary.

Clarity, structure, and explicit reasoning are mandatory.




────────────────────────

CANDIDATE CONTEXT (FACTUAL)

────────────────────────

- Graduation: March 2025

- Formal Full-Time Employment: None

- Only formal industry role: Businessolver internship

- Other work: side projects, capstones, small-team or self-directed builds

- Visa: OPT (H1B required)

- Location: Atlanta, open to relocation



IMPORTANT INTERPRETATION RULE:

- Side projects and founder-led work demonstrate **technical exposure and problem-solving**, NOT people management, org-scale ownership, or seniority by default.

- Do NOT inflate or penalize seniority purely based on project complexity.



────────────────────────

EVALUATION PRIORITIES (ORDER MATTERS)

────────────────────────

1. Can this candidate **execute the core tasks of this role** within 3–6 months?

2. Is there a **domain or workflow mismatch that blocks execution**, regardless of intelligence?

3. Is the candidate's background **compressible** to the role’s scope without creating flight risk?

4. Are there **external blockers** (visa, licensing, on-site constraints)?



────────────────────────

ANALYSIS FRAMEWORK (FOUR LAYERS)

────────────────────────



You MUST evaluate ALL four layers below.

You MUST NOT skip any layer.

Each layer MUST produce an explicit conclusion.



The final verdict MUST be derived ONLY from these layers.



────────────────────────

OUTPUT STRUCTURE FOR "analysis" (MANDATORY)

────────────────────────



The "analysis" field MUST be a structured, multi-section log using the exact section headers below.

Do NOT write a free-form paragraph.

Do NOT merge sections.

Do NOT omit sections.



Use '\\n' to separate lines.



REQUIRED STRUCTURE:


[1. GUT_CHECK]

- Work Type: (Operating systems / Configuring tools / Building systems)

- Alignment: Match / Partial / Mismatch

- Explanation: Concrete daily-task alignment or mismatch.



[2. HARD_MATCH]

- Domain Requirement: Pass / Fail

- Tool Requirement: Pass / Partial / Fail

- Blocking Assessment:

  - If Fail exists, explicitly state whether it is execution-blocking within 3–6 months.

  - If no hard block, state "No hard block".

- For Analyst, Informatics, Data, or Systems-oriented roles, domain exposure includes experience working with domain-constrained data, processes, or compliance frameworks, even if the candidate has not performed the domain’s core operational activities.

- Do NOT flag a domain mismatch solely because the candidate lacks hands-on execution in the domain’s primary function (e.g., patient care, lab work, legal practice), unless such execution is explicitly required as a licensed or mandatory responsibility in the JD.



[3. SOFT_MATCH_COMPRESSION]

- Domain Adjacency: High / Medium / Low

- Tool Substitutability: High / Medium / Low

- Scope Compression Judgment: Compressible / Risky / Not Compressible

- Rationale: Explain IC-level fit and internal leveling risk.



[4. IMMIGRATION_STRUCTURAL_RISK]

- Sponsorship Likelihood: High / Medium / Low / Unknown

- Role Sensitivity to Visa: Primary filter / Secondary risk

- Structural Impact: Does this factor alone downgrade the verdict?

- If the JD does not explicitly state 'No Sponsorship', assume Standard Risk (Tier 2/Conditional), do NOT assume 'Stop' unless the role is clearly government/clearance-based or explicitly bans visa holders.



[AGGREGATION_LOGIC]

- One to two lines explaining how the above layers combine into the final verdict.

- NO new evidence allowed here.



────────────────────────

HARD RULES

────────────────────────

- Do NOT add encouragement, advice, or motivational language.

- Do NOT rewrite or suggest resume changes.

- Do NOT speculate beyond provided JD and candidate facts.

- Do NOT collapse the analysis into a narrative summary.

- Treat immigration as a constraint, NOT as a skill judgment.



────────────────────────

FINAL VERDICT (ONE ONLY)

────────────────────────

⛔ STOP — Core execution blocked or structurally impossible

⚠️ CONDITIONAL — Viable only with referral / manager discretion

✅ APPLY — Realistic execution fit



────────────────────────

OUTPUT FORMAT (STRICT)

────────────────────────

1. You MUST output a SINGLE valid JSON object.

2. NO markdown code blocks.

3. The "analysis" field must be a single line string.

4. Use '\\n' for intentional line breaks.

5. Escape any internal double quotes with a backslash (\").



Schema:

{

  "verdict": "⛔ STOP | ⚠️ CONDITIONAL | ✅ APPLY",

  "score": 0-100,

  "analysis": "Structured analysis text here..."

}



Any violation of JSON format is considered a failure.
`;

    // ==========================================
    // 3. ROBUST SCRAPER (LinkedIn 抓取器)
    // ==========================================
    function getJobMeta() {
        // 尝试抓取职位标题
        const titleEl = document.querySelector('a[href*="/jobs/view/"]') ||
                        document.querySelector('.job-details-jobs-unified-top-card__job-title h1') ||
                        document.querySelector('h1');

        // 尝试抓取公司名称
        const companyAria = document.querySelector('[aria-label^="Company,"]');
        const companyLink = document.querySelector('a[href*="/company/"]');
        let company = "Unknown Company";

        if (companyAria) {
            company = companyAria.getAttribute('aria-label').replace('Company, ', '').replace('.', '');
        } else if (companyLink && companyLink.innerText.trim()) {
            company = companyLink.innerText.trim();
        }

        const title = titleEl ? titleEl.innerText.trim() : "Unknown Title";
        console.log("🚀 [Scraper] Title:", title, "| Company:", company);
        return { title, company };
    }

    function getJD() {
        // 尝试抓取 JD 正文
        const jdEl = document.querySelector('[data-testid="expandable-text-box"]') ||
                     document.querySelector('.jobs-description') ||
                     document.querySelector('#job-details') ||
                     document.querySelector('article');

        if (jdEl) {
            let text = jdEl.innerText.replace(/\s+/g, ' ').trim();
            console.log("✅ [Scraper] JD captured (Length:", text.length, ")");
            return text.substring(0, 10000); // 截取前10000字防止 Token 溢出
        }
        console.warn("❌ [Scraper] JD element not found! Ensure details pane is open.");
        return null;
    }

    // ==========================================
    // 4. CORE LOGIC (审计核心)
    // ==========================================
    async function runAudit() {
        const statusEl = document.getElementById('agent-status');
        const apiKey = GM_getValue("OPENAI_KEY");

        if (!apiKey) {
            alert("⚠️ 请先点击 '⚙️ Set API Key' 配置你的 OpenAI Key");
            return;
        }

        // 1. 抓取预检
        const { title, company } = getJobMeta();
        const jdText = getJD();

        if (!jdText) {
            statusEl.innerHTML = "<span style='color:#ff7675'>❌ JD Capture Failed.</span><br>请确保选中了一个职位，且右侧详情页已加载。";
            return;
        }

        statusEl.innerHTML = `🚀 Analyzing <b>${company}</b>...<br><span style="font-size:10px;color:#aaa">Waiting for LLM...</span>`;

        // 2. 调用 OpenAI API
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://api.openai.com/v1/chat/completions",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            data: JSON.stringify({
                "model": "gpt-4o",
                "response_format": { "type": "json_object" }, // 强制 JSON 模式
                "messages": [
                    { "role": "system", "content": SYSTEM_PROMPT_AUDIT },
                    { "role": "user", "content": `Job: ${title} @ ${company}\n\n[JD]\n${jdText}\n\n[ASSETS]\n${ASSET_LIBRARY}` }
                ],
                "temperature": 0.2
            }),
            onload: function(response) {
                try {
                    // --- 错误拦截 ---
                    if (response.status !== 200) {
                        const errJson = JSON.parse(response.responseText);
                        throw new Error(errJson.error?.message || `HTTP ${response.status}`);
                    }

                    // --- 解析内容 ---
                    const rawJSON = JSON.parse(response.responseText);
                    const content = rawJSON.choices[0].message.content.trim();
                    console.log("--- LLM RAW OUTPUT ---", content);

                    // --- 防御性 JSON 解析 ---
                    const res = JSON.parse(content);

                    // 验证必要字段
                    if (!res.verdict || res.score === undefined) {
                        throw new Error("JSON schema mismatch (missing verdict/score).");
                    }

                    // --- 渲染 UI ---
                    const color = res.verdict.includes("STOP") ? "#ff7675" : (res.verdict.includes("APPLY") ? "#55efc4" : "#ffeaa7");
                    
                    statusEl.innerHTML = `
                        <div style="color:${color}; font-weight:bold; font-size:14px; border-bottom:1px solid #555; padding-bottom:5px;">
                            ${res.verdict} (Score: ${res.score})
                        </div>
                        <div style="margin-top:8px; font-size:12px; line-height:1.5; color:#eee; white-space:pre-wrap; max-height:300px; overflow-y:auto;">${res.analysis}</div>
                    `;

                    // --- 自动云端记录 ---
                    if (GOOGLE_SHEET_WEBHOOK) {
                        saveToCloud({ 
                            company, 
                            job_title: title, 
                            verdict: res.verdict, 
                            score: res.score, 
                            analysis: res.analysis, 
                            jd: jdText.substring(0, 500) + "..." 
                        });
                        console.log("✅ Logged to Google Sheet.");
                    } else {
                        console.warn("⚠️ No Webhook configured. Cloud logging skipped.");
                    }

                } catch (err) {
                    console.error("Analysis Error:", err);
                    statusEl.innerHTML = `
                        <div style="color:#ff7675; font-weight:bold;">❌ Analysis Error</div>
                        <small style="color:#aaa;">${err.message}</small>
                    `;
                }
            },
            onerror: function(err) {
                console.error("Network Error:", err);
                statusEl.innerText = "❌ Network Request Failed (Check VPN/Internet)";
            }
        });
    }

    // ==========================================
    // 5. HELPER UTILS
    // ==========================================
    function saveToCloud(data) {
        GM_xmlhttpRequest({
            method: "POST",
            url: GOOGLE_SHEET_WEBHOOK,
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify(data)
        });
    }

    // ==========================================
    // 6. UI PANEL (交互界面)
    // ==========================================
    function createPanel() {
        if (document.getElementById('agent-panel')) return;
        
        const panel = document.createElement('div');
        panel.id = 'agent-panel';
        panel.innerHTML = `
            <div style="border-bottom:1px solid #555; padding-bottom:5px; margin-bottom:5px; font-weight:bold; color:#fff; display:flex; justify-content:space-between;">
                <span>🛡️ Career Agent Audit</span>
                <span style="font-size:10px; color:#aaa; cursor:pointer;" onclick="this.parentElement.parentElement.remove()">✕</span>
            </div>
            <div id="agent-status" style="font-size:11px; color:#ccc; margin-bottom:8px; line-height:1.4; min-height:40px; background:#222; padding:8px; border-radius:4px;">
                Ready to analyze. Open a JD to start.
            </div>
            <button id="btn-audit" class="agent-btn" style="background:#0984e3;">🔍 Run Audit (Phase 0)</button>
            <button id="btn-settings" class="agent-btn" style="background:#636e72; margin-top:5px; font-size:10px;">⚙️ Set API Key</button>
        `;
        document.body.appendChild(panel);

        document.getElementById('btn-audit').addEventListener('click', runAudit);
        document.getElementById('btn-settings').addEventListener('click', () => {
            const key = prompt("🔑 Enter OpenAI API Key (starts with sk-):", GM_getValue("OPENAI_KEY", ""));
            if (key) {
                GM_setValue("OPENAI_KEY", key);
                alert("API Key Saved!");
            }
        });
    }

    GM_addStyle(`
        #agent-panel { 
            position: fixed; 
            bottom: 20px; 
            right: 20px; 
            width: 320px; 
            background: #2d3436; 
            color: #dfe6e9; 
            padding: 15px; 
            border-radius: 8px; 
            z-index: 9999; 
            border: 1px solid #636e72; 
            box-shadow: 0 4px 15px rgba(0,0,0,0.5); 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        .agent-btn { 
            width: 100%; 
            padding: 8px; 
            border: none; 
            border-radius: 4px; 
            color: white; 
            cursor: pointer; 
            margin-bottom: 5px; 
            font-weight: bold; 
            transition: opacity 0.2s;
        }
        .agent-btn:hover { opacity: 0.9; }
        .agent-btn:active { transform: scale(0.98); }
    `);

    // 启动面板
    createPanel();
})();
