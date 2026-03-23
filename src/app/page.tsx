// 工單列表頁（首頁）— 統計條 + 篩選器 + 工單卡片
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
  priorityWeight,
  customerLevelWeight,
  customerLevelColor,
  channels,
  priorities,
  statuses,
} from '@/data/mock-tickets';

export default function HomePage() {
  const { tickets } = useTickets();

  // 篩選狀態
  const [filterChannel, setFilterChannel] = useState<Channel | '全部'>('全部');
  const [filterStatus, setFilterStatus] = useState<Status | '全部'>('全部');
  const [filterPriority, setFilterPriority] = useState<Priority | '全部'>('全部');

  // 計算統計數據
  const stats = useMemo(() => {
    const pending = tickets.filter((t) => t.status === '新建').length;
    const urgent = tickets.filter((t) => t.priority === '緊急').length;
    const todayCompleted = tickets.filter(
      (t) => t.status === '已完成' && t.updatedAt.startsWith('2026-03-23')
    ).length;
    return { pending, urgent, todayCompleted };
  }, [tickets]);

  // 篩選 + 排序
  const filteredTickets = useMemo(() => {
    let result = [...tickets];

    if (filterChannel !== '全部') {
      result = result.filter((t) => t.channel === filterChannel);
    }
    if (filterStatus !== '全部') {
      result = result.filter((t) => t.status === filterStatus);
    }
    if (filterPriority !== '全部') {
      result = result.filter((t) => t.priority === filterPriority);
    }

    // 排序：緊急優先 → VIP 優先 → 時間新到舊
    result.sort((a, b) => {
      const pDiff = priorityWeight[a.priority] - priorityWeight[b.priority];
      if (pDiff !== 0) return pDiff;
      const cDiff =
        customerLevelWeight[a.customerLevel] -
        customerLevelWeight[b.customerLevel];
      if (cDiff !== 0) return cDiff;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return result;
  }, [tickets, filterChannel, filterStatus, filterPriority]);

  // 計算等待時間
  const getWaitTime = (createdAt: string) => {
    const now = new Date('2026-03-23T11:00:00');
    const created = new Date(createdAt);
    const diffMs = now.getTime() - created.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins} 分鐘`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} 小時`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} 天`;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* 頁面標題 */}
      <h2 className="text-2xl font-bold text-slate-800 mb-6">工單總覽</h2>

      {/* 統計條 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
          <p className="text-sm text-slate-500">待處理工單</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
          <p className="text-sm text-slate-500">緊急工單</p>
          <p className="text-3xl font-bold text-red-600 mt-1">{stats.urgent}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
          <p className="text-sm text-slate-500">今日已完成</p>
          <p className="text-3xl font-bold text-green-600 mt-1">{stats.todayCompleted}</p>
        </div>
      </div>

      {/* 篩選器 */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">來源管道</label>
            <select
              value={filterChannel}
              onChange={(e) => setFilterChannel(e.target.value as Channel | '全部')}
              className="border border-slate-300 rounded-md px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="全部">全部</option>
              {channels.map((ch) => (
                <option key={ch} value={ch}>
                  {channelIcon[ch]} {ch}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">狀態</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as Status | '全部')}
              className="border border-slate-300 rounded-md px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="全部">全部</option>
              {statuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">優先級</label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as Priority | '全部')}
              className="border border-slate-300 rounded-md px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="全部">全部</option>
              {priorities.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <span className="text-sm text-slate-500">
              共 {filteredTickets.length} 張工單
            </span>
          </div>
        </div>
      </div>

      {/* 工單卡片列表 */}
      <div className="space-y-3">
        {filteredTickets.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-10 text-center text-slate-400">
            沒有符合條件的工單
          </div>
        ) : (
          filteredTickets.map((ticket) => (
            <Link key={ticket.id} href={`/tickets/${ticket.id}`}>
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer mb-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  {/* 左側：來源 icon + 工單資訊 */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <span className="text-2xl shrink-0" title={ticket.channel}>
                      {channelIcon[ticket.channel]}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono text-slate-400">
                          {ticket.id}
                        </span>
                        {ticket.customerLevel !== '一般' && (
                          <span className={`text-xs ${customerLevelColor[ticket.customerLevel]}`}>
                            {ticket.customerLevel}
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium text-slate-800 mt-1 truncate">
                        {ticket.summary}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                        <span>{ticket.customerName}</span>
                        <span>·</span>
                        <span>等待 {getWaitTime(ticket.createdAt)}</span>
                        {ticket.assignee && (
                          <>
                            <span>·</span>
                            <span>負責人：{ticket.assignee}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 右側：標籤 */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${priorityColor[ticket.priority]}`}>
                      {ticket.priority}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColor[ticket.status]}`}>
                      {ticket.status}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
