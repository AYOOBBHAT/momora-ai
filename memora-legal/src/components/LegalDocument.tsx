import type { LegalSection } from '../content/legal';
import { CONTACT_EMAIL, LAST_UPDATED } from '../content/legal';
import styles from './LegalDocument.module.css';

interface LegalDocumentProps {
  title: string;
  sections: LegalSection[];
}

export function LegalDocument({ title, sections }: LegalDocumentProps) {
  return (
    <article className={styles.article}>
      <header className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.meta}>
          Last updated: <time dateTime="2025-06-15">{LAST_UPDATED}</time>
        </p>
      </header>

      {sections.map((section) => (
        <section key={section.title} className={styles.section}>
          <h2 className={styles.sectionTitle}>{section.title}</h2>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 40)} className={styles.paragraph}>
              {paragraph.includes(CONTACT_EMAIL) ? (
                <>
                  {paragraph.split(CONTACT_EMAIL)[0]}
                  <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                  {paragraph.split(CONTACT_EMAIL)[1]}
                </>
              ) : (
                paragraph
              )}
            </p>
          ))}
          {section.list ? (
            <ul className={styles.list}>
              {section.list.map((item) => (
                <li key={item.slice(0, 40)}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}
    </article>
  );
}
