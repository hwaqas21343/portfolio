import PageHeader from '../components/PageHeader';
import Section from '../components/Section';
import SkillGroups from '../components/SkillGroups';
import { CONTACT } from '../data/contact';
import styles from './Contact.module.css';

const SUMMARY: Array<{ label: string; value: string }> = [
  { label: 'Course', value: 'BEng Aerospace Engineering (predicted First)' },
  { label: 'University', value: "City St George's, University of London" },
  { label: 'Graduating', value: 'July 2027' },
  { label: 'Seeking', value: 'Graduate roles and MSc, spacecraft GNC' },
];

const EXPERIENCE = [
  {
    role: 'Summer Work Experience',
    org: 'Panasonic Avionics Corporation',
    when: 'July 2025',
    where: 'London, UK',
    points: [
      'Looked into integration of IFE systems onto Airbus aircraft and the current issues they had on the customer aircraft.',
      'Followed tests taken to recreate the power interrupts from switching from APU to GPU or to engine power.',
      'Studied older IFE systems facing issues to draw parallels and determine if these were hardware or aircraft related.',
      'Shadowed the engineers working on the project, covering part of the engineering investigations and execution of the aircraft test plan.',
    ],
  },
  {
    role: 'Head of Mechanical Systems',
    org: 'Formula Student UK',
    when: '2025 – Present',
    where: 'Extracurricular, 2nd year',
    points: [
      "Led chassis design and structural validation for the team's first EV and car in 8 years, targeting the 2027 season.",
      'Designed the full front and rear suspension geometry from a clean-sheet chassis, defining roll centre height, camber, anti-dive and pushrod / bellcrank motion ratio targets.',
      'Validated structural integrity to 40g frontal / side impact loading while cutting chassis mass from 57.8 kg to 53.2 kg (safety factor > 1.6); delivered full vehicle design-to-build in 10 months against fixed facility constraints.',
    ],
  },
  {
    role: 'Aerodynamics',
    org: 'Formula Student UK',
    when: '2024',
    where: 'Extracurricular, 1st year',
    points: [
      "Worked on the team's aerodynamics package before moving into chassis and structural leadership as Head of Mechanical Systems in 2025.",
    ],
  },
];

export default function Resume() {
  return (
    <div className="container">
      <div className="sheet">
        <PageHeader
          eyebrow="Resume"
          title="My background"
          lede="Modules, grades, team roles and the details behind each project on this site."
        />

        <Section label="Download" title="Full CV">
          <div className="prose">
            <p>
              Feel free to download my resume and take a look at my experiences.
              If you want to skip the download, have a read below.
            </p>
          </div>

          {CONTACT.cvAvailable ? (
            <a
              className={styles.download}
              href={CONTACT.cvPath}
              download={CONTACT.cvFileName}
            >
              Download CV (PDF)
            </a>
          ) : (
            <p className={styles.pending}>
              CV not uploaded yet, drop the PDF into <code>public/cv.pdf</code>{' '}
              and set <code>cvAvailable: true</code> in{' '}
              <code>src/data/contact.ts</code>.
            </p>
          )}
        </Section>

        <Section label="Summary" title="At a glance">
          <ul className={styles.rows}>
            {SUMMARY.map(({ label, value }) => (
              <li key={label} className={styles.row}>
                <span className={styles.rowLabel}>{label}</span>
                <span className={styles.rowValue}>{value}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section label="Experience" title="Where I've worked">
          {EXPERIENCE.map((job) => (
            <article key={`${job.org}-${job.role}`} className={styles.job}>
              <header className={styles.jobHead}>
                <div>
                  <h3 className={styles.jobRole}>{job.role}</h3>
                  <p className={styles.jobOrg}>{job.org}</p>
                </div>
                <div className={styles.jobMeta}>
                  <span>{job.when}</span>
                  <span>{job.where}</span>
                </div>
              </header>
              <ul className={styles.jobPoints}>
                {job.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </Section>

        <Section label="Skills" title="Tools and methods">
          <SkillGroups />
        </Section>
      </div>
    </div>
  );
}
