# SIGNWELL AI CLASS

**Learn. Build. Prove.**

SIGNWELL AI Education Group 的第一階段公開概念網站。以 AI 教育、實作型評量、學習追蹤為核心，設計可擴展至多學院、企業培訓與技能認證的平台。

## 查看網站

- GitHub: https://github.com/easylearnfromtw/Aiclass
- GitHub Pages 啟用後：https://easylearnfromtw.github.io/Aiclass/

### 啟用 GitHub Pages

在儲存庫選擇 **Settings → Pages → Build and deployment → Deploy from a branch**，選擇 **main** 與 **/(root)**，然後按 **Save**。當 GitHub 頁面顯示成功部署後，使用上方 Pages 網址。此步驟需由儲存庫管理員在 GitHub 設定中完成。

## 已製作的 V1 互動模組

| 模組 | 狀態 |
| --- | --- |
| 響應式首頁與品牌視覺 | 已實作 |
| 6 門課程的探索、分類、章節瀏覽 | 已實作 |
| 課程加入與章節完成度 | 本機保存 |
| AI Literacy 隨機抽題快速測驗 | 5 題、本機計分與回顧 |
| 3 種 AI 實作挑戰 | 任務規準與本機文字草稿 |
| 學習儀表板與成長歷程 | 本機計算；無歷史時示範圖表 |
| 導師輔導需求 | 本機表單原型 |
| 學員心得分享 | 本機展示，不是公開社群 |
| 證書預覽與示範編號 | 非有效證照 |
| 創作者推廣與推薦碼展示 | URL 範例、假資料儀表板 |
| 集團營運功能總覽 | UI 預覽，非正式後台 |

## 重要限制

本版是 **純前端 proof of concept**，使用瀏覽器 localStorage 保存體驗記錄。清除瀏覽器資料、更換瀏覽器或裝置後，資料無法同步。

**未實作**：正式帳號登入、跨裝置同步、課程影片服務、可證明身份的正式考試、評分審核與申訴、有效的證書核發／撤銷／查驗、社群資料庫、真正的預約媒合、金流、電子發票、訂閱、推薦歸因或佣金發放。

網站所有成績、教材、樣板證書及後台數字均不代表真實營運成果。**請勿輸入個資或敏感業務資料**。

## 結構

- index.html — HTML 骨架與 SEO 資訊
- styles.css — 完整響應式設計系統
- app.js — 前端路由、課程、測驗及本機示範功能
- favicon.svg — 品牌圖示
- .github/workflows/check.yml — JavaScript 語法與網站檔案檢查

此版為無建置需求的靜態網站，直接開啟 index.html 或使用 GitHub Pages 部署；內部使用 hash-based routing，因此支援在 GitHub Pages 專案子路徑下瀏覽。

## 下一階段建議

1. 正式規格與角色權限模型（學員、講師、導師、審查員、營運管理者、合作推廣者）。
2. 建置身份驗證、後端 API、PostgreSQL 資料庫、資料隔離與日誌。
3. 正式影音課程、作業批改、實作題目的檔案繳交與審核工作流程。
4. 逐步整合訂單、台灣金流、退款、電子發票、推薦分潤。
5. 以信效度、評分準則、監考與身份驗證為優先，獨立打造正式 AI Skills Benchmark。

© 2026 SIGNWELL. Concept prototype.
