import { useState, useCallback, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import SectionHeader from './SectionHeader';
import { services } from '../../lib/translations';
import { Signal, GraduationCap, MonitorPlay, Tv, Copy, Printer, Shield, FileText, FolderOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const iconMap = { Signal, GraduationCap, MonitorPlay, Tv, Copy, Printer, Shield, FileText, FolderOpen };

const ALL_SLOTS = ['09:00','09:30','10:00','10:30','11:00','11:30','12:00','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30','19:00'];

export default function Appointment({ t, isArabic }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [selectedService, setSelectedService] = useState(null);
  const [calYear, setCalYear] = useState(2026);
  const [calMonth, setCalMonth] = useState(2);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [ticketId, setTicketId] = useState('');
  const [bookedSlots, setBookedSlots] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const today = new Date();
  today.setHours(0,0,0,0);

  const goStep = (n) => setStep(n);

  const calPrev = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
    else setCalMonth(m => m - 1);
  };
  const calNext = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
    else setCalMonth(m => m + 1);
  };

  const getDateLabel = useCallback((date) => {
    if (!date) return '—';
    return `${date.getDate()} ${t.months[date.getMonth()]} ${date.getFullYear()}`;
  }, [t]);

  useEffect(() => {
    if (!selectedDate) return;
    const dateStr = selectedDate.toLocaleDateString('fr-FR');
    base44.entities.ServiceRequest.filter({ date: dateStr }).then(results => {
      setBookedSlots(results.filter(r => r.status !== 'cancelled').map(r => r.time));
    });
  }, [selectedDate]);

  const timeSlots = ALL_SLOTS.map(t => ({ time: t, booked: bookedSlots.includes(t) }));

  const getServiceName = () => {
    if (!selectedService) return '—';
    return isArabic ? selectedService.ar : selectedService.fr;
  };

  const confirmBooking = async () => {
    if (!fname || !lname || !phone) { alert(t.alertFill); return; }
    setSubmitting(true);
    const id = '#OGX-' + String(Math.floor(Math.random() * 9000) + 1000);
    setTicketId(id);
    await base44.entities.ServiceRequest.create({
      ticket_id: id,
      service_id: selectedService?.id || '',
      service_name_fr: selectedService?.fr || '',
      service_name_ar: selectedService?.ar || '',
      date: selectedDate ? selectedDate.toLocaleDateString('fr-FR') : '',
      time: selectedTime,
      first_name: fname,
      last_name: lname,
      phone,
      email,
      note,
      status: 'pending',
    });
    setSubmitting(false);
    goStep(3);
  };

  const resetBooking = () => {
    setStep(0); setSelectedService(null); setSelectedDate(null); setSelectedTime('');
    setFname(''); setLname(''); setPhone(''); setEmail(''); setNote('');
  };

  // Calendar rendering
  const renderCalendar = () => {
    const firstDay = new Date(calYear, calMonth, 1).getDay();
    const offset = firstDay === 0 ? 6 : firstDay - 1;
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const cells = [];

    for (let i = 0; i < offset; i++) cells.push(<div key={`e${i}`} />);
    for (let d = 1; d <= daysInMonth; d++) {
      const thisDate = new Date(calYear, calMonth, d);
      const isPast = thisDate < today && thisDate.toDateString() !== today.toDateString();
      const isToday = thisDate.toDateString() === today.toDateString();
      const isSelected = selectedDate && selectedDate.toDateString() === thisDate.toDateString();

      let cls = 'aspect-square flex items-center justify-center rounded text-sm cursor-pointer border border-transparent transition-all ';
      if (isPast) cls += 'opacity-25 cursor-not-allowed text-ogx-text-muted';
      else if (isSelected) cls += 'bg-gold text-black font-bold border-gold';
      else if (isToday) cls += 'text-gold font-bold hover:border-gold-dark';
      else cls += 'text-ogx-text-muted hover:border-gold-dark hover:text-gold';

      cells.push(
        <div key={d} className={cls}
          onClick={() => !isPast && setSelectedDate(new Date(calYear, calMonth, d))}>
          {d}
        </div>
      );
    }
    return cells;
  };

  return (
    <section id="appointment" className="py-20 px-6" style={{ background: 'var(--ogx-bg3)' }}>
      <div className="max-w-[1100px] mx-auto">
        <SectionHeader label={t.apptLabel} title={t.apptTitle} />

        {/* Stepper */}
        <div className="flex items-center justify-center gap-0 mb-12 flex-wrap">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="flex flex-col items-center gap-2 relative" style={{ marginRight: i < 3 ? 60 : 0 }}>
              {i < 3 && (
                <div className="absolute top-5 h-0.5 w-[60px] z-0"
                  style={{ left: '50%', background: i < step ? 'var(--gold)' : 'var(--ogx-border)' }} />
              )}
              <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-orbitron text-sm font-bold relative z-10 transition-all
                ${i < step ? 'border-gold bg-gold text-black' : i === step ? 'border-gold text-gold shadow-[0_0_18px_rgba(201,162,39,0.35)]' : 'border-ogx-border text-ogx-text-muted'}`}
                style={{ background: i < step ? 'var(--gold)' : 'var(--ogx-bg3)' }}>
                {i < step ? '✓' : i === 3 ? '✓' : i + 1}
              </div>
              <span className={`text-[0.7rem] tracking-widest uppercase whitespace-nowrap ${i === step ? 'text-gold' : i < step ? 'text-gold-dark' : 'text-ogx-text-muted'}`}>
                {t.stepLabels[i]}
              </span>
            </div>
          ))}
        </div>

        <div className="max-w-[860px] mx-auto">
          {/* Step 0: Service */}
          {step === 0 && (
            <div style={{ animation: 'fadeUp 0.45s forwards' }}>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                {services.map(s => {
                  const Icon = iconMap[s.icon];
                  const isSelected = selectedService?.id === s.id;
                  return (
                    <div key={s.id}
                      onClick={() => {
                        if (s.link) { navigate(s.link); return; }
                        setSelectedService(s);
                      }}
                      className={`relative overflow-hidden rounded-md p-5 text-center cursor-pointer transition-all border-[1.5px]
                        ${isSelected ? 'border-gold shadow-[0_0_24px_rgba(201,162,39,0.25)]' : 'border-ogx-border hover:border-gold-dark hover:-translate-y-0.5'}`}
                      style={{ background: isSelected ? 'linear-gradient(135deg, rgba(201,162,39,0.06), transparent)' : 'var(--ogx-card)' }}>
                      {isSelected && (
                        <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-gold text-black text-[0.65rem] font-black flex items-center justify-center">✓</div>
                      )}
                      <div className="flex justify-center mb-3">
                        {Icon && <Icon className="text-gold" size={28} strokeWidth={1.5} />}
                      </div>
                      <div className={`font-orbitron text-[0.7rem] font-bold tracking-widest leading-tight ${isSelected ? 'text-gold' : 'text-ogx-text'}`}>
                        {isArabic ? s.ar : s.fr}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-end">
                <button disabled={!selectedService} onClick={() => goStep(1)}
                  className="bg-gradient-to-br from-gold-dark to-gold text-black px-8 py-3 font-orbitron text-xs font-bold tracking-widest rounded-sm disabled:opacity-35 disabled:cursor-not-allowed hover:opacity-90 hover:-translate-y-0.5 transition-all"
                  style={{ clipPath: 'polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%)' }}>
                  {t.btnNext}
                </button>
              </div>
            </div>
          )}

          {/* Step 1: Date & Time */}
          {step === 1 && (
            <div style={{ animation: 'fadeUp 0.45s forwards' }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
                {/* Calendar */}
                <div className="bg-ogx-card border border-ogx-border rounded-md p-5">
                  <div className="flex items-center justify-between mb-4">
                    <button onClick={calPrev} className="bg-ogx-bg3 border border-ogx-border text-ogx-text px-2.5 py-1 rounded-sm text-sm hover:border-gold hover:text-gold transition-all">‹</button>
                    <div className="font-orbitron text-sm font-bold text-gold tracking-widest">{t.months[calMonth]} {calYear}</div>
                    <button onClick={calNext} className="bg-ogx-bg3 border border-ogx-border text-ogx-text px-2.5 py-1 rounded-sm text-sm hover:border-gold hover:text-gold transition-all">›</button>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {t.days.map(d => (
                      <div key={d} className="text-[0.65rem] tracking-wider text-ogx-text-muted py-1 uppercase">{d}</div>
                    ))}
                    {renderCalendar()}
                  </div>
                </div>

                {/* Time slots */}
                <div className="bg-ogx-card border border-ogx-border rounded-md p-5">
                  <div className="font-orbitron text-xs font-bold text-gold tracking-widest mb-4">{t.timeBoxTitle}</div>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map(slot => (
                      <div key={slot.time}
                        onClick={() => !slot.booked && setSelectedTime(slot.time)}
                        className={`text-center py-2 px-1 rounded text-sm tracking-wider border transition-all cursor-pointer
                          ${slot.booked ? 'opacity-30 cursor-not-allowed line-through border-ogx-border text-ogx-text-muted' :
                          selectedTime === slot.time ? 'bg-gold text-black font-bold border-gold' :
                          'bg-ogx-bg3 border-ogx-border text-ogx-text-muted hover:border-gold-dark hover:text-gold'}`}>
                        {slot.time}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-4 mt-3.5 flex-wrap text-[0.7rem] tracking-wider text-ogx-text-muted">
                    <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-gold" /> {t.legAvail}</span>
                    <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-ogx-border" /> {t.legBusy}</span>
                    <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-gold opacity-40" /> {t.legSel}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button onClick={() => goStep(0)}
                  className="border border-ogx-border text-ogx-text-muted px-6 py-3 font-orbitron text-xs tracking-widest rounded-sm hover:border-gold hover:text-gold transition-all"
                  style={{ clipPath: 'polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%)' }}>
                  {t.btnBack}
                </button>
                <button disabled={!selectedDate || !selectedTime} onClick={() => goStep(2)}
                  className="bg-gradient-to-br from-gold-dark to-gold text-black px-8 py-3 font-orbitron text-xs font-bold tracking-widest rounded-sm disabled:opacity-35 disabled:cursor-not-allowed hover:opacity-90 transition-all"
                  style={{ clipPath: 'polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%)' }}>
                  {t.btnNext}
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Info */}
          {step === 2 && (
            <div style={{ animation: 'fadeUp 0.45s forwards' }}>
              <div className="bg-ogx-card border border-gold-dark rounded-md p-5 mb-7 flex gap-6 flex-wrap items-center">
                <div className="flex items-center gap-2 text-sm text-ogx-text-muted">
                  🎯 <div><span className="text-[0.7rem] tracking-widest">{t.sumService}</span><br/><strong className="text-gold font-orbitron text-xs tracking-wider">{getServiceName()}</strong></div>
                </div>
                <div className="flex items-center gap-2 text-sm text-ogx-text-muted">
                  📅 <div><span className="text-[0.7rem] tracking-widest">{t.sumDate}</span><br/><strong className="text-gold font-orbitron text-xs tracking-wider">{getDateLabel(selectedDate)}</strong></div>
                </div>
                <div className="flex items-center gap-2 text-sm text-ogx-text-muted">
                  🕐 <div><span className="text-[0.7rem] tracking-widest">{t.sumTime}</span><br/><strong className="text-gold font-orbitron text-xs tracking-wider">{selectedTime || '—'}</strong></div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                <div>
                  <label className="block text-xs tracking-widest uppercase text-gold mb-2">{t.fnameLbl}</label>
                  <input value={fname} onChange={e => setFname(e.target.value)}
                    className="w-full bg-ogx-bg3 border border-ogx-border text-ogx-text px-4 py-3 rounded-sm text-sm focus:border-gold outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-gold mb-2">{t.lnameLbl}</label>
                  <input value={lname} onChange={e => setLname(e.target.value)}
                    className="w-full bg-ogx-bg3 border border-ogx-border text-ogx-text px-4 py-3 rounded-sm text-sm focus:border-gold outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-gold mb-2">{t.phoneLbl}</label>
                  <input value={phone} onChange={e => setPhone(e.target.value)} type="tel" placeholder="+213 XX XX XX XX"
                    className="w-full bg-ogx-bg3 border border-ogx-border text-ogx-text px-4 py-3 rounded-sm text-sm focus:border-gold outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-gold mb-2">{t.emailLbl}</label>
                  <input value={email} onChange={e => setEmail(e.target.value)} type="email"
                    className="w-full bg-ogx-bg3 border border-ogx-border text-ogx-text px-4 py-3 rounded-sm text-sm focus:border-gold outline-none transition-all" />
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-xs tracking-widest uppercase text-gold mb-2">{t.noteLbl}</label>
                <textarea value={note} onChange={e => setNote(e.target.value)} rows={3}
                  className="w-full bg-ogx-bg3 border border-ogx-border text-ogx-text px-4 py-3 rounded-sm text-sm focus:border-gold outline-none transition-all resize-y" />
              </div>

              <div className="flex justify-between">
                <button onClick={() => goStep(1)}
                  className="border border-ogx-border text-ogx-text-muted px-6 py-3 font-orbitron text-xs tracking-widest rounded-sm hover:border-gold hover:text-gold transition-all"
                  style={{ clipPath: 'polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%)' }}>
                  {t.btnBack}
                </button>
                <button onClick={confirmBooking} disabled={submitting}
                  className="bg-gradient-to-br from-gold-dark to-gold text-black px-8 py-3 font-orbitron text-xs font-bold tracking-widest rounded-sm hover:opacity-90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ clipPath: 'polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%)' }}>
                  {t.btnConfirm}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="text-center py-10" style={{ animation: 'fadeUp 0.45s forwards' }}>
              <div className="text-6xl mb-5" style={{ animation: 'confPop 0.5s ease-out' }}>🎉</div>
              <div className="font-orbitron text-2xl font-black text-gold tracking-widest mb-4">{t.confTitle}</div>
              <p className="text-ogx-text-muted mb-0">{t.confSubtitle}</p>

              <div className="max-w-[420px] mx-auto mt-7 bg-ogx-card border border-gold rounded-md overflow-hidden shadow-[0_0_40px_rgba(201,162,39,0.12)]">
                <div className="bg-gradient-to-br from-gold-dark to-gold text-black px-5 py-3.5 font-orbitron text-xs font-black tracking-widest flex justify-between items-center">
                  <span>CYBER OGX</span>
                  <span>{ticketId}</span>
                </div>
                <div className="p-5 flex flex-col gap-3">
                  {[
                    [t.tkClient, `${fname} ${lname}`],
                    [t.tkService, getServiceName()],
                    [t.tkDate, getDateLabel(selectedDate)],
                    [t.tkTime, selectedTime],
                  ].map(([key, val], i) => (
                    <div key={i} className="flex justify-between items-center border-b border-dashed border-ogx-border pb-2.5 last:border-0 last:pb-0">
                      <span className="text-[0.7rem] tracking-widest uppercase text-ogx-text-muted">{key}</span>
                      <span className="font-orbitron text-xs text-gold font-bold">{val}</span>
                    </div>
                  ))}
                  <div className="w-[70px] h-[70px] mx-auto rounded opacity-60"
                    style={{ background: 'repeating-conic-gradient(var(--gold-dark) 0% 25%, transparent 0% 50%) 0 0/6px 6px' }} />
                </div>
                <div className="bg-ogx-bg3 border-t border-dashed border-ogx-border px-5 py-3 text-[0.7rem] tracking-widest text-ogx-text-muted text-center">
                  {t.tkFooter}
                </div>
              </div>

              <div className="flex justify-center mt-6">
                <button onClick={resetBooking}
                  className="border border-gold text-gold px-7 py-3 font-orbitron text-xs tracking-widest rounded-sm hover:bg-gold hover:text-black transition-all"
                  style={{ clipPath: 'polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%)' }}>
                  {t.confNewBtn}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}