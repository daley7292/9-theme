'use client';

import { useEffect } from 'react';
import { initChatwoot } from '@/libs/chatwoot';

export const ChatWoot = () => {
  useEffect(() => {
    initChatwoot();
  }, []);
  return null;
};
