import React from 'react';
import Link from 'next/link';
import { Github, Mail, Twitter } from 'lucide-react';

const footerLinks = {
  产品: [
    { name: '课程', href: '/courses' },
    { name: '教程', href: '/tutorials' },
    { name: '项目', href: '/projects' },
    { name: '社区', href: '/community' },
  ],
  支持: [
    { name: '帮助中心', href: '/help' },
    { name: '使用指南', href: '/guide' },
    { name: '常见问题', href: '/faq' },
    { name: '联系我们', href: '/contact' },
  ],
  关于: [
    { name: '关于我们', href: '/about' },
    { name: '加入我们', href: '/jobs' },
    { name: '隐私政策', href: '/privacy' },
    { name: '服务条款', href: '/terms' },
  ],
};

const socialLinks = [
  {
    name: 'GitHub',
    href: 'https://github.com',
    icon: Github,
  },
  {
    name: 'Twitter',
    href: 'https://twitter.com',
    icon: Twitter,
  },
  {
    name: 'Email',
    href: 'mailto:contact@example.com',
    icon: Mail,
  },
];

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <img 
                src="/logo.png" 
                alt="Logo" 
                className="h-8 w-auto transform transition-transform duration-300 hover:scale-110"
              />
              <span className="font-bold text-xl gradient-text">Scratch学习平台</span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              让每个孩子都能享受编程的乐趣，培养创造力和逻辑思维能力。
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
                {category}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-gray-600 hover:text-[var(--scratch-blue)] dark:text-gray-400 dark:hover:text-[var(--scratch-blue)] text-sm transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              © {new Date().getFullYear()} Scratch学习平台. 保留所有权利.
            </p>

            {/* Social Links */}
            <div className="flex space-x-6">
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-[var(--scratch-blue)] dark:text-gray-400 dark:hover:text-[var(--scratch-blue)] transition-colors duration-300"
                  >
                    <span className="sr-only">{item.name}</span>
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 