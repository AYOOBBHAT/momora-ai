import { LegalDocument } from '../components/LegalDocument';
import { privacyPolicy } from '../content/legal';

export function PrivacyPage() {
  return <LegalDocument title="Privacy Policy" sections={privacyPolicy} />;
}
