'use client';

import React, { useState } from 'react';
import { Bell, Menu, X, ChevronDown, User, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();
  const { user, signOut, loading } = useAuth();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsProfileOpen(false);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

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
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <span className="hidden md:flex items-center ml-2 mr-1">
                {user?.name || user?.email || 'User'}
                <ChevronDown size={16} className="ml-1" />
              </span>
            </button>
            
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
                <button
                  onClick={handleSignOut}
                  disabled={loading}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center disabled:opacity-50"
                >
                  <LogOut size={16} className="mr-2" />
                  {loading ? 'Signing out...' : 'Sign out'}
                </button>
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