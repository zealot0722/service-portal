// HCT 客服工單 Mock 資料

/** 來源管道 */
export type Channel = 'LINE' | '電話' | '表單' | 'Email' | '內部系統';

/** 優先級 */
export type Priority = '低' | '中' | '高' | '緊急';

/** 工單狀態 */
export type Status = '新建' | '處理中' | '待回覆' | '已完成';

/** 客戶等級 */
export type CustomerLevel = '一般' | '白銀' | '黃金' | 'VIP';

/** 對話訊息 */
export interface Message {
  id: string;
  sender: 'customer' | 'agent';
  senderName: string;
  content: string;
  timestamp: string;
}

/** 工單 */
export interface Ticket {
  id: string;
  channel: Channel;
  priority: Priority;
  status: Status;
  summary: string;
  description: string;
  customerName: string;
  customerContact: string;
  customerLevel: CustomerLevel;
  assignee: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
  internalNotes: string;
}

/** 優先級權重（用於排序） */
export const priorityWeight: Record<Priority, number> = {
  '緊急': 0,
  '高': 1,
  '中': 2,
  '低': 3,
};

/** 客戶等級權重 */
export const customerLevelWeight: Record<CustomerLevel, number> = {
  'VIP': 0,
  '黃金': 1,
  '白銀': 2,
  '一般': 3,
};

/** 來源 icon 對應 */
export const channelIcon: Record<Channel, string> = {
  'LINE': '💬',
  '電話': '📞',
  '表單': '📝',
  'Email': '✉️',
  '內部系統': '🖥️',
};

/** 狀態顏色 */
export const statusColor: Record<Status, string> = {
  '新建': 'bg-sky-100 text-sky-700',
  '處理中': 'bg-amber-100 text-amber-700',
  '待回覆': 'bg-violet-100 text-violet-700',
  '已完成': 'bg-emerald-100 text-emerald-700',
};

/** 優先級顏色（badge） */
export const priorityColor: Record<Priority, string> = {
  '低': 'bg-slate-100 text-slate-600',
  '中': 'bg-blue-500 text-white',
  '高': 'bg-amber-500 text-white',
  '緊急': 'bg-red-500 text-white',
};

/** 優先級左邊線顏色 */
export const priorityBorderColor: Record<Priority, string> = {
  '低': 'border-l-slate-300',
  '中': 'border-l-blue-400',
  '高': 'border-l-amber-400',
  '緊急': 'border-l-red-500',
};

/** 客戶等級顏色 */
export const customerLevelColor: Record<CustomerLevel, string> = {
  '一般': 'text-slate-400',
  '白銀': 'text-slate-500 font-medium',
  '黃金': 'text-amber-600 font-semibold',
  'VIP': 'text-purple-600 font-bold',
};

/** 客戶等級 badge */
export const customerLevelBadge: Record<CustomerLevel, string> = {
  '一般': '',
  '白銀': 'bg-slate-100 text-slate-600 border border-slate-300',
  '黃金': 'bg-amber-50 text-amber-700 border border-amber-300',
  'VIP': 'bg-purple-50 text-purple-700 border border-purple-300',
};

// ===== Mock 工單資料 =====
export const mockTickets: Ticket[] = [
  {
    id: 'T-20260323-001',
    channel: 'LINE',
    priority: '緊急',
    status: '新建',
    summary: '無法登入系統，急需處理',
    description: '客戶反映從今早 8 點開始完全無法登入後台管理系統，嘗試重設密碼後仍然失敗。客戶表示今天有重要訂單需要處理，情況緊急。',
    customerName: '王大明',
    customerContact: 'LINE: wang_daming',
    customerLevel: 'VIP',
    assignee: '李小華',
    createdAt: '2026-03-23T08:15:00',
    updatedAt: '2026-03-23T08:15:00',
    messages: [
      { id: 'm1', sender: 'customer', senderName: '王大明', content: '你好，我從早上開始就完全無法登入系統了，一直顯示帳號密碼錯誤', timestamp: '2026-03-23T08:15:00' },
      { id: 'm2', sender: 'agent', senderName: '李小華', content: '王先生您好，我立即為您查看。請問您是使用哪個帳號登入的呢？', timestamp: '2026-03-23T08:17:00' },
      { id: 'm3', sender: 'customer', senderName: '王大明', content: '帳號是 wangdm@hct.com，我已經試過重設密碼了還是不行，今天有很急的訂單要處理！', timestamp: '2026-03-23T08:18:00' },
      { id: 'm4', sender: 'agent', senderName: '李小華', content: '收到，我已經將此問題提升為緊急等級，正在聯繫技術團隊協助處理，請您稍等。', timestamp: '2026-03-23T08:20:00' },
    ],
    internalNotes: '已確認是 SSO 系統異常導致，已通知 IT 部門。',
  },
  {
    id: 'T-20260323-002',
    channel: '電話',
    priority: '高',
    status: '處理中',
    summary: '貨物配送延遲三天未到',
    description: '客戶於 3/20 下單的貨物至今未送達，物流系統顯示「配送中」但已超過預計到貨時間 3 天。客戶要求立即查明原因並賠償。',
    customerName: '陳美玲',
    customerContact: '0912-345-678',
    customerLevel: '黃金',
    assignee: '張志偉',
    createdAt: '2026-03-23T09:30:00',
    updatedAt: '2026-03-23T10:00:00',
    messages: [
      { id: 'm5', sender: 'customer', senderName: '陳美玲', content: '我的訂單 ORD-20260320-088 已經延遲三天了，到底什麼時候能收到？', timestamp: '2026-03-23T09:30:00' },
      { id: 'm6', sender: 'agent', senderName: '張志偉', content: '陳小姐您好，非常抱歉造成您的不便。我立即為您查詢物流狀態。', timestamp: '2026-03-23T09:32:00' },
      { id: 'm7', sender: 'agent', senderName: '張志偉', content: '經查詢，您的包裹目前在桃園轉運中心，因近日大雨導致部分路線延誤。預計明天上午送達，我們會安排優先配送。', timestamp: '2026-03-23T09:45:00' },
    ],
    internalNotes: '已聯繫物流部門確認，桃園倉庫因天氣因素積壓。需跟進賠償事宜。',
  },
  {
    id: 'T-20260323-003',
    channel: 'Email',
    priority: '中',
    status: '待回覆',
    summary: '詢問企業方案價格與合約內容',
    description: '潛在企業客戶來信詢問年度企業方案的價格、合約條款以及客製化服務的可能性。需要業務部門提供報價。',
    customerName: '林建宏',
    customerContact: 'jhlin@techcorp.com.tw',
    customerLevel: '一般',
    assignee: '王雅琪',
    createdAt: '2026-03-22T14:20:00',
    updatedAt: '2026-03-23T09:00:00',
    messages: [
      { id: 'm8', sender: 'customer', senderName: '林建宏', content: '您好，我是 TechCorp 的採購經理，想了解貴公司的企業年度方案，我們約有 200 位使用者。能否提供詳細報價？', timestamp: '2026-03-22T14:20:00' },
      { id: 'm9', sender: 'agent', senderName: '王雅琪', content: '林經理您好！感謝您的來信。我已將您的需求轉給業務團隊，將在 1-2 個工作天內提供詳細報價方案。', timestamp: '2026-03-22T15:00:00' },
    ],
    internalNotes: '已轉給業務部 Kevin 處理，等待報價回覆。',
  },
  {
    id: 'T-20260323-004',
    channel: '表單',
    priority: '低',
    status: '已完成',
    summary: '如何匯出月報表為 PDF',
    description: '客戶不清楚如何在系統中將月報表匯出為 PDF 格式，需要操作指引。',
    customerName: '黃小芬',
    customerContact: 'huang.sf@gmail.com',
    customerLevel: '白銀',
    assignee: '李小華',
    createdAt: '2026-03-22T11:00:00',
    updatedAt: '2026-03-22T11:30:00',
    messages: [
      { id: 'm10', sender: 'customer', senderName: '黃小芬', content: '請問月報表要怎麼匯出成 PDF？我在系統裡找不到這個功能。', timestamp: '2026-03-22T11:00:00' },
      { id: 'm11', sender: 'agent', senderName: '李小華', content: '黃小姐您好！匯出步驟如下：\n1. 進入「報表中心」\n2. 選擇要匯出的月份\n3. 點擊右上角「匯出」按鈕\n4. 選擇 PDF 格式\n即可下載。', timestamp: '2026-03-22T11:15:00' },
      { id: 'm12', sender: 'customer', senderName: '黃小芬', content: '找到了！謝謝你的幫忙！', timestamp: '2026-03-22T11:25:00' },
    ],
    internalNotes: '',
  },
  {
    id: 'T-20260323-005',
    channel: '內部系統',
    priority: '高',
    status: '處理中',
    summary: '批次匯入功能出現錯誤代碼 500',
    description: '內部人員回報批次匯入功能在匯入超過 1000 筆資料時會出現 500 錯誤。小量資料正常，大量資料必定失敗。',
    customerName: '內部—業務部',
    customerContact: '分機 2301',
    customerLevel: '一般',
    assignee: '張志偉',
    createdAt: '2026-03-23T07:45:00',
    updatedAt: '2026-03-23T08:30:00',
    messages: [
      { id: 'm13', sender: 'customer', senderName: '業務部 趙經理', content: '批次匯入超過 1000 筆就會報錯，錯誤代碼 500。100 筆以下沒問題。', timestamp: '2026-03-23T07:45:00' },
      { id: 'm14', sender: 'agent', senderName: '張志偉', content: '收到，已經開始排查。初步判斷可能是伺服器端的記憶體限制問題。', timestamp: '2026-03-23T08:00:00' },
      { id: 'm15', sender: 'agent', senderName: '張志偉', content: '已確認是 nginx 的 request body size 限制，正在調整設定。', timestamp: '2026-03-23T08:25:00' },
    ],
    internalNotes: '根本原因：nginx client_max_body_size 設定為 10MB，大檔案超過限制。已提交修改 PR。',
  },
  {
    id: 'T-20260323-006',
    channel: 'LINE',
    priority: '中',
    status: '新建',
    summary: '帳單金額與實際使用量不符',
    description: '客戶反映本月帳單金額明顯高於預期，懷疑計費有誤。需要核對使用量明細。',
    customerName: '劉家豪',
    customerContact: 'LINE: liujh_88',
    customerLevel: '一般',
    assignee: '',
    createdAt: '2026-03-23T10:05:00',
    updatedAt: '2026-03-23T10:05:00',
    messages: [
      { id: 'm16', sender: 'customer', senderName: '劉家豪', content: '你好，我這個月帳單怎麼多了將近 5000 元？我使用量跟上個月差不多啊', timestamp: '2026-03-23T10:05:00' },
      { id: 'm17', sender: 'customer', senderName: '劉家豪', content: '可以幫我查一下明細嗎？', timestamp: '2026-03-23T10:06:00' },
    ],
    internalNotes: '',
  },
  {
    id: 'T-20260323-007',
    channel: '電話',
    priority: '緊急',
    status: '處理中',
    summary: '系統全面當機，所有使用者無法存取',
    description: '多位客戶同時來電反映系統完全無法存取，顯示 503 Service Unavailable。影響範圍極大，需要立即處理。',
    customerName: '多位客戶',
    customerContact: '客服專線',
    customerLevel: '一般',
    assignee: '李小華',
    createdAt: '2026-03-23T07:00:00',
    updatedAt: '2026-03-23T07:30:00',
    messages: [
      { id: 'm18', sender: 'customer', senderName: '客戶 A', content: '系統完全進不去！顯示 503 錯誤！', timestamp: '2026-03-23T07:00:00' },
      { id: 'm19', sender: 'customer', senderName: '客戶 B', content: '我這邊也是一樣的狀況，完全無法使用。', timestamp: '2026-03-23T07:05:00' },
      { id: 'm20', sender: 'agent', senderName: '李小華', content: '各位客戶您好，我們已經收到大量回報，技術團隊正在全力搶修中。預計 30 分鐘內恢復服務。', timestamp: '2026-03-23T07:10:00' },
      { id: 'm21', sender: 'agent', senderName: '李小華', content: '更新：已定位問題為資料庫連線池耗盡，正在重啟服務。', timestamp: '2026-03-23T07:25:00' },
    ],
    internalNotes: 'P0 事件。根因：資料庫連線池滿載。已重啟並擴容。需寫事後報告。',
  },
  {
    id: 'T-20260323-008',
    channel: '表單',
    priority: '低',
    status: '已完成',
    summary: '希望新增深色模式功能',
    description: '客戶建議系統加入深色模式，方便晚間使用。此為功能建議，非問題回報。',
    customerName: '周志遠',
    customerContact: 'chou.zy@outlook.com',
    customerLevel: '白銀',
    assignee: '王雅琪',
    createdAt: '2026-03-21T16:00:00',
    updatedAt: '2026-03-22T10:00:00',
    messages: [
      { id: 'm22', sender: 'customer', senderName: '周志遠', content: '建議系統可以加入深色模式，晚上使用比較不傷眼。', timestamp: '2026-03-21T16:00:00' },
      { id: 'm23', sender: 'agent', senderName: '王雅琪', content: '感謝您的寶貴建議！我們已經將深色模式列入下季度的開發計畫中。屆時會優先通知您。', timestamp: '2026-03-22T10:00:00' },
    ],
    internalNotes: '已加入 Q3 roadmap，JIRA ticket: FEAT-2891',
  },
  {
    id: 'T-20260323-009',
    channel: 'Email',
    priority: '高',
    status: '待回覆',
    summary: 'API 金鑰遭盜用，請求停用與重新核發',
    description: '客戶發現其 API 金鑰有異常呼叫紀錄，懷疑遭到盜用。要求立即停用現有金鑰並重新核發。',
    customerName: '蔡宗翰',
    customerContact: 'tsai.th@securetech.io',
    customerLevel: 'VIP',
    assignee: '張志偉',
    createdAt: '2026-03-23T06:30:00',
    updatedAt: '2026-03-23T07:00:00',
    messages: [
      { id: 'm24', sender: 'customer', senderName: '蔡宗翰', content: '我剛才檢查 API 使用紀錄，發現有大量來自未知 IP 的呼叫。請立即停用我的 API 金鑰！', timestamp: '2026-03-23T06:30:00' },
      { id: 'm25', sender: 'agent', senderName: '張志偉', content: '蔡先生您好，已收到您的緊急請求。我們已立即停用您的現有金鑰。請問需要立即核發新金鑰嗎？', timestamp: '2026-03-23T06:40:00' },
      { id: 'm26', sender: 'customer', senderName: '蔡宗翰', content: '是的，請盡快核發。另外可以提供異常呼叫的詳細紀錄嗎？我需要做安全評估。', timestamp: '2026-03-23T06:45:00' },
    ],
    internalNotes: '安全事件。已停用舊金鑰 AK-****-7829。等待資安團隊提供異常呼叫紀錄後回覆客戶。',
  },
  {
    id: 'T-20260323-010',
    channel: '電話',
    priority: '中',
    status: '新建',
    summary: '申請退貨退款，商品有瑕疵',
    description: '客戶收到商品後發現有外觀瑕疵（刮痕），要求退貨退款。訂單編號 ORD-20260319-155。',
    customerName: '吳佳蓉',
    customerContact: '0933-456-789',
    customerLevel: '黃金',
    assignee: '',
    createdAt: '2026-03-23T10:30:00',
    updatedAt: '2026-03-23T10:30:00',
    messages: [
      { id: 'm27', sender: 'customer', senderName: '吳佳蓉', content: '我收到的商品有很明顯的刮痕，訂單編號是 ORD-20260319-155，我要退貨退款。', timestamp: '2026-03-23T10:30:00' },
      { id: 'm28', sender: 'customer', senderName: '吳佳蓉', content: '我已經拍照存證了，需要的話可以提供照片。', timestamp: '2026-03-23T10:31:00' },
    ],
    internalNotes: '',
  },
];

/** 客服人員列表 */
export const agents = ['李小華', '張志偉', '王雅琪', '陳怡君'];

/** 所有來源管道 */
export const channels: Channel[] = ['LINE', '電話', '表單', 'Email', '內部系統'];

/** 所有優先級 */
export const priorities: Priority[] = ['低', '中', '高', '緊急'];

/** 所有狀態 */
export const statuses: Status[] = ['新建', '處理中', '待回覆', '已完成'];

/** 狀態流轉順序 */
export const statusFlow: Status[] = ['新建', '處理中', '待回覆', '已完成'];
