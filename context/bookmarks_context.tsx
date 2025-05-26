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