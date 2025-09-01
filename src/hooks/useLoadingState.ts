import { useState } from 'react';

type LoadingKey = string;

export const useLoadingState = () => {
  const [loadingStates, setLocalLoadingStates] = useState<Record<LoadingKey, boolean>>({});

  const getKey = (id: string, action: string): string => `${id}_${action}`;

  const isLocalLoading = (id: string, action: string): boolean => {
    const key = getKey(id, action);
    return !!loadingStates[key];
  };

  const setLocalLoading = (id: string, action: string) => {
    const key = getKey(id, action);
    setLocalLoadingStates((prev) => ({ ...prev, [key]: true }));
  };

  const clearLocalLoading = (id: string, action: string) => {
    const key = getKey(id, action);
    setLocalLoadingStates((prev) => ({ ...prev, [key]: false }));
  };

  return { isLocalLoading, setLocalLoading, clearLocalLoading };
};
