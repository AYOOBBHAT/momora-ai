export const CONTACT_EMAIL = 'support@memora.app';
export const LAST_UPDATED = 'June 15, 2025';

export interface LegalSection {
  title: string;
  paragraphs: string[];
  list?: string[];
}

export const privacyPolicy: LegalSection[] = [
  {
    title: 'Introduction',
    paragraphs: [
      'Memora AI ("Memora," "we," "us," or "our") provides a personal knowledge management application that helps you capture, organize, and search your notes and documents using artificial intelligence.',
      'This Privacy Policy explains how we collect, use, store, and protect your information when you use the Memora mobile application and related services. By using Memora, you agree to the practices described in this policy.',
    ],
  },
  {
    title: 'Information We Collect',
    paragraphs: ['We collect the following categories of information to provide and improve the Memora service:'],
    list: [
      'Account information: When you register, we collect your name, email address, and a securely hashed password. If you sign in with Google, we receive your Google account identifier, name, and email address from Google\'s authentication service.',
      'User-created notes: Text notes, titles, tags, and metadata you create within the app.',
      'PDF uploads: Documents you upload as PDF files, including their text content after processing.',
      'URL imports: Web page content you import by providing a URL.',
      'YouTube transcript imports: Video metadata and transcript text from YouTube URLs you choose to import.',
      'Usage data: Basic diagnostic information such as request timestamps and error logs needed to operate the service reliably.',
    ],
  },
  {
    title: 'How We Use Your Information',
    paragraphs: ['We use your information solely to provide and improve Memora:'],
    list: [
      'Authenticate your account and maintain your session.',
      'Store and organize your notes, documents, and imported content.',
      'Generate text embeddings and enable semantic search across your content.',
      'Power AI-assisted chat and question-answering features scoped to your documents.',
      'Respond to support requests and legal inquiries.',
      'Maintain security, prevent abuse, and comply with applicable law.',
    ],
  },
  {
    title: 'AI Processing Providers',
    paragraphs: [
      'Memora uses third-party AI services to process your content. When you use search, embeddings, or chat features, relevant portions of your documents may be sent to these providers for processing.',
      'We use Google AI (Gemini) for generating text embeddings used in semantic search, and Groq for generating chat responses in retrieval-augmented generation (RAG) features.',
      'These providers process data on our behalf to deliver AI functionality. We do not sell your content to AI providers, and we configure our integrations to send only the minimum data necessary for each request.',
      'Third-party providers maintain their own privacy policies and security practices. We select providers that commit to appropriate data handling standards.',
    ],
  },
  {
    title: 'Data Storage',
    paragraphs: [
      'Your account data, notes, documents, embeddings, and chat history are stored in MongoDB Atlas, a cloud database service operated by MongoDB, Inc.',
      'Data is stored in encrypted form at rest and transmitted over encrypted connections (TLS/HTTPS). Database access is restricted to authorized backend services.',
      'We retain your data for as long as your account is active or as needed to provide the service. You may request deletion of your account and associated data at any time.',
    ],
  },
  {
    title: 'Data Security',
    paragraphs: [
      'We implement industry-standard security measures to protect your information, including encrypted connections, secure password hashing, JWT-based authentication, and access controls on our database and API.',
      'No method of transmission or storage is completely secure. While we strive to protect your data, we cannot guarantee absolute security. Please use a strong, unique password and keep your device secure.',
    ],
  },
  {
    title: 'Data Sharing',
    paragraphs: [
      'We do not sell, rent, or trade your personal information. We share data only in the following limited circumstances:',
    ],
    list: [
      'With service providers (MongoDB Atlas, Google AI, Groq) who process data on our behalf under contractual obligations.',
      'When required by law, regulation, legal process, or governmental request.',
      'To protect the rights, safety, and security of Memora, our users, or the public.',
      'In connection with a merger, acquisition, or sale of assets, with notice to affected users where required by law.',
    ],
  },
  {
    title: 'Your Rights and Data Deletion',
    paragraphs: [
      'Depending on your location, you may have rights to access, correct, export, or delete your personal data.',
      'You can delete individual notes and documents within the app. To delete your entire account and all associated data, contact us at the email address below. We will process verified deletion requests within a reasonable timeframe, typically within 30 days.',
      'If you signed in with Google, revoking Memora\'s access in your Google Account settings will prevent future sign-ins but will not automatically delete data already stored in Memora. Submit a deletion request to remove stored data.',
    ],
  },
  {
    title: 'Children\'s Privacy',
    paragraphs: [
      'Memora is not intended for children under 13 years of age. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us so we can delete it.',
    ],
  },
  {
    title: 'Changes to This Policy',
    paragraphs: [
      'We may update this Privacy Policy from time to time. We will revise the "Last updated" date at the top of this page when changes are made. Continued use of Memora after changes constitutes acceptance of the updated policy.',
    ],
  },
  {
    title: 'Contact Us',
    paragraphs: [
      `If you have questions about this Privacy Policy or wish to submit a data deletion request, contact us at ${CONTACT_EMAIL}.`,
    ],
  },
];

export const termsOfService: LegalSection[] = [
  {
    title: 'Acceptance of Terms',
    paragraphs: [
      'These Terms of Service ("Terms") govern your access to and use of the Memora AI application and related services ("Service") operated by Memora.',
      'By creating an account or using the Service, you agree to be bound by these Terms. If you do not agree, do not use the Service.',
    ],
  },
  {
    title: 'Description of Service',
    paragraphs: [
      'Memora is a personal knowledge management tool that lets you create notes, upload PDFs, import web pages and YouTube transcripts, organize content into collections, and interact with your documents using AI-powered search and chat.',
      'The Service is provided on an "as is" basis. Features may change, be added, or be discontinued at our discretion.',
    ],
  },
  {
    title: 'Account Registration',
    paragraphs: [
      'You must provide accurate and complete information when registering. You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account.',
      'You must be at least 13 years old to use the Service. You may register with an email and password or through Google Sign-In, subject to Google\'s terms of service.',
      'Notify us immediately at support@memora.app if you suspect unauthorized access to your account.',
    ],
  },
  {
    title: 'User Responsibilities',
    paragraphs: ['You agree to:'],
    list: [
      'Use the Service only for lawful purposes and in compliance with these Terms.',
      'Maintain accurate account information and keep your login credentials secure.',
      'Ensure you have the right to upload, import, or store any content you add to Memora.',
      'Back up important content independently; we are not a backup service.',
      'Review AI-generated responses critically; they may contain errors and should not be relied upon as professional advice.',
    ],
  },
  {
    title: 'Acceptable Use',
    paragraphs: [
      'You may use Memora to manage personal notes, documents, and imported content for your own lawful purposes. You may not use the Service to harm others, violate laws, or interfere with the operation of the Service.',
    ],
  },
  {
    title: 'Prohibited Content and Conduct',
    paragraphs: ['You may not upload, import, or transmit content that:'],
    list: [
      'Infringes intellectual property, privacy, or other rights of third parties.',
      'Contains malware, spam, or code designed to disrupt systems.',
      'Promotes violence, harassment, hate speech, or illegal activity.',
      'Contains child sexual abuse material or exploitation content.',
      'Attempts to reverse-engineer, scrape, or abuse the Service or its infrastructure.',
      'Circumvents usage limits, authentication, or security measures.',
    ],
  },
  {
    title: 'Intellectual Property',
    paragraphs: [
      'You retain ownership of content you create or upload. By using the Service, you grant Memora a limited license to store, process, and display your content solely to provide the Service, including AI processing for search and chat features.',
      'Memora\'s name, logo, application design, and underlying technology are owned by Memora and protected by applicable intellectual property laws. You may not copy, modify, or distribute our branding or software without permission.',
    ],
  },
  {
    title: 'Account Termination',
    paragraphs: [
      'You may stop using the Service and request account deletion at any time by contacting support@memora.app.',
      'We may suspend or terminate your account if you violate these Terms, engage in prohibited conduct, or if continued provision of the Service poses legal or security risks. Where practicable, we will provide notice before termination.',
      'Upon termination, your right to access the Service ends. We may delete your stored data in accordance with our Privacy Policy.',
    ],
  },
  {
    title: 'Service Availability',
    paragraphs: [
      'We aim to keep Memora available and reliable but do not guarantee uninterrupted or error-free operation. The Service may be unavailable due to maintenance, updates, third-party outages (including MongoDB Atlas, Google AI, or Groq), or circumstances beyond our control.',
      'We may modify, limit, or discontinue features with or without notice. Free-tier and beta features may have usage limits.',
    ],
  },
  {
    title: 'Disclaimer of Warranties',
    paragraphs: [
      'THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.',
      'AI-generated responses are informational only and may be inaccurate or incomplete. Memora does not provide legal, medical, financial, or other professional advice.',
    ],
  },
  {
    title: 'Limitation of Liability',
    paragraphs: [
      'TO THE MAXIMUM EXTENT PERMITTED BY LAW, MEMORA AND ITS OPERATORS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF DATA, PROFITS, OR GOODWILL, ARISING FROM YOUR USE OF THE SERVICE.',
      'OUR TOTAL LIABILITY FOR ANY CLAIM ARISING FROM THESE TERMS OR THE SERVICE SHALL NOT EXCEED THE GREATER OF (A) THE AMOUNT YOU PAID US IN THE TWELVE MONTHS PRECEDING THE CLAIM, OR (B) FIFTY U.S. DOLLARS ($50).',
      'Some jurisdictions do not allow certain limitations of liability; in those cases, our liability is limited to the fullest extent permitted by law.',
    ],
  },
  {
    title: 'Indemnification',
    paragraphs: [
      'You agree to indemnify and hold harmless Memora from claims, damages, and expenses (including reasonable legal fees) arising from your use of the Service, your content, or your violation of these Terms.',
    ],
  },
  {
    title: 'Governing Law',
    paragraphs: [
      'These Terms are governed by the laws of the jurisdiction in which Memora operates, without regard to conflict-of-law principles. Disputes shall be resolved in the courts of that jurisdiction, unless otherwise required by applicable consumer protection law.',
    ],
  },
  {
    title: 'Changes to These Terms',
    paragraphs: [
      'We may update these Terms from time to time. The "Last updated" date at the top of this page will reflect the latest revision. Continued use of the Service after changes constitutes acceptance of the updated Terms.',
    ],
  },
  {
    title: 'Contact Us',
    paragraphs: [
      `If you have questions about these Terms, contact us at ${CONTACT_EMAIL}.`,
    ],
  },
];
