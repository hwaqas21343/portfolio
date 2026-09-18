import { CONTACT } from '../../../data/contact';
import { Cells, DownloadButton, EntryHeader, ExperienceList, Rule } from '../ui';
import styles from './panels.module.css';

const EXPERIENCE = [
  {
    role: 'Summer Work Experience',
    org: 'Panasonic Avionics Corporation',
    when: 'July 2025',
    where: 'London, UK',
    body: 'Looked into integration of IFE systems onto Airbus aircraft and the current issues they had on the customer aircraft. Followed tests taken to recreate the power interrupts from switching from APU to GPU or to engine power and shadowed the engineers across the investigations and the aircraft test plan.',
  },
  {
    role: 'Head of Mechanical Systems',
    org: 'Formula Student UK',
    when: '2025 – Present',
    where: 'Extracurricular, 2nd year',
    body: "Led chassis design and structural validation for the team's first EV and car in 8 years, targeting the 2027 season. Designed the full front and rear suspension geometry from a clean-sheet chassis and validated structural integrity to 40g frontal / side impact loading while cutting chassis mass from 57.8 kg to 53.2 kg (safety factor > 1.6).",
  },
  {
    role: 'Aerodynamics',
    org: 'Formula Student UK',
    when: '2024',
    where: 'Extracurricular, 1st year',
    body: "Worked on the team's aerodynamics package before moving into chassis and structural leadership as Head of Mechanical Systems in 2025.",
  },
];

export default function ResumePanel() {
  return (
    <div className={styles.stack18}>
      <EntryHeader
        rows={[
          ['DATE', 'September 2026'],
          ['FILE', CONTACT.cvFileName],
          ['ENTRIES', '3 roles · 3 skill groups'],
        ]}
      />
      <Rule />

      <DownloadButton href={CONTACT.cvPath} download={CONTACT.cvFileName}>
        DOWNLOAD RESUME (PDF) ▸
      </DownloadButton>

      <Cells
        minWidth={220}
        cells={[
          { label: 'COURSE', value: 'BEng Aerospace Engineering (predicted First)' },
          { label: 'UNIVERSITY', value: "City St George's, University of London" },
          { label: 'GRADUATING', value: 'July 2027' },
          { label: 'SEEKING', value: 'Graduate roles and MSc, spacecraft GNC' },
        ]}
      />

      <ExperienceList items={EXPERIENCE} />
    </div>
  );
}
