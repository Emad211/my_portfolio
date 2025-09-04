"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { name: 'داشبورد', href: '/' },
  { name: 'جستجوی دانش', href: '/kb' },
  { name: 'تنظیمات', href: '/settings' },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-64 bg-gray-800 text-white">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold">Vibe Prompt Studio</h2>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={classNames(
              pathname === item.href
                ? 'bg-gray-900 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white',
              'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
            )}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}
