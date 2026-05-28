## 使用者偏好

- 如果任務卡在缺少工具、PATH 設定、版本不相容、權限不足或環境設定問題，先暫停並告知使用者缺少什麼、有哪些選項，再決定是否花時間繞路處理。
- 優先選擇最短且可靠的設定方式。當安裝工具或重新啟動可以節省時間與 token 時，先詢問使用者是否要這麼做。
- 與使用者溝通時預設使用繁體中文，除非使用者要求改用其他語言。
- 在提出任何方案、工具、服務、平台、架構、套件、API、模型、雲端資源、外部依賴、工作流程或替代選項時，預設把成本列入考量。說明是否免費、何時可能開始收費、常見付費模式、成本風險，以及目前專案階段是否值得付費。這條規則不限於部署、後端或資料庫。
- 在 Windows / Codex 沙盒中如果 `git`、`node`、`npm`、`python` 或 `pip` 找不到，先檢查 `C:\Program Files\Git\cmd`、`C:\Program Files\nodejs`、`C:\Users\nagachen\AppData\Local\Programs\Python\Python313` 與 `C:\Users\nagachen\AppData\Local\Programs\Python\Python313\Scripts`。必要時在當次 PowerShell 指令前補上 `$env:Path = 'C:\Users\nagachen\AppData\Local\Programs\Python\Python313;C:\Users\nagachen\AppData\Local\Programs\Python\Python313\Scripts;C:\Program Files\Git\cmd;C:\Program Files\nodejs;' + $env:Path`；執行 npm 時優先使用 `npm.cmd`，避免 PowerShell 執行原則擋住 `npm.ps1`。

## Codex / Windows 沙盒故障排除

- 如果連 `Get-Location`、`pwd` 這類最小指令都無法執行，且錯誤包含 `windows sandbox`、`setup refresh failed`、`sandbox failed` 或 `kernel exited unexpectedly`，優先判定為 Codex 執行器或沙盒初始化失敗，不要先歸因於 repo、git 或應用程式程式碼。
- 遇到上述情況時，先建議重跑同一個 automation 一次；若仍失敗，再建議重開 Codex app 或新開 thread。只有在最小指令可執行後，才繼續檢查 PATH、依賴、git 狀態或專案腳本。
- 如果最小指令可執行，但出現 `git is not recognized`、`node is not recognized`、`npm` / `python` 找不到，再依前述 PATH 規則處理，這種情況才屬於工具鏈或環境設定問題。
