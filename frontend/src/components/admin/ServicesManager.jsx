import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BarChart3,
  Code2,
  Eye,
  EyeOff,
  Globe,
  Layers,
  Monitor,
  MonitorSmartphone,
  Palette,
  Pencil,
  Plus,
  Save,
  Search,
  Server,
  ShieldCheck,
  Smartphone,
  Trash2,
  Wrench,
  X,
} from 'lucide-react';
import { deleteAdminService, getAdminServices, saveAdminService } from '../../lib/api';

const serviceIconOptions = [
  { key: 'monitor', label: 'Web', Icon: Monitor },
  { key: 'frontenddevelopment', label: 'Frontend Development', Icon: MonitorSmartphone },
  { key: 'fullstackdevelopment', label: 'Full Stack Development', Icon: Layers },
  { key: 'server', label: 'Backend', Icon: Server },
  { key: 'smartphone', label: 'Mobile', Icon: Smartphone },
  { key: 'palette', label: 'Design', Icon: Palette },
  { key: 'globe', label: 'API', Icon: Globe },
  { key: 'shield', label: 'Security', Icon: ShieldCheck },
  { key: 'analytics', label: 'Analytics', Icon: BarChart3 },
  { key: 'code', label: 'Code', Icon: Code2 },
];

const serviceIconAliases = {
  webdevelopment: Monitor,
  frontend: MonitorSmartphone,
  responsive: MonitorSmartphone,
  responsivedevelopment: MonitorSmartphone,
  fullstack: Layers,
  fullstackdeveloper: Layers,
  stack: Layers,
};

const emptyForm = {
  title: '',
  icon: 'monitor',
  description: '',
  is_visible: true,
  order_index: 0,
};

const inputCls = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/60 transition-all text-sm';
const labelCls = 'text-xs font-semibold uppercase tracking-widest text-slate-500';

const sortByOrder = (items) => [...items].sort((a, b) => {
  const orderDiff = Number(a.order_index ?? 0) - Number(b.order_index ?? 0);
  if (orderDiff !== 0) return orderDiff;
  return String(a.title || '').localeCompare(String(b.title || ''));
});

const getServiceIcon = (value = '') => {
  const key = String(value).toLowerCase().replace(/[^a-z0-9]/g, '');
  return serviceIconOptions.find(option => option.key === key)?.Icon || serviceIconAliases[key] || Wrench;
};

const ServicesManager = () => {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [status, setStatus] = useState('loading');
  const [actionStatus, setActionStatus] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    getAdminServices()
      .then(data => {
        if (!active) return;
        setServices(sortByOrder(data));
        setStatus('ready');
      })
      .catch(loadError => {
        if (!active) return;
        setError(loadError.message || 'Could not load services.');
        setStatus('ready');
      });

    return () => {
      active = false;
    };
  }, []);

  const visibleCount = useMemo(
    () => services.filter(service => service.is_visible).length,
    [services],
  );

  const filteredServices = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return services;

    return services.filter(service => (
      service.title.toLowerCase().includes(term)
      || service.description.toLowerCase().includes(term)
      || service.icon.toLowerCase().includes(term)
    ));
  }, [search, services]);

  const nextOrder = useMemo(() => (
    services.reduce((max, service) => Math.max(max, Number(service.order_index ?? 0)), 0) + 1
  ), [services]);

  const setValue = (key, value) => {
    setForm(current => ({ ...current, [key]: value }));
  };

  const openAdd = () => {
    setForm({ ...emptyForm, order_index: nextOrder });
    setEditId(null);
    setError('');
    setModalOpen(true);
  };

  const openEdit = (service) => {
    setForm({
      ...emptyForm,
      ...service,
      order_index: Number(service.order_index ?? 0),
      is_visible: service.is_visible ?? true,
    });
    setEditId(service.id);
    setError('');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditId(null);
  };

  const handleSave = async () => {
    const title = form.title.trim();
    const description = form.description.trim();

    if (!title) {
      setError('Service title is required.');
      return;
    }

    if (!description) {
      setError('Service description is required.');
      return;
    }

    setActionStatus('saving');
    setError('');

    try {
      const saved = await saveAdminService({
        ...form,
        id: editId,
        title,
        description,
        icon: form.icon.trim() || 'monitor',
        order_index: Number(form.order_index ?? 0),
        is_visible: Boolean(form.is_visible),
      });

      setServices(current => sortByOrder(editId
        ? current.map(service => service.id === editId ? saved : service)
        : [...current, saved]));
      closeModal();
    } catch (saveError) {
      setError(saveError.message || 'Could not save service.');
    } finally {
      setActionStatus('');
    }
  };

  const toggleVisibility = async (service) => {
    const next = { ...service, is_visible: !service.is_visible };
    setServices(current => sortByOrder(current.map(item => item.id === service.id ? next : item)));

    try {
      const saved = await saveAdminService(next);
      setServices(current => sortByOrder(current.map(item => item.id === service.id ? saved : item)));
    } catch (toggleError) {
      setError(toggleError.message || 'Could not update service visibility.');
      setServices(current => sortByOrder(current.map(item => item.id === service.id ? service : item)));
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setActionStatus('deleting');
    setError('');

    try {
      await deleteAdminService(deleteTarget.id);
      setServices(current => current.filter(service => service.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (deleteError) {
      setError(deleteError.message || 'Could not delete service.');
    } finally {
      setActionStatus('');
    }
  };

  const selectedIcon = getServiceIcon(form.icon);
  const statCards = [
    { label: 'Total Services', value: services.length, helper: `${filteredServices.length} visible in list`, Icon: Wrench, color: 'text-cyan-300' },
    { label: 'Published', value: visibleCount, helper: 'Shown on portfolio', Icon: Eye, color: 'text-emerald-300' },
    { label: 'Hidden', value: services.length - visibleCount, helper: 'Saved but not public', Icon: EyeOff, color: 'text-amber-300' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold font-heading text-white">Services Manager</h2>
          <p className="mt-1 text-slate-500">Add, edit, publish, and delete portfolio service cards.</p>
        </div>
        <button onClick={openAdd} className="btn-primary w-fit">
          <Plus size={18} /> Add Service
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {statCards.map(({ label, value, helper, Icon, color }) => (
          <div key={label} className="glass-card p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-600">{label}</p>
                <p className="mt-2 text-2xl font-bold font-heading text-white">{value}</p>
                <p className="mt-1 truncate text-sm text-slate-500">{helper}</p>
              </div>
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/6">
                <Icon className={color} size={18} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="flex items-start justify-between gap-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          <span>{error}</span>
          <button onClick={() => setError('')} className="text-red-200/70 hover:text-white">
            <X size={16} />
          </button>
        </div>
      )}

      <div className="glass-card p-4 sm:p-5">
        <label className="relative block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input
            className={`${inputCls} pl-11`}
            value={search}
            onChange={event => setSearch(event.target.value)}
            placeholder="Search services"
          />
        </label>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {status === 'loading' ? (
          <div className="glass-card p-6 text-slate-500 xl:col-span-2">Loading services...</div>
        ) : filteredServices.length === 0 ? (
          <div className="glass-card p-10 text-center text-slate-500 xl:col-span-2">No services match this view.</div>
        ) : filteredServices.map((service, index) => {
          const Icon = getServiceIcon(service.icon);

          return (
            <motion.div
              key={service.id || service.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className="glass-card p-5"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
                  <Icon size={22} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-heading text-lg font-bold text-white">{service.title}</h3>
                    <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${service.is_visible ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300' : 'border-amber-400/30 bg-amber-400/10 text-amber-300'}`}>
                      {service.is_visible ? 'Published' : 'Hidden'}
                    </span>
                  </div>
                  <p className="mt-1 text-xs uppercase tracking-widest text-slate-600">Order {service.order_index} | {service.icon}</p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-400">{service.description}</p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap justify-end gap-2">
                <button
                  onClick={() => toggleVisibility(service)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-slate-400 transition-all hover:bg-white/10 hover:text-emerald-300"
                  title={service.is_visible ? 'Hide service' : 'Publish service'}
                >
                  {service.is_visible ? <Eye size={15} /> : <EyeOff size={15} />}
                </button>
                <button
                  onClick={() => openEdit(service)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-slate-400 transition-all hover:bg-white/10 hover:text-indigo-400"
                  title="Edit service"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => setDeleteTarget({ id: service.id, name: service.title })}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-slate-400 transition-all hover:bg-red-500/10 hover:text-red-400"
                  title="Delete service"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              className="relative z-10 w-full max-w-2xl glass-card p-7"
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              onClick={event => event.stopPropagation()}
            >
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold font-heading text-white">{editId ? 'Edit Service' : 'Add Service'}</h3>
                  <p className="mt-1 text-sm text-slate-500">This card appears in the public Services section when published.</p>
                </div>
                <button onClick={closeModal} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20">
                  <X size={16} />
                </button>
              </div>

              <div className="grid gap-6 md:grid-cols-[120px_1fr]">
                <div className="space-y-3">
                  <div className="flex h-28 w-28 items-center justify-center rounded-2xl border border-white/10 bg-white/6">
                    {React.createElement(selectedIcon, { size: 38, className: 'text-cyan-300' })}
                  </div>
                  <label className="flex items-center gap-2 text-sm text-slate-300">
                    <input
                      type="checkbox"
                      checked={Boolean(form.is_visible)}
                      onChange={event => setValue('is_visible', event.target.checked)}
                      className="h-4 w-4 accent-purple-500"
                    />
                    Published
                  </label>
                </div>

                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_120px]">
                    <div>
                      <label className={labelCls}>Service Title</label>
                      <input
                        className={`${inputCls} mt-2`}
                        value={form.title}
                        onChange={event => setValue('title', event.target.value)}
                        placeholder="Web Development"
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Order</label>
                      <input
                        className={`${inputCls} mt-2`}
                        type="number"
                        min="0"
                        value={form.order_index}
                        onChange={event => setValue('order_index', event.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Icon</label>
                    <input
                      className={`${inputCls} mt-2`}
                      value={form.icon}
                      onChange={event => setValue('icon', event.target.value)}
                      placeholder="monitor"
                      list="service-icon-options"
                    />
                    <datalist id="service-icon-options">
                      {serviceIconOptions.map(option => (
                        <option key={option.key} value={option.key}>{option.label}</option>
                      ))}
                    </datalist>
                    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {serviceIconOptions.map(option => {
                        const isSelected = form.icon === option.key;

                        return (
                          <button
                            type="button"
                            key={option.key}
                            onClick={() => setValue('icon', option.key)}
                            className={`flex min-h-11 min-w-0 items-center gap-2 rounded-xl border px-3 py-2 text-left text-xs font-semibold transition-all ${isSelected
                              ? 'border-cyan-400/50 bg-cyan-400/15 text-white'
                              : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-white'
                            }`}
                          >
                            <option.Icon size={14} />
                            <span className="leading-tight">{option.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Description</label>
                    <textarea
                      className={`${inputCls} mt-2 min-h-32 resize-none`}
                      value={form.description}
                      onChange={event => setValue('description', event.target.value)}
                      placeholder="Describe this service"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-7 flex gap-3">
                <button onClick={closeModal} className="btn-secondary flex-1 justify-center">Cancel</button>
                <button
                  onClick={handleSave}
                  disabled={actionStatus === 'saving'}
                  className="btn-primary flex-1 justify-center disabled:opacity-60"
                >
                  <Save size={16} />
                  {actionStatus === 'saving' ? 'Saving...' : editId ? 'Save Changes' : 'Add Service'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDeleteTarget(null)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              className="relative z-10 w-full max-w-sm glass-card p-8 text-center"
              initial={{ scale: 0.94 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.94 }}
              onClick={event => event.stopPropagation()}
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/15">
                <Trash2 className="text-red-400" size={24} />
              </div>
              <h3 className="mb-2 text-lg font-bold font-heading text-white">Delete Service?</h3>
              <p className="mb-6 text-sm text-slate-400">Delete "{deleteTarget.name}" from the dashboard and public portfolio.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteTarget(null)} className="btn-secondary flex-1 justify-center">Cancel</button>
                <button
                  onClick={handleDelete}
                  disabled={actionStatus === 'deleting'}
                  className="flex-1 rounded-full border border-red-500/40 bg-red-500/20 px-5 py-2.5 text-sm font-semibold text-red-400 transition-all hover:bg-red-500/30 disabled:opacity-60"
                >
                  {actionStatus === 'deleting' ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ServicesManager;
