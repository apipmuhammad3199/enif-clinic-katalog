import React, { createContext, useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import defaultTreatments from '../data.json';

export const CMSContext = createContext();

export const CMSProvider = ({ children }) => {
  const [treatments, setTreatments] = useState([]);
  const [promos, setPromos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [promoSettings, setPromoSettings] = useState({ 
    show45: true, show50: true
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to treatments
    const unsubTreatments = onSnapshot(collection(db, 'treatments'), (snapshot) => {
      const treatmentsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      treatmentsData.sort((a, b) => b.createdAt - a.createdAt);
      if (treatmentsData.length === 0 && defaultTreatments) {
        setTreatments(defaultTreatments);
      } else {
        setTreatments(treatmentsData);
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
          { id: 'vdefault1', src: `${import.meta.env.BASE_URL}assets/videos/enefclinic1.mp4`, title: "Enef Clinic Treatment" },
          { id: 'vdefault2', src: `${import.meta.env.BASE_URL}assets/videos/enefclinic2.mp4`, title: "Treatment Review" }
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

    setLoading(false);

    return () => {
      unsubTreatments();
      unsubPromos();
      unsubVideos();
      unsubPromoSettings();
    };
  }, []);

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

  return (
    <CMSContext.Provider value={{
      treatments, addTreatment, updateTreatment, removeTreatment,
      promos, addPromo, removePromo,
      videos, addVideo, removeVideo,
      promoSettings, updatePromoSettings,
      loading
    }}>
      {children}
    </CMSContext.Provider>
  );
};
