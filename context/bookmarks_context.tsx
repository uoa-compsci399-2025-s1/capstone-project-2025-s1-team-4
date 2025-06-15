/** 
* Bookmarks Context: Stores bookmark state of medicine card throguhout pages. If bookmark icon
* is pressed from anywhere in the app, it will reflect in all pages where the medicine card
* is present. 
* Import import { useBookmarks } from '../../context/bookmarks_context' to use;
*/

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

export const BookmarkContext = createContext<{
  bookmarks: number[];
  toggleBookmark: (id: number) => void;
  setBookmarks: React.Dispatch<React.SetStateAction<number[]>>;
} | null>(null);

export const BookmarkProvider = ({ children }: { children: React.ReactNode }) => {
  const [bookmarks, setBookmarks] = useState<number[]>([]);

  useEffect(() => {
    const loadBookmarks = async () => {
      const stored = await AsyncStorage.getItem('bookmarks');
      if (stored) setBookmarks(JSON.parse(stored));
    };
    loadBookmarks();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const toggleBookmark = (id: number) => {
    setBookmarks((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };

  return (
    <BookmarkContext.Provider value={{ bookmarks, toggleBookmark, setBookmarks }}>
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmarks = () => {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error('useBookmarks must be used within BookmarkProvider');
  }
  return context;
};