import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CMSContext } from '../context/CMSContext';

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const uploadFileToBase64 = async (file) => {
  if (!file) return null;
  return await fileToBase64(file);
};

const compressImageToBase64 = async (file, maxWidth = 800) => {
  if (!file) return null;
  if (!file.type.startsWith('image/')) {
    return await fileToBase64(file); // For PDFs and non-images
  }
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Return Base64 string directly
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        resolve(dataUrl);
      };
      img.onerror = (err) => resolve(event.target.result); // Fallback to uncompressed Base64
    };
    reader.onerror = (err) => reject(err);
  });
};

function Admin() {
  const navigate = useNavigate();
  const { 
    treatments, addTreatment, updateTreatment, removeTreatment,
    promos, addPromo, updatePromo, removePromo,
    videos, addVideo, updateVideo, removeVideo,
    promoSettings, updatePromoSettings,
    skincareProducts, addSkincare, updateSkincare, removeSkincare,
    perawatanPDFs, addPerawatanPDF, updatePerawatanPDF, removePerawatanPDF,
    beforeAfterImages, addBeforeAfter, updateBeforeAfter, removeBeforeAfter,
    users, addUser, removeUser,
    testimonials, addTestimonial, updateTestimonial, removeTestimonial,
    articles, addArticle, updateArticle, removeArticle
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

  const handleSyncLocalPDFs = async () => {
    try {
      const localPdfs = [
        "ACNE TREATMENT.pdf", "BODY CONTOUR.pdf", "BODY TREATMENT2.pdf", "BOTOX TREATMENT.pdf",
        "CAUTER.pdf", "FACE CONTOUR TREATMENT.pdf", "FACIAL TREATMENT.pdf", "FILLER.pdf",
        "GLOWING TREATMENT.pdf", "HAIR REMOVEL TRATMENT.pdf", "INJECTION TREATMENT.pdf",
        "LASER TREATMENT.pdf", "LUXURY SKINBOOSTER.pdf", "MASSAGE BADAN.pdf",
        "MELASMA FLEK TREATMENT.pdf", "MESOLIPO.pdf", "PAKET BODY CONTOUR.pdf",
        "PEELING.pdf", "RADIO FREQUENCY.pdf", "SCAR TREATMENT.pdf", "SUBSISI.pdf",
        "THREADLIFT..pdf", "TUNGGAL TREATMENT.pdf", "WHITENING TREATMENT.pdf"
      ];

      let synced = 0;

      for (const filename of localPdfs) {
        const cleanName = filename.replace(/\.+pdf$/i, '').trim();
        const existingTreatment = treatments.find(t => t.name?.trim().toLowerCase() === cleanName.toLowerCase());
        const pdfLink = `${import.meta.env.BASE_URL}assets/perawatan/${filename}`;

        if (existingTreatment) {
          if (!existingTreatment.pdfLink || existingTreatment.pdfLink !== pdfLink) {
            await updateTreatment(existingTreatment.id, { pdfLink });
            synced++;
          }
        } else {
          await addTreatment({
            name: cleanName,
            description: '',
            price: '',
            discount: 0,
            startDate: '',
            endDate: '',
            pdfLink
          });
          synced++;
        }
      }

      showNotification(`Berhasil! ${synced} item perawatan disinkronisasi dengan PDF lokal.`);
    } catch (error) {
      console.error("Error syncing PDFs:", error);
      showNotification("Terjadi kesalahan saat mensinkronisasi.");
    }
  };


  const handleFileChange = (e, callback) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      callback(url);
    }
  };

  const [promoFile, setPromoFile] = useState(null);
  const [uploadingPromo, setUploadingPromo] = useState(false);
  const [editingPromoId, setEditingPromoId] = useState(null);

  const handleAddPromo = async (e) => {
    e.preventDefault();
    if (!promoFile && !editingPromoId) {
      showNotification('Pilih gambar promo terlebih dahulu!');
      return;
    }
    
    if (editingPromoId && !promoFile) {
      showNotification('Tidak ada perubahan gambar.');
      setEditingPromoId(null);
      return;
    }

    setUploadingPromo(true);
    try {
      let url = null;
      if (promoFile) {
        url = await compressImageToBase64(promoFile);
      }

      if (editingPromoId) {
        if (url) {
          updatePromo(editingPromoId, { url });
        }
        setEditingPromoId(null);
        showNotification('Promo berhasil diubah!');
      } else {
        addPromo(url);
        showNotification('Promo berhasil ditambahkan!');
      }
      
      setPromoFile(null); 
      setUploadingPromo(false);
      const fileInput = document.getElementById('promoFileInput');
      if (fileInput) fileInput.value = '';
    } catch (err) {
      console.error("Upload error: ", err);
      setUploadingPromo(false);
      showNotification('Gagal upload: ' + (err.message || 'Error tidak diketahui'));
    }
  };

  const handleEditPromoClick = (promo) => {
    setEditingPromoId(promo.id);
    showNotification('Silakan upload gambar baru untuk mengubah promo ini.');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  // --- Skincare State ---
  const [skincareName, setSkincareName] = useState('');
  const [skincarePrice, setSkincarePrice] = useState('');
  const [skincareDesc, setSkincareDesc] = useState('');
  const [skincareFile, setSkincareFile] = useState(null);
  const [uploadingSkincare, setUploadingSkincare] = useState(false);
  const [editingSkincareId, setEditingSkincareId] = useState(null);

  const handleEditSkincare = (p) => {
    setEditingSkincareId(p.id);
    setSkincareName(p.name);
    setSkincarePrice(p.price || '');
    setSkincareDesc(p.description || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddSkincare = async (e) => {
    e.preventDefault();
    if (!skincareName) {
      showNotification('Nama produk wajib diisi!');
      return;
    }
    if (!skincareFile && !editingSkincareId) {
      showNotification('Foto produk wajib diisi!');
      return;
    }
    setUploadingSkincare(true);
    try {
      let url = null;
      if (skincareFile) {
        url = await compressImageToBase64(skincareFile);
      }
      
      if (editingSkincareId) {
        const updateData = { name: skincareName, price: skincarePrice, description: skincareDesc };
        if (url) updateData.image = url;
        updateSkincare(editingSkincareId, updateData);
        setEditingSkincareId(null);
        showNotification('Produk berhasil diubah!');
      } else {
        addSkincare({ name: skincareName, price: skincarePrice, description: skincareDesc, image: url });
        showNotification('Produk berhasil ditambahkan!');
      }
      setSkincareName(''); setSkincarePrice(''); setSkincareDesc(''); setSkincareFile(null); 
      setUploadingSkincare(false);
      const inputs = document.querySelectorAll('input[type="file"]');
      inputs.forEach(i => i.value = '');
    } catch (err) {
      console.error("Upload error: ", err);
      setUploadingSkincare(false);
      showNotification('Gagal upload: ' + (err.message || 'Error tidak diketahui'));
    }
  };

  // --- Before After State ---
  const [baTitle, setBaTitle] = useState('');
  const [baFile, setBaFile] = useState(null);
  const [uploadingBa, setUploadingBa] = useState(false);
  const [editingBaId, setEditingBaId] = useState(null);

  const handleEditBa = (ba) => {
    setEditingBaId(ba.id);
    setBaTitle(ba.title === "Treatment By Enef Clinic" ? "" : ba.title);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddBeforeAfter = async (e) => {
    e.preventDefault();
    if (!baFile && !editingBaId) {
      showNotification('Foto Before-After wajib diisi!');
      return;
    }
    setUploadingBa(true);
    
    try {
      let url = null;
      if (baFile) {
        url = await compressImageToBase64(baFile);
      }
      
      const title = baTitle || "Treatment By Enef Clinic";
      const doctor = "Treatment by : dr. Enef";
      
      if (editingBaId) {
        const updateData = { title, doctor };
        if (url) updateData.img = url;
        updateBeforeAfter(editingBaId, updateData);
        setEditingBaId(null);
        showNotification('Foto berhasil diubah!');
      } else {
        addBeforeAfter({ title, img: url, doctor });
        showNotification('Foto berhasil ditambahkan!');
      }

      setBaTitle(''); setBaFile(null); 
      setUploadingBa(false);
      const inputs = document.querySelectorAll('input[type="file"]');
      inputs.forEach(i => i.value = '');
    } catch (err) {
      console.error("Upload error: ", err);
      setUploadingBa(false);
      showNotification('Gagal upload: ' + (err.message || 'Error tidak diketahui'));
    }
  };

  // --- Users State ---
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newUsername || !newPassword) return;
    if (users.some(u => u.username === newUsername)) {
      showNotification('Username sudah ada!');
      return;
    }
    addUser({ username: newUsername, password: newPassword });
    setNewUsername(''); setNewPassword('');
    showNotification('User berhasil ditambahkan!');
  };

  // --- Testimonial State ---
  const [testiName, setTestiName] = useState('');
  const [testiTreatment, setTestiTreatment] = useState('');
  const [testiQuote, setTestiQuote] = useState('');
  const [testiFile, setTestiFile] = useState(null);
  const [uploadingTesti, setUploadingTesti] = useState(false);
  const [editingTestiId, setEditingTestiId] = useState(null);

  const handleEditTestimonial = (t) => {
    setEditingTestiId(t.id);
    setTestiName(t.name);
    setTestiTreatment(t.treatment);
    setTestiQuote(t.quote);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddTestimonial = async (e) => {
    e.preventDefault();
    if (!testiName || !testiTreatment || !testiQuote) {
      showNotification('Nama, treatment, dan ulasan wajib diisi!');
      return;
    }
    
    setUploadingTesti(true);
    
    try {
      let url = '';
      if (testiFile) {
        url = await compressImageToBase64(testiFile);
      }
      
      if (editingTestiId) {
        const updateData = { name: testiName, treatment: testiTreatment, quote: testiQuote };
        if (url) updateData.image = url;
        updateTestimonial(editingTestiId, updateData);
        showNotification('Testimoni berhasil diubah!');
      } else {
        addTestimonial({ name: testiName, treatment: testiTreatment, quote: testiQuote, image: url });
        showNotification('Testimoni berhasil ditambahkan!');
      }
      
      setTestiName(''); setTestiTreatment(''); setTestiQuote(''); setTestiFile(null); 
      setUploadingTesti(false); setEditingTestiId(null);
      const inputs = document.querySelectorAll('input[type="file"]');
      inputs.forEach(i => i.value = '');
    } catch (err) {
      console.error("Upload error: ", err);
      setUploadingTesti(false);
      showNotification('Gagal upload: ' + (err.message || 'Error tidak diketahui'));
    }
  };

  // --- Article State ---
  const [articleTitle, setArticleTitle] = useState('');
  const [articleSummary, setArticleSummary] = useState('');
  const [articleFile, setArticleFile] = useState(null);
  const [uploadingArticle, setUploadingArticle] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState(null);

  const handleEditArticle = (a) => {
    setEditingArticleId(a.id);
    setArticleTitle(a.title);
    setArticleSummary(a.summary);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddArticle = async (e) => {
    e.preventDefault();
    if (!articleTitle || !articleSummary) {
      showNotification('Judul dan ringkasan wajib diisi!');
      return;
    }
    if (!articleFile && !editingArticleId) {
      showNotification('Gambar artikel wajib diisi!');
      return;
    }

    setUploadingArticle(true);
    
    try {
      let url = null;
      if (articleFile) {
        url = await compressImageToBase64(articleFile);
      }
      
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      const date = new Date().toLocaleDateString('id-ID', options);
      
      if (editingArticleId) {
        const updateData = { title: articleTitle, summary: articleSummary };
        if (url) updateData.image = url;
        updateArticle(editingArticleId, updateData);
        setEditingArticleId(null);
        showNotification('Artikel berhasil diubah!');
      } else {
        addArticle({ title: articleTitle, summary: articleSummary, image: url, date });
        showNotification('Artikel berhasil ditambahkan!');
      }
      
      setArticleTitle(''); setArticleSummary(''); setArticleFile(null); 
      setUploadingArticle(false);
      const inputs = document.querySelectorAll('input[type="file"]');
      inputs.forEach(i => i.value = '');
    } catch (err) {
      console.error("Upload error: ", err);
      setUploadingArticle(false);
      showNotification('Gagal upload: ' + (err.message || 'Error tidak diketahui'));
    }
  };

  // Treatment State
  const [treatmentName, setTreatmentName] = useState('');
  const [treatmentDesc, setTreatmentDesc] = useState('');
  const [treatmentPrice, setTreatmentPrice] = useState('');
  const [treatmentDiscount, setTreatmentDiscount] = useState('0');
  const [treatmentPdf, setTreatmentPdf] = useState('');
  const [treatmentPdfFile, setTreatmentPdfFile] = useState(null);
  const [treatmentStartDate, setTreatmentStartDate] = useState('');
  const [treatmentEndDate, setTreatmentEndDate] = useState('');
  const [treatmentImageFile, setTreatmentImageFile] = useState(null);
  const [uploadingTreatmentImage, setUploadingTreatmentImage] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const handleEditTreatment = (t) => {
    setEditingId(t.id);
    setTreatmentName(t.name || '');
    setTreatmentDesc(t.description || '');
    setTreatmentPrice(t.price || '');
    setTreatmentDiscount(t.discount ? t.discount.toString() : '0');
    setTreatmentStartDate(t.startDate || '');
    setTreatmentEndDate(t.endDate || '');
    setTreatmentPdf(t.pdfLink === "#" ? '' : (t.pdfLink || ''));
    setTreatmentPdfFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTreatmentName('');
    setTreatmentDesc('');
    setTreatmentPrice('');
    setTreatmentDiscount('0');
    setTreatmentStartDate('');
    setTreatmentEndDate('');
    setTreatmentPdf('');
    setTreatmentPdfFile(null);
    setTreatmentImageFile(null);
  };

  const handlePriceChange = (e) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    if (!rawValue) {
      setTreatmentPrice('');
      return;
    }
    const formatted = new Intl.NumberFormat('id-ID').format(rawValue);
    setTreatmentPrice(`Rp. ${formatted}`);
  };

  const handleAddTreatment = async (e) => {
    e.preventDefault();
    setUploadingTreatmentImage(true);
    
    try {
      let imageUrl = '';
      
      if (treatmentImageFile) {
        imageUrl = await compressImageToBase64(treatmentImageFile);
      }
      
      let finalPdfUrl = treatmentPdf;
      if (treatmentPdfFile) {
        finalPdfUrl = await uploadFileToBase64(treatmentPdfFile);
      }
      
      const data = {
        name: treatmentName,
        description: treatmentDesc,
        price: treatmentPrice,
        discount: parseInt(treatmentDiscount, 10),
        startDate: treatmentStartDate,
        endDate: treatmentEndDate,
        pdfLink: finalPdfUrl || "#"
      };
      
      if (imageUrl) {
        data.image = imageUrl;
      }

      if (editingId) {
        updateTreatment(editingId, data);
        showNotification('Treatment berhasil diubah!');
      } else {
        addTreatment(data);
        showNotification('Treatment berhasil ditambahkan!');
      }

      setTreatmentName('');
      setTreatmentDesc('');
      setTreatmentPrice('');
      setTreatmentDiscount('0');
      setTreatmentStartDate('');
      setTreatmentEndDate('');
      setTreatmentPdf('');
      setTreatmentPdfFile(null);
      setTreatmentImageFile(null);
      setUploadingTreatmentImage(false);
      setEditingId(null);
      
      const inputs = document.querySelectorAll('input[type="file"]');
      inputs.forEach(i => i.value = '');
    } catch (err) {
      console.error("Upload error: ", err);
      setUploadingTreatmentImage(false);
      showNotification('Gagal upload: ' + (err.message || 'Error tidak diketahui'));
    }
  };

  // Video State
  const [videoTitle, setVideoTitle] = useState('');
  const [videoSrc, setVideoSrc] = useState('');
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [editingVideoId, setEditingVideoId] = useState(null);

  const handleEditVideo = (video) => {
    setEditingVideoId(video.id);
    setVideoTitle(video.title || '');
    setVideoSrc(video.src.includes('firebasestorage') ? '' : video.src);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetVideoForm = () => {
    setVideoTitle('');
    setVideoSrc('');
    setUploadingVideo(false);
    setEditingVideoId(null);
  };

  const handleAddVideo = async (e) => {
    e.preventDefault();
    if (!videoTitle) {
      showNotification('Judul video wajib diisi!');
      return;
    }

    if (videoSrc) {
      let finalSrc = videoSrc.trim();
      
      // Auto-convert YouTube links to embed format
      if (finalSrc.includes('youtube.com/watch?v=')) {
        const videoId = finalSrc.split('v=')[1].split('&')[0];
        finalSrc = `https://www.youtube.com/embed/${videoId}`;
      } else if (finalSrc.includes('youtu.be/')) {
        const videoId = finalSrc.split('youtu.be/')[1].split('?')[0];
        finalSrc = `https://www.youtube.com/embed/${videoId}`;
      }
      // Auto-convert Instagram links to embed format
      else if (finalSrc.includes('instagram.com') && !finalSrc.includes('/embed')) {
        finalSrc = finalSrc.split('?')[0]; 
        if (!finalSrc.endsWith('/')) {
          finalSrc += '/';
        }
        finalSrc += 'embed';
      }
      
      if (editingVideoId) {
        updateVideo(editingVideoId, { title: videoTitle, src: finalSrc });
        showNotification('Video berhasil diubah!');
      } else {
        addVideo({ title: videoTitle, src: finalSrc });
        showNotification('Video link berhasil ditambahkan!');
      }
      resetVideoForm();
    } else if (editingVideoId && !videoSrc) {
      // Allow saving just title change if no new link provided
      updateVideo(editingVideoId, { title: videoTitle });
      showNotification('Video berhasil diubah!');
      resetVideoForm();
    } else {
      showNotification('Masukkan link URL video dari YouTube atau Instagram!');
    }
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

  const handleRemoveArticle = (id) => {
    setConfirmDialog({
      isOpen: true,
      message: 'Apakah Anda yakin ingin menghapus artikel ini?',
      onConfirm: () => {
        removeArticle(id);
        showNotification('Artikel berhasil dihapus!');
        setConfirmDialog({ isOpen: false, message: '', onConfirm: null });
      }
    });
  };

  const isUploadingAny = uploadingPromo || uploadingVideo || uploadingBa || uploadingTesti || uploadingArticle || uploadingTreatmentImage;

  return (
    <div className="admin-layout" style={{ position: 'relative' }}>
      {isUploadingAny && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 9999,
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white'
        }}>
          <div style={{
            width: '60px', height: '60px', border: '6px solid #f3f3f3', 
            borderTop: '6px solid var(--primary-color)', borderRadius: '50%', 
            animation: 'spin 1s linear infinite', marginBottom: '1rem'
          }} />
          <h2 style={{ margin: 0 }}>Sedang Mengunggah...</h2>
          <p>Mohon tunggu sebentar, file sedang diproses dan dikirim ke database.</p>
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </div>
      )}

      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem', padding: '0 1rem' }}>
          <img src={`${import.meta.env.BASE_URL}assets/logo.png`} alt="Logo" style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px', objectFit: 'cover' }} />
          <h2 style={{ marginBottom: 0, padding: 0 }}>Enef CMS</h2>
        </div>
        <div className="sidebar-menu">
          <button className={`sidebar-btn ${activeTab === 'promo' ? 'active' : ''}`} onClick={() => setActiveTab('promo')}> Kelola Promo</button>
          <button className={`sidebar-btn ${activeTab === 'treatment' ? 'active' : ''}`} onClick={() => setActiveTab('treatment')}> Kelola Treatment</button>
          <button className={`sidebar-btn ${activeTab === 'video' ? 'active' : ''}`} onClick={() => setActiveTab('video')}> Kelola Video</button>
          <button className={`sidebar-btn ${activeTab === 'skincare' ? 'active' : ''}`} onClick={() => setActiveTab('skincare')}> Produk Skincare</button>
          <button className={`sidebar-btn ${activeTab === 'perawatan' ? 'active' : ''}`} onClick={() => setActiveTab('perawatan')}> Perawatan</button>
          <button className={`sidebar-btn ${activeTab === 'before_after' ? 'active' : ''}`} onClick={() => setActiveTab('before_after')}> Hasil Nyata</button>
          <button className={`sidebar-btn ${activeTab === 'testimonial' ? 'active' : ''}`} onClick={() => setActiveTab('testimonial')}> Testimoni</button>
          <button className={`sidebar-btn ${activeTab === 'articles' ? 'active' : ''}`} onClick={() => setActiveTab('articles')}> Kelola Artikel</button>
          <button className={`sidebar-btn ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}> Manajemen Admin</button>
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

            <h3 style={{ borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>{editingPromoId ? 'Edit Promo' : 'Tambah Promo Slider Baru'}</h3>
            <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1.5rem' }}>*Upload gambar untuk slider halaman depan.</p>
            <div className="admin-form-group">
              <input type="file" id="promoFileInput" accept="image/*" onChange={(e) => setPromoFile(e.target.files[0])} className="admin-input" />
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button onClick={handleAddPromo} className="admin-btn" disabled={uploadingPromo} style={{ flex: 1 }}>
                  {uploadingPromo ? 'Mengunggah...' : (editingPromoId ? 'Simpan Perubahan' : 'Upload Promo')}
                </button>
                {editingPromoId && (
                  <button onClick={() => setEditingPromoId(null)} className="admin-btn admin-btn-outline" style={{ flex: 1 }}>
                    Batal Edit
                  </button>
                )}
              </div>
            </div>
            
            <h3 style={{ marginTop: '3rem' }}>Daftar Promo Saat Ini</h3>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              {promos.map((promo, idx) => (
                <div key={promo.id || idx} style={{ position: 'relative', border: '1px solid #eee', borderRadius: '12px', overflow: 'hidden' }}>
                  <img src={promo.url || promo} alt="promo" style={{ width: '200px', height: '120px', objectFit: 'cover', display: 'block' }} />
                  <div style={{ position: 'absolute', top: '5px', right: '5px', display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => handleEditPromoClick(promo)} className="admin-btn" style={{ background: 'var(--primary-color)', color: 'white', padding: '0.4rem 0.8rem', fontSize: '0.8rem', minWidth: 'auto' }}>Edit</button>
                    <button onClick={() => handleRemovePromo(promo.id)} className="admin-btn admin-btn-danger" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Hapus</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'treatment' && (
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
            <div className="admin-card" style={{ flex: 1 }}>
              <h3>{editingId ? 'Edit Treatment' : 'Tambah Treatment Baru'}</h3>
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
                    <option value="55">Diskon 55%</option>
                  </select>
                </div>
                {(treatmentDiscount === '45' || treatmentDiscount === '50' || treatmentDiscount === '55') && (
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
                  <label>Upload Gambar Treatment (Opsional)</label>
                  <input type="file" accept="image/*" className="admin-input" onChange={e => setTreatmentImageFile(e.target.files[0])} />
                </div>
                <div className="admin-form-group">
                  <label>Upload PDF Brosur (Opsional)</label>
                  <input type="file" accept=".pdf" className="admin-input" onChange={(e) => setTreatmentPdfFile(e.target.files[0])} />
                  {treatmentPdf && !treatmentPdfFile && <div style={{marginTop: '0.5rem', fontSize: '0.85rem'}}><a href={treatmentPdf} target="_blank" rel="noopener noreferrer">Lihat PDF Saat Ini</a></div>}
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="submit" className="admin-btn" disabled={uploadingTreatmentImage} style={{ flex: 1 }}>{uploadingTreatmentImage ? 'Menyimpan...' : (editingId ? 'Simpan Perubahan' : 'Simpan Treatment')}</button>
                  {editingId && (
                    <button type="button" className="admin-btn admin-btn-outline" style={{ flex: 1 }} onClick={handleCancelEdit}>Batal Edit</button>
                  )}
                </div>
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
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleEditTreatment(t)} className="admin-btn" style={{ padding: '0.5rem 1rem', background: '#e0e0e0', color: '#333' }}>Edit</button>
                      <button onClick={() => handleRemoveTreatment(t.id)} className="admin-btn admin-btn-danger" style={{ padding: '0.5rem 1rem' }}>Hapus</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'video' && (
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
            <div className="admin-card" style={{ flex: 1 }}>
              <h3>{editingVideoId ? 'Edit Video' : 'Tambah Video Baru'}</h3>
              <form onSubmit={handleAddVideo}>
                <div className="admin-form-group">
                  <label>Judul Video</label>
                  <input type="text" className="admin-input" placeholder="Masukkan judul video" value={videoTitle} onChange={e => setVideoTitle(e.target.value)} required />
                </div>
                <div style={{ marginBottom: '1rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #e9ecef' }}>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label>Link Video (YouTube / Instagram Reels)</label>
                    <input type="text" className="admin-input" placeholder="Misal: https://www.instagram.com/reel/... atau https://youtube.com/watch?v=..." value={videoSrc} onChange={(e) => setVideoSrc(e.target.value)} disabled={uploadingVideo} required />
                  </div>
                </div>

                {uploadingVideo && (
                  <div style={{ marginBottom: '1rem', color: 'var(--primary-color)', fontWeight: 'bold' }}>
                    Menyimpan Video...
                  </div>
                )}
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="submit" className="admin-btn" style={{ flex: 1 }} disabled={uploadingVideo}>
                    {uploadingVideo ? 'Sedang Menyimpan...' : (editingVideoId ? 'Simpan Perubahan' : 'Simpan Video')}
                  </button>
                  {editingVideoId && (
                    <button type="button" onClick={resetVideoForm} className="admin-btn admin-btn-outline" style={{ flex: 1 }}>
                      Batal Edit
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="admin-card" style={{ flex: 1 }}>
              <h3>Daftar Video</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {videos.map((v, idx) => {
                  const isMp4 = v.src.includes('firebasestorage') || v.src.endsWith('.mp4');
                  return (
                  <div key={v.id || idx} className="admin-list-item" style={{ alignItems: 'flex-start' }}>
                    {isMp4 ? (
                      <video src={v.src} style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: '8px', background: '#000' }} muted playsInline />
                    ) : (
                      <iframe src={v.src} style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: '8px', background: '#000', border: 'none', overflow: 'hidden' }} scrolling="no" allowtransparency="true"></iframe>
                    )}
                    <div style={{ flex: 1, marginLeft: '1rem' }}>
                      <div style={{ fontWeight: '600' }}>{v.title}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleEditVideo(v)} className="admin-btn" style={{ padding: '0.5rem 1rem', background: '#e0e0e0', color: '#333' }}>Edit</button>
                      <button onClick={() => handleRemoveVideo(v.id)} className="admin-btn admin-btn-danger" style={{ padding: '0.5rem 1rem' }}>Hapus</button>
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'skincare' && (
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
            <div className="admin-card" style={{ flex: 1 }}>
              <h3>{editingSkincareId ? 'Edit Produk Skincare' : 'Tambah Produk Skincare'}</h3>
              <form onSubmit={handleAddSkincare}>
                <div className="admin-form-group">
                  <label>Nama Produk</label>
                  <input type="text" className="admin-input" value={skincareName} onChange={e => setSkincareName(e.target.value)} required />
                </div>
                <div className="admin-form-group">
                  <label>Harga Produk (Contoh: 83000)</label>
                  <input type="number" className="admin-input" value={skincarePrice} onChange={e => setSkincarePrice(e.target.value)} placeholder="83000" />
                </div>
                <div className="admin-form-group">
                  <label>Deskripsi Produk</label>
                  <textarea className="admin-input" value={skincareDesc} onChange={e => setSkincareDesc(e.target.value)} placeholder="Detail dan kegunaan produk..." rows="3"></textarea>
                </div>
                <div className="admin-form-group">
                  <label>Foto Produk {editingSkincareId && '(Opsional)'}</label>
                  <input type="file" accept="image/*" className="admin-input" onChange={e => setSkincareFile(e.target.files[0])} required={!editingSkincareId} />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="submit" className="admin-btn" style={{ flex: 1 }} disabled={uploadingSkincare}>{uploadingSkincare ? 'Menyimpan...' : (editingSkincareId ? 'Simpan Perubahan' : 'Simpan Produk')}</button>
                  {editingSkincareId && (
                    <button type="button" className="admin-btn admin-btn-outline" style={{ flex: 1 }} onClick={() => { setEditingSkincareId(null); setSkincareName(''); setSkincarePrice(''); setSkincareDesc(''); setSkincareFile(null); }}>Batal Edit</button>
                  )}
                </div>
              </form>
            </div>
            <div className="admin-card" style={{ flex: 1 }}>
              <h3>Daftar Produk Skincare</h3>
              <div>
                {skincareProducts.map((p, idx) => (
                  <div key={p.id || idx} className="admin-list-item" style={{ alignItems: 'center' }}>
                    <img src={p.image && (p.image.startsWith('data:') || p.image.startsWith('http')) ? p.image : `${import.meta.env.BASE_URL}${p.image ? (p.image.startsWith('/') ? p.image.substring(1) : p.image) : ''}`} alt={p.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }} />
                    <div style={{ flex: 1, marginLeft: '1rem' }}>
                      <div style={{ fontWeight: '600' }}>{p.name}</div>
                      {p.price && <div style={{ fontSize: '0.9rem', color: '#666' }}>Rp. {Number(p.price).toLocaleString('id-ID')}</div>}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleEditSkincare(p)} className="admin-btn" style={{ padding: '0.5rem 1rem', background: '#e0e0e0', color: '#333' }}>Edit</button>
                      <button onClick={() => removeSkincare(p.id)} className="admin-btn admin-btn-danger" style={{ padding: '0.5rem 1rem' }}>Hapus</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'perawatan' && (
          <div className="admin-card">
            <h3 style={{ marginTop: 0 }}>Perawatan</h3>
            <p style={{ color: '#666', marginBottom: '1rem' }}>
              Halaman Perawatan menampilkan daftar treatment yang sudah memiliki PDF. Untuk mengelola isinya, gunakan bagian Kelola Treatment.
            </p>
            <button onClick={handleSyncLocalPDFs} className="admin-btn" style={{ background: '#28a745' }}>
              Sinkronkan PDF Lokal ke Treatment
            </button>
          </div>
        )}

        {activeTab === 'before_after' && (
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
            <div className="admin-card" style={{ flex: 1 }}>
              <h3>{editingBaId ? 'Edit Foto Hasil Nyata' : 'Tambah Foto Hasil Nyata (Before-After)'}</h3>
              <form onSubmit={handleAddBeforeAfter}>
                <div className="admin-form-group">
                  <label>Judul Hasil (Pilih Treatment)</label>
                  <select 
                    className="admin-input" 
                    value={baTitle} 
                    onChange={e => setBaTitle(e.target.value)}
                  >
                    <option value="">-- Pilih Treatment (Opsional) --</option>
                    {treatments.map((t, idx) => (
                      <option key={idx} value={t.name}>{t.name}</option>
                    ))}
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>Upload Foto {editingBaId && '(Opsional)'}</label>
                  <input type="file" accept="image/*" className="admin-input" onChange={e => setBaFile(e.target.files[0])} required={!editingBaId} />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="submit" className="admin-btn" style={{ flex: 1 }} disabled={uploadingBa}>{uploadingBa ? 'Menyimpan...' : (editingBaId ? 'Simpan Perubahan' : 'Simpan Foto')}</button>
                  {editingBaId && (
                    <button type="button" className="admin-btn admin-btn-outline" style={{ flex: 1 }} onClick={() => { setEditingBaId(null); setBaTitle(''); setBaFile(null); }}>Batal Edit</button>
                  )}
                </div>
              </form>
            </div>
            <div className="admin-card" style={{ flex: 1 }}>
              <h3>Daftar Foto</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {beforeAfterImages.map((b, idx) => (
                  <div key={b.id || idx} style={{ position: 'relative', border: '1px solid #eee', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ position: 'relative' }}>
                      <img src={b.img} alt={b.title} style={{ width: '100%', height: '100px', objectFit: 'cover', display: 'block' }} />
                      <div style={{ position: 'absolute', top: '5px', right: '5px', display: 'flex', gap: '0.5rem' }}>
                        <button type="button" onClick={() => handleEditBa(b)} className="admin-btn" style={{ background: 'var(--primary-color)', color: 'white', padding: '0.3rem 0.6rem', fontSize: '0.8rem', minWidth: 'auto' }}>Edit</button>
                        <button type="button" onClick={() => removeBeforeAfter(b.id)} className="admin-btn admin-btn-danger" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}>Hapus</button>
                      </div>
                    </div>
                    <div style={{ padding: '0.5rem', backgroundColor: '#fff', fontSize: '0.85rem', fontWeight: '500', textAlign: 'center', borderTop: '1px solid #eee', color: b.title ? 'var(--text-dark)' : 'var(--text-light)' }}>
                      {b.title || 'Belum ada judul'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
            <div className="admin-card" style={{ flex: 1 }}>
              <h3>Tambah Akun Admin Baru</h3>
              <form onSubmit={handleAddUser}>
                <div className="admin-form-group">
                  <label>Username</label>
                  <input type="text" className="admin-input" value={newUsername} onChange={e => setNewUsername(e.target.value)} required />
                </div>
                <div className="admin-form-group">
                  <label>Password</label>
                  <input type="password" className="admin-input" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                </div>
                <button type="submit" className="admin-btn">Tambah Akun</button>
              </form>
            </div>
            <div className="admin-card" style={{ flex: 1 }}>
              <h3>Daftar Admin</h3>
              <div>
                {users.map((u, idx) => (
                  <div key={u.id || idx} className="admin-list-item">
                    <div style={{ fontWeight: '600', flex: 1 }}>{u.username}</div>
                    <button onClick={() => removeUser(u.id)} className="admin-btn admin-btn-danger" disabled={u.username === 'admin'}>Hapus</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'testimonial' && (
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
            <div className="admin-card" style={{ flex: 1 }}>
              <h3>{editingTestiId ? 'Edit Testimoni' : 'Tambah Testimoni'}</h3>
              <form onSubmit={handleAddTestimonial}>
                <div className="admin-form-group">
                  <label>Nama Pasien</label>
                  <input type="text" className="admin-input" value={testiName} onChange={e => setTestiName(e.target.value)} required />
                </div>
                <div className="admin-form-group">
                  <label>Jenis Treatment</label>
                  <input type="text" className="admin-input" value={testiTreatment} onChange={e => setTestiTreatment(e.target.value)} required />
                </div>
                <div className="admin-form-group">
                  <label>Ulasan / Quote</label>
                  <textarea className="admin-input" rows="3" value={testiQuote} onChange={e => setTestiQuote(e.target.value)} required />
                </div>
                <div className="admin-form-group">
                  <label>Foto Pasien (Opsional)</label>
                  <input type="file" accept="image/*" className="admin-input" onChange={e => setTestiFile(e.target.files[0])} />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="submit" className="admin-btn" style={{ flex: 1 }} disabled={uploadingTesti}>{uploadingTesti ? 'Menyimpan...' : (editingTestiId ? 'Simpan Perubahan' : 'Simpan Testimoni')}</button>
                  {editingTestiId && (
                    <button type="button" className="admin-btn admin-btn-outline" style={{ flex: 1 }} onClick={() => { setEditingTestiId(null); setTestiName(''); setTestiTreatment(''); setTestiQuote(''); setTestiFile(null); }}>Batal Edit</button>
                  )}
                </div>
              </form>
            </div>
            <div className="admin-card" style={{ flex: 1 }}>
              <h3>Daftar Testimoni</h3>
              <div>
                {(testimonials || []).map((t, idx) => (
                  <div key={t.id || idx} className="admin-list-item" style={{ alignItems: 'flex-start' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0, overflow: 'hidden' }}>
                      {t?.image ? <img src={t.image && (t.image.startsWith('data:') || t.image.startsWith('http')) ? t.image : `${import.meta.env.BASE_URL}${t.image ? (t.image.startsWith('/') ? t.image.substring(1) : t.image) : ''}`} alt={t?.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (t?.name || '?').charAt(0)}
                    </div>
                    <div style={{ flex: 1, marginLeft: '1rem' }}>
                      <div style={{ fontWeight: '600' }}>{t.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.5rem' }}>{t.treatment}</div>
                      <div style={{ fontSize: '0.9rem', fontStyle: 'italic', color: '#444' }}>"{t.quote}"</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginLeft: '1rem' }}>
                      <button onClick={() => handleEditTestimonial(t)} className="admin-btn" style={{ padding: '0.4rem 0.8rem', background: '#e0e0e0', color: '#333', fontSize: '0.8rem' }}>Edit</button>
                      <button onClick={() => removeTestimonial(t.id)} className="admin-btn admin-btn-danger" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Hapus</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'articles' && (
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
            <div className="admin-card" style={{ flex: 1 }}>
              <h3>{editingArticleId ? 'Edit Artikel' : 'Tambah Artikel Baru'}</h3>
              <form onSubmit={handleAddArticle}>
                <div className="admin-form-group">
                  <label>Judul Artikel</label>
                  <input type="text" className="admin-input" placeholder="Masukkan judul" value={articleTitle} onChange={e => setArticleTitle(e.target.value)} required />
                </div>
                <div className="admin-form-group">
                  <label>Ringkasan/Isi Singkat</label>
                  <textarea className="admin-input" placeholder="Masukkan ringkasan atau isi singkat artikel" value={articleSummary} onChange={e => setArticleSummary(e.target.value)} rows="5" required />
                </div>
                <div className="admin-form-group">
                  <label>Upload Gambar Artikel {editingArticleId && '(Opsional)'}</label>
                  <input type="file" accept="image/*" className="admin-input" onChange={e => setArticleFile(e.target.files[0])} required={!editingArticleId} />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="submit" className="admin-btn" disabled={uploadingArticle} style={{ flex: 1 }}>
                    {uploadingArticle ? 'Menyimpan...' : (editingArticleId ? 'Simpan Perubahan' : 'Simpan Artikel')}
                  </button>
                  {editingArticleId && (
                    <button type="button" className="admin-btn admin-btn-outline" style={{ flex: 1 }} onClick={() => { setEditingArticleId(null); setArticleTitle(''); setArticleSummary(''); setArticleFile(null); }}>Batal Edit</button>
                  )}
                </div>
              </form>
            </div>
            
            <div className="admin-card" style={{ flex: 1 }}>
              <h3>Daftar Artikel</h3>
              <div>
                {articles.map((a, idx) => (
                  <div key={a.id || idx} className="admin-list-item">
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <img src={a.image && a.image.startsWith('/') ? `${import.meta.env.BASE_URL}${a.image.substring(1)}` : a.image} alt="Artikel" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                      <div>
                        <div style={{ fontWeight: '600', color: '#222' }}>{a.title}</div>
                        <div style={{ fontSize: '0.8rem', color: '#888' }}>{a.date}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleEditArticle(a)} className="admin-btn" style={{ padding: '0.4rem 0.8rem', background: '#e0e0e0', color: '#333', fontSize: '0.8rem' }}>Edit</button>
                      <button onClick={() => handleRemoveArticle(a.id)} className="admin-btn admin-btn-danger" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Hapus</button>
                    </div>
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

