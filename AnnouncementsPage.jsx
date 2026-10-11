import React, { useState, useEffect } from 'react';
import { Megaphone, Search, Plus, Calendar, Tag, ShieldCheck } from 'lucide-react';
import { announcementApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';

export const AnnouncementsPage = () => {
  const { user } = useAuth();
  const { showToast } = useNotification();
  const [announcements, setAnnouncements] = useState([]);
  const [category, setCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Post announcement modal
  const [showModal, setShowModal] = useState(false);
  const [postForm, setPostForm] = useState({
    title: '',
    content: '',
    category: 'ACADEMIC',
    targetAudience: 'ALL',
    important: false
  });
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, [category]);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const data = await announcementApi.getAll(category === 'ALL' ? null : category);
      setAnnouncements(data || []);
    } catch (err) {
      console.error('Failed to load announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!postForm.title.trim() || !postForm.content.trim()) {
      showToast('Please enter both title and notice content', 'error');
      return;
    }

    try {
      setPosting(true);
      await announcementApi.create(postForm);
      showToast('Circular broadcasted successfully!');
      setShowModal(false);
      setPostForm({
        title: '',
        content: '',
        category: 'ACADEMIC',
        targetAudience: 'ALL',
        important: false
      });
      fetchAnnouncements();
    } catch (err) {
      showToast(err.message || 'Failed to publish announcement', 'error');
    } finally {
      setPosting(false);
    }
  };

  const filtered = announcements.filter(a => {
    if (!searchQuery) return true;
    return a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           a.content.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const canPost = user?.role === 'ROLE_FACULTY' || user?.role === 'ROLE_HOD' || user?.role === 'ROLE_ADMIN';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>College Notice Board</h2>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
            Official circulars, exam dates, academic notices, and university updates
          </p>
        </div>

        {canPost && (
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            <Plus size={16} /> Broadcast Notice
          </button>
        )}
      </div>

      {/* Category Pills & Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '8px', background: '#f1f5f9', padding: '4px', borderRadius: '8px', flexWrap: 'wrap' }}>
          {['ALL', 'ACADEMIC', 'EXAM', 'EVENT', 'GENERAL'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`auth-tab-btn ${category === cat ? 'active' : ''}`}
              style={{ padding: '6px 14px', fontSize: '12px' }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', minWidth: '240px' }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '36px' }}
            placeholder="Search circulars..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Announcements List */}
      {loading ? (
        <div style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>Loading circulars...</div>
      ) : filtered.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', color: '#64748b' }}>
          No announcements found matching the criteria.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filtered.map((item) => (
            <div
              key={item.id}
              className="card"
              style={{
                borderLeft: `4px solid ${item.important ? '#ef4444' : '#10b981'}`
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>{item.title}</h3>
                  {item.important && <Badge status="danger">Urgent</Badge>}
                </div>
                <Badge status="info">{item.category}</Badge>
              </div>

              <p style={{ fontSize: '13px', color: '#334155', lineHeight: '1.6' }}>
                {item.content}
              </p>

              <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', flexWrap: 'wrap', gap: '8px' }}>
                <span>Author: <strong>{item.authorName}</strong> ({item.authorRole})</span>
                <span>Department: {item.departmentName || 'Campus Wide'}</span>
                <span>Date: {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Today'}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Broadcast Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Broadcast New Notice"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleCreatePost} disabled={posting}>
              {posting ? 'Publishing...' : 'Publish Circular'}
            </button>
          </>
        }
      >
        <form onSubmit={handleCreatePost}>
          <div className="form-group">
            <label className="form-label">Notice Title</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Schedule for Campus Placements 2026"
              value={postForm.title}
              onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
              required
            />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={postForm.category}
                onChange={(e) => setPostForm({ ...postForm, category: e.target.value })}
              >
                <option value="ACADEMIC">ACADEMIC</option>
                <option value="EXAM">EXAM</option>
                <option value="EVENT">EVENT</option>
                <option value="GENERAL">GENERAL</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Audience</label>
              <select
                className="form-select"
                value={postForm.targetAudience}
                onChange={(e) => setPostForm({ ...postForm, targetAudience: e.target.value })}
              >
                <option value="ALL">All Students & Faculty</option>
                <option value="STUDENT">Students Only</option>
                <option value="FACULTY">Faculty Only</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Notice Details</label>
            <textarea
              className="form-textarea"
              rows={4}
              placeholder="Write the circular announcement message..."
              value={postForm.content}
              onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
              required
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
