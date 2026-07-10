import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ImagePlus, Layers, Pencil, Plus, Save, Search, Tag, Trash2, Upload, X } from 'lucide-react';
import {
  deleteAdminSkill,
  deleteSkillCategory,
  getAdminSkills,
  getSkillCategories,
  saveAdminSkill,
  saveSkillCategory,
  uploadAdminMedia,
} from '../../lib/api';
import { TechLogo, techIconOptions } from '../common/TechIcon';

const fallbackCategories = [
  { id: undefined, name: 'Programming Languages', order_index: 1 },
  { id: undefined, name: 'Web Technologies', order_index: 2 },
  { id: undefined, name: 'Backend & Database', order_index: 3 },
  { id: undefined, name: 'Tools', order_index: 4 },
  { id: undefined, name: 'Data & ML', order_index: 5 },
];

const emptySkillForm = {
  name: '',
  icon_url: '',
  category: 'Programming Languages',
  category_id: undefined,
  proficiency: 80,
  order_index: 0,
};

const emptyCategoryForm = {
  id: undefined,
  name: '',
  order_index: 0,
};

const inputCls = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/60 transition-all text-sm';
const labelCls = 'text-xs font-semibold uppercase tracking-widest text-slate-500';

const sortByOrder = (items) => [...items].sort((a, b) => {
  const orderDiff = Number(a.order_index ?? 0) - Number(b.order_index ?? 0);
  if (orderDiff !== 0) return orderDiff;
  return String(a.name || '').localeCompare(String(b.name || ''));
});

const clampPercent = (value) => Math.max(0, Math.min(100, Number(value) || 0));

const SkillsManager = () => {
  const [skills, setSkills] = useState([]);
  const [categories, setCategories] = useState(fallbackCategories);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [skillModalOpen, setSkillModalOpen] = useState(false);
  const [editSkillId, setEditSkillId] = useState(null);
  const [skillForm, setSkillForm] = useState(emptySkillForm);
  const [categoryForm, setCategoryForm] = useState(emptyCategoryForm);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [status, setStatus] = useState('loading');
  const [actionStatus, setActionStatus] = useState('');
  const [logoUploadStatus, setLogoUploadStatus] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    Promise.all([getAdminSkills(), getSkillCategories()])
      .then(([skillData, categoryData]) => {
        if (!active) return;
        const orderedCategories = sortByOrder(categoryData.length ? categoryData : fallbackCategories);
        setSkills(sortByOrder(skillData));
        setCategories(orderedCategories);
        setSkillForm(current => ({
          ...current,
          category: orderedCategories[0]?.name || current.category,
          category_id: orderedCategories[0]?.id,
        }));
        setStatus('ready');
      })
      .catch(loadError => {
        if (!active) return;
        setError(loadError.message || 'Could not load skills.');
        setStatus('ready');
      });

    return () => {
      active = false;
    };
  }, []);

  const categoryLookup = useMemo(
    () => Object.fromEntries(categories.map(category => [category.name, category.id])),
    [categories],
  );

  const categoryCounts = useMemo(() => skills.reduce((counts, skill) => {
    counts[skill.category] = (counts[skill.category] || 0) + 1;
    return counts;
  }, {}), [skills]);

  const filteredSkills = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return skills.filter(skill => {
      const matchesCategory = activeCategory === 'All' || skill.category === activeCategory;
      const matchesSearch = !searchTerm
        || skill.name.toLowerCase().includes(searchTerm)
        || skill.category.toLowerCase().includes(searchTerm)
        || String(skill.icon_url || '').toLowerCase().includes(searchTerm);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search, skills]);

  const nextSkillOrder = useMemo(() => {
    const highestOrder = skills.reduce((max, skill) => Math.max(max, Number(skill.order_index ?? 0)), 0);
    return highestOrder + 1;
  }, [skills]);

  const setSkillValue = (key, value) => {
    setSkillForm(current => ({ ...current, [key]: value }));
  };

  const setCategoryValue = (key, value) => {
    setCategoryForm(current => ({ ...current, [key]: value }));
  };

  const openAddSkill = () => {
    const selectedCategory = activeCategory !== 'All'
      ? activeCategory
      : categories[0]?.name || emptySkillForm.category;

    setSkillForm({
      ...emptySkillForm,
      category: selectedCategory,
      category_id: categoryLookup[selectedCategory],
      order_index: nextSkillOrder,
    });
    setEditSkillId(null);
    setLogoUploadStatus('');
    setError('');
    setSkillModalOpen(true);
  };

  const openEditSkill = (skill) => {
    setSkillForm({
      ...emptySkillForm,
      ...skill,
      category_id: categoryLookup[skill.category],
      icon_url: skill.icon_url || skill.name,
      order_index: Number(skill.order_index ?? 0),
      proficiency: clampPercent(skill.proficiency),
    });
    setEditSkillId(skill.id);
    setLogoUploadStatus('');
    setError('');
    setSkillModalOpen(true);
  };

  const closeSkillModal = () => {
    setSkillModalOpen(false);
    setEditSkillId(null);
  };

  const handleSkillCategoryChange = (categoryName) => {
    setSkillForm(current => ({
      ...current,
      category: categoryName,
      category_id: categoryLookup[categoryName],
    }));
  };

  const handleLogoUpload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setLogoUploadStatus('uploading');
    setError('');

    try {
      const media = await uploadAdminMedia(file);
      setSkillValue('icon_url', media.file_url);
      setLogoUploadStatus('uploaded');
      window.setTimeout(() => setLogoUploadStatus(''), 1800);
    } catch (uploadError) {
      setError(uploadError.message || 'Could not upload logo.');
      setLogoUploadStatus('');
    }
  };

  const handleSaveSkill = async () => {
    const name = skillForm.name.trim();
    if (!name) {
      setError('Skill name is required.');
      return;
    }

    setActionStatus('saving-skill');
    setError('');

    try {
      const saved = await saveAdminSkill({
        ...skillForm,
        id: editSkillId,
        name,
        icon_url: skillForm.icon_url.trim() || name,
        category_id: categoryLookup[skillForm.category],
        proficiency: clampPercent(skillForm.proficiency),
        order_index: Number(skillForm.order_index ?? 0),
      });

      setSkills(current => sortByOrder(editSkillId
        ? current.map(skill => skill.id === editSkillId ? saved : skill)
        : [...current, saved]));

      if (!categories.some(category => category.name === saved.category)) {
        setCategories(current => sortByOrder([
          ...current,
          { id: saved.category_id, name: saved.category, order_index: current.length + 1 },
        ]));
      }

      closeSkillModal();
    } catch (saveError) {
      setError(saveError.message || 'Could not save skill.');
    } finally {
      setActionStatus('');
    }
  };

  const startEditCategory = (category) => {
    setCategoryForm({
      id: category.id,
      name: category.name,
      order_index: Number(category.order_index ?? 0),
    });
    setEditingCategoryId(category.id || category.name);
    setError('');
  };

  const resetCategoryForm = () => {
    setCategoryForm(emptyCategoryForm);
    setEditingCategoryId(null);
  };

  const handleSaveCategory = async (event) => {
    event.preventDefault();

    const name = categoryForm.name.trim();
    if (!name) {
      setError('Category name is required.');
      return;
    }

    setActionStatus('saving-category');
    setError('');

    try {
      const saved = await saveSkillCategory({
        ...categoryForm,
        id: categoryForm.id,
        name,
        order_index: Number(categoryForm.order_index ?? 0),
      });

      setCategories(current => {
        const exists = current.some(category => category.id === saved.id || category.name === saved.name);
        const next = exists
          ? current.map(category => (category.id === saved.id || category.name === name ? saved : category))
          : [...current, saved];

        return sortByOrder(next);
      });

      setSkills(current => current.map(skill => {
        if (skill.category_id === saved.id || skill.category === categoryForm.name) {
          return { ...skill, category: saved.name, category_id: saved.id };
        }
        return skill;
      }));

      if (activeCategory === categoryForm.name) {
        setActiveCategory(saved.name);
      }

      resetCategoryForm();
    } catch (saveError) {
      setError(saveError.message || 'Could not save category.');
    } finally {
      setActionStatus('');
    }
  };

  const openDeleteSkill = (skill) => {
    setDeleteTarget({ type: 'skill', id: skill.id, name: skill.name });
  };

  const openDeleteCategory = (category) => {
    const linkedCount = skills.filter(skill => skill.category === category.name || skill.category_id === category.id).length;
    if (linkedCount > 0) {
      setError(`Move or delete ${linkedCount} skill${linkedCount === 1 ? '' : 's'} before deleting "${category.name}".`);
      return;
    }

    setDeleteTarget({ type: 'category', id: category.id, name: category.name });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setActionStatus('deleting');
    setError('');

    try {
      if (deleteTarget.type === 'skill') {
        await deleteAdminSkill(deleteTarget.id);
        setSkills(current => current.filter(skill => skill.id !== deleteTarget.id));
      } else {
        await deleteSkillCategory(deleteTarget.id);
        setCategories(current => current.filter(category => category.id !== deleteTarget.id));
        if (activeCategory === deleteTarget.name) {
          setActiveCategory('All');
        }
      }

      setDeleteTarget(null);
    } catch (deleteError) {
      setError(deleteError.message || 'Could not delete item.');
    } finally {
      setActionStatus('');
    }
  };

  const selectedIconName = skillForm.icon_url || skillForm.name || 'code';

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold font-heading text-white">Skills Manager</h2>
          <p className="text-slate-500 mt-1">{skills.length} skills across {categories.length} categories</p>
        </div>
        <button onClick={openAddSkill} className="btn-primary w-fit">
          <Plus size={18} /> Add Skill
        </button>
      </div>

      {error && (
        <div className="mb-6 flex items-start justify-between gap-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          <span>{error}</span>
          <button onClick={() => setError('')} className="text-red-200/70 hover:text-white">
            <X size={16} />
          </button>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <section className="space-y-5">
          <div className="glass-card p-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <label className="relative block min-w-0 flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  className={`${inputCls} pl-11`}
                  value={search}
                  onChange={event => setSearch(event.target.value)}
                  placeholder="Search skills"
                />
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveCategory('All')}
                  className={`rounded-full border px-3 py-2 text-xs font-semibold transition-all ${activeCategory === 'All'
                    ? 'border-purple-500/50 bg-purple-500/20 text-white'
                    : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  All {skills.length}
                </button>
                {categories.map(category => (
                  <button
                    key={category.id || category.name}
                    onClick={() => setActiveCategory(category.name)}
                    className={`rounded-full border px-3 py-2 text-xs font-semibold transition-all ${activeCategory === category.name
                      ? 'border-cyan-400/50 bg-cyan-400/15 text-white'
                      : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    {category.name} {categoryCounts[category.name] || 0}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-sm">
                <thead>
                  <tr className="border-b border-white/8 text-xs uppercase tracking-widest text-slate-500">
                    <th className="p-4 text-left">Skill</th>
                    <th className="p-4 text-left">Category</th>
                    <th className="p-4 text-left">Proficiency</th>
                    <th className="p-4 text-center">Order</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {status === 'loading' ? (
                    <tr>
                      <td className="p-6 text-slate-500" colSpan="5">Loading skills...</td>
                    </tr>
                  ) : filteredSkills.length === 0 ? (
                    <tr>
                      <td className="p-10 text-center text-slate-500" colSpan="5">No skills match this view.</td>
                    </tr>
                  ) : filteredSkills.map(skill => (
                    <motion.tr
                      key={skill.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-white/3 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/6">
                            <TechLogo name={skill.icon_url || skill.name} size="md" />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-slate-200">{skill.name}</p>
                            <p className="truncate text-xs text-slate-600">{skill.icon_url || skill.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex max-w-[220px] items-center gap-1.5 rounded-full border border-indigo-500/25 bg-indigo-500/15 px-2.5 py-1 text-xs font-semibold text-indigo-300">
                          <Tag size={12} />
                          <span className="truncate">{skill.category}</span>
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex min-w-[190px] items-center gap-3">
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400"
                              style={{ width: `${clampPercent(skill.proficiency)}%` }}
                            />
                          </div>
                          <span className="w-10 text-right text-xs font-semibold text-slate-300">{clampPercent(skill.proficiency)}%</span>
                        </div>
                      </td>
                      <td className="p-4 text-center text-slate-400">{skill.order_index}</td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditSkill(skill)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-slate-400 transition-all hover:bg-white/10 hover:text-indigo-400"
                            title="Edit skill"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => openDeleteSkill(skill)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-slate-400 transition-all hover:bg-red-500/10 hover:text-red-400"
                            title="Delete skill"
                          >
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
        </section>

        <aside className="glass-card h-fit p-5 xl:sticky xl:top-24">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold font-heading text-white">Categories</h3>
              <p className="text-sm text-slate-500">{categories.length} groups</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/6">
              <Layers className="text-cyan-300" size={20} />
            </div>
          </div>

          <form onSubmit={handleSaveCategory} className="space-y-3">
            <div>
              <label className={labelCls}>Name</label>
              <input
                className={`${inputCls} mt-2`}
                value={categoryForm.name}
                onChange={event => setCategoryValue('name', event.target.value)}
                placeholder="Category name"
              />
            </div>
            <div>
              <label className={labelCls}>Order</label>
              <input
                className={`${inputCls} mt-2`}
                type="number"
                min="0"
                value={categoryForm.order_index}
                onChange={event => setCategoryValue('order_index', event.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={actionStatus === 'saving-category'}
                className="btn-primary flex-1 justify-center px-4 disabled:opacity-60"
              >
                <Save size={16} />
                {editingCategoryId ? 'Update' : 'Add'}
              </button>
              {editingCategoryId && (
                <button type="button" onClick={resetCategoryForm} className="btn-secondary px-4">
                  <X size={16} />
                </button>
              )}
            </div>
          </form>

          <div className="mt-6 space-y-2">
            {categories.map(category => (
              <div
                key={category.id || category.name}
                className="flex items-center justify-between gap-3 rounded-xl border border-white/8 bg-white/4 px-3 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-200">{category.name}</p>
                  <p className="text-xs text-slate-600">Order {category.order_index} | {categoryCounts[category.name] || 0} skills</p>
                </div>
                <div className="flex flex-shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => startEditCategory(category)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-slate-400 hover:text-indigo-400"
                    title="Edit category"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => openDeleteCategory(category)}
                    disabled={!category.id}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-slate-400 hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-40"
                    title="Delete category"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>

      <AnimatePresence>
        {skillModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSkillModal}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              className="relative z-10 w-full max-w-3xl glass-card p-7"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={event => event.stopPropagation()}
            >
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold font-heading text-white">{editSkillId ? 'Edit Skill' : 'Add Skill'}</h3>
                </div>
                <button
                  onClick={closeSkillModal}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="grid gap-6 lg:grid-cols-[150px_1fr]">
                <div className="space-y-3">
                  <div className="flex h-32 w-32 items-center justify-center rounded-2xl border border-white/10 bg-white/6">
                    <TechLogo name={selectedIconName} size="xl" />
                  </div>
                  <label className={`btn-secondary w-32 cursor-pointer justify-center px-3 text-xs ${logoUploadStatus === 'uploading' ? 'pointer-events-none opacity-60' : ''}`}>
                    <Upload size={14} />
                    {logoUploadStatus === 'uploading' ? 'Uploading' : logoUploadStatus === 'uploaded' ? 'Uploaded' : 'Upload'}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoUpload}
                    />
                  </label>
                </div>

                <div className="space-y-5">
                  <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_120px]">
                    <div>
                      <label className={labelCls}>Skill Name</label>
                      <input
                        className={`${inputCls} mt-2`}
                        value={skillForm.name}
                        onChange={event => setSkillValue('name', event.target.value)}
                        placeholder="React.js"
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Category</label>
                      <select
                        className={`${inputCls} mt-2`}
                        value={skillForm.category}
                        onChange={event => handleSkillCategoryChange(event.target.value)}
                      >
                        {categories.map(category => (
                          <option key={category.id || category.name} value={category.name} className="bg-[#0A0A12]">
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Order</label>
                      <input
                        className={`${inputCls} mt-2`}
                        type="number"
                        min="0"
                        value={skillForm.order_index}
                        onChange={event => setSkillValue('order_index', event.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between gap-4">
                      <label className={labelCls}>Proficiency</label>
                      <input
                        className="w-20 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-right text-sm text-white focus:border-purple-500/60 focus:outline-none"
                        type="number"
                        min="0"
                        max="100"
                        value={skillForm.proficiency}
                        onChange={event => setSkillValue('proficiency', event.target.value)}
                      />
                    </div>
                    <input
                      className="mt-3 w-full accent-purple-500"
                      type="range"
                      min="0"
                      max="100"
                      value={skillForm.proficiency}
                      onChange={event => setSkillValue('proficiency', event.target.value)}
                    />
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className={labelCls}>Logo</label>
                      <label className="relative mt-2 block">
                        <ImagePlus className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                          className={`${inputCls} pl-11`}
                          value={skillForm.icon_url}
                          onChange={event => setSkillValue('icon_url', event.target.value)}
                          placeholder="react or https://example.com/logo.png"
                        />
                      </label>
                    </div>
                    <div className="grid max-h-48 grid-cols-2 gap-2 overflow-y-auto pr-1 sm:grid-cols-3">
                      {techIconOptions.map(option => {
                        const isSelected = selectedIconName === option.key;

                        return (
                          <button
                            type="button"
                            key={option.key}
                            onClick={() => setSkillValue('icon_url', option.key)}
                            className={`flex min-w-0 items-center gap-2 rounded-xl border px-3 py-2 text-left text-xs font-semibold transition-all ${isSelected
                              ? 'border-cyan-400/50 bg-cyan-400/15 text-white'
                              : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-white'
                            }`}
                          >
                            <TechLogo name={option.key} size="sm" />
                            <span className="min-w-0 flex-1 truncate">{option.label}</span>
                            {isSelected && <Check className="flex-shrink-0 text-cyan-300" size={14} />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-7 flex gap-3">
                <button onClick={closeSkillModal} className="btn-secondary flex-1 justify-center">Cancel</button>
                <button
                  onClick={handleSaveSkill}
                  disabled={actionStatus === 'saving-skill'}
                  className="btn-primary flex-1 justify-center disabled:opacity-60"
                >
                  {actionStatus === 'saving-skill' ? 'Saving...' : editSkillId ? 'Save Changes' : 'Add Skill'}
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
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={event => event.stopPropagation()}
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/15">
                <Trash2 className="text-red-400" size={24} />
              </div>
              <h3 className="mb-2 text-lg font-bold font-heading text-white">Delete {deleteTarget.type}?</h3>
              <p className="mb-6 text-sm text-slate-400">"{deleteTarget.name}" will be removed from the admin and live portfolio.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteTarget(null)} className="btn-secondary flex-1 justify-center">Cancel</button>
                <button
                  onClick={handleConfirmDelete}
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

export default SkillsManager;
