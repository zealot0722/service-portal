// 深色側邊欄元件
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: '工單列表', icon: '📋' },
  { href: '/tickets/new', label: '新建工單', icon: '➕' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 min-h-screen bg-slate-900 text-white flex flex-col shrink-0">
      {/* Logo 區域 */}
      <div className="px-5 py-6 border-b border-slate-700">
        <h1 className="text-xl font-bold tracking-wide">HCT 客服中心</h1>
        <p className="text-xs text-slate-400 mt-1">Customer Service Dashboard</p>
      </div>

      {/* 導航選單 */}
      <nav className="flex-1 py-4">
        {navItems.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-5 py-3 text-sm transition-colors ${
                isActive
                  ? 'bg-slate-700 text-white font-medium'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* 底部資訊 */}
      <div className="px-5 py-4 border-t border-slate-700 text-xs text-slate-500">
        <p>HCT Dashboard v1.0</p>
        <p className="mt-1">MVP 展示版本</p>
      </div>
    </aside>
  );
}
