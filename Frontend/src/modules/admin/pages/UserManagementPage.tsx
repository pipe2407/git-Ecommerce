import Layout from '../../../shared/components/Layout';

const MOCK_USERS = [
  { id: '1', name: 'Alfonso Perez', email: 'alfonso.perez@email.com', role: 'Vendedor', status: 'Activo', joinedAt: '2023-11-12' },
  { id: '2', name: 'Maria Gomez', email: 'maria.g@email.com', role: 'Comprador', status: 'Activo', joinedAt: '2024-01-05' },
  { id: '3', name: 'Carlos Tech', email: 'ctech89@email.com', role: 'Comprador', status: 'Bloqueado', joinedAt: '2024-02-18' },
  { id: '4', name: 'Tech Store Admin', email: 'admin@techcore.com', role: 'Administrador', status: 'Activo', joinedAt: '2022-09-01' }
];

export default function UserManagementPage() {
  return (
    <Layout>
      <div className="max-w-screen-xl mx-auto px-4 py-12 relative">
        <div className="orb orb-purple w-96 h-96 top-0 right-10 opacity-20" />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 relative z-10">
          <div>
            <h1 className="text-3xl font-extrabold text-white mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
              Gestión de <span className="gradient-text">Usuarios</span>
            </h1>
            <p className="text-slate-400">
              Administra los permisos, roles y estados de las cuentas registradas en la plataforma.
            </p>
          </div>
          <button className="btn-primary mt-4 md:mt-0">
            + Invitar Usuario
          </button>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="p-5 text-sm font-semibold text-slate-300">Usuario</th>
                  <th className="p-5 text-sm font-semibold text-slate-300">Rol</th>
                  <th className="p-5 text-sm font-semibold text-slate-300">Estado</th>
                  <th className="p-5 text-sm font-semibold text-slate-300 hidden sm:table-cell">Fecha Registro</th>
                  <th className="p-5 text-sm font-semibold text-slate-300 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_USERS.map((user, idx) => (
                  <tr key={user.id} className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors ${idx === MOCK_USERS.length - 1 ? 'border-b-0' : ''}`}>
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center font-bold text-cyan-400">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-white font-medium text-sm">{user.name}</div>
                          <div className="text-slate-500 text-xs">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        user.role === 'Administrador' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                        user.role === 'Vendedor' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                        'bg-slate-500/10 text-slate-300 border-slate-500/20'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-5">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                        user.status === 'Activo' ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${user.status === 'Activo' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                        {user.status}
                      </span>
                    </td>
                    <td className="p-5 text-sm text-slate-400 hidden sm:table-cell">
                      {user.joinedAt}
                    </td>
                    <td className="p-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="btn-ghost px-3 py-1.5 text-xs text-slate-300 hover:text-white">Editar</button>
                        {user.status === 'Activo' ? (
                          <button className="btn-ghost px-3 py-1.5 text-xs text-red-400 border-red-500/20 hover:bg-red-500/10">Bloquear</button>
                        ) : (
                          <button className="btn-ghost px-3 py-1.5 text-xs text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/10">Desbloquear</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
