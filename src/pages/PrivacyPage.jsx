import InfoPage from './InfoPage';

const PrivacyPage = () => {
  return (
    <InfoPage
      title="Privacy Policy"
      summary="We take patient, staff, and operational data seriously. SmartCare HMS is designed to protect sensitive information with strong access controls, auditability, and privacy-conscious workflows."
      highlights={[
        {
          title: 'Data handling',
          description: 'Patient records are stored and managed in line with operational best practices and Nigerian data protection expectations.'
        },
        {
          title: 'Access controls',
          description: 'Role-based permissions limit data visibility to authorized teams and reduce exposure of sensitive records.'
        }
      ]}
      bullets={[
        'Only authorized users can view or modify protected information.',
        'Audit trails help administrators monitor critical actions across the system.',
        'Security and privacy settings can be reviewed and adjusted from the platform settings area.'
      ]}
    />
  );
};

export default PrivacyPage;
