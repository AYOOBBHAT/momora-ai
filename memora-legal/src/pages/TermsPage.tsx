import { LegalDocument } from '../components/LegalDocument';
import { termsOfService } from '../content/legal';

export function TermsPage() {
  return <LegalDocument title="Terms of Service" sections={termsOfService} />;
}
