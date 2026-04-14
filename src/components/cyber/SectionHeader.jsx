export default function SectionHeader({ label, title }) {
  return (
    <div className="text-center mb-14">
      <p className="text-xs tracking-widest uppercase text-gold mb-3">{label}</p>
      <h2 className="font-orbitron text-3xl md:text-4xl font-black tracking-wider text-ogx-text">{title}</h2>
      <div className="w-16 h-0.5 mx-auto mt-5" style={{ background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }} />
    </div>
  );
}