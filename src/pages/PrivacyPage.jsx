import { useEffect, useState } from 'react';
import InfoPage from './InfoPage';
import { fetchPublicBranding, defaultPublicBranding } from '../utils/publicBranding';

const PrivacyPage = () => {
  const [brand, setBrand] = useState(defaultPublicBranding);

  useEffect(() => {
    let isMounted = true;
    fetchPublicBranding().then((branding) => {
      if (isMounted) setBrand(branding);
    });
    return () => { isMounted = false; };
  }, []);

  return (
    <InfoPage
      brand={brand}
      title={brand.privacy.title}
      summary={brand.privacy.summary}
      highlights={brand.privacy.highlights}
      bullets={brand.privacy.bullets}
    />
  );
};

export default PrivacyPage;
