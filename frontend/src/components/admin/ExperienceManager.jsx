import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Briefcase,
  Building2,
  Calendar,
  GraduationCap,
  ImagePlus,
  Pencil,
  Plus,
  Save,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { deleteAdminExperience, getAdminExperience, saveAdminExperience } from '../../lib/api';

const emptyForm = {
  role: '',
  company: '',
  company_logo_url: '',
  start_date: '',
  end_date: '',
  is_present: false,
  description: '',
  order_index: 0,
};

const inputCls = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/60 transition-all text-sm';
const labelCls = 'text-xs font-semibold uppercase tracking-widest text-slate-500';

const sortByOrder = (items) => [...items].sort((a, b) => {
  const orderDiff = Number(a.order_index ?? 0) - Number(b.order_index ?? 0);
  if (orderDiff !== 0) return orderDiff;
  return String(a.start_date || a.start || '').localeCompare(String(b.start_date || b.start || ''));
});

const isEducation = (item) => item.type === 'education'
  || /\b(b\.?tech|education|certificate|higher secondary|hsc|college|school)\b/i.test(`${item.role || ''} ${item.company || ''}`);

const ExperienceManager = () => {
  const [items, setItems] = useState([]);
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

    getAdminExperience()
      .then(data => {
        if (!active) return;
        setItems(sortByOrder(data));
        setStatus('ready');
      })
      .catch(loadError => {
        if (!active) return;
        setError(loadError.message || 'Could not load experience.');
        setStatus('ready');
      });

    return () => {
      active = false;
    };
  }, []);

  const filteredItems = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return items;

    return items.filter(item => (
      item.role.toLowerCase().includes(term)
      || item.company.toLowerCase().includes(term)
      || item.description.toLowerCase().includes(term)
      || item.start_date.toLowerCase().includes(term)
      || item.end_date.toLowerCase().includes(term)
    ));
  }, [items, search]);

  const currentCount = useMemo(
    () => items.filter(item => item.is_present).length,
    [items],
  );

  const educationCount = useMemo(
    () => items.filter(isEducation).length,
    [items],
  );

  const nextOrder = useMemo(() => (
    items.reduce((max, item) => Math.max(max, Number(item.order_index ?? 0)), 0) + 1
  ), [items]);

  const setValue = (key, value) => {
    setForm(current => ({ ...current, [key]: value }));
  };

  const openAdd = () => {
    setForm({ ...emptyForm, order_index: nextOrder });
    setEditId(null);
    setError('');
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setForm({
      ...emptyForm,
      ...item,
      start_date: item.start_date || item.start || '',
      end_date: item.end_date || item.end || '',
      description: item.description || item.desc || '',
      is_present: item.is_present ?? false,
      order_index: Number(item.order_index ?? 0),
    });
    setEditId(item.id);
    setError('');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditId(null);
  };

  const handleSave = async () => {
    const role = form.role.trim();
    const company = form.company.trim();
    const description = form.description.trim();

    if (!role) {
      setError('Role or title is required.');
      return;
    }

    if (!company) {
      setError('Company, college, or organization is required.');
      return;
    }

    if (!description) {
      setError('Description is required.');
      return;
    }

    setActionStatus('saving');
    setError('');

    try {
      const saved = await saveAdminExperience({
        ...form,
        id: editId,
        role,
        company,
        description,
        company_logo_url: form.company_logo_url.trim(),
        end_date: form.is_present ? '' : form.end_date,
        order_index: Number(form.order_index ?? 0),
      });

      setItems(current => sortByOrder(editId
        ? current.map(item => item.id === editId ? saved : item)
        : [...current, saved]));
      closeModal();
    } catch (saveError) {
      setError(saveError.message || 'Could not save experience.');
    } finally {
      setActionStatus('');
    }
  };

  const togglePresent = async (item) => {
    const next = { ...item, is_present: !item.is_present, end_date: !item.is_present ? '' : item.end_date };
    setItems(current => sortByOrder(current.map(entry => entry.id === item.id ? next : entry)));

    try {
      const saved = await saveAdminExperience(next);
      setItems(current => sortByOrder(current.map(entry => entry.id === item.id ? saved : entry)));
    } catch (toggleError) {
      setError(toggleError.message || 'Could not update experience.');
      setItems(current => sortByOrder(current.map(entry => entry.id === item.id ? item : entry)));
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setActionStatus('deleting');
    setError('');

    try {
      await deleteAdminExperience(deleteTarget.id);
      setItems(current => current.filter(item => item.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (deleteError) {
      setError(deleteError.message || 'Could not delete experience.');
    } finally {
      setActionStatus('');
    }
  };

  const statCards = [
    { label: 'Total Entries', value: items.length, helper: `${filteredItems.length} visible in list`, Icon: Briefcase, color: 'text-cyan-300' },
    { label: 'Current', value: currentCount, helper: 'Marked present', Icon: Calendar, color: 'text-emerald-300' },
    { label: 'Education', value: educationCount, helper: 'Detected from title', Icon: GraduationCap, color: 'text-purple-300' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold font-heading text-white">Experience Manager</h2>
          <p className="mt-1 text-slate-500">Add, update, and remove work experience or education entries.</p>
        </div>
        <button onClick={openAdd} className="btn-primary w-fit">
          <Plus size={18} /> Add Experience
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
            placeholder="Search experience"
          />
        </label>
      </div>

      <div className="space-y-4">
        {status === 'loading' ? (
          <div className="glass-card p-6 text-slate-500">Loading experience...</div>
        ) : filteredItems.length === 0 ? (
          <div className="glass-card p-10 text-center text-slate-500">No experience entries match this view.</div>
        ) : filteredItems.map((item, index) => {
          const education = isEducation(item);
          const Icon = education ? GraduationCap : Briefcase;

          return (
            <motion.div
              key={item.id || `${item.role}-${item.company}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className="glass-card p-5"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex min-w-0 gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border border-purple-400/20 bg-purple-400/10 text-purple-300">
                    <Icon size={22} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-heading text-lg font-bold text-white">{item.role}</h3>
                      <span className="rounded-full border border-white/10 bg-white/6 px-2 py-0.5 text-xs font-semibold text-slate-300">
                        {education ? 'Education' : 'Work'}
                      </span>
                      {item.is_present && (
                        <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-xs font-semibold text-emerald-300">
                          Present
                        </span>
                      )}
                    </div>
                    <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-cyan-300">
                      <Building2 size={14} /> {item.company}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-widest text-slate-600">
                      {item.start_date} - {item.is_present ? 'Present' : item.end_date || 'Current'} | Order {item.order_index}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-slate-400">{item.description}</p>
                  </div>
                </div>
                <div className="flex flex-wrap justify-end gap-2">
                  <button
                    onClick={() => togglePresent(item)}
                    className="rounded-lg bg-white/5 px-3 py-2 text-xs font-semibold text-slate-400 transition-all hover:bg-white/10 hover:text-emerald-300"
                  >
                    {item.is_present ? 'Set Past' : 'Set Present'}
                  </button>
                  <button
                    onClick={() => openEdit(item)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-slate-400 transition-all hover:bg-white/10 hover:text-indigo-400"
                    title="Edit experience"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget({ id: item.id, name: item.role })}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-slate-400 transition-all hover:bg-red-500/10 hover:text-red-400"
                    title="Delete experience"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              className="relative z-10 my-8 w-full max-w-3xl glass-card p-7"
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              onClick={event => event.stopPropagation()}
            >
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold font-heading text-white">{editId ? 'Edit Experience' : 'Add Experience'}</h3>
                  <p className="mt-1 text-sm text-slate-500">This entry appears in the public Experience section.</p>
                </div>
                <button onClick={closeModal} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_120px]">
                  <div>
                    <label className={labelCls}>Role / Title</label>
                    <input
                      className={`${inputCls} mt-2`}
                      value={form.role}
                      onChange={event => setValue('role', event.target.value)}
                      placeholder="Full Stack Developer Intern"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Company / College</label>
                    <input
                      className={`${inputCls} mt-2`}
                      value={form.company}
                      onChange={event => setValue('company', event.target.value)}
                      placeholder="Roriri Software Solutions"
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

                <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_160px]">
                  <div>
                    <label className={labelCls}>Start</label>
                    <input
                      className={`${inputCls} mt-2`}
                      value={form.start_date}
                      onChange={event => setValue('start_date', event.target.value)}
                      placeholder="Apr 2026"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>End</label>
                    <input
                      className={`${inputCls} mt-2`}
                      value={form.end_date}
                      onChange={event => setValue('end_date', event.target.value)}
                      placeholder="Jul 2026"
                      disabled={Boolean(form.is_present)}
                    />
                  </div>
                  <label className="mt-7 flex items-center gap-2 text-sm text-slate-300">
                    <input
                      type="checkbox"
                      checked={Boolean(form.is_present)}
                      onChange={event => setValue('is_present', event.target.checked)}
                      className="h-4 w-4 accent-purple-500"
                    />
                    Present
                  </label>
                </div>

                <div>
                  <label className={labelCls}>Logo URL</label>
                  <label className="relative mt-2 block">
                    <ImagePlus className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                      className={`${inputCls} pl-11`}
                      value={form.company_logo_url}
                      onChange={event => setValue('company_logo_url', event.target.value)}
                      placeholder="Optional company or college logo URL"
                    />
                  </label>
                </div>

                <div>
                  <label className={labelCls}>Description</label>
                  <textarea
                    className={`${inputCls} mt-2 min-h-36 resize-none`}
                    value={form.description}
                    onChange={event => setValue('description', event.target.value)}
                    placeholder="Describe your responsibilities, education, or achievements"
                  />
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
                  {actionStatus === 'saving' ? 'Saving...' : editId ? 'Save Changes' : 'Add Experience'}
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
              <h3 className="mb-2 text-lg font-bold font-heading text-white">Delete Experience?</h3>
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

export default ExperienceManager;
