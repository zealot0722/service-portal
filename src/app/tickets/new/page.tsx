// 新建工單頁 — 表單輸入並加入 mock 列表
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTickets } from '@/data/ticket-store';
import {
  Channel,
  Priority,
  Ticket,
  channels,
  priorities,
  channelIcon,
} from '@/data/mock-tickets';

export default function NewTicketPage() {
  const router = useRouter();
  const { tickets, addTicket } = useTickets();

  // 表單狀態
  const [channel, setChannel] = useState<Channel>('LINE');
  const [customerName, setCustomerName] = useState('');
  const [customerContact, setCustomerContact] = useState('');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('中');
  const [submitted, setSubmitted] = useState(false);

  // 產生工單編號
  const generateId = () => {
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const count = tickets.length + 1;
    return `T-${today}-${count.toString().padStart(3, '0')}`;
  };

  // 提交表單
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !summary) return;

    const now = new Date().toISOString();
    const newTicket: Ticket = {
      id: generateId(),
      channel,
      priority,
      status: '新建',
      summary,
      description: description || summary,
      customerName,
      customerContact,
      customerLevel: '一般',
      assignee: '',
      createdAt: now,
      updatedAt: now,
      messages: [
        {
          id: `m-new-${Date.now()}`,
          sender: 'customer',
          senderName: customerName,
          content: description || summary,
          timestamp: now,
        },
      ],
      internalNotes: '',
    };

    addTicket(newTicket);
    setSubmitted(true);

    // 1.5 秒後跳轉首頁
    setTimeout(() => router.push('/'), 1500);
  };

  if (submitted) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-green-200 p-10 text-center">
          <div className="text-4xl mb-4">✅</div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">工單已建立</h2>
          <p className="text-sm text-slate-500">正在返回工單列表...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">新建工單</h2>
        <p className="text-sm text-slate-500 mt-1">建立新的客服工單並分派處理</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-7 space-y-6">
          {/* 來源管道 */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              來源管道 <span className="text-red-500">*</span>
            </label>
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value as Channel)}
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {channels.map((ch) => (
                <option key={ch} value={ch}>
                  {channelIcon[ch]} {ch}
                </option>
              ))}
            </select>
          </div>

          {/* 客戶名稱 */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              客戶名稱 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="請輸入客戶名稱"
              required
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 聯絡方式 */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              聯絡方式
            </label>
            <input
              type="text"
              value={customerContact}
              onChange={(e) => setCustomerContact(e.target.value)}
              placeholder="電話、Email 或 LINE ID"
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 問題摘要 */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              問題摘要 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="簡短描述問題"
              required
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 詳細描述 */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              詳細描述
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="詳細說明問題內容..."
              rows={4}
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 優先級 */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              優先級 <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-3">
              {priorities.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`px-4 py-2 rounded-md text-sm font-medium border transition-all ${
                    priority === p
                      ? p === '緊急'
                        ? 'bg-red-100 text-red-700 border-red-300 ring-2 ring-red-300'
                        : p === '高'
                          ? 'bg-orange-100 text-orange-700 border-orange-300 ring-2 ring-orange-300'
                          : p === '中'
                            ? 'bg-blue-100 text-blue-700 border-blue-300 ring-2 ring-blue-300'
                            : 'bg-gray-100 text-gray-700 border-gray-300 ring-2 ring-gray-300'
                      : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 提交按鈕 */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="px-5 py-2.5 rounded-md text-sm font-medium border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            取消
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
          >
            建立工單
          </button>
        </div>
      </form>
    </div>
  );
}
