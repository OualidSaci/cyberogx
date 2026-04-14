export default function Footer({ t }) {
  return (
    <footer className="border-t border-ogx-border py-6 px-6 text-center text-sm text-ogx-text-muted tracking-widest"
      style={{ background: 'var(--ogx-bg)' }}>
      <span dangerouslySetInnerHTML={{ __html: t.footer }} />
    </footer>
  );
}