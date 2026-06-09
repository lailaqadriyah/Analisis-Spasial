import React, { useState } from 'react';
import { useSpatial } from '../context/SpatialContext';
import { 
  Search, 
  MapPin, 
  Clock, 
  Coins, 
  Star, 
  ArrowLeft, 
  Check, 
  Compass, 
  Navigation
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    filteredPools,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedPool,
    setSelectedPool,
    userLocation,
    nearestPool,
    nearestDistance,
    clearNearestAnalysis,
    activeTab,
    setActiveTab
  } = useSpatial();

  const [localSearch, setLocalSearch] = useState(searchQuery);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setLocalSearch(query);
    setSearchQuery(query);
  };

  const formatPrice = (price: number) => {
    if (price === 0) return 'Gratis';
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  const handleBackToDirectory = () => {
    setSelectedPool(null);
    setActiveTab('directory');
  };

  return (
    <div className="sidebar-container">
      {/* Header / Branding */}
      <div className="sidebar-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-md)'
          }}>
            {/* Custom Inline SVG for Swim wave symbol */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 6c.6.5 1.2 1 2.5 1C6 7 7 5 9 5c2 0 3 2 5 2 2.5 0 3.7-1.5 5-2"/>
              <path d="M2 12c.6.5 1.2 1 2.5 1 1.5 0 2.5-2 4.5-2 2 0 3 2 5 2 2.5 0 3.7-1.5 5-2"/>
              <path d="M2 18c.6.5 1.2 1 2.5 1 1.5 0 2.5-2 4.5-2 2 0 3 2 5 2 2.5 0 3.7-1.5 5-2"/>
            </svg>
          </div>
          <div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>AquaMap</h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>Direktori Kolam Renang Padang</p>
          </div>
        </div>
      </div>

      {/* Tabs / Navigation */}
      <div style={{ padding: '0 24px 12px 24px' }}>
        <div className="tab-nav" style={{ backgroundColor: 'var(--bg-primary)', padding: '3px', borderRadius: '10px' }}>
          <button 
            className={`tab-btn ${activeTab === 'directory' || activeTab === 'detail' ? 'active' : ''}`}
            onClick={() => {
              if (selectedPool) {
                setActiveTab('detail');
              } else {
                setActiveTab('directory');
              }
            }}
          >
            Direktori
          </button>
          <button 
            className={`tab-btn ${activeTab === 'nearest' ? 'active' : ''}`}
            onClick={() => setActiveTab('nearest')}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <Compass size={14} /> Cari Terdekat
            </div>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="sidebar-content">
        
        {/* DIRECTORY VIEW */}
        {activeTab === 'directory' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Search Bar */}
            <div className="search-wrapper">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Cari kolam renang, lokasi, fasilitas..."
                value={localSearch}
                onChange={handleSearchChange}
                className="search-input"
              />
            </div>

            {/* Category Pills */}
            <div className="filter-pills-container">
              {['Semua', 'Umum', 'Hotel', 'Waterpark'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`pill-btn ${selectedCategory === cat ? 'active' : ''}`}
                >
                  {cat === 'Semua' ? 'Semua Tipe' : cat}
                </button>
              ))}
            </div>

            {/* Pools List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, margin: '2px 0' }}>
                Menampilkan <strong>{filteredPools.length}</strong> tempat
              </p>
              
              {filteredPools.length > 0 ? (
                filteredPools.map((pool) => (
                  <div
                    key={pool.id}
                    onClick={() => setSelectedPool(pool)}
                    className={`pool-card ${selectedPool?.id === pool.id ? 'active' : ''}`}
                  >
                    {/* Visual Card Top Header */}
                    <div className="pool-visual-placeholder">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M2 6c.6.5 1.2 1 2.5 1C6 7 7 5 9 5c2 0 3 2 5 2 2.5 0 3.7-1.5 5-2"/>
                        <path d="M2 12c.6.5 1.2 1 2.5 1 1.5 0 2.5-2 4.5-2 2 0 3 2 5 2 2.5 0 3.7-1.5 5-2"/>
                      </svg>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, marginLeft: '6px' }}>{pool.category.toUpperCase()}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '4px' }}>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: 700, lineHeight: 1.3, flex: 1, paddingRight: '8px' }}>
                        {pool.name}
                      </h3>
                      <span className="badge badge-rating" style={{ flexShrink: 0 }}>
                        <Star size={11} fill="#f59e0b" color="#f59e0b" style={{ marginRight: '3px' }} />
                        {pool.rating}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={12} color="var(--text-muted)" />
                      {pool.district}, Padang
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mulai dari</span>
                      <strong style={{ fontSize: '0.9rem', color: 'var(--accent-primary)', fontWeight: 700 }}>
                        {formatPrice(pool.ticketPrice)}
                      </strong>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{
                  textAlign: 'center',
                  padding: '32px 16px',
                  color: 'var(--text-muted)',
                  border: '1px dashed var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.85rem'
                }}>
                  Kolam renang tidak ditemukan.
                </div>
              )}
            </div>

          </div>
        )}

        {/* DETAILS INSPECTOR VIEW */}
        {activeTab === 'detail' && selectedPool && (
          <div className="detail-view-container">
            <button 
              className="btn btn-secondary" 
              onClick={handleBackToDirectory}
              style={{ display: 'flex', alignSelf: 'flex-start', padding: '6px 12px', fontSize: '0.8rem', borderRadius: '20px' }}
            >
              <ArrowLeft size={14} /> Kembali ke Daftar
            </button>

            {/* Pool Image Banner */}
            <div className="pool-visual-placeholder" style={{ height: '140px', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2 6c.6.5 1.2 1 2.5 1C6 7 7 5 9 5c2 0 3 2 5 2 2.5 0 3.7-1.5 5-2"/>
                  <path d="M2 12c.6.5 1.2 1 2.5 1 1.5 0 2.5-2 4.5-2 2 0 3 2 5 2 2.5 0 3.7-1.5 5-2"/>
                </svg>
                <span className="badge badge-pool-type">{selectedPool.category} Pool</span>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, lineHeight: 1.3 }}>
                  {selectedPool.name}
                </h2>
                <span className="badge badge-rating" style={{ margin: 0 }}>
                  <Star size={12} fill="#f59e0b" color="#f59e0b" style={{ marginRight: '4px' }} />
                  {selectedPool.rating}
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={14} color="var(--text-muted)" />
                {selectedPool.address}
              </p>
            </div>

            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5, backgroundColor: 'var(--bg-tertiary)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
              {selectedPool.description}
            </p>

            {/* Quick Specs Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ border: '1px solid var(--border-color)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  <Clock size={14} />
                  <span style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase' }}>Jam Buka</span>
                </div>
                <strong style={{ fontSize: '0.8rem' }}>{selectedPool.openingHours}</strong>
              </div>
              
              <div style={{ border: '1px solid var(--border-color)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  <Coins size={14} />
                  <span style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase' }}>Tiket Masuk</span>
                </div>
                <strong style={{ fontSize: '0.8rem', color: 'var(--accent-primary)' }}>{formatPrice(selectedPool.ticketPrice)}</strong>
              </div>
            </div>

            {/* Facilities List */}
            <div>
              <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '0.05em' }}>
                Fasilitas Tersedia
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {selectedPool.facilities.map((fac, idx) => (
                  <span key={idx} className="facility-tag">
                    <Check size={12} color="var(--accent-primary)" style={{ marginRight: '4px', verticalAlign: 'middle', display: 'inline-block' }} />
                    {fac}
                  </span>
                ))}
              </div>
            </div>
            
          </div>
        )}

        {/* NEAREST POOL ANALYSIS VIEW */}
        {activeTab === 'nearest' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '10px', backgroundColor: 'var(--bg-accent-light)', borderColor: 'var(--accent-secondary)' }}>
              <h3 style={{ fontSize: '0.9rem', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Navigation size={16} />
                Fitur Cari Terdekat
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                Aktifkan mode ini dengan tetap berada di tab ini. Klik pada area mana saja di peta Padang untuk mencari lokasi kolam renang terdekat dari titik tersebut.
              </p>
            </div>

            {userLocation ? (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                
                {/* Clicked Coordinates box */}
                <div style={{ padding: '10px 14px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.8rem' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 600, marginBottom: '2px' }}>
                    Lokasi Terpilih (Kueri)
                  </div>
                  <strong>Lat: {userLocation[0].toFixed(5)}, Lng: {userLocation[1].toFixed(5)}</strong>
                </div>

                {/* Nearest Pool Card Display */}
                {nearestPool && (
                  <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderLeft: '4px solid var(--success)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>
                        Kolam Terdekat
                      </span>
                      <strong style={{ fontSize: '0.85rem', color: 'var(--success)' }}>
                        ± {nearestDistance} km
                      </strong>
                    </div>

                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>{nearestPool.name}</h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      Kategori: {nearestPool.category} • Tiket: {formatPrice(nearestPool.ticketPrice)}
                    </p>

                    <button 
                      className="btn btn-primary" 
                      onClick={() => setSelectedPool(nearestPool)}
                      style={{ fontSize: '0.75rem', padding: '6px 12px', marginTop: '4px' }}
                    >
                      Buka Rincian Kolam
                    </button>
                  </div>
                )}

                <button className="btn btn-danger" onClick={clearNearestAnalysis}>
                  Reset Pencarian Terdekat
                </button>

              </div>
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px 16px', 
                fontSize: '0.8rem', 
                color: 'var(--text-muted)',
                border: '1px dashed var(--border-color)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px'
              }}>
                <MapPin size={24} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
                <span>Belum ada titik pencarian.<br />Silakan klik pada peta.</span>
              </div>
            )}

          </div>
        )}

      </div>

      {/* Footer Info */}
      <div className="sidebar-footer">
        <span>AquaMap Padang © 2026</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--success)' }}></span>
          Data Siap
        </span>
      </div>
    </div>
  );
};
