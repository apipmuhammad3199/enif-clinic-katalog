import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CMSContext } from '../context/CMSContext';

function Admin() {
  const navigate = useNavigate();
  const { 
    treatments, addTreatment, removeTreatment,
    promos, addPromo, removePromo,
    videos, addVideo, removeVideo,
    promoSettings, updatePromoSettings
  } = useContext(CMSContext);

  const [activeTab, setActiveTab] = useState('promo');
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, message: '', onConfirm: null });

  const showNotification = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  useEffect(() => {
    const isAuth = localStorage.getItem('cms_auth');
    if (!isAuth) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('cms_auth');
    navigate('/login');
  };

  const handleFileChange = (e, callback) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      callback(url);
    }
  };

  const handleAddPromo = (url) => {
    addPromo(url);
    showNotification('Promo Slider berhasil ditambahkan!');
  };

  // Treatment State
  const [treatmentName, setTreatmentName] = useState('');
  const [treatmentDesc, setTreatmentDesc] = useState('');
  const [treatmentPrice, setTreatmentPrice] = useState('');
  const [treatmentDiscount, setTreatmentDiscount] = useState('0');
  const [treatmentPdf, setTreatmentPdf] = useState('');
  const [treatmentStartDate, setTreatmentStartDate] = useState('');
  const [treatmentEndDate, setTreatmentEndDate] = useState('');

  const handlePriceChange = (e) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    if (!rawValue) {
      setTreatmentPrice('');
      return;
    }
    const formatted = new Intl.NumberFormat('id-ID').format(rawValue);
    setTreatmentPrice(`Rp. ${formatted}`);
  };

  const handleAddTreatment = (e) => {
    e.preventDefault();
    addTreatment({
      name: treatmentName,
      description: treatmentDesc,
      price: treatmentPrice,
      discount: parseInt(treatmentDiscount, 10),
      startDate: treatmentStartDate,
      endDate: treatmentEndDate,
      pdfLink: treatmentPdf || "#"
    });
    setTreatmentName('');
    setTreatmentDesc('');
    setTreatmentPrice('');
    setTreatmentDiscount('0');
    setTreatmentStartDate('');
    setTreatmentEndDate('');
    setTreatmentPdf('');
    showNotification('Treatment berhasil ditambahkan!');
  };

  // Video State
  const [videoTitle, setVideoTitle] = useState('');
  const [videoSrc, setVideoSrc] = useState('');

  const handleAddVideo = (e) => {
    e.preventDefault();
    addVideo({ title: videoTitle, src: videoSrc });
    setVideoTitle('');
    setVideoSrc('');
    showNotification('Video berhasil ditambahkan!');
  };

  const handleRemovePromo = (id) => {
    setConfirmDialog({
      isOpen: true,
      message: 'Apakah Anda yakin ingin menghapus promo slider ini?',
      onConfirm: () => {
        removePromo(id);
        showNotification('Promo slider berhasil dihapus!');
        setConfirmDialog({ isOpen: false, message: '', onConfirm: null });
      }
    });
  };

  const handleRemoveTreatment = (id) => {
    setConfirmDialog({
      isOpen: true,
      message: 'Apakah Anda yakin ingin menghapus treatment ini?',
      onConfirm: () => {
        removeTreatment(id);
        showNotification('Treatment berhasil dihapus!');
        setConfirmDialog({ isOpen: false, message: '', onConfirm: null });
      }
    });
  };

  const handleRemoveVideo = (id) => {
    setConfirmDialog({
      isOpen: true,
      message: 'Apakah Anda yakin ingin menghapus video ini?',
      onConfirm: () => {
        removeVideo(id);
        showNotification('Video berhasil dihapus!');
        setConfirmDialog({ isOpen: false, message: '', onConfirm: null });
      }
    });
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem', padding: '0 1rem' }}>
          <img src={`${import.meta.env.BASE_URL}assets/logo.jpg`} alt="Logo" style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px', objectFit: 'cover' }} />
          <h2 style={{ marginBottom: 0, padding: 0 }}>Enef CMS</h2>
        </div>
        <div className="sidebar-menu">
          <button 
            className={`sidebar-btn ${activeTab === 'promo' ? 'active' : ''}`}
            onClick={() => setActiveTab('promo')}
          >
             Kelola Promo
          </button>
          <button 
            className={`sidebar-btn ${activeTab === 'treatment' ? 'active' : ''}`}
            onClick={() => setActiveTab('treatment')}
          >
             Kelola Treatment
          </button>
          <button 
            className={`sidebar-btn ${activeTab === 'video' ? 'active' : ''}`}
            onClick={() => setActiveTab('video')}
          >
             Kelola Video
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <h1>Dashboard Overview</h1>
          <div>
            <button className="admin-btn admin-btn-outline" onClick={() => navigate('/')} style={{ marginRight: '1rem' }}>
              Lihat Website
            </button>
            <button className="admin-btn admin-btn-danger" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        {activeTab === 'promo' && (
          <div className="admin-card">

            <h3 style={{ borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>Tambah Promo Slider Baru</h3>
            <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1.5rem' }}>*Upload gambar untuk slider halaman depan (Mode Demo).</p>
            <div className="admin-form-group">
              <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, handleAddPromo)} className="admin-input" />
            </div>
            
            <h3 style={{ marginTop: '3rem' }}>Daftar Promo Saat Ini</h3>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              {promos.map((promo, idx) => (
                <div key={promo.id || idx} style={{ position: 'relative', border: '1px solid #eee', borderRadius: '12px', overflow: 'hidden' }}>
                  <img src={promo.url || promo} alt="promo" style={{ width: '200px', height: '120px', objectFit: 'cover', display: 'block' }} />
                  <button onClick={() => handleRemovePromo(promo.id)} className="admin-btn admin-btn-danger" style={{ position: 'absolute', top: '5px', right: '5px', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Hapus</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'treatment' && (
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
            <div className="admin-card" style={{ flex: 1 }}>
              <h3>Tambah Treatment Baru</h3>
              <form onSubmit={handleAddTreatment}>
                <div className="admin-form-group">
                  <label>Nama Treatment</label>
                  <input type="text" className="admin-input" placeholder="Masukkan nama treatment" value={treatmentName} onChange={e => setTreatmentName(e.target.value)} required />
                </div>
                <div className="admin-form-group">
                  <label>Deskripsi (Opsional)</label>
                  <textarea className="admin-input" placeholder="Tuliskan deskripsi singkat" value={treatmentDesc} onChange={e => setTreatmentDesc(e.target.value)} rows="3" />
                </div>
                <div className="admin-form-group">
                  <label>Harga Normal (Opsional)</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    placeholder="Kosongkan jika harga sudah ada di PDF" 
                    value={treatmentPrice} 
                    onChange={handlePriceChange} 
                  />
                </div>
                <div className="admin-form-group">
                  <label>Pilih Diskon</label>
                  <select className="admin-input" value={treatmentDiscount} onChange={e => setTreatmentDiscount(e.target.value)}>
                    <option value="0">Tidak Ada Diskon</option>
                    <option value="45">Diskon 45%</option>
                    <option value="50">Diskon 50%</option>
                  </select>
                </div>
                {(treatmentDiscount === '45' || treatmentDiscount === '50') && (
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ flex: 1 }}>
                      <label>Berlaku Dari</label>
                      <input type="date" className="admin-input" value={treatmentStartDate} onChange={e => setTreatmentStartDate(e.target.value)} required />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label>Hingga</label>
                      <input type="date" className="admin-input" value={treatmentEndDate} onChange={e => setTreatmentEndDate(e.target.value)} required />
                    </div>
                  </div>
                )}
                <div className="admin-form-group">
                  <label>Upload PDF Brosur (Opsional - Demo Lokal)</label>
                  <input type="file" accept=".pdf" className="admin-input" onChange={(e) => handleFileChange(e, setTreatmentPdf)} />
                </div>
                <button type="submit" className="admin-btn" style={{ width: '100%' }}>Simpan Treatment</button>
              </form>
            </div>

            <div className="admin-card" style={{ flex: 1 }}>
              <h3>Daftar Treatment</h3>
              <div>
                {treatments.map((t, idx) => (
                  <div key={t.id || idx} className="admin-list-item">
                    <div>
                      <div style={{ fontWeight: '600', color: '#222' }}>{t.name}</div>
                      <div style={{ fontSize: '0.9rem', color: '#666' }}>{t.price} {t.discount > 0 && <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>({t.discount}%)</span>}</div>
                      {t.discount > 0 && t.startDate && t.endDate && (
                        <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.2rem' }}>
                          Promo: {t.startDate} s/d {t.endDate}
                        </div>
                      )}
                    </div>
                    <button onClick={() => handleRemoveTreatment(t.id)} className="admin-btn admin-btn-danger" style={{ padding: '0.5rem 1rem' }}>Hapus</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'video' && (
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
            <div className="admin-card" style={{ flex: 1 }}>
              <h3>Tambah Video Baru</h3>
              <form onSubmit={handleAddVideo}>
                <div className="admin-form-group">
                  <label>Judul Video</label>
                  <input type="text" className="admin-input" placeholder="Masukkan judul video" value={videoTitle} onChange={e => setVideoTitle(e.target.value)} required />
                </div>
                <div className="admin-form-group">
                  <label>Upload File Video (Demo Lokal)</label>
                  <input type="file" accept="video/*" className="admin-input" required onChange={(e) => handleFileChange(e, setVideoSrc)} />
                </div>
                <button type="submit" className="admin-btn" style={{ width: '100%' }}>Simpan Video</button>
              </form>
            </div>

            <div className="admin-card" style={{ flex: 1 }}>
              <h3>Daftar Video</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {videos.map((v, idx) => (
                  <div key={v.id || idx} className="admin-list-item" style={{ alignItems: 'flex-start' }}>
                    <video src={v.src} style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: '8px', background: '#000' }}></video>
                    <div style={{ flex: 1, marginLeft: '1rem' }}>
                      <div style={{ fontWeight: '600' }}>{v.title}</div>
                    </div>
                    <button onClick={() => handleRemoveVideo(v.id)} className="admin-btn admin-btn-danger" style={{ padding: '0.5rem 1rem' }}>Hapus</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Custom Toast Notification */}
      <div className={`admin-toast ${showToast ? 'show' : ''}`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <span>{toastMessage}</span>
      </div>

      {/* Custom Confirm Dialog Modal */}
      {confirmDialog.isOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 10000,
          backdropFilter: 'blur(3px)'
        }}>
          <div style={{
            background: 'white',
            padding: '2.5rem 2rem',
            borderRadius: '16px',
            width: '90%',
            maxWidth: '380px',
            textAlign: 'center',
            boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
            animation: 'scaleIn 0.2s ease-out'
          }}>
            <div style={{ 
              width: '60px', height: '60px', borderRadius: '50%', background: '#fff0f0', 
              color: '#ff4757', display: 'flex', alignItems: 'center', justifyContent: 'center', 
              margin: '0 auto 1.5rem auto'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              </svg>
            </div>
            <h3 style={{ margin: '0 0 0.8rem 0', color: '#222', fontSize: '1.3rem' }}>Konfirmasi Hapus</h3>
            <p style={{ color: '#666', margin: '0 0 2rem 0', fontSize: '0.95rem', lineHeight: '1.5' }}>
              {confirmDialog.message}
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button 
                onClick={() => setConfirmDialog({ isOpen: false, message: '', onConfirm: null })} 
                className="admin-btn admin-btn-outline" 
                style={{ flex: 1, padding: '0.7rem' }}
              >
                Batal
              </button>
              <button 
                onClick={confirmDialog.onConfirm} 
                className="admin-btn admin-btn-danger" 
                style={{ flex: 1, padding: '0.7rem' }}
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Admin;
