import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateForm from './pages/CreateFrom';
import PreviewForm from './pages/PreviewForm';
import MyForms from './pages/MyForms';
import Navbar from './components/Navbar';
import 'react-toastify/dist/ReactToastify.css';
import LandingPage from './pages/LandingPage';
import ToastTestPage from './pages/testingPage';

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/create" element={<CreateForm />} />
          <Route path="/preview" element={<PreviewForm />} />
          <Route path="/myforms" element={<MyForms />} />
          <Route path="/toast-test" element={<ToastTestPage />} />
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
