// 深色側邊欄 — Zendesk 風格
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: '工單列表', icon: '📋', desc: '查看所有工單' },
  { href: '/tickets/new', label: '新建工單', icon: '➕', desc: '建立新的客服工單' },
  { href: '/reports', label: '每日報表', icon: '📊', desc: '日報檢核與送出' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white flex flex-col shrink-0">
      {/* Logo */}
      <div className="px-6 py-7 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-lg font-bold">H</div>
          <div>
            <h1 className="text-lg font-bold tracking-wide">HCT 客服中心</h1>
            <p className="text-[11px] text-slate-500">Service Dashboard</p>
          </div>
        </div>
      </div>

      {/* 導航 */}
      <nav className="flex-1 py-5 px-3">
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest px-3 mb-3">主選單</p>
        {navItems.map((item) => {
          const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all mb-1 ${
                isActive
                  ? 'bg-blue-600/20 text-blue-400 font-medium border border-blue-500/30'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}>
              <span className="text-lg">{item.icon}</span>
              <div>
                <p>{item.label}</p>
                {isActive && <p className="text-[10px] text-slate-500 mt-0.5">{item.desc}</p>}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* 底部 */}
      <div className="px-6 py-5 border-t border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-xs">👤</div>
          <div>
            <p className="text-sm font-medium text-slate-300">客服人員</p>
            <p className="text-[10px] text-slate-600">v1.0 · MVP</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
