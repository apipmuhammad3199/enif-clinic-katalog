import React, { createContext, useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import defaultTreatments from '../data.json';
import { articles as defaultArticles } from '../data/articles';

export const CMSContext = createContext();

export const CMSProvider = ({ children }) => {
  const [treatments, setTreatments] = useState([]);
  const [promos, setPromos] = useState([
    { id: 'default1', url: `${import.meta.env.BASE_URL}assets/Slide1.jpg` },
    { id: 'default2', url: `${import.meta.env.BASE_URL}assets/Slide2.jpg` },
    { id: 'default3', url: `${import.meta.env.BASE_URL}assets/Slide3.jpg` },
    { id: 'default4', url: `${import.meta.env.BASE_URL}assets/Slide4.jpeg` },
    { id: 'default5', url: `${import.meta.env.BASE_URL}assets/Slide5.jpeg` },
  ]);
  const [videos, setVideos] = useState([]);
  const [promoSettings, setPromoSettings] = useState({ 
    show45: true, show50: true
  });
  
  const [skincareProducts, setSkincareProducts] = useState([]);
  const [perawatanPDFs, setPerawatanPDFs] = useState([]);
  const [beforeAfterImages, setBeforeAfterImages] = useState([]);
  const [users, setUsers] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [articles, setArticles] = useState([]);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to treatments
    const unsubTreatments = onSnapshot(collection(db, 'treatments'), (snapshot) => {
      const treatmentsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      treatmentsData.sort((a, b) => b.createdAt - a.createdAt);
      if (treatmentsData.length === 0 && defaultTreatments) {
        setTreatments(defaultTreatments);
      } else {
        const mergedTreatments = treatmentsData.map(t => {
          if (!t.image && defaultTreatments) {
            const def = defaultTreatments.find(d => d.name === t.name);
            if (def && def.image) {
              return { ...t, image: def.image };
            }
          }
          return t;
        });
        setTreatments(mergedTreatments);
      }
    });

    // Listen to promos
    const unsubPromos = onSnapshot(collection(db, 'promos'), (snapshot) => {
      const promosData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      promosData.sort((a, b) => b.createdAt - a.createdAt);
      if (promosData.length === 0) {
        setPromos([
          { id: 'default1', url: `${import.meta.env.BASE_URL}assets/Slide1.jpg` },
          { id: 'default2', url: `${import.meta.env.BASE_URL}assets/Slide2.jpg` },
          { id: 'default3', url: `${import.meta.env.BASE_URL}assets/Slide3.jpg` },
          { id: 'default4', url: `${import.meta.env.BASE_URL}assets/Slide4.jpeg` },
          { id: 'default5', url: `${import.meta.env.BASE_URL}assets/Slide5.jpeg` },
        ]);
      } else {
        setPromos(promosData);
      }
    });

    // Listen to videos
    const unsubVideos = onSnapshot(collection(db, 'videos'), (snapshot) => {
      const videosData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      videosData.sort((a, b) => b.createdAt - a.createdAt);
      if (videosData.length === 0) {
        setVideos([
          { id: 'vdefault1', src: `${import.meta.env.BASE_URL}assets/videos/enefclinic1.mp4`, title: "Treatment Enef Clinic" },
          { id: 'vdefault2', src: `${import.meta.env.BASE_URL}assets/videos/enefclinic2.mp4`, title: "Bukti Nyata Pelanggan" }
        ]);
      } else {
        setVideos(videosData);
      }
    });

    // Listen to promo settings
    const unsubPromoSettings = onSnapshot(doc(db, 'settings', 'promoSettings'), (docSnap) => {
      if (docSnap.exists()) {
        setPromoSettings(docSnap.data());
      }
    });

    const unsubSkincare = onSnapshot(collection(db, 'skincare_products'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      data.sort((a, b) => b.createdAt - a.createdAt);
      if (data.length === 0) {
        setSkincareProducts([
          { id: 'skdefault1', name: 'Body Whitening SPF 20 Strawberry', image: `${import.meta.env.BASE_URL}assets/product_skincare/skincare1.jpeg` },
          { id: 'skdefault2', name: 'Bye Acne Facial Wash', image: `${import.meta.env.BASE_URL}assets/product_skincare/skincare2.jpeg` },
          { id: 'skdefault3', name: 'Bye Acne Toner', image: `${import.meta.env.BASE_URL}assets/product_skincare/skincare3.jpeg` },
          { id: 'skdefault4', name: 'Cera Niacin Gentle Cleanser', image: `${import.meta.env.BASE_URL}assets/product_skincare/skincare4.jpeg` },
          { id: 'skdefault5', name: 'Dreamy Glow HyaluMoist', image: `${import.meta.env.BASE_URL}assets/product_skincare/skincare5.jpeg` },
        ]);
      } else {
        setSkincareProducts(data);
      }
    });

    const unsubPerawatan = onSnapshot(collection(db, 'perawatan_pdfs'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      data.sort((a, b) => b.createdAt - a.createdAt);
      setPerawatanPDFs(data);
    });

    const unsubBeforeAfter = onSnapshot(collection(db, 'before_after'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      data.sort((a, b) => b.createdAt - a.createdAt);
      
      if (data.length === 0) {
        const titles = ["Acne Grade 3", "Glowing Skin", "Flek Hitam", "Skin Rejuvenation"];
        const defaults = Array.from({ length: 13 }, (_, i) => ({
          id: `badefault${i+1}`,
          title: titles[i % titles.length],
          img: `${import.meta.env.BASE_URL}assets/before_after/before${i + 1}.jpeg`,
          doctor: "Treatment by : dr. Enef"
        }));
        setBeforeAfterImages(defaults);
      } else {
        setBeforeAfterImages(data);
      }
    });

    const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Automatically create a default admin if collection is completely empty
      if (data.length === 0 && !loading) {
        addDoc(collection(db, 'users'), { username: 'admin', password: 'admin123', createdAt: Date.now() });
      }
      setUsers(data);
    });

    setLoading(false);


    const unsubTestimonials = onSnapshot(collection(db, 'testimonials'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      data.sort((a, b) => b.createdAt - a.createdAt);
      
      if (data.length === 0) {
        setTestimonials([
          { id: 't1', name: 'Rina Sari', treatment: 'Facial Acne', quote: 'Pelayanannya sangat ramah dan tempatnya bersih. Wajah saya terasa lebih glowing setelah perawatan pertama!', image: '' },
          { id: 't2', name: 'Dwi Wahyuni', treatment: 'Peeling Glow', quote: 'Dokternya sabar banget jelasin kondisi kulit saya. Krimnya juga cocok dan nggak bikin iritasi.', image: '' },
          { id: 't3', name: 'Anita Kusuma', treatment: 'Laser Rejuvenation', quote: 'Klinik favorit! Harganya terjangkau tapi hasilnya nggak main-main. Sangat direkomendasikan.', image: '' },
          { id: 't4', name: 'Siti Rahma', treatment: 'IPL Hair Removal', quote: 'Hasilnya langsung terlihat sejak treatment pertama. Stafnya sangat profesional dan membantu.', image: '' }
        ]);
      } else {
        setTestimonials(data);
      }
    });

    const unsubArticles = onSnapshot(collection(db, 'articles'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      data.sort((a, b) => b.createdAt - a.createdAt);
      if (data.length === 0 && defaultArticles) {
        setArticles(defaultArticles);
      } else {
        setArticles(data);
      }
    });
    
    return () => {
      unsubTreatments();
      unsubPromos();
      unsubVideos();
      unsubPromoSettings();
      unsubSkincare();
      unsubPerawatan();
      unsubBeforeAfter();
      unsubUsers();
      unsubTestimonials();
      unsubArticles();
    };
  }, []);

  const addTestimonial = async (data) => {
    try {
      await addDoc(collection(db, 'testimonials'), { ...data, createdAt: Date.now() });
    } catch (error) {
      console.error('Error adding testimonial: ', error);
    }
  };

  const updateTestimonial = async (id, updatedData) => {
    try {
      await setDoc(doc(db, 'testimonials', id), updatedData, { merge: true });
    } catch (e) {
      console.error("Error updating testimonial: ", e);
    }
  };

  const removeTestimonial = async (id) => {
    if(id.startsWith('t')) return; // block deleting defaults
    try {
      await deleteDoc(doc(db, 'testimonials', id));
    } catch (error) {
      console.error('Error removing testimonial: ', error);
    }
  };

  const addTreatment = async (newTreatment) => {
    try {
      await addDoc(collection(db, 'treatments'), { ...newTreatment, createdAt: Date.now() });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const updateTreatment = async (id, updatedData) => {
    try {
      await setDoc(doc(db, 'treatments', id), updatedData, { merge: true });
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  };

  const removeTreatment = async (id) => {
    try {
      await deleteDoc(doc(db, 'treatments', id));
    } catch (e) {
      console.error("Error removing document: ", e);
    }
  };

  const addPromo = async (promoUrl) => {
    try {
      await addDoc(collection(db, 'promos'), { url: promoUrl, createdAt: Date.now() });
    } catch (e) {
      console.error("Error adding promo: ", e);
    }
  };

  const updatePromo = async (id, updatedData) => {
    try {
      await setDoc(doc(db, 'promos', id), updatedData, { merge: true });
    } catch (e) {
      console.error("Error updating promo: ", e);
    }
  };

  const removePromo = async (id) => {
    try {
      await deleteDoc(doc(db, 'promos', id));
    } catch (e) {
      console.error("Error removing promo: ", e);
    }
  };

  const addVideo = async (videoObj) => {
    try {
      await addDoc(collection(db, 'videos'), { ...videoObj, createdAt: Date.now() });
    } catch (e) {
      console.error("Error adding video: ", e);
    }
  };

  const updateVideo = async (id, updatedData) => {
    try {
      await setDoc(doc(db, 'videos', id), updatedData, { merge: true });
    } catch (e) {
      console.error("Error updating video: ", e);
    }
  };

  const removeVideo = async (id) => {
    try {
      await deleteDoc(doc(db, 'videos', id));
    } catch (e) {
      console.error("Error removing video: ", e);
    }
  };

  const updatePromoSettings = async (settings) => {
    try {
      await setDoc(doc(db, 'settings', 'promoSettings'), settings);
    } catch (e) {
      console.error("Error updating settings: ", e);
    }
  };

  const addSkincare = async (product) => {
    try { await addDoc(collection(db, 'skincare_products'), { ...product, createdAt: Date.now() }); } catch (e) { console.error(e); }
  };
  const updateSkincare = async (id, updatedData) => {
    try { await setDoc(doc(db, 'skincare_products', id), updatedData, { merge: true }); } catch (e) { console.error(e); }
  };
  const removeSkincare = async (id) => {
    try { await deleteDoc(doc(db, 'skincare_products', id)); } catch (e) { console.error(e); }
  };

  const addPerawatanPDF = async (pdf) => {
    try { await addDoc(collection(db, 'perawatan_pdfs'), { ...pdf, createdAt: Date.now() }); } catch (e) { console.error(e); }
  };
  const updatePerawatanPDF = async (id, updatedData) => {
    try { await setDoc(doc(db, 'perawatan_pdfs', id), updatedData, { merge: true }); } catch (e) { console.error(e); }
  };
  const removePerawatanPDF = async (id) => {
    try { await deleteDoc(doc(db, 'perawatan_pdfs', id)); } catch (e) { console.error(e); }
  };

  const addBeforeAfter = async (image) => {
    try { await addDoc(collection(db, 'before_after'), { ...image, createdAt: Date.now() }); } catch (e) { console.error(e); }
  };
  const updateBeforeAfter = async (id, updatedData) => {
    try { await setDoc(doc(db, 'before_after', id), updatedData, { merge: true }); } catch (e) { console.error(e); }
  };
  const removeBeforeAfter = async (id) => {
    try { await deleteDoc(doc(db, 'before_after', id)); } catch (e) { console.error(e); }
  };

  const addUser = async (user) => {
    try { await addDoc(collection(db, 'users'), { ...user, createdAt: Date.now() }); } catch (e) { console.error(e); }
  };
  const removeUser = async (id) => {
    try { await deleteDoc(doc(db, 'users', id)); } catch (e) { console.error(e); }
  };

  const addArticle = async (article) => {
    try { await addDoc(collection(db, 'articles'), { ...article, createdAt: Date.now() }); } catch (e) { console.error(e); }
  };
  const updateArticle = async (id, updatedData) => {
    try { await setDoc(doc(db, 'articles', id), updatedData, { merge: true }); } catch (e) { console.error(e); }
  };
  const removeArticle = async (id) => {
    try { await deleteDoc(doc(db, 'articles', id)); } catch (e) { console.error(e); }
  };

  return (
    <CMSContext.Provider value={{
      treatments, addTreatment, updateTreatment, removeTreatment,
      promos, addPromo, updatePromo, removePromo,
      videos, addVideo, updateVideo, removeVideo,
      promoSettings, updatePromoSettings,
      skincareProducts, addSkincare, updateSkincare, removeSkincare,
      perawatanPDFs, addPerawatanPDF, updatePerawatanPDF, removePerawatanPDF,
      beforeAfterImages, addBeforeAfter, updateBeforeAfter, removeBeforeAfter,
      users, addUser, removeUser,
      testimonials, addTestimonial, updateTestimonial, removeTestimonial,
      articles, addArticle, updateArticle, removeArticle,
      loading
    }}>
      {children}
    </CMSContext.Provider>
  );
};
