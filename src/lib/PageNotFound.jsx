import { useNavigate } from 'react-router-dom';

export default function PageNotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: 'var(--ogx-bg)', color: 'var(--ogx-text)', fontFamily: 'var(--font-rajdhani)' }}>
      
      {/* Background rings */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
        {[200, 350, 500].map((size, i) => (
          <div key={i} className="absolute rounded-full border border-gold"
            style={{ width: size, height: size, opacity: 0.05 }} />
        ))}
      </div>

      <div className="text-center relative z-10" style={{ animation: 'fadeUp 0.6s forwards' }}>
        <div className="font-orbitron font-black leading-none mb-2"
          style={{
            fontSize: 'clamp(5rem, 20vw, 10rem)',
            background: 'linear-gradient(135deg, var(--gold-dark), var(--gold-light))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
          404
        </div>
        <div className="w-24 h-px mx-auto mb-6" style={{ background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }} />
        <h2 className="font-orbitron text-xl font-bold tracking-widest text-ogx-text mb-3">PAGE INTROUVABLE</h2>
        <p className="text-ogx-text-muted tracking-widest text-sm mb-8 max-w-xs mx-auto">
          Cette page n'existe pas ou a été déplacée.
        </p>
        <button onClick={() => navigate('/')}
          className="bg-gradient-to-br from-gold-dark to-gold text-black px-8 py-3 font-orbitron text-xs font-bold tracking-widest rounded-sm hover:opacity-90 hover:-translate-y-0.5 transition-all"
          style={{ clipPath: 'polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%)' }}>
          ← RETOUR À L'ACCUEIL
        </button>
      </div>
    </div>
  );
}