// 工單列表頁（首頁）— Zendesk 風格專業 UI
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useTickets } from '@/data/ticket-store';
import {
  Channel,
  Priority,
  Status,
  channelIcon,
  statusColor,
  priorityColor,
  priorityBorderColor,
  priorityWeight,
  customerLevelWeight,
  customerLevelBadge,
  channels,
  priorities,
  statuses,
} from '@/data/mock-tickets';

export default function HomePage() {
  const { tickets } = useTickets();
  const [filterChannel, setFilterChannel] = useState<Channel | '全部'>('全部');
  const [filterStatus, setFilterStatus] = useState<Status | '全部'>('全部');
  const [filterPriority, setFilterPriority] = useState<Priority | '全部'>('全部');

  const stats = useMemo(() => {
    const pending = tickets.filter((t) => t.status === '新建').length;
    const urgent = tickets.filter((t) => t.priority === '緊急').length;
    const todayCompleted = tickets.filter(
      (t) => t.status === '已完成' && t.updatedAt.startsWith('2026-03-23')
    ).length;
    return { pending, urgent, todayCompleted };
  }, [tickets]);

  const filteredTickets = useMemo(() => {
    let result = [...tickets];
    if (filterChannel !== '全部') result = result.filter((t) => t.channel === filterChannel);
    if (filterStatus !== '全部') result = result.filter((t) => t.status === filterStatus);
    if (filterPriority !== '全部') result = result.filter((t) => t.priority === filterPriority);
    result.sort((a, b) => {
      const pDiff = priorityWeight[a.priority] - priorityWeight[b.priority];
      if (pDiff !== 0) return pDiff;
      const cDiff = customerLevelWeight[a.customerLevel] - customerLevelWeight[b.customerLevel];
      if (cDiff !== 0) return cDiff;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return result;
  }, [tickets, filterChannel, filterStatus, filterPriority]);

  const getWaitTime = (createdAt: string) => {
    const now = new Date('2026-03-23T11:00:00');
    const created = new Date(createdAt);
    const diffMs = now.getTime() - created.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins}分`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}小時`;
    return `${Math.floor(diffHours / 24)}天`;
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* 頁面標題 */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">工單總覽</h2>
        <p className="text-sm text-slate-500 mt-1">管理所有客服工單與進度追蹤</p>
      </div>

      {/* 統計條 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">待處理</p>
              <p className="text-4xl font-bold text-blue-600 mt-2">{stats.pending}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl">📥</div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">緊急工單</p>
              <p className="text-4xl font-bold text-red-600 mt-2">{stats.urgent}</p>
            </div>
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-2xl">🔥</div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">今日完成</p>
              <p className="text-4xl font-bold text-emerald-600 mt-2">{stats.todayCompleted}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-2xl">✅</div>
          </div>
        </div>
      </div>

      {/* 篩選器 */}
      <div className="bg-white rounded-xl border border-slate-200 px-5 py-4 mb-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-5">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">來源</label>
            <select value={filterChannel} onChange={(e) => setFilterChannel(e.target.value as Channel | '全部')}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[120px]">
              <option value="全部">全部管道</option>
              {channels.map((ch) => (<option key={ch} value={ch}>{channelIcon[ch]} {ch}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">狀態</label>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as Status | '全部')}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[120px]">
              <option value="全部">全部狀態</option>
              {statuses.map((s) => (<option key={s} value={s}>{s}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">優先級</label>
            <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value as Priority | '全部')}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[120px]">
              <option value="全部">全部優先級</option>
              {priorities.map((p) => (<option key={p} value={p}>{p}</option>))}
            </select>
          </div>
          <div className="flex items-end ml-auto">
            <span className="text-sm text-slate-400 font-medium">{filteredTickets.length} 張工單</span>
          </div>
        </div>
      </div>

      {/* 工單表格 */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* 表頭 */}
        <div className="hidden sm:grid sm:grid-cols-[40px_1fr_100px_80px_80px_80px_90px] gap-3 px-5 py-3 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <div></div>
          <div>工單</div>
          <div>客戶</div>
          <div>來源</div>
          <div>優先級</div>
          <div>狀態</div>
          <div className="text-right">等待時間</div>
        </div>

        {/* 工單行 */}
        {filteredTickets.length === 0 ? (
          <div className="px-5 py-16 text-center text-slate-400">
            <p className="text-lg mb-1">沒有符合條件的工單</p>
            <p className="text-sm">請調整篩選條件</p>
          </div>
        ) : (
          filteredTickets.map((ticket) => (
            <Link key={ticket.id} href={`/tickets/${ticket.id}`}>
              <div className={`grid grid-cols-1 sm:grid-cols-[40px_1fr_100px_80px_80px_80px_90px] gap-3 px-5 py-4 border-b border-slate-100 border-l-4 ${priorityBorderColor[ticket.priority]} hover:bg-slate-50 transition-colors cursor-pointer group`}>
                {/* 來源 icon */}
                <div className="hidden sm:flex items-center justify-center text-xl">
                  {channelIcon[ticket.channel]}
                </div>

                {/* 工單資訊 */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400">{ticket.id}</span>
                    {ticket.customerLevel !== '一般' && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${customerLevelBadge[ticket.customerLevel]}`}>
                        {ticket.customerLevel === 'VIP' ? '👑 VIP' : ticket.customerLevel}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-slate-800 mt-0.5 truncate group-hover:text-blue-600 transition-colors">
                    {ticket.summary}
                  </p>
                  {/* 手機版額外資訊 */}
                  <div className="sm:hidden flex items-center gap-2 mt-2 flex-wrap">
                    <span className="text-xs text-slate-500">{channelIcon[ticket.channel]} {ticket.channel}</span>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${priorityColor[ticket.priority]}`}>{ticket.priority}</span>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${statusColor[ticket.status]}`}>{ticket.status}</span>
                  </div>
                </div>

                {/* 客戶 */}
                <div className="hidden sm:flex items-center">
                  <span className="text-sm text-slate-700 truncate">{ticket.customerName}</span>
                </div>

                {/* 來源 */}
                <div className="hidden sm:flex items-center">
                  <span className="text-xs text-slate-500">{ticket.channel}</span>
                </div>

                {/* 優先級 */}
                <div className="hidden sm:flex items-center">
                  <span className={`text-[11px] px-2.5 py-1 rounded-full font-semibold ${priorityColor[ticket.priority]}`}>
                    {ticket.priority}
                  </span>
                </div>

                {/* 狀態 */}
                <div className="hidden sm:flex items-center">
                  <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${statusColor[ticket.status]}`}>
                    {ticket.status}
                  </span>
                </div>

                {/* 等待時間 */}
                <div className="hidden sm:flex items-center justify-end">
                  <span className={`text-xs font-medium ${
                    ticket.priority === '緊急' ? 'text-red-600' :
                    ticket.priority === '高' ? 'text-amber-600' : 'text-slate-500'
                  }`}>
                    {getWaitTime(ticket.createdAt)}
                  </span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
