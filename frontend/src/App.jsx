import { useEffect, useMemo, useState } from 'react';
import './styles.css';

const initialForm = {
  name: '',
  os_type: 'Ubuntu 24.04',
  ram_mb: 4096,
  cpu_cores: 2,
  disk_gb: 40,
  network: 'nat'
};

function App() {
  const [form, setForm] = useState(initialForm);
  const [vms, setVms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadVms();
  }, []);

  async function loadVms() {
    try {
      const response = await fetch('/api/vms');
      const data = await response.json();
      setVms(data);
    } catch {
      setError('Impossible de charger les machines virtuelles.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!form.name.trim()) {
      setError('Le nom de la VM est obligatoire.');
      return;
    }

    try {
      const response = await fetch('/api/vms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...form,
          ram_mb: Number(form.ram_mb),
          cpu_cores: Number(form.cpu_cores),
          disk_gb: Number(form.disk_gb)
        })
      });

      if (!response.ok) {
        throw new Error('Erreur API');
      }

      const created = await response.json();
      setVms((current) => [created, ...current]);
      setMessage(`Machine virtuelle "${created.name}" créée avec succès.`);
      setForm(initialForm);
    } catch {
      setError('La création de la VM a échoué.');
    }
  }

  const totalRam = useMemo(
    () => vms.reduce((sum, vm) => sum + Number(vm.ram_mb || 0), 0),
    [vms]
  );

  return (
    <main className="app-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">VMdeveloppeur</p>
          <h1>Créer et préparer des machines virtuelles simplement.</h1>
          <p className="lead">
            Configure une VM, enregistre-la dans le backend, puis fais évoluer
            l'application vers le pilotage réel d'un hyperviseur.
          </p>
        </div>

        <div className="stats">
          <article>
            <span>Machines</span>
            <strong>{vms.length}</strong>
          </article>
          <article>
            <span>RAM totale</span>
            <strong>{totalRam} MB</strong>
          </article>
        </div>
      </section>

      <section className="content-grid">
        <form className="panel form-panel" onSubmit={handleSubmit}>
          <h2>Nouvelle machine</h2>

          <label>
            Nom
            <input
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              placeholder="ex: Dev-Ubuntu"
            />
          </label>

          <label>
            Système d'exploitation
            <input
              value={form.os_type}
              onChange={(event) => setForm({ ...form, os_type: event.target.value })}
            />
          </label>

          <div className="field-row">
            <label>
              RAM (MB)
              <input
                type="number"
                min="512"
                step="512"
                value={form.ram_mb}
                onChange={(event) => setForm({ ...form, ram_mb: event.target.value })}
              />
            </label>

            <label>
              CPU
              <input
                type="number"
                min="1"
                step="1"
                value={form.cpu_cores}
                onChange={(event) => setForm({ ...form, cpu_cores: event.target.value })}
              />
            </label>
          </div>

          <div className="field-row">
            <label>
              Disque (GB)
              <input
                type="number"
                min="10"
                step="10"
                value={form.disk_gb}
                onChange={(event) => setForm({ ...form, disk_gb: event.target.value })}
              />
            </label>

            <label>
              Réseau
              <select
                value={form.network}
                onChange={(event) => setForm({ ...form, network: event.target.value })}
              >
                <option value="nat">NAT</option>
                <option value="bridged">Bridged</option>
                <option value="host-only">Host-only</option>
              </select>
            </label>
          </div>

          <button type="submit">Créer la VM</button>

          {message ? <p className="message success">{message}</p> : null}
          {error ? <p className="message error">{error}</p> : null}
        </form>

        <section className="panel list-panel">
          <div className="panel-head">
            <h2>Machines existantes</h2>
            <button type="button" className="secondary" onClick={loadVms}>
              Rafraîchir
            </button>
          </div>

          {loading ? (
            <p>Chargement...</p>
          ) : vms.length === 0 ? (
            <p>Aucune machine virtuelle pour le moment.</p>
          ) : (
            <div className="vm-list">
              {vms.map((vm) => (
                <article key={vm.id} className="vm-card">
                  <div className="vm-card-top">
                    <h3>{vm.name}</h3>
                    <span className="badge">{vm.status}</span>
                  </div>
                  <p>{vm.os_type}</p>
                  <ul>
                    <li>{vm.ram_mb} MB RAM</li>
                    <li>{vm.cpu_cores} CPU</li>
                    <li>{vm.disk_gb} GB disque</li>
                    <li>{vm.network}</li>
                  </ul>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

export default App;
