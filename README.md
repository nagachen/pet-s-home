# Pet's Home

AI Studio 匯出的 React/Vite 專案。GitHub 作為正式來源，之後可以由 Codex 接手修改、整理與部署。

## 本機啟動

需要先安裝 Node.js。

1. 安裝套件

```powershell
npm install
```

2. 建立 `.env.local`

```powershell
Copy-Item .env.example .env.local
```

把 `.env.local` 裡的 `GEMINI_API_KEY` 換成你的 Gemini API key。不要把 `.env.local` 上傳到 GitHub。

3. 啟動開發網站

```powershell
npm run dev
```

開啟 `http://localhost:3000/`。

## 檢查建置

```powershell
npm run build
```

## AI Studio 到 Codex 的建議流程

AI Studio 用來做原型；GitHub 用來保存正式版本；Codex 從 GitHub 下載後負責整理、加功能、修 bug 和部署。

如果 AI Studio 產生新版，建議先放到新分支，再比較差異後合併，避免覆蓋 Codex 已經改好的內容。
