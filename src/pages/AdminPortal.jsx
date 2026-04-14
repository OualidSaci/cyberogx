import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { Users, ClipboardList, Eye, CheckCircle, XCircle, Clock, RefreshCw, LogOut } from 'lucide-react';

const STATUS_COLORS = {
  pending: 'text-yellow-400 border-yellow-400',
  confirmed: 'text-blue-400 border-blue-400',
  done: 'text-green-400 border-green-400',
  cancelled: 'text-red-400 border-red-400',
};

const STATUS_LABELS = {
  pending: 'En attente',
  confirmed: 'Confirmé',
  done: 'Terminé',
  cancelled: 'Annulé',
};

export default function AdminPortal() {
  const [requests, setRequests] = useState([]);
  const [visits, setVisits] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('requests');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    base44.auth.me().then(u => {
      if (u.role !== 'admin') { navigate('/'); return; }
      setUser(u);
      loadData();
    }).catch(() => navigate('/'));
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [reqs, vis, usrs] = await Promise.all([
      base44.entities.ServiceRequest.list('-created_date', 100),
      base44.entities.SiteVisit.list('-created_date', 200),
      base44.entities.User.list('-created_date', 100),
    ]);
    setRequests(reqs);
    setVisits(vis);
    setUsers(usrs);
    setLoading(false);
  };

  const updateStatus = async (id, status) => {
    await base44.entities.ServiceRequest.update(id, { status });
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const stats = [
    { label: 'Visites totales', value: visits.length, icon: Eye, color: 'text-blue-400' },
    { label: 'Demandes reçues', value: requests.length, icon: ClipboardList, color: 'text-gold' },
    { label: 'En attente', value: requests.filter(r => r.status === 'pending').length, icon: Clock, color: 'text-yellow-400' },
    { label: 'Utilisateurs inscrits', value: users.length, icon: Users, color: 'text-green-400' },
  ];

  const tabs = [
    { id: 'requests', label: 'Demandes de service', icon: ClipboardList },
    { id: 'visits', label: 'Visites du site', icon: Eye },
    { id: 'users', label: 'Utilisateurs', icon: Users },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--ogx-bg)', color: 'var(--ogx-text)', fontFamily: 'var(--font-rajdhani)' }}>
      {/* Header */}
      <div className="border-b border-ogx-border px-6 py-4 flex items-center justify-between" style={{ background: 'rgba(10,10,10,0.9)' }}>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="text-ogx-text-muted hover:text-gold transition-colors font-orbitron text-xs tracking-widest">← Retour</button>
          <div className="font-orbitron text-lg font-black tracking-widest bg-gradient-to-br from-gold-dark via-gold to-gold-light bg-clip-text text-transparent">
            CYBER OGX · ADMIN
          </div>
        </div>
        <div className="flex items-center gap-3">
          {user && <span className="text-xs text-ogx-text-muted tracking-widest">{user.email}</span>}
          <button onClick={loadData} className="flex items-center gap-1.5 bg-ogx-bg3 border border-ogx-border px-3 py-1.5 rounded text-xs text-ogx-text-muted hover:text-gold hover:border-gold transition-all">
            <RefreshCw size={12} /> Actualiser
          </button>
          <button onClick={() => base44.auth.logout('/')} className="flex items-center gap-1.5 bg-ogx-bg3 border border-ogx-border px-3 py-1.5 rounded text-xs text-red-400 hover:border-red-400 transition-all">
            <LogOut size={12} /> Déconnexion
          </button>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-10">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="bg-ogx-card border border-ogx-border rounded-md p-5 flex flex-col gap-2">
                <Icon className={s.color} size={22} />
                <div className={`font-orbitron text-3xl font-black ${s.color}`}>{s.value}</div>
                <div className="text-xs text-ogx-text-muted tracking-widest uppercase">{s.label}</div>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 font-orbitron text-xs tracking-widest rounded-sm border transition-all
                  ${activeTab === tab.id ? 'border-gold text-gold bg-gold/5' : 'border-ogx-border text-ogx-text-muted hover:border-gold-dark hover:text-gold'}`}>
                <Icon size={14} /> {tab.label}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Service Requests */}
            {activeTab === 'requests' && (
              <div className="space-y-3">
                {requests.length === 0 && <p className="text-ogx-text-muted text-center py-10 tracking-widest">Aucune demande pour l'instant.</p>}
                {requests.map(r => (
                  <div key={r.id} className="bg-ogx-card border border-ogx-border rounded-md p-5 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-orbitron text-xs text-gold tracking-widest">{r.ticket_id}</span>
                        <span className={`text-[0.65rem] font-orbitron tracking-widest border rounded px-2 py-0.5 ${STATUS_COLORS[r.status]}`}>
                          {STATUS_LABELS[r.status]}
                        </span>
                      </div>
                      <div className="text-sm font-bold text-ogx-text">{r.first_name} {r.last_name}</div>
                      <div className="text-xs text-ogx-text-muted">{r.service_name_fr} · {r.date} à {r.time}</div>
                      <div className="text-xs text-ogx-text-muted">{r.phone}{r.email ? ` · ${r.email}` : ''}</div>
                      {r.note && <div className="text-xs text-ogx-text-muted italic">"{r.note}"</div>}
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {r.status !== 'confirmed' && r.status !== 'done' && (
                        <button onClick={() => updateStatus(r.id, 'confirmed')}
                          className="flex items-center gap-1 border border-blue-400 text-blue-400 px-3 py-1.5 rounded text-xs font-orbitron tracking-widest hover:bg-blue-400/10 transition-all">
                          <CheckCircle size={12} /> Confirmer
                        </button>
                      )}
                      {r.status !== 'done' && (
                        <button onClick={() => updateStatus(r.id, 'done')}
                          className="flex items-center gap-1 border border-green-400 text-green-400 px-3 py-1.5 rounded text-xs font-orbitron tracking-widest hover:bg-green-400/10 transition-all">
                          <CheckCircle size={12} /> Terminé
                        </button>
                      )}
                      {r.status !== 'cancelled' && (
                        <button onClick={() => updateStatus(r.id, 'cancelled')}
                          className="flex items-center gap-1 border border-red-400 text-red-400 px-3 py-1.5 rounded text-xs font-orbitron tracking-widest hover:bg-red-400/10 transition-all">
                          <XCircle size={12} /> Annuler
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Site Visits */}
            {activeTab === 'visits' && (
              <div className="bg-ogx-card border border-ogx-border rounded-md overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-ogx-border">
                      <th className="text-left px-4 py-3 text-xs tracking-widest text-gold font-orbitron">Date</th>
                      <th className="text-left px-4 py-3 text-xs tracking-widest text-gold font-orbitron">Page</th>
                      <th className="text-left px-4 py-3 text-xs tracking-widest text-gold font-orbitron hidden md:table-cell">Référent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visits.length === 0 && (
                      <tr><td colSpan={3} className="text-center py-10 text-ogx-text-muted tracking-widest">Aucune visite enregistrée.</td></tr>
                    )}
                    {visits.map(v => (
                      <tr key={v.id} className="border-b border-ogx-border last:border-0 hover:bg-ogx-bg3 transition-colors">
                        <td className="px-4 py-3 text-xs text-ogx-text-muted">{new Date(v.created_date).toLocaleString('fr-FR')}</td>
                        <td className="px-4 py-3 text-xs text-ogx-text">{v.page}</td>
                        <td className="px-4 py-3 text-xs text-ogx-text-muted hidden md:table-cell">{v.referrer || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Users */}
            {activeTab === 'users' && (
              <div className="bg-ogx-card border border-ogx-border rounded-md overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-ogx-border">
                      <th className="text-left px-4 py-3 text-xs tracking-widest text-gold font-orbitron">Nom</th>
                      <th className="text-left px-4 py-3 text-xs tracking-widest text-gold font-orbitron">Email</th>
                      <th className="text-left px-4 py-3 text-xs tracking-widest text-gold font-orbitron">Rôle</th>
                      <th className="text-left px-4 py-3 text-xs tracking-widest text-gold font-orbitron hidden md:table-cell">Inscrit le</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 && (
                      <tr><td colSpan={4} className="text-center py-10 text-ogx-text-muted tracking-widest">Aucun utilisateur.</td></tr>
                    )}
                    {users.map(u => (
                      <tr key={u.id} className="border-b border-ogx-border last:border-0 hover:bg-ogx-bg3 transition-colors">
                        <td className="px-4 py-3 text-sm text-ogx-text">{u.full_name || '—'}</td>
                        <td className="px-4 py-3 text-xs text-ogx-text-muted">{u.email}</td>
                        <td className="px-4 py-3">
                          <span className={`text-[0.65rem] font-orbitron tracking-widest border rounded px-2 py-0.5 ${u.role === 'admin' ? 'border-gold text-gold' : 'border-ogx-border text-ogx-text-muted'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-ogx-text-muted hidden md:table-cell">{new Date(u.created_date).toLocaleDateString('fr-FR')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}