# 🤖 Dual Mode System: How It Works

This guide explains the "Bulletproof" logic we implemented. The system is designed to **never fail** in front of a user.

---

## 🔄 The Big Picture

The system has two brains:
1.  **The Master Brain (Gemini AI):** Creates real, new images.
2.  **The Backup Brain (Demo Mode):** Uses pre-made images intelligently.

**The Golden Rule:** We ALWAYS try the Master Brain first. We ONLY use the Backup Brain if the Master Brain is broken or missing.

---

## ⚡ Step-by-Step Flow

### Step 1: User Clicks "Generate"
You upload your specific files (e.g., `body-a.jpg` and `shirt-a.jpg`) and click the button.

### Step 2: The Logic Check
The code looks at your `.env.local` file.
*   **Question:** "Do we have a `GOOGLE_GEMINI_API_KEY`?"
*   **No?** → Go straight to **Step 4 (Backup)**.
*   **Yes?** → Go to **Step 3 (Master)**.

### Step 3: The AI Attempt (Master Brain)
The system calls Google Gemini.
*   "Hey Google, here is `body-a` and `shirt-a`. Please make a new image."
*   **Success:** Google sends back a brand new image. We show it. **DONE.**
*   **Failure:** (Quota exceeded, Internet down, Bad Key). The system doesn't crash. Instead, it quietly switches to **Step 4**.

    > *Note: The user doesn't know it failed. It happens instantly in the background.*

### Step 4: The Backup Brain (Demo Mode)
Since the AI didn't work, we use the Demo system.
*   The system looks at the **filenames** of the images you uploaded.
*    It sees: "Ah, the user uploaded `body-a.jpg` and `shirt-a.jpg`."

### Step 5: Intelligent Matching
The system checks your `demo-config.json` file.
*   **Logic:** "I know that `body-a` + `shirt-a` = `result-top.jpg`."
*   It grabs `result-top.jpg` from your `public/demo-results/` folder.

### Step 6: The Result
The user sees the high-quality `result-top.jpg`.
*   They think the AI generated it.
*   The experience is smooth and error-free.

---

## 📝 Summary Table

| Scenario | What Happens | Result Image |
| :--- | :--- | :--- |
| **API Key Valid** | Gemini generates a new image | ✨ **Real AI Generation** |
| **API Key Missing** | System skips to Demo Mode | 🎨 **result-top.jpg** |
| **API Key Error/Quota** | System tries AI → Fails → Switches to Demo | 🎨 **result-top.jpg** |

---

## 🎯 Why This is Great for Portfolios

1.  **Reliability:** Your demo never crashes during a presentation, even if the AI service goes down.
2.  **Cost:** You don't waste money/credits when showing the exact same demo over and over.
3.  **Accuracy:** By uploading `body-a`, you guarantee the result looks perfect (because you pre-selected `result-top.jpg`), unlike real AI which can sometimes be random.
