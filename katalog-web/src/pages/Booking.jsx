import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

function Booking() {
  const timeSlots = [
    "11:00", "11:30", "12:00", "12:30", 
    "13:00", "13:30", "14:00", "14:30", 
    "15:00", "15:30", "16:00", "16:30", "17:00"
  ];

  const [searchParams] = useSearchParams();
  const initialTreatment = searchParams.get('treatment') || '';

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    status: 'Baru',
    whatsapp: '',
    date: '',
    time: '',
    treatment: initialTreatment,
  });

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBooking = (e) => {
    e.preventDefault();
    
    // Construct the WhatsApp message
    const message = `Selamat Datang di Layanan Booking Online Enef Clinic

Kami informasikan, slot booking dibuka mulai jam 11.00 - 17.00
Booking maksimal H-1 sebelum kedatangan

*Proses verifikasi data*
Nama sesuai kartu identitas : ${formData.name}
Alamat sesuai kartu identitas : ${formData.address}
Pasien Lama atau Baru : ${formData.status}
Nomor Whatsapp : ${formData.whatsapp}

*Reservasi treatment*
Hari dan tanggal : ${formData.date}
Jam : ${formData.time}
Treatment : ${formData.treatment}

Mohon sertakan foto KTP jika belum pernah terdaftar di Enef Clinic.`;

    const encodedMessage = encodeURIComponent(message);
    const waNumber = '628214464406';
    const waUrl = `https://wa.me/${waNumber}?text=${encodedMessage}`;
    
    window.open(waUrl, '_blank');
  };

  return (
    <div className="app-container" style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      {/* Minimal Header */}
      <header className="header" style={{ backgroundColor: '#fff', borderBottom: '1px solid #eaeaea' }}>
        <div className="logo-container">
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', gap: '10px' }}>
            <img src={`${import.meta.env.BASE_URL}assets/logo.jpg`} alt="Enef Clinic Logo" className="logo" />
            <div className="clinic-name">Enef Clinic</div>
          </Link>
        </div>
        <div className="social-links">
          <Link to="/" className="contact-us-btn">
            Kembali ke Beranda
          </Link>
        </div>
      </header>

      <div className="booking-page-container" style={{ paddingTop: '2rem', minHeight: 'auto', alignItems: 'flex-start', paddingBottom: '4rem' }}>
        <div className="booking-card" data-aos="fade-up">
        <div className="booking-header">
          <h2>Booking Online Enef Clinic</h2>
          <p className="booking-rules">
            Slot booking dibuka mulai jam <strong>11.00 - 17.00</strong><br/>
            Booking maksimal <strong>H-1</strong> sebelum kedatangan.<br/>
            Mohon sertakan foto KTP pada pesan WhatsApp jika Anda pasien baru.
          </p>
        </div>

        <form onSubmit={handleBooking} className="booking-form">
          <div className="form-section">
            <h3>Proses Verifikasi Data</h3>
            
            <div className="form-group">
              <label>Nama sesuai kartu identitas :</label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="Contoh: Budi Santoso" />
            </div>

            <div className="form-group">
              <label>Alamat sesuai kartu identitas :</label>
              <textarea name="address" required value={formData.address} onChange={handleChange} placeholder="Contoh: Jl. Melati No. 10..." rows="2"></textarea>
            </div>

            <div className="form-group">
              <label>Pasien Lama atau Baru :</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="Baru">Baru (Belum pernah terdaftar)</option>
                <option value="Lama">Lama (Sudah pernah terdaftar)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Nomor WhatsApp :</label>
              <input type="tel" name="whatsapp" required value={formData.whatsapp} onChange={handleChange} placeholder="Contoh: 08123456789" />
            </div>
          </div>

          <div className="form-section">
            <h3>Reservasi Treatment</h3>
            
            <div className="form-group">
              <label>Hari dan tanggal :</label>
              <input type="date" name="date" required value={formData.date} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Jam :</label>
              <div className="time-slots-grid">
                {timeSlots.map(t => (
                  <button 
                    key={t}
                    type="button" 
                    className={`time-slot-btn ${formData.time === t ? 'active' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, time: t }))}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <input type="text" name="time" required value={formData.time} style={{opacity: 0, height: 0, position: 'absolute'}} onChange={() => {}} />
            </div>

            <div className="form-group">
              <label>Treatment :</label>
              <input type="text" name="treatment" required value={formData.treatment} onChange={handleChange} placeholder="Contoh: Facial Acne" />
            </div>
          </div>

          <button type="submit" className="booking-submit-btn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="20" height="20" fill="currentColor"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zM223.9 414.8c-33 0-65.4-8.9-94-25.7l-6.7-4-69.8 18.3L72 334.1l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg>
            Kirim Booking via WhatsApp
          </button>
        </form>
      </div>
    </div>
    </div>
  );
}

export default Booking;
