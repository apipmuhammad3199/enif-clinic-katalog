import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Admin from './pages/Admin';
import VideoGallery from './pages/VideoGallery';
import Socials from './pages/Socials';
import Booking from './pages/Booking';
import Promo50 from './pages/Promo50';
import Promo45 from './pages/Promo45';
import Products from './pages/Products';
import AllTreatment from './pages/AllTreatment';
import PromoTreatment from './pages/PromoTreatment';
import Articles from './pages/Articles';
import { CMSProvider } from './context/CMSContext';

function App() {
  return (
    <CMSProvider>
      {/* 
        Using HashRouter is the most robust way to handle client-side routing
        on GitHub Pages without needing special 404.html redirects.
      */}
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/treatments" element={<AllTreatment />} />
          <Route path="/promo" element={<PromoTreatment />} />
          <Route path="/promo-50" element={<Promo50 />} />
          <Route path="/promo-45" element={<Promo45 />} />
          <Route path="/products" element={<Products />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/videos" element={<VideoGallery />} />
          <Route path="/socials" element={<Socials />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Router>
    </CMSProvider>
  );
}

export default App;
