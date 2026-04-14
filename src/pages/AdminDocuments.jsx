import { useState } from 'react';
import { adminSubServices, translations } from '../lib/translations';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function AdminDocuments() {
  const [isArabic, setIsArabic] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  const t = translations[isArabic ? 'ar' : 'fr'];

  const [submitting, setSubmitting] = useState(false);

  const handleRequest = async () => {
    if (!selected) return;
    setSubmitting(true);
    const id = '#OGX-DOC-' + String(Math.floor(Math.random() * 9000) + 1000);
    await base44.entities.ServiceRequest.create({
      ticket_id: id,
      service_id: 'admin-docs',
      service_name_fr: selected.fr,
      service_name_ar: selected.ar,
      date: new Date().toLocaleDateString('fr-FR'),
      time: '',
      first_name: 'Demande',
      last_name: 'Document',
      phone: '',
      email: '',
      note: `Document: ${selected.fr} / ${selected.ar}`,
      status: 'pending',
    });
    setSubmitting(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000);
  };

  return (
    <div
      dir={isArabic ? 'rtl' : 'ltr'}
      className="min-h-screen px-6 py-12"
      style={{ background: 'var(--ogx-bg)', color: 'var(--ogx-text)', fontFamily: isArabic ? 'var(--font-arabic)' : 'var(--font-rajdhani)' }}
    >
      {/* Top bar */}
      <div className="max-w-[860px] mx-auto flex items-center justify-between mb-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-ogx-text-muted hover:text-gold transition-colors font-orbitron text-xs tracking-widest uppercase"
        >
          <ArrowLeft size={16} />
          {isArabic ? 'رجوع' : 'Retour'}
        </button>
        <button
          onClick={() => setIsArabic(v => !v)}
          className="bg-ogx-bg3 border border-ogx-border text-ogx-text px-3 py-1.5 rounded text-xs tracking-wider hover:bg-gold hover:text-black hover:border-gold transition-all font-orbitron"
        >
          {isArabic ? '🌐 Français' : '🌐 عربي'}
        </button>
      </div>

      <div className="max-w-[860px] mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs tracking-widest uppercase text-gold mb-3">
            {isArabic ? 'اختر الوثيقة المطلوبة' : 'Choisissez le document souhaité'}
          </p>
          <h1 className="font-orbitron text-3xl md:text-4xl font-black tracking-wider text-ogx-text mb-2">
            {isArabic ? 'استخراج وثائق إدارية' : 'DOCUMENTS ADMINISTRATIFS'}
          </h1>
          <div className="w-16 h-0.5 mx-auto mt-5" style={{ background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }} />
        </div>

        {/* Sub-services grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {adminSubServices.map((s) => {
            const isSelected = selected?.id === s.id;
            return (
              <div
                key={s.id}
                onClick={() => setSelected(isSelected ? null : s)}
                className={`relative cursor-pointer rounded-md p-6 border-[1.5px] transition-all duration-250 hover:-translate-y-0.5
                  ${isSelected
                    ? 'border-gold shadow-[0_0_28px_rgba(201,162,39,0.22)]'
                    : 'border-ogx-border hover:border-gold-dark'}`}
                style={{ background: isSelected ? 'linear-gradient(135deg, rgba(201,162,39,0.07), transparent)' : 'var(--ogx-card)' }}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3">
                    <CheckCircle2 className="text-gold" size={18} />
                  </div>
                )}
                <div className={`font-arabic text-base leading-snug mb-1 ${isSelected ? 'text-gold' : 'text-ogx-text'}`} dir="rtl">
                  {s.ar}
                </div>
                <div className="text-xs text-ogx-text-muted tracking-wide">{s.fr}</div>
              </div>
            );
          })}
        </div>

        {/* Action area */}
        {selected && (
          <div className="bg-ogx-card border border-ogx-border rounded-md p-6 flex flex-col sm:flex-row items-center gap-4 justify-between mb-6"
            style={{ animation: 'fadeUp 0.35s forwards' }}>
            <div>
              <p className="text-xs tracking-widest text-ogx-text-muted uppercase mb-1">
                {isArabic ? 'الوثيقة المختارة' : 'Document sélectionné'}
              </p>
              <p className="font-orbitron text-sm text-gold font-bold tracking-widest">
                {isArabic ? selected.ar : selected.fr}
              </p>
            </div>
            <button
              onClick={handleRequest}
              disabled={submitting}
              className="bg-gradient-to-br from-gold-dark to-gold text-black px-8 py-3 font-orbitron text-xs font-bold tracking-widest rounded-sm hover:opacity-90 hover:-translate-y-0.5 transition-all whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ clipPath: 'polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%)' }}
            >
              {isArabic ? 'طلب الخدمة' : 'DEMANDER CE SERVICE'}
            </button>
          </div>
        )}

        {showToast && (
          <div className="bg-gold text-black px-5 py-3.5 rounded font-bold tracking-wider text-center"
            style={{ animation: 'fadeUp 0.4s forwards' }}>
            {isArabic ? '✅ تم إرسال طلبكم! سنتصل بكم قريباً 🙏' : '✅ Votre demande a été envoyée ! Nous vous contacterons bientôt 🙏'}
          </div>
        )}
      </div>
    </div>
  );
}