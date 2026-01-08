
# 🛡️ The Career Truth Serum: AI Job Auditor
**(Felix's Career Agent v5.3)**

> **Stop applying blindly. Start auditing reality.**

This is not a resume generator. It is a **Personal AI Hiring Manager** that lives in your browser.

Most people apply for jobs based on their **Resume**—a marketing document designed to sell. However, you get hired (or rejected) based on your **Assets**—your true engineering reality, technical debts, trade-offs, and raw experiences.

This tool uses **GPT-4o** to act as a strict, "No-BS" Hiring Manager. It reads the LinkedIn Job Description (JD), compares it against your raw **Asset Library**, and gives you a brutal, objective probability of success (**Phase 0 Audit**) before you waste time tailoring a resume.

---

## 🚀 Features

* **Phase 0 Audit:** Instantly scores your fit (0-100) based on 4 layers: Gut Check, Hard Skills, Soft Skills, and Immigration Risk.
* **The "Asset" Philosophy:** Evaluates you based on unfiltered reality, not resume keywords.
* **Auto-Logging:** Automatically saves every job analysis to your Google Sheet for tracking.
* **Privacy First:** Your data lives in your local script. No third-party servers except OpenAI.

---

## 🛠️ Installation Guide

### Step 1: Install Tampermonkey
1.  Install the [Tampermonkey extension](https://www.tampermonkey.net/) for Chrome, Edge, or Firefox.
2.  Click the extension icon -> **Create a New Script**.
3.  Delete any default code.
4.  Paste the provided `Career_Agent_v5.3.js` code into the editor.
5.  Save (Ctrl+S).

### Step 2: Configure Your "Asset Library" (CRUCIAL)
This is the most important step. Inside the script code, look for the `const ASSET_LIBRARY` section.

* **Do not paste your resume here.**
* Instead, write down your **Engineering Reality**.

> **Example:** "I used React, but honestly the state management was a mess," or "I handled 30k users, but the database had a write-lock issue we never fixed."

**Why?** If you lie to the AI here, it will give you a false confidence score. The AI needs to know your "Dirty Laundry" (Technical Debts) to accurately predict if you will be blocked during a technical interview.

### Step 3: Set Up the Prompt
Look for `const SYSTEM_PROMPT_AUDIT`. Ensure the "Hiring Manager Persona" prompt is pasted there. (This defines how strict the AI behaves).

---

## 📊 Google Sheet Auto-Log Setup (Recommended)

If you want to track every job you analyze in a spreadsheet, follow these steps exactly:

### 1. Prepare the Sheet
1.  Create a new [Google Sheet](https://sheets.google.com).
2.  In the first row (**Header**), add these columns exactly in this order:
    * `Timestamp`
    * `Company`
    * `Job Title`
    * `Verdict`
    * `Score`
    * `Analysis`
    * `JD_Snippet`

### 2. Add the Script
1.  In the Google Sheet, go to **Extensions** > **Apps Script**.
2.  Delete any code in the editor (e.g., `myFunction`).
3.  Paste the following code **exactly**:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Check if data exists
    if (!e || !e.postData || !e.postData.contents) {
      return ContentService.createTextOutput("Error: No data received");
    }

    var data = JSON.parse(e.postData.contents);
    
    // Append Row
    sheet.appendRow([
      new Date(), 
      data.company || "N/A", 
      data.job_title || "N/A", 
      data.verdict || "N/A", 
      data.score || 0, 
      data.analysis || "N/A", 
      data.jd || "N/A"
    ]);
    
    return ContentService.createTextOutput("Success");
  } catch (err) {
    console.error("Payload Error: " + err.toString());
    return ContentService.createTextOutput("Error: " + err.toString());
  }
}

function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  
  // Return empty array if sheet is empty
  if (data.length === 0) {
    return ContentService.createTextOutput(JSON.stringify([]))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Assume Row 1 is Header, start reading from Row 2
  var rows = data.slice(1); 
  
  var result = rows.map(function(row) {
    // Mapping columns to object keys
    // [0]Date, [1]Company, [2]JobTitle, [3]Verdict, [4]Score, [5]Analysis, [6]JD
    return {
      timestamp: row[0],
      company: row[1],
      job_title: row[2],
      verdict: row[3],
      score: row[4],
      analysis: row[5],
      jd: row[6]
    };
  });
  
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

```

### 3. Deploy (Critical Step)

1. Click the blue **Deploy** button (Top Right) -> **New Deployment**.
2. Click the gear icon ⚙️ next to "Select type" -> select **Web app**.
3. Fill in the details:
* **Description:** Job Logger v1
* **Execute as:** Me (your email)
* **Who has access:** `Anyone` (⚠️ **Important:** Must be "Anyone" so the script can write to it without complex OAuth).


4. Click **Deploy**.
5. Copy the **Web App URL** (starts with `https://script.google.com/...`).
6. Paste this URL into the Tampermonkey script at the top:
`const GOOGLE_SHEET_WEBHOOK = "YOUR_URL_HERE";`

---

## 💡 How to Use

1. Go to any **LinkedIn Job Page** (search results or job detail view).
2. You will see a panel in the bottom right: `🛡️ Career Agent Audit`.
3. **First Time Only:** Click `⚙️ Set API Key` and enter your OpenAI API Key (needs `gpt-4o` access).
4. Click `💀 Phase 0: Audit & Log`.
5. Read the verdict:
* ⛔ **STOP:** Don't apply. Structural mismatch.
* ⚠️ **CONDITIONAL:** You need a referral or a specific narrative spin.
* ✅ **APPLY:** Strong fit. Go for it.



---

*Authored by Felix & Gemini | v5.3*

```


