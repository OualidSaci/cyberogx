import { useState } from 'react';
import SectionHeader from './SectionHeader';

export default function Feedback({ t }) {
  const [rating, setRating] = useState(0);
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
    e.target.reset();
    setRating(0);
  };

  return (
    <section id="feedback" className="py-20 px-6" style={{ background: 'var(--ogx-bg)' }}>
      <div className="max-w-[1100px] mx-auto">
        <SectionHeader label={t.fbLabel} title={t.fbTitle} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Info side */}
          <div>
            <h3 className="font-orbitron text-xl text-gold mb-4 tracking-widest">{t.fbInfoTitle}</h3>
            <p className="text-ogx-text-muted leading-relaxed mb-8">{t.fbInfoDesc}</p>
            <div className="flex gap-3 flex-wrap">
              <div className="bg-ogx-bg3 border border-ogx-border p-4 rounded text-center flex-1 min-w-[100px]">
                <div className="font-orbitron text-3xl text-gold font-black">4.8</div>
                <div className="text-xs tracking-widest text-ogx-text-muted mt-1">{t.ratingLabel}</div>
              </div>
              <div className="bg-ogx-bg3 border border-ogx-border p-4 rounded text-center flex-1 min-w-[100px]">
                <div className="font-orbitron text-3xl text-gold font-black">500+</div>
                <div className="text-xs tracking-widest text-ogx-text-muted mt-1">{t.clientsLabel}</div>
              </div>
            </div>
          </div>

          {/* Form side */}
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="block text-xs tracking-widest uppercase text-gold mb-2">{t.fbNameLabel}</label>
              <input type="text" required placeholder="Ex: Ahmed B."
                className="w-full bg-ogx-bg3 border border-ogx-border text-ogx-text px-4 py-3 rounded-sm text-sm focus:border-gold focus:shadow-[0_0_12px_rgba(201,162,39,0.15)] outline-none transition-all" />
            </div>

            <div className="mb-5">
              <label className="block text-xs tracking-widest uppercase text-gold mb-2">{t.fbRatingLabel}</label>
              <div className="flex gap-2 text-2xl cursor-pointer">
                {[1,2,3,4,5].map(n => (
                  <span key={n} onClick={() => setRating(n)}
                    className={`transition-colors ${n <= rating ? 'text-gold' : 'text-ogx-border'}`}>★</span>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-xs tracking-widest uppercase text-gold mb-2">{t.fbServiceLabel}</label>
              <select className="w-full bg-ogx-bg3 border border-ogx-border text-ogx-text px-4 py-3 rounded-sm text-sm focus:border-gold outline-none transition-all">
                {t.fbServiceOptions.map(opt => (
                  <option key={opt.value} value={opt.value} className="bg-ogx-bg3">{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="mb-5">
              <label className="block text-xs tracking-widest uppercase text-gold mb-2">{t.fbMsgLabel}</label>
              <textarea rows={4}
                className="w-full bg-ogx-bg3 border border-ogx-border text-ogx-text px-4 py-3 rounded-sm text-sm focus:border-gold focus:shadow-[0_0_12px_rgba(201,162,39,0.15)] outline-none transition-all resize-y" />
            </div>

            <button type="submit"
              className="w-full bg-gradient-to-br from-gold-dark to-gold text-black py-3.5 font-orbitron text-sm font-bold tracking-widest rounded-sm hover:opacity-90 hover:-translate-y-0.5 transition-all mt-2">
              {t.fbSubmit}
            </button>

            {showToast && (
              <div className="bg-gold text-black p-3.5 rounded mt-4 font-bold tracking-wider text-center"
                style={{ animation: 'fadeUp 0.4s forwards' }}>
                {t.fbToast}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}