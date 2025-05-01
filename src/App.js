import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './Components/HomePage';
import FormPage from './Components/FormPage';
import ItemViewPage from './Components/ItemViewPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/form" element={<FormPage />} />
        <Route path="/item/:id" element={<ItemViewPage />} />
      </Routes>
    </Router>
  );
}

export default App;
