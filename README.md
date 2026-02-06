# 🧳 Travel Agent Landing Page & n8n Workflow Setup

This repository contains the **Travel Agent Landing Page** along with an **n8n automation workflow**.

Follow the steps below to run the project locally and configure the workflow.

---

## 🔗 Live Website

https://v0-travel-agent-landing-page-five.vercel.app/

---

## 📦 Clone the Repository

```bash
git clone <your-repo-url>
cd <your-repo-folder>
```

---

## ⚙️ n8n Workflow Setup

### 1️⃣ Download the n8n JSON File
Download the **n8n workflow JSON** provided in this repository  
(example: `travel-agent-workflow.json`).

---

### 2️⃣ Install & Start n8n

If n8n is not installed:

```bash
npm install -g n8n
```

Start n8n:

```bash
n8n
# OR
npx n8n
```

Open in browser:

```
http://localhost:5678
```

---

### 3️⃣ Import Workflow into n8n

Inside n8n editor:

1. Click **Import**
2. Choose **Upload File**
3. Select the downloaded JSON workflow
4. Workflow will be added to your dashboard

---

### 4️⃣ Fill Credentials in Each Node

After importing:

- Open **every node** in the workflow  
- Add the required **API keys / tokens / credentials**  
- Save the node after filling credentials  

⚠️ Workflow will **not run** until all credentials are configured.

---

## 🚀 Run the Travel Agent Web App

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

Local site will run on:

```
http://localhost:3000
```

---

## ✅ Setup Checklist

- Clone repository  
- Download n8n JSON workflow  
- Import workflow into n8n  
- Fill credentials in all nodes  
- Run `npm install`  
- Run `npm run dev`  

---

## 📝 Notes

- Keep **n8n running** while testing the project.
- Ensure **all environment variables / API keys** are correct.
- If `.env.example` exists, copy it to `.env` and fill values.

---

## 🙌 Support

If you face any issues:

- n8n workflow errors  
- Missing credentials  
- Project not starting  

Create an **issue** in this repository.

---

**Happy Building 🚀**
