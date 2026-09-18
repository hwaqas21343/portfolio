import styles from './ImageGallery.module.css';

export interface GalleryImage {
  src: string;
  alt: string;
  caption: string;
}

interface ImageGalleryProps {
  images: GalleryImage[];
  index: number;
  onPick: (index: number) => void;
}

export default function ImageGallery({ images, index, onPick }: ImageGalleryProps) {
  const active = images[index];

  return (
    <>
      <div className={styles.wrap}>
        <div className={styles.plate}>
          <img src={active.src} alt={active.alt} />
        </div>

        <div className={styles.thumbs}>
          {images.map((img, i) => (
            <div
              key={img.src}
              className={styles.thumb}
              data-active={i === index}
              onClick={() => onPick(i)}
              onMouseEnter={() => onPick(i)}
            >
              <img src={img.src} alt="" />
            </div>
          ))}
        </div>
      </div>

      <span className={styles.caption}>{active.caption}</span>
    </>
  );
}
