import { Signal, GraduationCap, MonitorPlay, Tv, Copy, Printer, Shield, FileText, FolderOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SectionHeader from './SectionHeader';
import { services } from '../../lib/translations';

const iconMap = { Signal, GraduationCap, MonitorPlay, Tv, Copy, Printer, Shield, FileText, FolderOpen };

export default function Services({ t, isArabic }) {
  const navigate = useNavigate();

  return (
    <section id="services" className="py-20 px-6" style={{ background: 'var(--ogx-bg2)' }}>
      <div className="max-w-[1100px] mx-auto">
        <SectionHeader label={t.srvLabel} title={t.srvTitle} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((service) => {
            const IconComponent = iconMap[service.icon];
            const hasLink = !!service.link;
            return (
              <div key={service.id}
                onClick={() => hasLink && navigate(service.link)}
                className={`group relative overflow-hidden rounded bg-ogx-card border border-ogx-border p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-gold-dark ${hasLink ? 'cursor-pointer' : 'cursor-default'}`}
                style={{ boxShadow: 'none' }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 12px 40px var(--ogx-shadow)'}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}>
                {/* Top accent line */}
                <div className="absolute top-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-400"
                  style={{ background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }} />

                {/* Icon */}
                <div className="w-12 h-12 rounded-lg border border-gold/30 flex items-center justify-center mb-5 group-hover:border-gold/60 transition-colors">
                  {IconComponent && <IconComponent className="text-gold" size={24} strokeWidth={1.5} />}
                </div>

                {/* French name */}
                <div className="font-orbitron text-[0.8rem] font-bold text-gold tracking-widest mb-2 leading-tight">
                  {service.fr}
                </div>

                {/* Arabic name */}
                <div className="font-arabic text-sm text-gold/70 mb-3 leading-relaxed" dir="rtl">
                  {service.ar}
                </div>

                {/* Description */}
                <p className="text-ogx-text-muted text-sm leading-relaxed">
                  {isArabic ? service.descAr : service.descFr}
                </p>

                {hasLink && (
                  <div className="mt-4 text-[0.7rem] tracking-widest font-orbitron text-gold opacity-60 group-hover:opacity-100 transition-opacity">
                    {isArabic ? 'اضغط للمزيد ←' : 'Voir détails →'}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}