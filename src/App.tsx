import { Routes, Route, Navigate } from 'react-router-dom';
import TerminalShell from './pages/TerminalShell';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<TerminalShell />} />
      <Route path="/about" element={<TerminalShell />} />
      <Route path="/resume" element={<TerminalShell />} />
      <Route path="/contact" element={<TerminalShell />} />
      <Route path="/projects" element={<TerminalShell />} />
      <Route path="/projects/:slug" element={<TerminalShell />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
