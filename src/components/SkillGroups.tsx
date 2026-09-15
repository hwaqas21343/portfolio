import { SKILLS } from '../data/skills';
import styles from './SkillGroups.module.css';

export default function SkillGroups() {
  return (
    <ul className={styles.skills}>
      {SKILLS.map(({ group, items }) => (
        <li key={group} className={styles.skillGroup}>
          <p className="eyebrow">{group}</p>
          <ul className={styles.chips}>
            {items.map((item) => (
              <li key={item} className={styles.chip}>
                {item}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}
