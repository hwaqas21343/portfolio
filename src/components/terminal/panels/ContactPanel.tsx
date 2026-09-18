import { CONTACT } from '../../../data/contact';
import { Cells, EntryHeader, LinkBox, Rule } from '../ui';
import styles from './panels.module.css';

export default function ContactPanel() {
  return (
    <div className={styles.stack18}>
      <EntryHeader
        rows={[
          ['DATE', 'September 2026'],
          ['CHANNELS', 'Email · LinkedIn · GitHub'],
          ['AVAILABILITY', 'Open to graduate roles, internships and MSc supervision'],
        ]}
      />
      <Rule />

      <p className={styles.p}>
        Open to graduate roles, internships and MSc supervision conversations in spacecraft GNC,
        dynamics and control.
      </p>

      <Cells
        minWidth={240}
        cells={[
          {
            label: 'EMAIL',
            value: (
              <a href={`mailto:${CONTACT.email}`} style={{ color: 'var(--white)' }}>
                {CONTACT.email}
              </a>
            ),
          },
          { label: 'LOCATION', value: <span style={{ color: 'var(--white)' }}>{CONTACT.location}</span> },
        ]}
      />

      <div className={styles.stack12}>
        <LinkBox
          title="LinkedIn"
          copy="The fuller professional history, roles, the Formula Student team and the things that do not fit on one page of a resume. The best place to reach me if you would rather not email."
          href={CONTACT.linkedin}
          action="OPEN LINKEDIN ▸"
        />
        <LinkBox
          title="GitHub"
          copy="Source for the simulation work behind these projects and for this site. Worth a look if you want to see how the ADCS controller, CAGE radar and the chassis viewer are actually put together."
          href={CONTACT.github}
          action="OPEN GITHUB ▸"
        />
      </div>
    </div>
  );
}
