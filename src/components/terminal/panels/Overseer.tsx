import ImageGallery, { type GalleryImage } from '../ImageGallery';
import { EntryHeader, Rule } from '../ui';
import styles from './panels.module.css';

export const OVERSEER_IMAGES: GalleryImage[] = [
  {
    src: '/media/overseer/hero-cfd.png',
    caption: 'Velocity contour over the low-observable airframe',
    alt: 'CFD velocity contour over the blended low-observable airframe in side profile',
  },
  {
    src: '/media/overseer/cad-mesh.png',
    caption: 'CAD geometry pass',
    alt: 'Wireframe CAD model of the Overseer airframe in side profile',
  },
  {
    src: '/media/overseer/cfd-nose.png',
    caption: 'Nose and leading-edge detail, CFD',
    alt: 'Close-up CFD contour of the nose and forward fuselage',
  },
];

export function OverseerBrief() {
  return (
    <div className={styles.stack14}>
      <EntryHeader
        rows={[
          ['DATE', '2022 – 2026'],
          ['DOMAIN', 'UAV systems'],
          ['TYPE', 'Personal project, fixed-wing airframe'],
          ['STATUS', 'First prototype flown · design iterating on flight data'],
        ]}
      />
      <Rule />
      <p className={styles.p}>
        Overseer is a personal fixed-wing UAV project aimed at delivering low-observable,
        low-cost, autonomous airborne early warning and control (AEW&amp;C) and intelligence,
        surveillance and reconnaissance (ISR) capability in a compact platform. The idea is to
        target the kind of persistent, distributed sensing role traditionally filled by far larger
        and far more expensive crewed or uncrewed aircraft, at a fraction of the cost and radar
        cross-section, by combining a low-observable airframe with a layered onboard sensor suite
        and autonomous operation.
      </p>
      <p className={styles.p}>
        The airframe has been shaped and refined using CFD analysis and a first prototype has
        already flown, with the design now being updated based on the results of that flight.
      </p>
    </div>
  );
}

interface GalleryDemoProps {
  index: number;
  onPick: (index: number) => void;
}

export function OverseerDemo({ index, onPick }: GalleryDemoProps) {
  return (
    <div className={styles.stack12}>
      <EntryHeader rows={[['DATE', '2022 – 2026'], ['SOURCE', 'CFD velocity contours and a CAD geometry pass']]} />
      <Rule />
      <ImageGallery images={OVERSEER_IMAGES} index={index} onPick={onPick} />
    </div>
  );
}
