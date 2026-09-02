import { tenantSettingsApi } from './api';

export const defaultPublicBranding = {
  site_name: 'SmartCare HMS',
  logo: '',
  theme_color: '#0B6E4F',
  accent_color: '#0A2540',
  powered_by: 'Powered by SmartCare HMS',
  footer_text: '© 2026 SmartCare HMS. All rights reserved.',
  about: {
    title: 'About SmartCare HMS',
    summary: 'SmartCare HMS brings patient, staff, billing, pharmacy, and clinical workflows together in one secure healthcare platform.',
    highlights: [
      {
        title: 'Built for modern hospitals',
        description: 'The platform supports digital records, operational oversight, and cross-department coordination for busy clinical teams.',
      },
      {
        title: 'Designed with compliance in mind',
        description: 'NDPR, NHIS, and clinical governance requirements are built into the experience to support safer operations.',
      },
    ],
    bullets: [
      'Centralized patient and staff workflows for faster care coordination.',
      'Integrated modules for pharmacy, labs, finance, ward management, and reporting.',
      'Secure role-based access so the right people see the right information.',
    ],
  },
  contact: {
    title: 'Contact us',
    subtitle: 'Need help with onboarding, implementation, training, or support? Reach out and the SmartCare team will be happy to assist.',
    email: 'official.appbrew@gmail.com',
    phone: '+234 814 695 5393',
    hours: 'Monday to Friday, 8:00 AM to 6:00 PM',
  },
  privacy: {
    title: 'Privacy Policy',
    summary: 'We take patient, staff, and operational data seriously. SmartCare HMS is designed to protect sensitive information with strong access controls, auditability, and privacy-conscious workflows.',
    highlights: [
      {
        title: 'Data handling',
        description: 'Patient records are stored and managed in line with operational best practices and Nigerian data protection expectations.',
      },
      {
        title: 'Access controls',
        description: 'Role-based permissions limit data visibility to authorized teams and reduce exposure of sensitive records.',
      },
    ],
    bullets: [
      'Only authorized users can view or modify protected information.',
      'Audit trails help administrators monitor critical actions across the system.',
      'Security and privacy settings can be reviewed and adjusted from the platform settings area.',
    ],
  },
  testimonials: [
    {
      name: 'Dr. Adebayo Ogunlesi',
      role: 'Chief Medical Director',
      hospital: 'Lagos University Teaching Hospital',
      quote: 'SmartCare HMS has fundamentally changed how our clinical teams operate. The unified record and integrated modules have measurably improved both patient outcomes and staff satisfaction.',
    },
    {
      name: 'Mrs. Chioma Nwosu',
      role: 'Head of Administration',
      hospital: 'National Hospital Abuja',
      quote: 'NHIA claims management and the revenue cycle tools have been genuinely transformative — a 60% drop in claim rejections and a real improvement in cash flow.',
    },
    {
      name: 'Dr. Emeka Okonkwo',
      role: 'Medical Director',
      hospital: 'Nigerian Army Reference Hospital',
      quote: 'The clinical decision support and patient-safety tooling hold up against any global platform. Medication error rates fell 45% in our first quarter live.',
    },
  ],
};

export const normalizePublicBranding = (data = {}) => {
  const custom = data.custom_settings?.public_pages || {};
  const about = custom.about || defaultPublicBranding.about;
  const contact = custom.contact || defaultPublicBranding.contact;
  const privacy = custom.privacy || defaultPublicBranding.privacy;
  const testimonials = Array.isArray(custom.testimonials) && custom.testimonials.length
    ? custom.testimonials
    : defaultPublicBranding.testimonials;

  return {
    site_name: data.system_name || custom.site_name || defaultPublicBranding.site_name,
    logo: data.system_logo || custom.logo || defaultPublicBranding.logo,
    theme_color: data.theme_color || custom.theme_color || defaultPublicBranding.theme_color,
    accent_color: custom.accent_color || defaultPublicBranding.accent_color,
    powered_by: 'Powered by SmartCare HMS',
    footer_text: custom.footer_text || '© 2026 SmartCare HMS. All rights reserved.',
    about: {
      ...defaultPublicBranding.about,
      ...about,
      highlights: Array.isArray(about.highlights) && about.highlights.length ? about.highlights : defaultPublicBranding.about.highlights,
      bullets: Array.isArray(about.bullets) && about.bullets.length ? about.bullets : defaultPublicBranding.about.bullets,
    },
    contact: {
      ...defaultPublicBranding.contact,
      ...contact,
    },
    privacy: {
      ...defaultPublicBranding.privacy,
      ...privacy,
      highlights: Array.isArray(privacy.highlights) && privacy.highlights.length ? privacy.highlights : defaultPublicBranding.privacy.highlights,
      bullets: Array.isArray(privacy.bullets) && privacy.bullets.length ? privacy.bullets : defaultPublicBranding.privacy.bullets,
    },
    testimonials,
  };
};

export const fetchPublicBranding = async () => {
  try {
    const response = await tenantSettingsApi.getCurrent();
    return normalizePublicBranding(response || {});
  } catch (error) {
    console.error('Unable to load tenant public branding:', error);
    return defaultPublicBranding;
  }
};
