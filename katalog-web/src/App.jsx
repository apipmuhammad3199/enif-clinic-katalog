import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import 'aos/dist/aos.css';
import Home from './pages/Home';
import Login from './pages/Login';
import Admin from './pages/Admin';
import VideoGallery from './pages/VideoGallery';
import Socials from './pages/Socials';
import Booking from './pages/Booking';
import Promo50 from './pages/Promo50';
import Promo55 from './pages/Promo55';
import Promo45 from './pages/Promo45';
import Products from './pages/Products';
import AllTreatment from './pages/AllTreatment';
import PromoTreatment from './pages/PromoTreatment';
import Articles from './pages/Articles';
import Perawatan from './pages/Perawatan';
import BeforeAfter from './pages/BeforeAfter';
import { CMSProvider } from './context/CMSContext';

const ProtectedRoute = ({ children }) => {
  const isAuth = localStorage.getItem('cms_auth') === 'true';
  return isAuth ? children : <Navigate to="/login" replace />;
};

// Setiap pindah halaman selalu mulai dari paling atas —
// tanpa ini browser kadang mempertahankan posisi scroll halaman sebelumnya.
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    // 'instant' mengabaikan scroll-behavior:smooth global — tanpa ini halaman
    // baru terlihat "mulai di tengah" lalu merayap pelan ke atas.
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
};

function App() {
  return (
    <CMSProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/treatments" element={<AllTreatment />} />
          <Route path="/promo" element={<PromoTreatment />} />
          <Route path="/promo-50" element={<Promo50 />} />
          <Route path="/promo-55" element={<Promo55 />} />
          <Route path="/promo-45" element={<Promo45 />} />
          <Route path="/products" element={<Products />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/perawatan" element={<Perawatan />} />
          <Route path="/before-after" element={<BeforeAfter />} />
          <Route path="/videos" element={<VideoGallery />} />
          <Route path="/socials" element={<Socials />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        </Routes>
      </Router>
    </CMSProvider>
  );
}

export default App;
