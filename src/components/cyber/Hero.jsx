export default function Hero({ t, isArabic }) {
  return (
    <section id="hero" className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-28 pb-16 relative overflow-hidden">
      {/* Background rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[300, 500, 700, 900].map((size, i) => (
          <div key={i}
            className="absolute rounded-full border border-gold"
            style={{
              width: size, height: size,
              opacity: 0.08,
              animation: `pulseRing 4s ease-in-out infinite ${i * 0.6}s`
            }} />
        ))}
      </div>

      {/* Logo */}
      <div className="w-40 h-40 rounded-full border-[3px] border-gold overflow-hidden mb-8 relative z-10"
        style={{
          boxShadow: '0 0 40px var(--ogx-shadow), 0 0 80px var(--ogx-shadow)',
          animation: 'floatLogo 3s ease-in-out infinite'
        }}>
        <div className="w-full h-full bg-gradient-to-br from-gold-dark via-gold to-gold-light flex items-center justify-center">
          <span className="font-orbitron text-3xl font-black text-black">OGX</span>
        </div>
      </div>

      <p className="font-arabic text-gold text-lg tracking-widest mb-2 opacity-0"
        style={{ animation: 'fadeUp 0.8s 0.3s forwards' }}>
        {t.heroArabicTop}
      </p>

      <h1 className="font-orbitron font-black leading-none tracking-widest mb-1.5 opacity-0"
        style={{
          fontSize: 'clamp(3rem, 10vw, 6rem)',
          background: 'linear-gradient(135deg, var(--gold-dark) 0%, var(--gold-light) 50%, var(--gold-dark) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          animation: 'fadeUp 0.8s 0.5s forwards'
        }}>
        CYBER
      </h1>

      <div className="font-orbitron font-bold text-gold tracking-[10px] mb-4 opacity-0"
        style={{ fontSize: 'clamp(2rem, 7vw, 4rem)', animation: 'fadeUp 0.8s 0.7s forwards' }}>
        OGX
      </div>

      <p className="text-ogx-text-muted text-sm tracking-[4px] uppercase mb-12 opacity-0"
        style={{ animation: 'fadeUp 0.8s 0.9s forwards' }}>
        {t.heroTagline}
      </p>

      <p className="max-w-xl text-lg leading-relaxed text-ogx-text mb-12 opacity-0"
        style={{ animation: 'fadeUp 0.8s 1.1s forwards' }}
        dangerouslySetInnerHTML={{ __html: t.welcomeMsg }} />

      <div className="flex gap-4 flex-wrap justify-center opacity-0"
        style={{ animation: 'fadeUp 0.8s 1.3s forwards' }}>
        <a href="#services"
          className="bg-gradient-to-br from-gold-dark via-gold to-gold-light text-black px-9 py-3.5 font-orbitron text-xs font-bold tracking-widest uppercase hover:-translate-y-1 transition-transform"
          style={{ clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)' }}>
          {t.ctaServices}
        </a>
        <a href="#contact"
          className="border border-gold text-gold px-9 py-3.5 font-orbitron text-xs font-bold tracking-widest hover:bg-gold hover:text-black transition-all"
          style={{ clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)' }}>
          {t.ctaContact}
        </a>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-9 left-1/2 flex flex-col items-center gap-2 text-ogx-text-muted text-[0.7rem] tracking-widest uppercase"
        style={{ animation: 'scrollBounce 2s infinite' }}>
        {t.scroll}
        <div className="w-px h-10" style={{ background: 'linear-gradient(to bottom, var(--gold), transparent)' }} />
      </div>
    </section>
  );
}