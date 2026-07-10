import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ExternalLink, Pencil, Plus, Star, Trash2, X } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { deleteAdminProject, getAdminProjects, getProjectCategories, saveAdminProject } from '../../lib/api';

const emptyForm = {
  title: '',
  category: 'Web',
  category_id: undefined,
  tags: '',
  description: '',
  cover_image_url: '',
  live_url: '',
  repo_url: '',
  is_featured: false,
  is_published: true,
};

const fallbackCategories = ['Web', 'Mobile', 'UI/UX'];

const ProjectsManager = () => {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState(fallbackCategories);
  const [categoryLookup, setCategoryLookup] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getAdminProjects(), getProjectCategories()])
      .then(([projectData, categoryData]) => {
        setProjects(projectData);
        const names = categoryData.map(category => category.name);
        setCategories(names.length ? names : fallbackCategories);
        setCategoryLookup(Object.fromEntries(categoryData.map(category => [category.name, category.id])));
        setStatus('ready');
      })
      .catch(loadError => {
        setError(loadError.message || 'Could not load projects.');
        setStatus('ready');
      });
  }, []);

  const set = (key, value) => setForm(current => ({ ...current, [key]: value }));

  const openAdd = () => {
    setForm({ ...emptyForm, category: categories[0] || 'Web' });
    setEditProject(null);
    setModalOpen(true);
  };

  const openEdit = (project) => {
    setForm({
      ...emptyForm,
      ...project,
      tags: project.tags.join(', '),
      description: project.description || project.desc,
      cover_image_url: project.cover_image_url || project.cover,
    });
    setEditProject(project.id);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditProject(null);
  };

  const buildProject = (source) => ({
    ...source,
    id: editProject,
    category_id: categoryLookup[source.category],
    tags: source.tags.split(',').map(tag => tag.trim()).filter(Boolean),
  });

  const handleSave = async () => {
    setStatus('saving');
    setError('');
    try {
      const saved = await saveAdminProject(buildProject(form));
      setProjects(current => editProject
        ? current.map(project => project.id === editProject ? saved : project)
        : [...current, saved]);
      if (!categories.includes(saved.category)) {
        setCategories(current => [...current, saved.category]);
      }
      closeModal();
    } catch (saveError) {
      setError(saveError.message || 'Could not save project.');
    } finally {
      setStatus('ready');
    }
  };

  const handleDelete = async (id) => {
    setError('');
    try {
      await deleteAdminProject(id);
      setProjects(current => current.filter(project => project.id !== id));
      setDeleteId(null);
    } catch (deleteError) {
      setError(deleteError.message || 'Could not delete project.');
    }
  };

  const updateFlag = async (project, key) => {
    const next = { ...project, [key]: !project[key] };
    setProjects(current => current.map(item => item.id === project.id ? next : item));
    try {
      const saved = await saveAdminProject(next);
      setProjects(current => current.map(item => item.id === project.id ? saved : item));
    } catch (flagError) {
      setError(flagError.message || 'Could not update project.');
      setProjects(current => current.map(item => item.id === project.id ? project : item));
    }
  };

  const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/60 transition-all text-sm";

  return (
    <div>
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-heading text-white">Projects Manager</h2>
          <p className="text-slate-500 mt-1">{projects.length} projects total</p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus size={18} /> Add Project
        </button>
      </div>

      {error && <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>}

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8 text-slate-500 text-xs uppercase tracking-widest">
                <th className="text-left p-4">Project</th>
                <th className="text-left p-4">Category</th>
                <th className="text-left p-4">Tags</th>
                <th className="text-center p-4">Featured</th>
                <th className="text-center p-4">Published</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {status === 'loading' ? (
                <tr><td className="p-6 text-slate-500" colSpan="6">Loading projects...</td></tr>
              ) : projects.map(project => (
                <motion.tr
                  key={project.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-white/3 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={project.cover} alt={project.title} className="w-12 h-9 object-cover rounded-lg flex-shrink-0 border border-white/10" />
                      <span className="font-medium text-slate-200">{project.title}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/25 text-indigo-300">
                      {project.category}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {project.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-xs px-2 py-0.5 rounded-md bg-white/6 text-slate-400">{tag}</span>
                      ))}
                      {project.tags.length > 2 && <span className="text-xs text-slate-600">+{project.tags.length - 2}</span>}
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <button onClick={() => updateFlag(project, 'is_featured')} title="Toggle featured">
                      <Star size={16} className={project.is_featured ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'} />
                    </button>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      type="button"
                      onClick={() => updateFlag(project, 'is_published')}
                      className={`inline-block relative w-10 h-5 rounded-full cursor-pointer transition-colors ${project.is_published ? 'bg-purple-500' : 'bg-white/15'}`}
                    >
                      <span className={`absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${project.is_published ? 'translate-x-5' : 'translate-x-0'}`}></span>
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <a href={project.live_url} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:bg-white/10 transition-all">
                        <ExternalLink size={14} />
                      </a>
                      <a href={project.repo_url} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-purple-400 hover:bg-white/10 transition-all">
                        <FaGithub size={14} />
                      </a>
                      <button onClick={() => openEdit(project)} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-indigo-400 hover:bg-white/10 transition-all">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => setDeleteId(project.id)} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
            <motion.div
              className="relative z-10 w-full max-w-xl glass-card p-7"
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold font-heading">{editProject ? 'Edit Project' : 'Add Project'}</h3>
                <button onClick={closeModal} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
                  <X size={16} />
                </button>
              </div>
              <div className="space-y-4">
                <input className={inputCls} placeholder="Project Title" value={form.title} onChange={e => set('title', e.target.value)} />
                <select className={inputCls} value={form.category} onChange={e => set('category', e.target.value)}>
                  {categories.map(category => <option key={category} value={category} className="bg-[#0A0A12]">{category}</option>)}
                </select>
                <input className={inputCls} placeholder="Cover Image URL" value={form.cover_image_url} onChange={e => set('cover_image_url', e.target.value)} />
                <textarea className={`${inputCls} resize-none`} rows={3} placeholder="Project description" value={form.description} onChange={e => set('description', e.target.value)} />
                <input className={inputCls} placeholder="Tags (comma separated)" value={form.tags} onChange={e => set('tags', e.target.value)} />
                <input className={inputCls} placeholder="Live URL" value={form.live_url} onChange={e => set('live_url', e.target.value)} />
                <input className={inputCls} placeholder="Repository URL" value={form.repo_url} onChange={e => set('repo_url', e.target.value)} />
                <div className="flex gap-6 pt-1">
                  {[['is_featured', 'Mark as Featured'], ['is_published', 'Published']].map(([key, label]) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer text-sm text-slate-300">
                      <input type="checkbox" checked={form[key]} onChange={e => set(key, e.target.checked)}
                        className="w-4 h-4 accent-purple-500 rounded" />
                      {label}
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={closeModal} className="btn-secondary flex-1 justify-center">Cancel</button>
                <button onClick={handleSave} disabled={status === 'saving'} className="btn-primary flex-1 justify-center disabled:opacity-60">
                  {status === 'saving' ? 'Saving...' : editProject ? 'Save Changes' : 'Add Project'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteId && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setDeleteId(null)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
            <motion.div
              className="relative z-10 glass-card p-8 max-w-sm w-full text-center"
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="w-14 h-14 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="text-red-400" size={24} />
              </div>
              <h3 className="text-lg font-bold font-heading mb-2">Delete Project?</h3>
              <p className="text-slate-400 text-sm mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="btn-secondary flex-1 justify-center">Cancel</button>
                <button
                  onClick={() => handleDelete(deleteId)}
                  className="flex-1 py-2.5 px-5 rounded-full font-semibold text-sm bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 transition-all"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectsManager;
