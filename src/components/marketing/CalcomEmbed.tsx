'use client';

import Cal, { getCalApi } from '@calcom/embed-react';
import { useEffect } from 'react';

export function CalcomEmbed() {
  useEffect(() => {
    (async () => {
      const cal = await getCalApi();
      cal('ui', { styles: { branding: { brandColor: '#000' } } });
    })();
  }, []);

  return (
    <Cal
      calLink={process.env.NEXT_PUBLIC_CAL_COM_LINK ?? 'indoles/gorusme'}
      style={{ width: '100%', minHeight: '640px' }}
    />
  );
}
