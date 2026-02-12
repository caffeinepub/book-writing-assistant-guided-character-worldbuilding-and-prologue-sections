import { useState, useEffect } from 'react';
import { workspaceMenuItems } from '../config/workspaceMenuItems';

export interface CustomCategory {
  id: string;
  label: string;
  isCustom: true;
}

export interface Category {
  id: string;
  label: string;
  icon?: string;
  isCustom?: boolean;
}

const STORAGE_KEY = 'legendary-lovers-custom-categories';

function generateSafeId(name: string): string {
  const timestamp = Date.now();
  const randomPart = Math.random().toString(36).substring(2, 9);
  const safeName = name.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 20);
  return `custom-${safeName}-${timestamp}-${randomPart}`;
}

function loadCustomCategories(): CustomCategory[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load custom categories:', error);
  }
  return [];
}

function saveCustomCategories(categories: CustomCategory[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
  } catch (error) {
    console.error('Failed to save custom categories:', error);
  }
}

export function useWorkspaceCategories() {
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>(() => loadCustomCategories());

  useEffect(() => {
    saveCustomCategories(customCategories);
  }, [customCategories]);

  const addCustomCategory = (name: string): string => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      throw new Error('Category name is required');
    }

    const newCategory: CustomCategory = {
      id: generateSafeId(trimmedName),
      label: trimmedName,
      isCustom: true,
    };

    setCustomCategories(prev => [...prev, newCategory]);
    return newCategory.id;
  };

  const removeCustomCategory = (id: string): void => {
    setCustomCategories(prev => prev.filter(cat => cat.id !== id));
  };

  const builtInGenres = workspaceMenuItems.filter(item => item.group === 'genres');
  
  const allCategories: Category[] = [
    ...builtInGenres.map(item => ({
      id: item.id,
      label: item.label,
      icon: item.icon,
      isCustom: false,
    })),
    ...customCategories,
  ];

  const getCategoryLabel = (id: string): string | undefined => {
    const category = allCategories.find(cat => cat.id === id);
    return category?.label;
  };

  const categoryExists = (id: string): boolean => {
    return allCategories.some(cat => cat.id === id);
  };

  return {
    customCategories,
    allCategories,
    builtInGenres,
    addCustomCategory,
    removeCustomCategory,
    getCategoryLabel,
    categoryExists,
  };
}
