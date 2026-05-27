# Pet's Home 專案歷史紀錄

更新日期：2026-05-27

## 專案定位

Pet's Home 是一個寵物認養網站，目前已從前端展示頁，逐步擴充成可連接 Supabase 的認養平台。現階段重點是建立可用的前台、會員系統、認養申請流程、後台管理與資料庫串接，適合先作為 MVP 與測試版使用。

## 從一開始到目前的進度

### 1. 前端展示網站

一開始網站主要是靜態前端，包含：

- 首頁
- 待認養名單
- 服務據點
- 寵物詳情
- 收藏互動
- 認養諮詢表單

前期資料主要存在前端範例資料中，適合展示畫面，但不適合多人使用或正式保存資料。

### 2. 選擇後台與資料庫方案

評估後選擇 Supabase，原因是：

- 免費方案足夠目前測試與 MVP。
- 內建 PostgreSQL 資料庫。
- 內建 Auth 會員登入。
- 可直接提供前端 API。
- 可加入 Storage 圖片上傳。
- 未來若流量成長，可再升級付費方案。

成本注意：

- 目前 Supabase 免費方案可先使用。
- 之後若資料量、圖片流量、Auth 使用量或專案需求增加，可能需要升級。
- Vercel Hobby 方案目前也足夠部署前端測試版。

### 3. Supabase 資料庫建立

已建立並使用的主要資料表：

- `pets`：寵物資料。
- `profiles`：會員資料與角色。
- `favorites`：會員收藏。
- `adoption_applications`：認養申請紀錄。

也加入 Row Level Security，讓公開資料、會員資料、後台資料有基本權限控管。

### 4. Supabase Auth 會員系統

網站已串接 Supabase Auth，可支援：

- 註冊會員。
- 登入會員。
- 登出會員。
- 依登入狀態讀取收藏與認養申請。
- 依 `profiles.role` 判斷是否為 admin。

重要觀念：

- `profiles` 只是網站會員資料表。
- 真正能不能登入，要看 Supabase `Authentication -> Users`。
- 不建議用 SQL 直接塞 demo Auth users，容易造成 `auth.users` 有資料但 Auth 內部資料不完整，導致登入或刪除失敗。

### 5. 前台與會員功能串接

目前前台已能從 Supabase 讀取公開中的寵物資料。

已完成：

- 只顯示 `status = available` 的寵物。
- 登入後收藏會寫入 Supabase。
- 登入後可送出認養申請。
- 會員頁可看到收藏、認養申請、自己刊登的寵物。

已測試：

- 公開寵物列表可載入。
- 收藏可新增並同步到會員頁。
- 認養申請可送出並同步到後台。

### 6. 後台管理功能

目前後台路徑：

```txt
#admin
```

後台目前需要 admin 權限才可使用。

已完成：

- 寵物管理。
- 新增寵物。
- 編輯寵物。
- 上架 / 下架。
- 標記已送養。
- 圖片網址與圖片上傳欄位。
- 認養申請列表。
- 認養申請狀態更新。
- 會員管理分頁。

認養申請狀態包含：

- `待審核`
- `訪談中`
- `已核准`
- `已完成`
- `已婉拒`

建議流程：

```txt
待審核 -> 訪談中 -> 已核准 -> 已完成
```

若不適合認養，則改為：

```txt
已婉拒
```

### 7. 會員管理功能

後台已新增 `會員管理` 分頁。

目前可查看：

- 會員姓名。
- Email。
- 角色。
- 收藏數。
- 認養申請數。
- 加入日期。

目前可操作：

- 搜尋會員。
- 將會員設為 `一般會員`。
- 將會員設為 `Admin`。

注意：

- 若目前只有一個 admin，不建議把自己改成一般會員，否則可能會失去後台權限。
- 修改會員角色前，Supabase 必須先執行最新版 `supabase/admin-policies.sql`。

### 8. 圖片與 Storage

已規劃 Supabase Storage bucket：

```txt
pet-images
```

圖片大小限制建議：

- 單張上傳控制在 2 MB 以內。
- 網站顯示圖片建議壓縮到 300 KB 到 800 KB。
- 正式上線前可再加入前端壓縮或圖片裁切。

已新增 Storage policy SQL：

```txt
supabase/storage-policies.sql
```

### 9. Demo Seed 資料

已建立 demo seed SQL：

```txt
supabase/demo-seed.sql
```

用途：

- 建立測試寵物。
- 建立收藏資料。
- 建立認養申請資料。
- 建立 profiles 測試資料。

重要警告：

不建議再用這份 SQL 直接建立 Supabase Auth users。之前用 SQL 塞入 demo Auth users 後，出現過：

```txt
Database error querying schema
Failed to delete user: Database error loading user
```

原因是 Supabase Auth 不只依賴 `auth.users`，還有內部身份資料，例如 `auth.identities`。手動 SQL 建立帳號容易資料不完整。

建議做法：

- 真實會員從網站註冊。
- 測試會員從 Supabase Dashboard 的 `Authentication -> Users -> Add user` 建立。
- 開啟 `Auto Confirm User`。

### 10. Vercel 部署

已確認需要在 Vercel 設定環境變數：

```txt
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

設定位置：

```txt
Vercel Project -> Settings -> Environment Variables
```

建議勾選：

- Production
- Preview

Development 若被鎖住可先不用勾。

設定後必須重新部署，線上網站才會吃到新的環境變數。

## 目前已驗證的功能

已手動測試：

- 前台讀取 Supabase 寵物資料。
- 待認養名單顯示 8 筆公開寵物。
- 登入會員後加入收藏。
- 會員頁顯示收藏。
- 送出認養申請。
- 後台看到新申請。
- 後台更新申請狀態。
- 後台會員管理分頁顯示會員資料。
- 會員搜尋功能。
- 後台角色下拉選單顯示正常。

已執行：

```txt
npm.cmd run lint
npm.cmd run build
```

結果：

- TypeScript 檢查通過。
- Vite build 通過。
- 目前只有 chunk size warning，不影響功能。

## 目前已知問題

### 1. Demo Auth users 不完整

症狀：

- demo 帳密複製貼上仍不能登入。
- Supabase 顯示 `Database error querying schema`。
- 刪除 demo users 時顯示 `Database error loading user`。

原因：

- 用 SQL 直接建立 Auth users，導致 Supabase Auth 內部資料不完整。

建議處理：

- 用 SQL 清掉壞掉的 demo Auth users。
- 之後用 Supabase Dashboard 新增測試會員。

### 2. profiles 會員數不等於 Auth users 數

原因：

- `profiles` 是網站用會員資料。
- `auth.users` 是真正登入帳號。

建議：

- 以 Supabase Auth 作為登入帳號來源。
- 註冊後自動建立 profiles。
- 後台只管理 profiles 的角色與網站資料。

### 3. 測試資料與正式資料需分開

目前 demo 資料適合開發測試，但正式上線前應整理：

- 移除不完整 demo Auth users。
- 保留乾淨的 pets demo data。
- 建立正式 admin 帳號。
- 確認 RLS policy。

## 目前檔案整理

重要檔案：

```txt
src/lib/supabase.ts
src/auth/AuthProvider.tsx
src/components/AdminDashboard.tsx
src/components/AuthModal.tsx
src/components/MemberProfile.tsx
src/App.tsx
supabase/schema.sql
supabase/admin-policies.sql
supabase/storage-policies.sql
supabase/demo-seed.sql
.env.example
```

不要提交：

```txt
.env.local
```

原因：

- 裡面包含真實 Supabase URL 與 API key。
- 雖然 publishable key 可放前端，但仍建議透過環境變數管理。

## 建議下一步優化

### 優先級高

1. 清掉壞掉的 demo Auth users。
2. 用 Supabase Dashboard 建立乾淨測試會員。
3. 執行最新版 `supabase/admin-policies.sql`。
4. 測試後台會員角色切換。
5. 把目前新增的會員管理功能 commit 並 push 到 GitHub。
6. 確認 Vercel 環境變數已設定並重新部署。

### 優先級中

1. 後台新增會員詳細頁。
2. 後台加入認養申請篩選與搜尋。
3. 後台加入寵物搜尋與狀態篩選。
4. 圖片上傳加入前端壓縮。
5. 會員頁顯示申請狀態更新時間。
6. 建立正式資料 migration 流程。

### 優先級低

1. 增加 Email 通知。
2. 增加管理員操作紀錄。
3. 增加資料匯出 CSV。
4. 增加寵物圖片多圖管理。
5. 增加寵物送養成功故事頁。

## 上線前檢查清單

- Supabase Auth 可正常註冊與登入。
- 正式 admin 帳號已建立。
- `profiles.role = admin` 已設定。
- RLS policy 已執行。
- Storage bucket 與 policy 已執行。
- Vercel 環境變數已設定。
- Vercel 已重新部署。
- 前台可讀取公開寵物。
- 會員可收藏。
- 會員可送出認養申請。
- 後台可讀取寵物、申請、會員。
- 後台可更新寵物狀態。
- 後台可更新認養申請狀態。
- 後台可更新會員角色。

## 維護原則

- Supabase Auth 帳號用官方流程建立，不直接 SQL 塞入。
- 前端只使用 publishable key，不放 service role key。
- 管理員權限只存在 `profiles.role`。
- RLS policy 必須保護後台資料。
- 測試資料與正式資料分開管理。
- 每次改後台權限後，都要重新測前台、會員、後台三個流程。

