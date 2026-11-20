import { useEffect } from 'react';

export const useTitle = (title) => {
  useEffect(() => {
    const prevTitle = document.title;
    if (title) {
      document.title = `${title} | NexaTech Enterprise IT`;
    } else {
      document.title = 'NexaTech — Enterprise IT & Software Engineering';
    }

    return () => {
      document.title = prevTitle;
    };
  }, [title]);
};
