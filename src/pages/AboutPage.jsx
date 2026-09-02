import { useEffect, useState } from 'react';
import InfoPage from './InfoPage';
import { fetchPublicBranding, defaultPublicBranding } from '../utils/publicBranding';

const AboutPage = () => {
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
      title={brand.about.title}
      summary={brand.about.summary}
      highlights={brand.about.highlights}
      bullets={brand.about.bullets}
    />
  );
};

export default AboutPage;
