import React, { useEffect, useState } from 'react';
import { Download, FileText, ImageIcon, Plus, Save, Upload, X } from 'lucide-react';
import { DEFAULT_RESUME_URL, getAdminHero, getFileDownloadUrl, saveAdminHero, uploadAdminMedia } from '../../lib/api';

const emptyHero = {
  name: '',
  availability_badge: true,
  availability_text: 'Available for Work',
  bio: '',
  profile_image_url: '',
  resume_url: DEFAULT_RESUME_URL,
  primary_btn_text: 'Contact Me',
  primary_btn_link: '#contact',
  secondary_btn_text: 'Download Resume',
  secondary_btn_link: DEFAULT_RESUME_URL,
  roles: [],
};

const HeroEditor = () => {
  const [form, setForm] = useState(emptyHero);
  const [newRole, setNewRole] = useState('');
  const [status, setStatus] = useState('loading');
  const [profileUploadStatus, setProfileUploadStatus] = useState('idle');
  const [profileUploadError, setProfileUploadError] = useState('');
  const [resumeUploadStatus, setResumeUploadStatus] = useState('idle');
  const [resumeUploadError, setResumeUploadError] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    getAdminHero()
      .then(hero => {
        if (!mounted) return;
        setForm({ ...emptyHero, ...hero });
        setStatus('ready');
      })
      .catch(loadError => {
        if (!mounted) return;
        setError(loadError.message || 'Could not load hero content.');
        setStatus('error');
      });
    return () => { mounted = false; };
  }, []);

  const set = (key, val) => setForm(current => ({ ...current, [key]: val }));
  const addRole = () => {
    if (newRole.trim()) {
      setForm(current => ({ ...current, roles: [...current.roles, newRole.trim()] }));
      setNewRole('');
    }
  };
  const removeRole = (i) => setForm(current => ({ ...current, roles: current.roles.filter((_, idx) => idx !== i) }));

  const handleProfileImageUpload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;

    if (file.type && !file.type.startsWith('image/')) {
      setProfileUploadError('Choose an image file.');
      return;
    }

    setProfileUploadStatus('uploading');
    setProfileUploadError('');
    setError('');

    try {
      const media = await uploadAdminMedia(file);
      const fileUrl = media.raw_file_url || media.file_url;
      const saved = await saveAdminHero({
        ...form,
        profile_image_url: fileUrl,
      });

      setForm({ ...emptyHero, ...saved });
      setProfileUploadStatus('uploaded');
      setStatus('saved');
      setTimeout(() => {
        setProfileUploadStatus('idle');
        setStatus('ready');
      }, 2500);
    } catch (uploadError) {
      setProfileUploadError(uploadError.message || 'Could not upload profile image.');
      setProfileUploadStatus('idle');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setStatus('saving');
    setError('');
    try {
      const saved = await saveAdminHero(form);
      setForm({ ...emptyHero, ...saved });
      setStatus('saved');
      setTimeout(() => setStatus('ready'), 2500);
    } catch (saveError) {
      setError(saveError.message || 'Could not save hero content.');
      setStatus('ready');
    }
  };

  const handleResumeUpload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;

    setResumeUploadStatus('uploading');
    setResumeUploadError('');
    setError('');

    try {
      const media = await uploadAdminMedia(file);
      const fileUrl = media.raw_file_url || media.file_url;
      const updated = {
        ...form,
        resume_url: fileUrl,
        secondary_btn_link: fileUrl,
        secondary_btn_text: form.secondary_btn_text || 'Download Resume',
      };
      const saved = await saveAdminHero(updated);

      setForm({ ...emptyHero, ...saved });
      setResumeUploadStatus('uploaded');
      setStatus('saved');
      setTimeout(() => {
        setResumeUploadStatus('idle');
        setStatus('ready');
      }, 2500);
    } catch (uploadError) {
      setResumeUploadError(uploadError.message || 'Could not upload resume.');
      setResumeUploadStatus('idle');
    }
  };

  const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/60 transition-all text-sm";
  const labelCls = "block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-widest";
  const hasProfileImage = form.profile_image_url && form.profile_image_url !== '#';
  const hasResume = form.resume_url && form.resume_url !== '#';

  if (status === 'loading') {
    return <div className="glass-card p-8 text-slate-400">Loading hero editor...</div>;
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-heading text-white">Hero Editor</h2>
          <p className="text-slate-500 mt-1">Manage your hero section content.</p>
        </div>
      </div>

      {error && <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>}

      <div className="grid lg:grid-cols-3 gap-8">
        <form onSubmit={handleSave} className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 space-y-5">
            <h3 className="font-semibold text-white border-b border-white/8 pb-3">Basic Info</h3>
            <div>
              <label className={labelCls}>Display Name</label>
              <input className={inputCls} value={form.name} onChange={e => set('name', e.target.value)} placeholder="Your name" />
            </div>
            <div>
              <label className={labelCls}>Short Bio</label>
              <textarea rows={3} className={`${inputCls} resize-none`} value={form.bio} onChange={e => set('bio', e.target.value)} placeholder="Write a short tagline..." />
            </div>
          </div>

          <div className="glass-card p-6 space-y-4">
            <h3 className="font-semibold text-white border-b border-white/8 pb-3">Availability Badge</h3>
            <label className="flex items-center gap-3 cursor-pointer">
              <button
                type="button"
                onClick={() => set('availability_badge', !form.availability_badge)}
                className={`relative w-11 h-6 rounded-full transition-colors ${form.availability_badge ? 'bg-purple-500' : 'bg-white/15'}`}
              >
                <span className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform ${form.availability_badge ? 'translate-x-5' : 'translate-x-0'}`}></span>
              </button>
              <span className="text-sm text-slate-300">Show availability badge</span>
            </label>
            {form.availability_badge && (
              <div>
                <label className={labelCls}>Badge Text</label>
                <input className={inputCls} value={form.availability_text} onChange={e => set('availability_text', e.target.value)} />
              </div>
            )}
          </div>

          <div className="glass-card p-6 space-y-4">
            <h3 className="font-semibold text-white border-b border-white/8 pb-3">Roles</h3>
            <div className="flex flex-wrap gap-2">
              {form.roles.map((role, i) => (
                <span key={`${role}-${i}`} className="flex items-center gap-2 text-sm bg-purple-500/15 border border-purple-500/30 text-purple-300 px-3 py-1.5 rounded-full">
                  {role}
                  <button type="button" onClick={() => removeRole(i)} className="text-purple-400 hover:text-red-400 transition-colors">
                    <X size={13} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-3">
              <input
                className={`${inputCls} flex-1`}
                value={newRole}
                onChange={e => setNewRole(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addRole())}
                placeholder="Add a new role..."
              />
              <button type="button" onClick={addRole} className="btn-secondary px-4 flex-shrink-0">
                <Plus size={18} />
              </button>
            </div>
          </div>

          <div className="glass-card p-6 space-y-4">
            <h3 className="font-semibold text-white border-b border-white/8 pb-3">CTA Buttons</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Primary Button Text</label>
                <input className={inputCls} value={form.primary_btn_text} onChange={e => set('primary_btn_text', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Primary Link</label>
                <input className={inputCls} value={form.primary_btn_link} onChange={e => set('primary_btn_link', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Secondary Button Text</label>
                <input className={inputCls} value={form.secondary_btn_text} onChange={e => set('secondary_btn_text', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Secondary Link</label>
                <input className={inputCls} value={form.secondary_btn_link} onChange={e => set('secondary_btn_link', e.target.value)} />
              </div>
            </div>
          </div>

          <div className="glass-card p-6 space-y-4">
            <h3 className="font-semibold text-white border-b border-white/8 pb-3">Media</h3>
            <div>
              <label className={labelCls}>Profile Image URL</label>
              <input className={inputCls} value={form.profile_image_url} onChange={e => set('profile_image_url', e.target.value)} placeholder="https://..." />
            </div>

            {profileUploadError && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {profileUploadError}
              </div>
            )}

            <div className="border-2 border-dashed border-white/15 rounded-xl p-6 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 p-1 flex-shrink-0">
                  <div className="w-full h-full rounded-full bg-white/8 flex items-center justify-center overflow-hidden">
                    {hasProfileImage ? (
                      <img
                        src={form.profile_image_url}
                        alt={form.name || 'Profile preview'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon size={22} className="text-slate-400" />
                    )}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-200 truncate">
                    {hasProfileImage ? form.profile_image_url : 'No profile image connected yet'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Upload a JPG, PNG, WEBP, or GIF image for the landing hero.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <input
                  id="profile-image-upload"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleProfileImageUpload}
                />
                <label
                  htmlFor="profile-image-upload"
                  className={`btn-secondary cursor-pointer px-4 ${profileUploadStatus === 'uploading' ? 'pointer-events-none opacity-60' : ''}`}
                >
                  <Upload size={18} />
                  {profileUploadStatus === 'uploading' ? 'Uploading...' : profileUploadStatus === 'uploaded' ? 'Image Uploaded' : 'Upload Profile Image'}
                </label>
              </div>
            </div>

            <div>
              <label className={labelCls}>Resume URL</label>
              <input className={inputCls} value={form.resume_url} onChange={e => set('resume_url', e.target.value)} placeholder="https://..." />
            </div>

            {resumeUploadError && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {resumeUploadError}
              </div>
            )}

            <div className="border-2 border-dashed border-white/15 rounded-xl p-6 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/8 flex items-center justify-center flex-shrink-0">
                  <FileText size={22} className="text-slate-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-200 truncate">
                    {hasResume ? form.resume_url : 'No resume connected yet'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Upload a PDF, DOC, or DOCX file and it will be saved to the landing page.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <input
                  id="resume-upload"
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="sr-only"
                  onChange={handleResumeUpload}
                />
                <label
                  htmlFor="resume-upload"
                  className={`btn-secondary cursor-pointer px-4 ${resumeUploadStatus === 'uploading' ? 'pointer-events-none opacity-60' : ''}`}
                >
                  <Upload size={18} />
                  {resumeUploadStatus === 'uploading' ? 'Uploading...' : resumeUploadStatus === 'uploaded' ? 'Resume Uploaded' : 'Upload Resume'}
                </label>
                {hasResume && (
                  <a
                    href={getFileDownloadUrl(form.resume_url)}
                    download
                    className="btn-secondary px-4"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Download size={18} />
                    Download Current
                  </a>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={status === 'saving'}
            className={`btn-primary w-full justify-center py-3 text-base transition-all disabled:opacity-60 ${status === 'saved' ? '!from-green-500 !to-emerald-500' : ''}`}
          >
            <Save size={18} />
            {status === 'saving' ? 'Saving...' : status === 'saved' ? 'Saved Successfully!' : 'Save Changes'}
          </button>
        </form>

        <div className="glass-card p-6 h-fit sticky top-24">
          <h3 className="font-semibold text-white border-b border-white/8 pb-3 mb-5">Live Preview</h3>
          <div className="space-y-4">
            {form.availability_badge && (
              <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-xs text-slate-300 font-medium">{form.availability_text}</span>
              </div>
            )}
            <h2 className="text-2xl font-bold font-heading">
              Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">{form.name}</span>
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed">{form.bio}</p>
            <div className="flex flex-wrap gap-2 pt-2">
              {form.roles.map((role, i) => (
                <span key={`${role}-${i}`} className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300">{role}</span>
              ))}
            </div>
            <div className="flex gap-2 pt-2">
              <span className="btn-primary text-xs py-1.5 px-3">{form.primary_btn_text}</span>
              <span className="btn-secondary text-xs py-1.5 px-3">{form.secondary_btn_text}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroEditor;
