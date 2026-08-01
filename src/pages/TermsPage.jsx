import InfoPage from './InfoPage';

const TermsPage = () => {
  return (
    <InfoPage
      title="Terms of Service"
      summary="These terms describe the expected use of SmartCare HMS for healthcare operations, administration, and clinical coordination."
      highlights={[
        {
          title: 'Responsible use',
          description: 'The platform should be used to support good clinical practice, accurate documentation, and secure teamwork.'
        },
        {
          title: 'Operational reliability',
          description: 'Hospitals are expected to keep user accounts, credentials, and configuration practices aligned with internal policy.'
        }
      ]}
      bullets={[
        'Users are responsible for keeping their account credentials secure.',
        'The system is intended for authorized healthcare and administrative use only.',
        'Organizations should validate data accuracy before relying on reports or workflows for decision-making.'
      ]}
    />
  );
};

export default TermsPage;
