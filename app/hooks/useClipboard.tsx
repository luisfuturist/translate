import { useState } from 'react';

const useClipboard = () => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      import.meta.env.DEV && console.error('Failed to copy:', error);
    }
  };

  return { copied, copyToClipboard };
};

export default useClipboard;
