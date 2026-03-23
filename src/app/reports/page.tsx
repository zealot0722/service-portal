// 每日報表檢核頁 — Phase 1：手動上傳檢核 + DB 自動統計
'use client';

import { useState, useMemo } from 'react';
import { useTickets } from '@/data/ticket-store';
import {
  categories,
  categoryIcon,
  channels,
  channelIcon,
  priorities,
} from '@/data/mock-tickets';

interface CheckItem {
  id: string;
  label: string;
  category: '自動統計' | '手動填寫' | '檢核項目';
  checked: boolean;
}

interface ManualField {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  unit: string;
}

export default function ReportsPage() {
  const { tickets } = useTickets();
  const today = '2026-03-23';

  // ========== 自動統計（from DB） ==========
  const autoStats = useMemo(() => {
    const todayTickets = tickets.filter((t) => t.createdAt.startsWith(today));
    const allActive = tickets.filter((t) => t.status !== '已完成');
    const completed = tickets.filter((t) => t.status === '已完成' && t.updatedAt.startsWith(today));
    const urgent = tickets.filter((t) => t.priority === '緊急' && t.status !== '已完成');
    const transferred = tickets.filter((t) => t.transfer?.isTransferred && !t.transfer?.isReturned);
    const returned = tickets.filter((t) => t.transfer?.isReturned);

    // By channel
    const byChannel: Record<string, number> = {};
    channels.forEach((ch) => {
      byChannel[ch] = todayTickets.filter((t) => t.channel === ch).length;
    });

    // By category
    const byCategory: Record<string, number> = {};
    categories.forEach((cat) => {
      byCategory[cat] = todayTickets.filter((t) => t.category === cat).length;
    });

    // By priority
    const byPriority: Record<string, number> = {};
    priorities.forEach((p) => {
      byPriority[p] = todayTickets.filter((t) => t.priority === p).length;
    });

    // Total contact count
    const totalContacts = tickets.reduce((sum, t) => sum + (t.contactCount || 0), 0);

    const resolutionRate = tickets.length > 0
      ? Math.round((completed.length / tickets.length) * 100)
      : 0;

    return {
      todayNew: todayTickets.length,
      todayCompleted: completed.length,
      totalActive: allActive.length,
      urgentOpen: urgent.length,
      transferred: transferred.length,
      returned: returned.length,
      totalContacts,
      resolutionRate,
      byChannel,
      byCategory,
      byPriority,
    };
  }, [tickets]);

  // ========== 手動填寫欄位 ==========
  const [manualFields, setManualFields] = useState<ManualField[]>([
    { id: 'phone_total', label: '電話總接聽量', value: '', placeholder: '從電話系統查詢', unit: '通' },
    { id: 'phone_missed', label: '未接來電', value: '', placeholder: '從電話系統查詢', unit: '通' },
    { id: 'line_messages', label: 'LINE 訊息總量', value: '', placeholder: '從 LINE OA 後台查詢', unit: '則' },
    { id: 'email_received', label: 'Email 收件量', value: '', placeholder: '從信箱查詢', unit: '封' },
    { id: 'complaint_count', label: '客訴案件數', value: '', placeholder: '手動統計', unit: '件' },
    { id: 'refund_amount', label: '退款金額', value: '', placeholder: '從財務系統查詢', unit: '元' },
    { id: 'special_notes', label: '特殊事項備註', value: '', placeholder: '重大事件、系統異常等', unit: '' },
  ]);

  const updateManualField = (id: string, value: string) => {
    setManualFields((prev) => prev.map((f) => f.id === id ? { ...f, value } : f));
  };

  // ========== 檢核清單 ==========
  const [checkItems, setCheckItems] = useState<CheckItem[]>([
    { id: 'c1', label: '今日工單統計已確認（件數、分類正確）', category: '自動統計', checked: false },
    { id: 'c2', label: '緊急案件已全數處理或交接', category: '檢核項目', checked: false },
    { id: 'c3', label: '已轉出工單已追蹤回覆狀態', category: '檢核項目', checked: false },
    { id: 'c4', label: '電話總量已填寫（從電話系統）', category: '手動填寫', checked: false },
    { id: 'c5', label: 'LINE 訊息量已填寫（從 OA 後台）', category: '手動填寫', checked: false },
    { id: 'c6', label: 'Email 收件量已填寫', category: '手動填寫', checked: false },
    { id: 'c7', label: '客訴案件已個別記錄處理結果', category: '檢核項目', checked: false },
    { id: 'c8', label: '退款/折讓金額已核對', category: '手動填寫', checked: false },
    { id: 'c9', label: '特殊事項已備註（無則勾選確認）', category: '檢核項目', checked: false },
    { id: 'c10', label: '報表已送出 / 已匯出', category: '檢核項目', checked: false },
  ]);

  const toggleCheck = (id: string) => {
    setCheckItems((prev) => prev.map((c) => c.id === id ? { ...c, checked: !c.checked } : c));
  };

  const checkedCount = checkItems.filter((c) => c.checked).length;
  const allChecked = checkedCount === checkItems.length;

  // ========== 匯出預覽 ==========
  const [showPreview, setShowPreview] = useState(false);

  const generateReport = () => {
    const lines: string[] = [];
    lines.push(`══════════════════════════════════`);
    lines.push(`  HCT 客服中心 — 每日報表`);
    lines.push(`  日期：${today}`);
    lines.push(`══════════════════════════════════`);
    lines.push('');
    lines.push(`【工單統計】`);
    lines.push(`  今日新建：${autoStats.todayNew} 件`);
    lines.push(`  今日結案：${autoStats.todayCompleted} 件`);
    lines.push(`  待處理中：${autoStats.totalActive} 件`);
    lines.push(`  緊急未結：${autoStats.urgentOpen} 件`);
    lines.push(`  結案率：${autoStats.resolutionRate}%`);
    lines.push('');
    lines.push(`【管道分布】`);
    channels.forEach((ch) => {
      if (autoStats.byChannel[ch] > 0) {
        lines.push(`  ${channelIcon[ch]} ${ch}：${autoStats.byChannel[ch]} 件`);
      }
    });
    lines.push('');
    lines.push(`【分類分布】`);
    categories.forEach((cat) => {
      if (autoStats.byCategory[cat] > 0) {
        lines.push(`  ${categoryIcon[cat]} ${cat}：${autoStats.byCategory[cat]} 件`);
      }
    });
    lines.push('');
    lines.push(`【轉接追蹤】`);
    lines.push(`  已轉出：${autoStats.transferred} 件`);
    lines.push(`  已轉回：${autoStats.returned} 件`);
    lines.push(`  累計聯繫次數：${autoStats.totalContacts} 次`);
    lines.push('');
    lines.push(`【手動填報】`);
    manualFields.forEach((f) => {
      if (f.value || f.id === 'special_notes') {
        lines.push(`  ${f.label}：${f.value || '（未填）'}${f.unit ? ` ${f.unit}` : ''}`);
      }
    });
    lines.push('');
    lines.push(`【檢核狀態】 ${checkedCount}/${checkItems.length}`);
    checkItems.forEach((c) => {
      lines.push(`  ${c.checked ? '✅' : '⬜'} ${c.label}`);
    });
    lines.push('');
    lines.push(`══════════════════════════════════`);
    return lines.join('\n');
  };

  const handleCopyReport = async () => {
    const report = generateReport();
    try {
      await navigator.clipboard.writeText(report);
      alert('報表已複製到剪貼簿！');
    } catch {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = report;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      alert('報表已複製到剪貼簿！');
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* 標題 */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">每日報表</h2>
          <p className="text-sm text-slate-500 mt-1">日期：{today}（自動統計 + 手動填報 + 檢核確認）</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`px-4 py-2 rounded-full text-sm font-semibold ${allChecked ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
            {allChecked ? '✅ 全部完成' : `⏳ ${checkedCount}/${checkItems.length} 已確認`}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左欄：自動統計 + 手動填寫 */}
        <div className="lg:col-span-2 space-y-6">

          {/* 自動統計區 */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-700">📊 自動統計（from 工單 DB）</h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-600 font-medium">自動產生</span>
            </div>

            {/* 主要數字 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">{autoStats.todayNew}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">今日新建</p>
              </div>
              <div className="bg-emerald-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-emerald-600">{autoStats.todayCompleted}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">今日結案</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-red-600">{autoStats.urgentOpen}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">緊急未結</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-slate-700">{autoStats.resolutionRate}%</p>
                <p className="text-[11px] text-slate-500 mt-0.5">結案率</p>
              </div>
            </div>

            {/* 管道 + 分類分布 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">管道分布</p>
                <div className="space-y-1.5">
                  {channels.map((ch) => (
                    <div key={ch} className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">{channelIcon[ch]} {ch}</span>
                      <span className="font-medium text-slate-800">{autoStats.byChannel[ch]}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">分類分布</p>
                <div className="space-y-1.5">
                  {categories.filter((cat) => autoStats.byCategory[cat] > 0).map((cat) => (
                    <div key={cat} className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">{categoryIcon[cat]} {cat}</span>
                      <span className="font-medium text-slate-800">{autoStats.byCategory[cat]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 轉接 */}
            <div className="mt-5 pt-4 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">轉接追蹤</p>
              <div className="flex gap-6 text-sm">
                <span className="text-slate-600">↗️ 已轉出 <strong className="text-slate-800">{autoStats.transferred}</strong></span>
                <span className="text-slate-600">🔄 已轉回 <strong className="text-slate-800">{autoStats.returned}</strong></span>
                <span className="text-slate-600">📞 累計聯繫 <strong className="text-slate-800">{autoStats.totalContacts}</strong> 次</span>
              </div>
            </div>
          </div>

          {/* 手動填寫區 */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-700">✏️ 手動填報（其他來源數據）</h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-600 font-medium">需人工填寫</span>
            </div>
            <div className="space-y-4">
              {manualFields.map((field) => (
                <div key={field.id} className="flex items-center gap-3">
                  <label className="text-sm text-slate-600 w-36 shrink-0">{field.label}</label>
                  <div className="flex-1 flex items-center gap-2">
                    {field.id === 'special_notes' ? (
                      <textarea
                        value={field.value}
                        onChange={(e) => updateManualField(field.id, e.target.value)}
                        placeholder={field.placeholder}
                        rows={2}
                        className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
                      />
                    ) : (
                      <input
                        type="text"
                        value={field.value}
                        onChange={(e) => updateManualField(field.id, e.target.value)}
                        placeholder={field.placeholder}
                        className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    )}
                    {field.unit && <span className="text-xs text-slate-400 w-6">{field.unit}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 報表預覽 */}
          {showPreview && (
            <div className="bg-slate-900 rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-300">📄 報表預覽</h3>
                <button onClick={() => setShowPreview(false)} className="text-xs text-slate-500 hover:text-slate-300">收合</button>
              </div>
              <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap leading-relaxed overflow-auto max-h-[500px]">
                {generateReport()}
              </pre>
            </div>
          )}
        </div>

        {/* 右欄：檢核清單 + 動作 */}
        <div className="space-y-6">
          {/* 檢核清單 */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">☑️ 檢核清單</h3>
            <div className="space-y-2">
              {checkItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-all ${
                    item.checked
                      ? 'bg-emerald-50 border border-emerald-200'
                      : 'bg-slate-50 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-base mt-0.5 shrink-0">
                    {item.checked ? '✅' : '⬜'}
                  </span>
                  <div>
                    <p className={`${item.checked ? 'text-emerald-700 line-through' : 'text-slate-700'}`}>
                      {item.label}
                    </p>
                    <span className={`text-[9px] font-medium ${
                      item.category === '自動統計' ? 'text-emerald-500' :
                      item.category === '手動填寫' ? 'text-amber-500' : 'text-slate-400'
                    }`}>
                      {item.category}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* 進度條 */}
            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                <span>完成進度</span>
                <span>{checkedCount}/{checkItems.length}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${allChecked ? 'bg-emerald-500' : 'bg-blue-500'}`}
                  style={{ width: `${(checkedCount / checkItems.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* 動作按鈕 */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-3">
            <h3 className="text-sm font-semibold text-slate-700 mb-2">📤 報表操作</h3>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="w-full px-4 py-2.5 rounded-lg text-sm font-medium border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
            >
              👁️ {showPreview ? '收合預覽' : '預覽報表'}
            </button>
            <button
              onClick={handleCopyReport}
              className="w-full px-4 py-2.5 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              📋 複製報表（可貼到 LINE / Email）
            </button>
            <button
              disabled={!allChecked}
              className={`w-full px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                allChecked
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              {allChecked ? '✅ 確認送出報表' : `⏳ 尚有 ${checkItems.length - checkedCount} 項未確認`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
