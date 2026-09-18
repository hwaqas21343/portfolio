import ImageGallery, { type GalleryImage } from '../ImageGallery';
import { EntryHeader, Rule, TagList } from '../ui';
import styles from './panels.module.css';

export const GAS_TURBINE_IMAGES: GalleryImage[] = [
  {
    src: '/media/gas-turbine-ml/eda-emissions-by-condition.png',
    caption: 'Emissions by combustion regime and operating mode',
    alt: 'Boxplots of CO and NOx emissions split by combustion regime and operating mode',
  },
  {
    src: '/media/gas-turbine-ml/test-co.png',
    caption: 'CO, held-out test set · R² 0.712',
    alt: 'Actual versus predicted CO emissions on the held-out test set',
  },
  {
    src: '/media/gas-turbine-ml/test-nox.png',
    caption: 'NOx, held-out test set · R² 0.652',
    alt: 'Actual versus predicted NOx emissions on the held-out test set',
  },
];

export function GasTurbineBrief() {
  return (
    <div className={styles.stack14}>
      <EntryHeader
        rows={[
          ['DATE', '2025'],
          ['DOMAIN', 'Machine learning'],
          ['TYPE', 'University coursework, 35,499-row sensor dataset'],
          ['STATUS', 'Complete · gradient boosting on both targets'],
        ]}
      />
      <Rule />
      <p className={styles.p}>
        Gas turbines are tightly regulated on two emissions, carbon monoxide and nitrogen oxides.
        Both move with how the turbine is being run, but not in the same way or for the same
        reasons, so a model that predicts them from live sensor data has to treat them as
        genuinely separate problems rather than one shared curve.
      </p>
      <p className={styles.p}>
        I built this as a university coursework project, a complete machine learning pipeline over
        a 35,499-row sensor dataset, from cleaning and exploratory analysis through to a held-out
        test evaluation, working to a fixed train/validation/test split set by the coursework
        brief so every model was compared on equal terms.
      </p>
      <TagList items={['Python', 'scikit-learn', 'Feature engineering', 'Gradient boosting']} />
    </div>
  );
}

interface GalleryDemoProps {
  index: number;
  onPick: (index: number) => void;
}

export function GasTurbineDemo({ index, onPick }: GalleryDemoProps) {
  return (
    <div className={styles.stack12}>
      <EntryHeader rows={[['DATE', '2025'], ['SOURCE', 'Held-out test set · R² 0.712 CO, 0.652 NOx']]} />
      <Rule />
      <p className={styles.p}>
        Four models were compared under a fixed split, polynomial, ridge and lasso regression as
        baselines then a tuned gradient boosting regressor. Gradient boosting won on both targets.
      </p>
      <ImageGallery images={GAS_TURBINE_IMAGES} index={index} onPick={onPick} />
    </div>
  );
}
