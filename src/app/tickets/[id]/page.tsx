// 工單詳情頁 — 客戶資訊 + 對話時間軸 + 狀態管理 + 回覆草稿
'use client';

import { useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTickets } from '@/data/ticket-store';
import {
  channelIcon,
  statusColor,
  priorityColor,
  customerLevelColor,
  statusFlow,
  agents,
  priorities,
  Priority,
  Status,
} from '@/data/mock-tickets';

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { tickets, updateTicket } = useTickets();
  const ticketId = decodeURIComponent(params.id as string);
  const ticket = tickets.find((t) => t.id === ticketId);

  // 回覆草稿
  const [draft, setDraft] = useState('');
  // 內部備註
  const [note, setNote] = useState(ticket?.internalNotes || '');
  // 複製成功提示
  const [copied, setCopied] = useState(false);

  // 複製到剪貼簿
  const handleCopy = useCallback(async () => {
    if (!draft) return;
    try {
      await navigator.clipboard.writeText(draft);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const textarea = document.createElement('textarea');
      textarea.value = draft;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [draft]);

  // 更新狀態
  const handleStatusChange = (newStatus: Status) => {
    if (!ticket) return;
    updateTicket(ticket.id, {
      status: newStatus,
      updatedAt: new Date().toISOString(),
    });
  };

  // 更新優先級
  const handlePriorityChange = (newPriority: Priority) => {
    if (!ticket) return;
    updateTicket(ticket.id, { priority: newPriority });
  };

  // 指派負責人
  const handleAssigneeChange = (assignee: string) => {
    if (!ticket) return;
    updateTicket(ticket.id, { assignee });
  };

  // 儲存備註
  const handleSaveNote = () => {
    if (!ticket) return;
    updateTicket(ticket.id, { internalNotes: note });
  };

  // 格式化時間
  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  if (!ticket) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center py-20">
          <p className="text-slate-400 text-lg mb-4">找不到此工單</p>
          <Link href="/" className="text-blue-600 hover:underline text-sm">
            返回工單列表
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* 返回按鈕 + 標題列 */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.push('/')}
          className="text-slate-400 hover:text-slate-600 transition-colors"
        >
          ← 返回
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-2xl">{channelIcon[ticket.channel]}</span>
            <h2 className="text-xl font-bold text-slate-800">{ticket.summary}</h2>
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${priorityColor[ticket.priority]}`}>
              {ticket.priority}
            </span>
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColor[ticket.status]}`}>
              {ticket.status}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">{ticket.id}</p>
        </div>
      </div>

      {/* 主體：左右兩欄 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左欄：客戶資訊 + 問題描述 + 對話時間軸 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 客戶資訊 */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">客戶資訊</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-slate-400">客戶名稱</span>
                <p className="text-slate-800 font-medium">{ticket.customerName}</p>
              </div>
              <div>
                <span className="text-slate-400">聯絡方式</span>
                <p className="text-slate-800">{ticket.customerContact}</p>
              </div>
              <div>
                <span className="text-slate-400">客戶等級</span>
                <p className={customerLevelColor[ticket.customerLevel]}>
                  {ticket.customerLevel}
                </p>
              </div>
              <div>
                <span className="text-slate-400">來源管道</span>
                <p className="text-slate-800">
                  {channelIcon[ticket.channel]} {ticket.channel}
                </p>
              </div>
            </div>
          </div>

          {/* 完整問題描述 */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">問題描述</h3>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
              {ticket.description}
            </p>
          </div>

          {/* 對話時間軸 */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">對話記錄</h3>
            <div className="space-y-4">
              {ticket.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      msg.sender === 'agent'
                        ? 'bg-blue-50 border border-blue-200'
                        : 'bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-slate-600">
                        {msg.senderName}
                      </span>
                      <span className="text-xs text-slate-400">
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 回覆草稿區 */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">回覆草稿</h3>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="在此撰寫回覆草稿..."
              className="w-full border border-slate-300 rounded-md p-3 text-sm min-h-[120px] resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={handleCopy}
                disabled={!draft}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  draft
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {copied ? '已複製！' : '複製到剪貼簿'}
              </button>
            </div>
          </div>

          {/* 內部備註區 */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">內部備註</h3>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="僅供內部人員查看的備註..."
              className="w-full border border-slate-300 rounded-md p-3 text-sm min-h-[80px] resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={handleSaveNote}
                className="px-4 py-2 rounded-md text-sm font-medium bg-slate-700 text-white hover:bg-slate-800 transition-colors"
              >
                儲存備註
              </button>
            </div>
          </div>
        </div>

        {/* 右欄：操作面板 */}
        <div className="space-y-6">
          {/* 狀態更新 */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">狀態更新</h3>
            <div className="grid grid-cols-2 gap-2">
              {statusFlow.map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  className={`px-3 py-2 rounded-md text-xs font-medium border transition-all ${
                    ticket.status === s
                      ? `${statusColor[s]} border-current ring-2 ring-offset-1 ring-blue-400`
                      : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* 優先級調整 */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">優先級</h3>
            <select
              value={ticket.priority}
              onChange={(e) => handlePriorityChange(e.target.value as Priority)}
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {priorities.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* 負責人指派 */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">負責人</h3>
            <select
              value={ticket.assignee}
              onChange={(e) => handleAssigneeChange(e.target.value)}
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">未指派</option>
              {agents.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          {/* 工單資訊 */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">工單資訊</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">建立時間</span>
                <span className="text-slate-700">{formatTime(ticket.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">更新時間</span>
                <span className="text-slate-700">{formatTime(ticket.updatedAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">負責人</span>
                <span className="text-slate-700">{ticket.assignee || '未指派'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
