import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ isArabic, isDark, onToggleLang, onToggleTheme, t }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLoginConfirm, setShowLoginConfirm] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    base44.auth.me().then(u => {
      setLoggedIn(true);
      setIsAdmin(u.role === 'admin');
    }).catch(() => {});
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-8 py-3.5 border-b border-ogx-border backdrop-blur-xl"
      style={{ background: isDark ? 'rgba(10,10,10,0.85)' : 'rgba(240,236,224,0.9)' }}>
      <div className="font-orbitron text-lg font-black tracking-widest bg-gradient-to-br from-gold-dark via-gold to-gold-light bg-clip-text text-transparent">
        CYBER OGX
      </div>

      {/* Desktop links */}
      <ul className={`hidden md:flex gap-6 items-center ${isArabic ? 'flex-row-reverse' : ''}`}>
        {t.navLinks.map((link) => (
          <li key={link.href}>
            <a href={link.href}
              className="text-ogx-text-muted text-sm tracking-wider uppercase hover:text-gold transition-colors relative group">
              {link.label}
              <span className="absolute -bottom-1 left-0 right-0 h-px bg-gold scale-x-0 group-hover:scale-x-100 transition-transform" />
            </a>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-3">
        <button onClick={onToggleLang}
          className="bg-ogx-bg3 border border-ogx-border text-ogx-text px-3 py-1.5 rounded text-xs tracking-wider hover:bg-gold hover:text-black hover:border-gold transition-all">
          {t.langBtn}
        </button>
        <button onClick={onToggleTheme}
          className="bg-ogx-bg3 border border-ogx-border text-ogx-text px-3 py-1.5 rounded text-xs tracking-wider hover:bg-gold hover:text-black hover:border-gold transition-all">
          {isDark ? '☀️' : '🌙'} {isDark ? (isArabic ? 'فاتح' : 'Light') : (isArabic ? 'داكن' : 'Dark')}
        </button>
        {isAdmin && (
          <button onClick={() => navigate('/admin')}
            className="hidden sm:inline-flex items-center gap-1.5 border border-gold text-gold px-4 py-1.5 rounded text-xs font-orbitron font-bold tracking-widest hover:bg-gold hover:text-black transition-all">
            ⚙️ Admin
          </button>
        )}
        {loggedIn ? (
          <button onClick={() => base44.auth.logout('/')}
            className="hidden sm:inline-flex items-center gap-1.5 bg-ogx-bg3 border border-ogx-border text-ogx-text-muted px-4 py-1.5 rounded text-xs font-orbitron tracking-widest hover:border-red-400 hover:text-red-400 transition-all">
            {isArabic ? 'خروج' : 'Déconnexion'}
          </button>
        ) : (
          <div className="relative">
            <button
              onClick={() => setShowLoginConfirm(v => !v)}
              className="hidden sm:inline-flex items-center gap-1.5 bg-gradient-to-br from-gold-dark to-gold text-black px-4 py-1.5 rounded text-xs font-orbitron font-bold tracking-widest hover:opacity-90 transition-all">
              🔐 {isArabic ? 'تسجيل الدخول' : 'Connexion'}
            </button>
            {showLoginConfirm && (
              <div className="absolute top-full mt-2 right-0 bg-ogx-card border border-ogx-border rounded-md shadow-[0_8px_30px_rgba(0,0,0,0.4)] p-4 w-56 z-50"
                style={{ animation: 'fadeUp 0.2s forwards' }}>
                <p className="text-xs text-ogx-text-muted tracking-widest mb-4 text-center">
                  {isArabic ? 'هل تريد المتابعة إلى تسجيل الدخول؟' : 'Continuer vers la connexion ?'}
                </p>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => { setShowLoginConfirm(false); base44.auth.redirectToLogin(window.location.href); }}
                    className="w-full bg-gradient-to-br from-gold-dark to-gold text-black py-2 font-orbitron text-[0.7rem] font-bold tracking-widest rounded-sm hover:opacity-90 transition-all">
                    {isArabic ? 'نعم، دخول' : 'Oui, connexion'}
                  </button>
                  <button
                    onClick={() => setShowLoginConfirm(false)}
                    className="w-full border border-ogx-border text-ogx-text-muted py-2 font-orbitron text-[0.7rem] tracking-widest rounded-sm hover:border-gold hover:text-gold transition-all">
                    {isArabic ? '← إلغاء' : '← Annuler'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        <button className="md:hidden text-gold" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="absolute top-full left-0 right-0 border-b border-ogx-border py-4 px-6 flex flex-col gap-3 md:hidden"
          style={{ background: isDark ? 'rgba(10,10,10,0.95)' : 'rgba(240,236,224,0.95)' }}>
          {t.navLinks.map((link) => (
            <a key={link.href} href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-ogx-text-muted text-sm tracking-wider uppercase hover:text-gold transition-colors">
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}