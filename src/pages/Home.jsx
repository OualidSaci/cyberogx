import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { translations } from '../lib/translations';
import Navbar from '../components/cyber/Navbar';
import Hero from '../components/cyber/Hero';
import GoldDivider from '../components/cyber/GoldDivider';
import Services from '../components/cyber/Services';
import Feedback from '../components/cyber/Feedback';
import Appointment from '../components/cyber/Appointment';
import Contact from '../components/cyber/Contact';
import SocialBar from '../components/cyber/SocialBar';
import Footer from '../components/cyber/Footer';

export default function Home() {
  const [isArabic, setIsArabic] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    base44.entities.SiteVisit.create({
      page: window.location.pathname,
      referrer: document.referrer || '',
      user_agent: navigator.userAgent.slice(0, 200),
    });
  }, []);

  const t = translations[isArabic ? 'ar' : 'fr'];

  const toggleLang = () => {
    setIsArabic(prev => !prev);
  };

  const toggleTheme = () => {
    setIsDark(prev => {
      document.body.classList.toggle('light-mode', prev);
      return !prev;
    });
  };

  return (
    <div dir={isArabic ? 'rtl' : 'ltr'} style={{ fontFamily: isArabic ? 'var(--font-arabic)' : 'var(--font-rajdhani)' }}>
      <Navbar isArabic={isArabic} isDark={isDark} onToggleLang={toggleLang} onToggleTheme={toggleTheme} t={t} />
      <Hero t={t} isArabic={isArabic} />
      <GoldDivider />
      <Services t={t} isArabic={isArabic} />
      <GoldDivider />
      <Appointment t={t} isArabic={isArabic} />
      <GoldDivider />
      <Feedback t={t} />
      <GoldDivider />
      <Contact t={t} />
      <SocialBar t={t} />
      <Footer t={t} />
    </div>
  );
}