import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';

export default function NotFound() {
  return (
    <div className="container">
      <div className="sheet">
      <PageHeader
        eyebrow="404"
        title="Off nominal"
        lede="That page doesn't exist, or hasn't been built yet."
      />
      <p style={{ marginTop: 'var(--s-6)' }}>
        <Link to="/projects">← Back to the projects</Link>
      </p>
      </div>
    </div>
  );
}
