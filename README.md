# JobFit-Auditor-TheLinkedin-AI-Hiring-Manager
🛡️ The Career Truth Serum: AI Job Auditor
Stop applying blindly. Start auditing reality.
This is not a resume generator. It is a Personal AI Hiring Manager that lives in your browser.

Most people apply for jobs based on their Resume—a marketing document designed to sell. However, you get hired (or rejected) based on your Assets—your true engineering reality, technical debts, trade-offs, and raw experiences.

This tool uses GPT-4 to act as a strict, "No-BS" Hiring Manager. It reads the LinkedIn Job Description (JD), compares it against your raw Asset Library, and gives you a brutal, objective probability of success (Phase 0 Audit) before you waste time tailoring a resume.

🚀 Features
Phase 0 Audit: Instantly scores your fit (0-100) based on 4 layers: Gut Check, Hard Skills, Soft Skills, and Immigration Risk.

The "Asset" Philosophy: Evaluates you based on unfiltered reality, not resume keywords.

Auto-Logging: (Optional) Automatically saves every job analysis to a Google Sheet for tracking.

Privacy First: Your data lives in your local script. No third-party servers except OpenAI.

🛠️ Installation Guide
Step 1: Install Tampermonkey
Install the Tampermonkey extension for Chrome/Edge.

Create a New Script.

Paste the provided .js code into the editor.

Save (Ctrl+S).

Step 2: Configure Your "Asset Library" (Crucial)
This is the most important step. inside the code, look for the const ASSET_LIBRARY section.

Do not paste your resume here.

Instead, write down your Engineering Reality.

Example: "I used React, but honestly the state management was a mess," or "I handled 30k users, but the database had a write-lock issue we never fixed."

The more honest you are here, the more accurate the AI's prediction will be.

Step 3: Set Up the Prompt
Look for const SYSTEM_PROMPT_AUDIT. You need to paste the "Hiring Manager Persona" prompt here. (Ask Felix for the prompt file if it's missing!).

📊 (Optional) Google Sheet Auto-Log Setup
If you want to track every job you analyze in a spreadsheet, follow these steps:

Create a new Google Sheet.

Add headers in Row 1: Date, Company, Job Title, Score, Verdict, Analysis, JD_Snippet.

Go to Extensions > Apps Script.

Delete any code there and paste the code below:

JavaScript

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  
  sheet.appendRow([
    new Date(),
    data.company,
    data.job_title,
    data.score,
    data.verdict,
    data.analysis,
    data.jd
  ]);
  
  return ContentService.createTextOutput(JSON.stringify({"status": "success"}))
    .setMimeType(ContentService.MimeType.JSON);
}
Click Deploy (Top Right) > New Deployment.

Select type: Web app.

Description: "Job Logger".

Execute as: Me.

Who has access: Anyone (This is required for the script to write to it).

Click Deploy.

Copy the Web App URL.

Paste this URL into the Tampermonkey script at: const GOOGLE_SHEET_WEBHOOK = "YOUR_URL_HERE";

💡 How to Use
Go to any LinkedIn Job Page.

You will see a panel in the bottom right: "🛡️ Career Agent Audit".

Click "Set API Key" (One time setup, use your OpenAI Key).

Click "Run Audit".

Read the verdict.

⛔ STOP: Don't waste your time.

⚠️ CONDITIONAL: You need a referral or a specific narrative spin.

✅ APPLY: You are a strong fit. Go for it.
