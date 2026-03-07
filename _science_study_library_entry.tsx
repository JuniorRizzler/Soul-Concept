import React from 'react';
import { createRoot } from 'react-dom/client';
import ScienceStudyLibrary from './math/ScienceStudyLibrary';

const rootEl = document.getElementById('root');
if (rootEl) {
  createRoot(rootEl).render(<ScienceStudyLibrary />);
}
