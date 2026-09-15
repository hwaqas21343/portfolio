import PageHeader from '../components/PageHeader';
import Section from '../components/Section';
import { CONTACT } from '../data/contact';
import styles from './Contact.module.css';

const DIRECT = [
  { label: 'Email', value: CONTACT.email, href: `mailto:${CONTACT.email}` },
  { label: 'Location', value: CONTACT.location, href: '' },
].filter((row) => row.value);

const PROFILES = [
  {
    key: 'linkedin',
    rail: 'Network',
    title: 'LinkedIn',
    copy: 'The fuller professional history: roles, the Formula Student team and the things that do not fit on one page of CV. The best place to reach me if you would rather not email.',
    action: 'Open LinkedIn',
    href: CONTACT.linkedin,
    field: 'linkedin',
  },
  {
    key: 'github',
    rail: 'Code',
    title: 'GitHub',
    copy: 'Source for the simulation work behind these projects and for this site. Worth a look if you want to see how the ADCS controller and the chassis viewer are actually put together.',
    action: 'Open GitHub',
    href: CONTACT.github,
    field: 'github',
  },
];

export default function Contact() {
  return (
    <div className="container">
      <div className="sheet">
        <PageHeader
          eyebrow="Contact"
          title="Get in touch"
          lede="Open to graduate roles, internships and MSc supervision conversations in spacecraft GNC, dynamics and control."
        />

        <Section label="Direct" title="Where to find me">
          <ul className={styles.rows}>
            {DIRECT.map(({ label, value, href }) => (
              <li key={label} className={styles.row}>
                <span className={styles.rowLabel}>{label}</span>
                {href ? (
                  <a className={styles.rowValue} href={href}>
                    {value}
                  </a>
                ) : (
                  <span className={styles.rowValue}>{value}</span>
                )}
              </li>
            ))}
          </ul>
        </Section>

        {PROFILES.map(({ key, rail, title, copy, action, href, field }) => (
          <Section key={key} label={rail} title={title}>
            <div className="prose">
              <p>{copy}</p>
            </div>

            {href ? (
              <a
                className={styles.action}
                href={href}
                target="_blank"
                rel="noreferrer"
              >
                {action}
              </a>
            ) : (
              <p className={styles.pending}>
                Not linked yet, add the profile URL to <code>{field}</code> in{' '}
                <code>src/data/contact.ts</code> and this becomes a button.
              </p>
            )}
          </Section>
        ))}
      </div>
    </div>
  );
}
