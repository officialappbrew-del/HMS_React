import InfoPage from './InfoPage';

const AboutPage = () => {
  return (
    <InfoPage
      title="About SmartCare HMS"
      summary="SmartCare HMS is a full-stack hospital management platform designed to help Nigerian healthcare providers coordinate patients, clinical workflows, billing, pharmacy, labs, and administration from one secure system."
      highlights={[
        {
          title: 'Built for modern hospitals',
          description: 'The platform supports digital records, operational oversight, and cross-department coordination for busy clinical teams.'
        },
        {
          title: 'Designed with compliance in mind',
          description: 'NDPR, NHIS, and clinical governance requirements are built into the experience to support safer operations.'
        }
      ]}
      bullets={[
        'Centralized patient and staff workflows for faster care coordination.',
        'Integrated modules for pharmacy, labs, finance, ward management, and reporting.',
        'Secure role-based access so the right people see the right information.'
      ]}
    />
  );
};

export default AboutPage;
