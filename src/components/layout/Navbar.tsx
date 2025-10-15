'use client';

import React, { useState } from 'react';
import { Bell, Menu, X, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-2.5 shadow-sm">
      <div className="flex flex-wrap justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <span className="self-center text-xl font-semibold whitespace-nowrap text-blue-600">
              JobTrackPath
            </span>
          </Link>
          <div className="hidden md:flex ml-10 space-x-8">
            <Link
              href="/"
              className={`${
                pathname === '/' ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Board
            </Link>
            <Link
              href="/conversations"
              className={`${
                pathname === '/conversations'
                  ? 'text-blue-600 font-medium'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Conversations
            </Link>
            <Link
              href="/analytics"
              className={`${
                pathname === '/analytics'
                  ? 'text-blue-600 font-medium'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Analytics
            </Link>
          </div>
        </div>
        
        <div className="flex items-center">
          <button className="p-2 mr-2 text-gray-500 rounded-full hover:bg-gray-100">
            <Bell size={20} />
          </button>
          
          <div className="relative">
            <button
              onClick={toggleProfile}
              className="flex items-center text-sm bg-gray-100 rounded-full p-1 focus:ring-4 focus:ring-gray-200"
            >
              <img
                className="w-8 h-8 rounded-full"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="User"
              />
              <span className="hidden md:flex items-center ml-2 mr-1">
                John Doe
                <ChevronDown size={16} className="ml-1" />
              </span>
            </button>
            
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Your Profile
                </a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Settings
                </a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Sign out
                </a>
              </div>
            )}
          </div>
          
          <button
            onClick={toggleMenu}
            className="inline-flex items-center p-2 ml-3 text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:ring-2 focus:ring-gray-200"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="md:hidden w-full mt-2">
          <ul className="flex flex-col mt-4 space-y-2">
            <li>
              <Link
                href="/"
                className={`block py-2 px-3 ${
                  pathname === '/' ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                Board
              </Link>
            </li>
            <li>
              <Link
                href="/conversations"
                className={`block py-2 px-3 ${
                  pathname === '/conversations'
                    ? 'text-blue-600 font-medium'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                Conversations
              </Link>
            </li>
            <li>
              <Link
                href="/analytics"
                className={`block py-2 px-3 ${
                  pathname === '/analytics'
                    ? 'text-blue-600 font-medium'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                Analytics
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};