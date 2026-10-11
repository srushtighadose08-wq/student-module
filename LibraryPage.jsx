import React, { useState } from 'react';
import { Library as LibraryIcon, Search, BookOpen, Download, Bookmark, CheckCircle2 } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import { Badge } from '../components/Badge';

export const LibraryPage = () => {
  const { showToast } = useNotification();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const books = [
    { id: 1, title: 'Introduction to Algorithms (CLRS)', author: 'Cormen, Leiserson, Rivest, Stein', category: 'ALGORITHMS', edition: '4th Edition', pages: 1312, available: true },
    { id: 2, title: 'Database System Concepts', author: 'Silberschatz, Korth, Sudarshan', category: 'DATABASE', edition: '7th Edition', pages: 1376, available: true },
    { id: 3, title: 'Computer Networks: A Systems Approach', author: 'Larry L. Peterson, Bruce S. Davie', category: 'NETWORKING', edition: '6th Edition', pages: 850, available: false, returnDate: 'Oct 20' },
    { id: 4, title: 'Full Stack React & Modern Web Apps', author: 'Robin Wieruch', category: 'WEB_DEV', edition: '2026 Edition', pages: 420, available: true },
    { id: 5, title: 'Software Engineering: A Practitioner’s Approach', author: 'Roger S. Pressman', category: 'SOFTWARE_ENG', edition: '9th Edition', pages: 940, available: true },
    { id: 6, title: 'Artificial Intelligence: A Modern Approach', author: 'Stuart Russell, Peter Norvig', category: 'AI_ML', edition: '4th Edition', pages: 1152, available: true }
  ];

  const handleBorrow = (book) => {
    showToast(`Book reserved: "${book.title}". Pick up from Central Library Counter 2.`);
  };

  const filtered = books.filter(b => {
    const matchCat = selectedCategory === 'ALL' || b.category === selectedCategory;
    const matchSearch = b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>Digital Library & E-Books</h2>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
            Search 15,000+ technical publications, academic journals, and textbook reserves
          </p>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '8px', background: '#f1f5f9', padding: '4px', borderRadius: '8px', flexWrap: 'wrap' }}>
          {['ALL', 'ALGORITHMS', 'DATABASE', 'NETWORKING', 'WEB_DEV', 'AI_ML'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`auth-tab-btn ${selectedCategory === cat ? 'active' : ''}`}
              style={{ padding: '6px 14px', fontSize: '12px' }}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', minWidth: '240px' }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '36px' }}
            placeholder="Search title, author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid-3">
        {filtered.map(book => (
          <div key={book.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '8px',
                  background: '#ecfdf5',
                  color: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <BookOpen size={18} />
                </div>
                <Badge status={book.available ? 'success' : 'warning'}>
                  {book.available ? 'Available' : `Borrowed (${book.returnDate})`}
                </Badge>
              </div>

              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', lineHeight: '1.3' }}>
                {book.title}
              </h3>
              <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                By {book.author}
              </p>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px' }}>
                {book.edition} • {book.pages} Pages • Digital PDF + Print
              </div>
            </div>

            <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '8px' }}>
              <button
                onClick={() => handleBorrow(book)}
                className="btn btn-sm btn-outline-primary"
                style={{ flex: 1 }}
              >
                <Bookmark size={14} /> Reserve
              </button>
              <button
                onClick={() => showToast(`Downloading study companion for "${book.title}"...`)}
                className="btn btn-sm btn-secondary"
                title="Download Chapter Guide"
              >
                <Download size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
