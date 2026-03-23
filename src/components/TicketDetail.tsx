// 工單詳情 Client Component — 含案件歷程、轉接、聯繫次數
'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTickets } from '@/data/ticket-store';
import {
  channelIcon,
  statusColor,
  priorityColor,
  categoryIcon,
  categoryColor,
  customerLevelColor,
  customerLevelBadge,
  statusFlow,
  agents,
  priorities,
  transferTargets,
  historyIcon,
  Priority,
  Status,
  TransferTarget,
  HistoryEntry,
} from '@/data/mock-tickets';

export default function TicketDetail({ ticketId }: { ticketId: string }) {
  const router = useRouter();
  const { tickets, updateTicket } = useTickets();
  const ticket = tickets.find((t) => t.id === ticketId);

  const [draft, setDraft] = useState('');
  const [note, setNote] = useState(ticket?.internalNotes || '');
  const [copied, setCopied] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);

  const handleCopy = useCallback(async () => {
    if (!draft) return;
    try {
      await navigator.clipboard.writeText(draft);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = draft;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [draft]);

  const handleStatusChange = (newStatus: Status) => {
    if (!ticket) return;
    const newHistory: HistoryEntry = {
      id: `h-${Date.now()}`,
      action: newStatus === '已完成' ? '結案' : '狀態變更',
      actor: ticket.assignee || '客服人員',
      detail: `狀態從「${ticket.status}」更新為「${newStatus}」`,
      timestamp: new Date().toISOString(),
    };
    updateTicket(ticket.id, {
      status: newStatus,
      updatedAt: new Date().toISOString(),
      history: [...(ticket.history || []), newHistory],
    });
  };

  const handlePriorityChange = (newPriority: Priority) => {
    if (!ticket) return;
    const newHistory: HistoryEntry = {
      id: `h-${Date.now()}`,
      action: '優先級變更',
      actor: ticket.assignee || '客服人員',
      detail: `優先級從「${ticket.priority}」調整為「${newPriority}」`,
      timestamp: new Date().toISOString(),
    };
    updateTicket(ticket.id, {
      priority: newPriority,
      history: [...(ticket.history || []), newHistory],
    });
  };

  const handleAssigneeChange = (assignee: string) => {
    if (!ticket) return;
    const newHistory: HistoryEntry = {
      id: `h-${Date.now()}`,
      action: '指派',
      actor: ticket.assignee || '系統',
      detail: `指派給 ${assignee}`,
      timestamp: new Date().toISOString(),
    };
    updateTicket(ticket.id, {
      assignee,
      history: [...(ticket.history || []), newHistory],
    });
  };

  const handleTransfer = (target: TransferTarget) => {
    if (!ticket) return;
    if (target === '結案') {
      handleStatusChange('已完成');
      setShowTransfer(false);
      return;
    }
    const newHistory: HistoryEntry = {
      id: `h-${Date.now()}`,
      action: '轉接',
      actor: ticket.assignee || '客服人員',
      detail: `轉接至 ${target}`,
      timestamp: new Date().toISOString(),
    };
    updateTicket(ticket.id, {
      history: [...(ticket.history || []), newHistory],
    });
    setShowTransfer(false);
  };

  const handleSaveNote = () => {
    if (!ticket) return;
    const newHistory: HistoryEntry = {
      id: `h-${Date.now()}`,
      action: '備註',
      actor: ticket.assignee || '客服人員',
      detail: '新增內部備註',
      timestamp: new Date().toISOString(),
    };
    updateTicket(ticket.id, {
      internalNotes: note,
      history: [...(ticket.history || []), newHistory],
    });
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  if (!ticket) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="text-center py-20">
          <p className="text-slate-400 text-lg mb-4">找不到此工單</p>
          <Link href="/" className="text-blue-600 hover:underline text-sm">返回工單列表</Link>
        </div>
      </div>
    );
  }

  const history = ticket.history || [];
  const contactCount = ticket.contactCount || 0;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* 頂部導航 + 標題 */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.push('/')} className="text-slate-400 hover:text-slate-600 transition-colors text-sm">← 返回列表</button>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-2xl">{channelIcon[ticket.channel]}</span>
            <h2 className="text-xl font-bold text-slate-900">{ticket.summary}</h2>
            <span className={`text-[11px] px-2.5 py-1 rounded-full font-semibold ${priorityColor[ticket.priority]}`}>{ticket.priority}</span>
            <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${statusColor[ticket.status]}`}>{ticket.status}</span>
            {ticket.customerLevel !== '一般' && (
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${customerLevelBadge[ticket.customerLevel]}`}>
                {ticket.customerLevel === 'VIP' ? '👑 VIP' : ticket.customerLevel}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
            <span className="text-xs font-mono text-slate-400">{ticket.id}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${categoryColor[ticket.category]}`}>
              {categoryIcon[ticket.category]} {ticket.category}
            </span>
            {ticket.transfer?.isTransferred && (
              <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${ticket.transfer.isReturned ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                {ticket.transfer.isReturned ? `🔄 已從 ${ticket.transfer.returnedFrom} 轉回` : `↗️ 已轉出至 ${ticket.transfer.transferTo}`}
              </span>
            )}
            <span className="text-xs text-slate-400">|</span>
            <span className="text-xs text-slate-500">📞 聯繫 <strong className="text-slate-700">{contactCount}</strong> 次</span>
            <span className="text-xs text-slate-400">|</span>
            <span className="text-xs text-slate-500">📋 歷程 <strong className="text-slate-700">{history.length}</strong> 筆</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左欄 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 客戶資訊 */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">客戶資訊</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-xs text-slate-400 mb-0.5">客戶名稱</p><p className="text-slate-800 font-medium">{ticket.customerName}</p></div>
              <div><p className="text-xs text-slate-400 mb-0.5">聯絡方式</p><p className="text-slate-800">{ticket.customerContact}</p></div>
              <div><p className="text-xs text-slate-400 mb-0.5">客戶等級</p><p className={customerLevelColor[ticket.customerLevel]}>{ticket.customerLevel}</p></div>
              <div><p className="text-xs text-slate-400 mb-0.5">來源管道</p><p className="text-slate-800">{channelIcon[ticket.channel]} {ticket.channel}</p></div>
            </div>
          </div>

          {/* 問題描述 */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">問題描述</h3>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{ticket.description}</p>
          </div>

          {/* 對話記錄 */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">對話記錄</h3>
            <div className="space-y-4">
              {ticket.messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-xl p-4 ${msg.sender === 'agent' ? 'bg-blue-50 border border-blue-200' : 'bg-slate-50 border border-slate-200'}`}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-semibold text-slate-600">{msg.senderName}</span>
                      <span className="text-[10px] text-slate-400">{formatTime(msg.timestamp)}</span>
                    </div>
                    <p className="text-sm text-slate-700 whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 案件歷程 */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">📋 案件歷程</h3>
            {history.length === 0 ? (
              <p className="text-sm text-slate-400">尚無歷程記錄</p>
            ) : (
              <div className="relative">
                {/* 時間線 */}
                <div className="absolute left-[15px] top-2 bottom-2 w-[2px] bg-slate-200"></div>
                <div className="space-y-0">
                  {history.map((entry) => (
                    <div key={entry.id} className="flex gap-4 relative py-3">
                      {/* 節點圓點 */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 z-10 ${
                        entry.action === '結案' ? 'bg-emerald-100' :
                        entry.action === '轉接' ? 'bg-amber-100' :
                        entry.action === '聯繫客戶' ? 'bg-blue-100' :
                        'bg-slate-100'
                      }`}>
                        {historyIcon[entry.action]}
                      </div>
                      {/* 內容 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-semibold text-slate-700">{entry.action}</span>
                          <span className="text-[10px] text-slate-400">·</span>
                          <span className="text-[10px] text-slate-500">{entry.actor}</span>
                          <span className="text-[10px] text-slate-400 ml-auto">{formatTime(entry.timestamp)}</span>
                        </div>
                        <p className="text-sm text-slate-600 mt-0.5">{entry.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 回覆草稿 */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">回覆草稿</h3>
            <textarea value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="在此撰寫回覆草稿..."
              className="w-full border border-slate-200 rounded-lg p-4 text-sm min-h-[120px] resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            <div className="flex justify-end mt-3">
              <button onClick={handleCopy} disabled={!draft}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${draft ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}>
                {copied ? '✅ 已複製！' : '📋 複製到剪貼簿'}
              </button>
            </div>
          </div>

          {/* 內部備註 */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">內部備註</h3>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="僅供內部人員查看的備註..."
              className="w-full border border-slate-200 rounded-lg p-4 text-sm min-h-[80px] resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            <div className="flex justify-end mt-3">
              <button onClick={handleSaveNote}
                className="px-5 py-2 rounded-lg text-sm font-medium bg-slate-700 text-white hover:bg-slate-800 transition-colors">
                💾 儲存備註
              </button>
            </div>
          </div>
        </div>

        {/* 右欄 */}
        <div className="space-y-6">
          {/* 聯繫統計 */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">📊 聯繫統計</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-blue-600">{contactCount}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">聯繫次數</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-slate-700">{history.length}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">歷程事件</p>
              </div>
            </div>
          </div>

          {/* 狀態更新 */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">狀態更新</h3>
            <div className="grid grid-cols-2 gap-2">
              {statusFlow.map((s) => (
                <button key={s} onClick={() => handleStatusChange(s)}
                  className={`px-3 py-2.5 rounded-lg text-xs font-medium border transition-all ${
                    ticket.status === s
                      ? `${statusColor[s]} border-current ring-2 ring-offset-1 ring-blue-400`
                      : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}>{s}</button>
              ))}
            </div>
          </div>

          {/* 轉接 / 結案 */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">↗️ 轉接 / 結案</h3>
            {!showTransfer ? (
              <button onClick={() => setShowTransfer(true)}
                className="w-full px-3 py-2.5 rounded-lg text-sm font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
                選擇轉接目標...
              </button>
            ) : (
              <div className="space-y-2">
                {transferTargets.map((target) => (
                  <button key={target} onClick={() => handleTransfer(target)}
                    className={`w-full px-3 py-2.5 rounded-lg text-xs font-medium border transition-all text-left ${
                      target === '結案'
                        ? 'border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}>
                    {target === '結案' ? '✅ ' : '↗️ '}{target}
                  </button>
                ))}
                <button onClick={() => setShowTransfer(false)}
                  className="w-full px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-slate-600 transition-colors">
                  取消
                </button>
              </div>
            )}
          </div>

          {/* 優先級 */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">優先級</h3>
            <select value={ticket.priority} onChange={(e) => handlePriorityChange(e.target.value as Priority)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              {priorities.map((p) => (<option key={p} value={p}>{p}</option>))}
            </select>
          </div>

          {/* 負責人 */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">負責人</h3>
            <select value={ticket.assignee} onChange={(e) => handleAssigneeChange(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">未指派</option>
              {agents.map((a) => (<option key={a} value={a}>{a}</option>))}
            </select>
          </div>

          {/* 工單資訊 */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">工單資訊</h3>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between"><span className="text-slate-400">建立時間</span><span className="text-slate-700">{formatTime(ticket.createdAt)}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">更新時間</span><span className="text-slate-700">{formatTime(ticket.updatedAt)}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">負責人</span><span className="text-slate-700">{ticket.assignee || '未指派'}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">聯繫次數</span><span className="text-slate-700 font-medium">{contactCount} 次</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
