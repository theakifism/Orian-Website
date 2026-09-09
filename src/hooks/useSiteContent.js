import { useEffect, useState } from 'react';

let cache = null;  

export default function useSiteContent() {
  const [content, setContent] = useState(cache || {});

  useEffect(() => {
    if (cache) return;
    fetch('/api/content')
      .then((res) => res.json())
      .then((data) => {
        cache = data.content || {};
        setContent(cache);
      })
      .catch(() => {
        
      });
  }, []);

  
  const get = (key, fallback) => content[key] ?? fallback;

  return { get };
}
