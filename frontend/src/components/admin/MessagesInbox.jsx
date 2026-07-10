import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Inbox, Mail, Trash2 } from 'lucide-react';
import { deleteAdminMessage, getAdminMessages, markMessageRead } from '../../lib/api';

const MessagesInbox = () => {
  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');

  useEffect(() => {
    getAdminMessages()
      .then(setMessages)
      .catch(loadError => setError(loadError.message || 'Could not load messages.'));
  }, []);

  const displayed = filter === 'unread' ? messages.filter(m => !m.is_read) : messages;
  const unreadCount = messages.filter(m => !m.is_read).length;

  const openMessage = async (msg) => {
    setSelected(msg);
    if (!msg.is_read) {
      setMessages(current => current.map(item => item.id === msg.id ? { ...item, is_read: true } : item));
      try {
        const updated = await markMessageRead(msg.id);
        setMessages(current => current.map(item => item.id === msg.id ? updated : item));
        setSelected(updated);
      } catch (readError) {
        setError(readError.message || 'Could not mark message as read.');
      }
    }
  };

  const deleteMessage = async (id) => {
    try {
      await deleteAdminMessage(id);
      setMessages(current => current.filter(message => message.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch (deleteError) {
      setError(deleteError.message || 'Could not delete message.');
    }
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-heading text-white flex items-center gap-3">
            Messages Inbox
            {unreadCount > 0 && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-500 text-white">{unreadCount}</span>
            )}
          </h2>
          <p className="text-slate-500 mt-1">{messages.length} total, {unreadCount} unread</p>
        </div>
        <div className="flex gap-2">
          {['all', 'unread'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                filter === f
                  ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                  : 'border-white/10 text-slate-500 hover:border-white/20 hover:text-slate-300'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>}

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-2">
          {displayed.length === 0 ? (
            <div className="glass-card p-12 flex flex-col items-center justify-center text-center">
              <Inbox className="text-slate-600 mb-3" size={40} />
              <p className="text-slate-500 text-sm">No messages here</p>
            </div>
          ) : (
            displayed.map(msg => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => openMessage(msg)}
                className={`glass-card p-4 cursor-pointer transition-all border
                  ${selected?.id === msg.id ? 'border-purple-500/50 bg-purple-500/8' : 'hover:border-white/20'}
                  ${!msg.is_read ? 'border-l-2 border-l-purple-500' : ''}
                `}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {msg.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className={`text-sm font-semibold truncate ${!msg.is_read ? 'text-white' : 'text-slate-300'}`}>{msg.name}</p>
                      <p className="text-xs text-slate-500 truncate">{msg.subject}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <span className="text-xs text-slate-600">{msg.date}</span>
                    {!msg.is_read && <span className="w-2 h-2 rounded-full bg-purple-500"></span>}
                  </div>
                </div>
                <p className="text-xs text-slate-600 mt-2 line-clamp-2 ml-12">{msg.message}</p>
              </motion.div>
            ))
          )}
        </div>

        <div className="lg:col-span-3">
          {selected ? (
            <div className="glass-card p-7 h-full">
              <div className="flex items-start justify-between mb-6 gap-4">
                <div>
                  <h3 className="text-xl font-bold font-heading text-white">{selected.subject}</h3>
                  <p className="text-sm text-slate-400 mt-1">
                    From <span className="text-purple-400 font-medium">{selected.name}</span>
                    {' - '}{selected.email}
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">{selected.date}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <a
                    href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                    className="btn-primary text-xs py-2 px-4"
                  >
                    <Mail size={14} /> Reply
                  </a>
                  <button
                    onClick={() => deleteMessage(selected.id)}
                    className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-all"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              <div className="border-t border-white/8 pt-6">
                <p className="text-slate-300 leading-relaxed">{selected.message}</p>
              </div>
            </div>
          ) : (
            <div className="glass-card flex flex-col items-center justify-center py-32 text-center h-full">
              <Eye className="text-slate-700 mb-3" size={40} />
              <p className="text-slate-500">Select a message to read it</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesInbox;
