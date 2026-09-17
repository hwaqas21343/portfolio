import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Resume from './pages/Resume';
import AiTransparency from './pages/AiTransparency';
import Projects from './pages/Projects';
import AdcsSimulator from './pages/projects/AdcsSimulator';
import Cage from './pages/projects/Cage';
import Overseer from './pages/projects/Overseer';
import FormulaStudent from './pages/projects/FormulaStudent';
import GasTurbineMl from './pages/projects/GasTurbineMl';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="resume" element={<Resume />} />
        <Route path="contact" element={<Contact />} />
        <Route path="ai-transparency" element={<AiTransparency />} />

        <Route path="projects">
          <Route index element={<Projects />} />
          <Route path="adcs-simulator" element={<AdcsSimulator />} />
          <Route path="cage" element={<Cage />} />
          <Route path="overseer" element={<Overseer />} />
          <Route path="formula-student" element={<FormulaStudent />} />
          <Route path="gas-turbine-ml" element={<GasTurbineMl />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
