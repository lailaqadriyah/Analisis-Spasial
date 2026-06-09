import React, { useState } from 'react';
import { useSpatial } from '../context/SpatialContext';
import {
  Search, MapPin, Clock, Coins, Star,
  ArrowLeft, Check, Compass, Navigation,
  Dumbbell, Home
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    filteredPools,
    searchQuery,
    setSearchQuery,
    selectedKategori,
    setSelectedKategori,
    selectedJenis,
    setSelectedJenis,
    selectedPool,
    setSelectedPool,
    userLocation,
    nearestPool,
    nearestDistance,
    clearNearestAnalysis,
    activeTab,
    setActiveTab,
  } = useSpatial();

  const [localSearch, setLocalSearch] = useState(searchQuery);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setLocalSearch(q);
    setSearchQuery(q);
  };

  const handleBackToDirectory = () => {
    setSelectedPool(null);
    setActiveTab('directory');
  };

  return (
    <div className="sidebar-container">
      {/* ── HEADER ── */}
      <div className="sidebar-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #0891b2, #06b6d4)',
            width: '40px', height: '40px',
            borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(8,145,178,0.3)',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 6c.6.5 1.2 1 2.5 1C6 7 7 5 9 5c2 0 3 2 5 2 2.5 0 3.7-1.5 5-2"/>
              <path d="M2 12c.6.5 1.2 1 2.5 1 1.5 0 2.5-2 4.5-2 2 0 3 2 5 2 2.5 0 3.7-1.5 5-2"/>
              <path d="M2 18c.6.5 1.2 1 2.5 1 1.5 0 2.5-2 4.5-2 2 0 3 2 5 2 2.5 0 3.7-1.5 5-2"/>
            </svg>
          </div>
          <div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800 }}>AquaMap</h1>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              Direktori Kolam Renang Kota Padang
            </p>
          </div>
        </div>
        <span style={{
          fontSize: '0.65rem', fontWeight: 700, color: 'var(--accent-primary)',
          background: 'var(--bg-accent-light)', padding: '3px 8px',
          border: '1px solid rgba(8,145,178,0.2)', borderRadius: '20px',
        }}>46 Lokasi</span>
      </div>

      {/* ── TAB NAV ── */}
      <div style={{ padding: '0 24px 12px 24px' }}>
        <div style={{
          display: 'flex', gap: '4px',
          backgroundColor: 'var(--bg-primary)', padding: '3px',
          borderRadius: '10px', border: '1px solid var(--border-color)',
        }}>
          <button
            className={`tab-btn ${activeTab === 'directory' || activeTab === 'detail' ? 'active' : ''}`}
            onClick={() => { setSelectedPool(null); setActiveTab('directory'); }}
          >Direktori</button>
          <button
            className={`tab-btn ${activeTab === 'nearest' ? 'active' : ''}`}
            onClick={() => setActiveTab('nearest')}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
              <Compass size={13} /> Cari Terdekat
            </div>
          </button>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="sidebar-content">

        {/* ════ DIRECTORY ════ */}
        {activeTab === 'directory' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

            {/* Search bar */}
            <div className="search-wrapper">
              <Search size={17} className="search-icon" />
              <input
                type="text"
                placeholder="Cari nama, lokasi, fasilitas..."
                value={localSearch}
                onChange={handleSearchChange}
                className="search-input"
              />
            </div>

            {/* Filter row 1 – Kategori Penggunaan */}
            <div>
              <p style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                Tipe Penggunaan
              </p>
              <div className="filter-pills-container">
                {['Semua', 'Rekreasi', 'Atlet'].map(k => (
                  <button
                    key={k}
                    onClick={() => setSelectedKategori(k)}
                    className={`pill-btn ${selectedKategori === k ? 'active' : ''}`}
                  >
                    {k === 'Atlet' && <Dumbbell size={11} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />}
                    {k}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter row 2 – Indoor / Outdoor */}
            <div>
              <p style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                Jenis Kolam
              </p>
              <div className="filter-pills-container">
                {['Semua', 'Indoor', 'Outdoor'].map(j => (
                  <button
                    key={j}
                    onClick={() => setSelectedJenis(j)}
                    className={`pill-btn ${selectedJenis === j ? 'active' : ''}`}
                  >
                    {j === 'Indoor' && <Home size={11} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />}
                    {j}
                  </button>
                ))}
              </div>
            </div>

            {/* Result count */}
            <p style={{ fontSize: '0.73rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              Menampilkan <strong style={{ color: 'var(--accent-primary)' }}>{filteredPools.length}</strong> dari 46 lokasi
            </p>

            {/* Pool list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredPools.length > 0 ? filteredPools.map(pool => (
                <div
                  key={pool.id}
                  onClick={() => setSelectedPool(pool)}
                  className={`pool-card ${selectedPool?.id === pool.id ? 'active' : ''}`}
                >
                  {/* Color top-bar by category */}
                  <div style={{
                    height: '4px', borderRadius: '4px 4px 0 0',
                    margin: '-16px -16px 10px -16px',
                    background: pool.kategori === 'Atlet'
                      ? 'linear-gradient(90deg,#7c3aed,#6d28d9)'
                      : pool.jenisKolam === 'Indoor'
                        ? 'linear-gradient(90deg,#0e7490,#0891b2)'
                        : 'linear-gradient(90deg,#0891b2,#06b6d4)',
                  }} />

                  {/* Name + Rating */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 700, lineHeight: 1.3, flex: 1, paddingRight: '8px' }}>
                      {pool.name}
                    </h3>
                    <span className="badge badge-rating" style={{ flexShrink: 0, gap: '3px', display: 'flex', alignItems: 'center' }}>
                      <Star size={10} fill="#f59e0b" color="#f59e0b" />
                      {pool.rating}
                    </span>
                  </div>

                  {/* Location */}
                  <p style={{ fontSize: '0.73rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', margin: '4px 0' }}>
                    <MapPin size={11} color="var(--text-muted)" />
                    {pool.district}
                  </p>

                  {/* Badge row */}
                  <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginTop: '2px' }}>
                    <span className="badge" style={{
                      fontSize: '0.62rem', padding: '2px 8px',
                      background: pool.kategori === 'Atlet' ? '#f5f3ff' : 'var(--bg-accent-light)',
                      color: pool.kategori === 'Atlet' ? '#6d28d9' : 'var(--accent-primary)',
                      border: `1px solid ${pool.kategori === 'Atlet' ? '#ddd6fe' : 'rgba(8,145,178,0.2)'}`,
                    }}>
                      {pool.kategori}
                    </span>
                    <span className="badge" style={{
                      fontSize: '0.62rem', padding: '2px 8px',
                      background: pool.jenisKolam === 'Indoor' ? '#fef3c7' : '#ecfdf5',
                      color: pool.jenisKolam === 'Indoor' ? '#92400e' : '#065f46',
                      border: `1px solid ${pool.jenisKolam === 'Indoor' ? '#fde68a' : '#a7f3d0'}`,
                    }}>
                      {pool.jenisKolam}
                    </span>
                  </div>

                  {/* Price footer */}
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #f1f5f9',
                  }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Tiket masuk</span>
                    <strong style={{
                      fontSize: '0.8rem', color: pool.ticketPriceMin > 0 ? 'var(--accent-primary)' : 'var(--text-muted)',
                      fontWeight: 700,
                    }}>
                      {pool.ticketPriceMin > 0 ? `Rp ${pool.ticketPriceMin.toLocaleString('id-ID')}+` : '—'}
                    </strong>
                  </div>
                </div>
              )) : (
                <div style={{
                  textAlign: 'center', padding: '32px 16px',
                  color: 'var(--text-muted)', border: '1px dashed var(--border-color)',
                  borderRadius: 'var(--radius-md)', fontSize: '0.82rem',
                }}>
                  Tidak ada kolam renang yang sesuai filter.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ════ DETAIL INSPECTOR ════ */}
        {activeTab === 'detail' && selectedPool && (
          <div className="detail-view-container">
            <button
              className="btn btn-secondary"
              onClick={handleBackToDirectory}
              style={{ display: 'flex', alignSelf: 'flex-start', padding: '6px 12px', fontSize: '0.78rem', borderRadius: '20px' }}
            >
              <ArrowLeft size={13} /> Kembali
            </button>

            {/* Color Banner */}
            <div style={{
              height: '10px', borderRadius: 'var(--radius-sm)',
              background: selectedPool.kategori === 'Atlet'
                ? 'linear-gradient(90deg,#7c3aed,#06b6d4)'
                : 'linear-gradient(90deg,#0891b2,#06b6d4)',
            }} />

            {/* Name & Badges */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, lineHeight: 1.3 }}>
                  {selectedPool.name}
                </h2>
                <span className="badge badge-rating" style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <Star size={12} fill="#f59e0b" color="#f59e0b" />
                  {selectedPool.rating}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '5px', marginTop: '6px', flexWrap: 'wrap' }}>
                <span className="badge" style={{
                  fontSize: '0.65rem',
                  background: selectedPool.kategori === 'Atlet' ? '#f5f3ff' : 'var(--bg-accent-light)',
                  color: selectedPool.kategori === 'Atlet' ? '#6d28d9' : 'var(--accent-primary)',
                  border: `1px solid ${selectedPool.kategori === 'Atlet' ? '#ddd6fe' : 'rgba(8,145,178,0.2)'}`,
                }}>
                  {selectedPool.kategori === 'Atlet' && <Dumbbell size={9} style={{ display: 'inline', marginRight: '3px' }} />}
                  {selectedPool.kategori}
                </span>
                <span className="badge" style={{
                  fontSize: '0.65rem',
                  background: selectedPool.jenisKolam === 'Indoor' ? '#fef3c7' : '#ecfdf5',
                  color: selectedPool.jenisKolam === 'Indoor' ? '#92400e' : '#065f46',
                  border: `1px solid ${selectedPool.jenisKolam === 'Indoor' ? '#fde68a' : '#a7f3d0'}`,
                }}>
                  {selectedPool.jenisKolam === 'Indoor' && <Home size={9} style={{ display: 'inline', marginRight: '3px' }} />}
                  {selectedPool.jenisKolam}
                </span>
              </div>

              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
                <MapPin size={13} color="var(--text-muted)" />
                {selectedPool.address}
              </p>
            </div>

            {/* Description */}
            <p style={{
              fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.55,
              backgroundColor: 'var(--bg-tertiary)', padding: '12px',
              borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--accent-secondary)',
            }}>
              {selectedPool.description}
            </p>

            {/* Info Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {[
                { icon: <Clock size={14} />, label: 'Jam Buka', value: selectedPool.openingHours },
                { icon: <Coins size={14} />, label: 'Tiket Masuk', value: selectedPool.ticketPrice, highlight: true },
              ].map(item => (
                <div key={item.label} style={{ border: '1px solid var(--border-color)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    {item.icon}
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase' }}>{item.label}</span>
                  </div>
                  <strong style={{ fontSize: '0.78rem', color: item.highlight ? 'var(--accent-primary)' : 'var(--text-primary)', lineHeight: 1.3, display: 'block' }}>
                    {item.value}
                  </strong>
                </div>
              ))}
            </div>

            {/* Coordinates */}
            <div style={{ border: '1px solid var(--border-color)', padding: '10px', borderRadius: 'var(--radius-sm)', fontSize: '0.73rem', color: 'var(--text-muted)' }}>
              <strong style={{ display: 'block', marginBottom: '4px', fontSize: '0.65rem', textTransform: 'uppercase' }}>Koordinat GPS</strong>
              <code style={{ color: 'var(--accent-primary)', fontFamily: 'monospace' }}>
                {selectedPool.latitude.toFixed(7)}, {selectedPool.longitude.toFixed(7)}
              </code>
            </div>

            {/* Facilities */}
            <div>
              <h3 style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '0.05em', fontWeight: 700 }}>
                Fasilitas Tersedia
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {selectedPool.facilities.map((fac, idx) => (
                  <span key={idx} className="facility-tag">
                    <Check size={11} color="var(--accent-primary)" style={{ marginRight: '4px', verticalAlign: 'middle', display: 'inline-block', flexShrink: 0 }} />
                    {fac}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ════ CARI TERDEKAT ════ */}
        {activeTab === 'nearest' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

            <div style={{
              background: 'var(--bg-accent-light)', border: '1px solid rgba(6,182,212,0.3)',
              borderRadius: 'var(--radius-md)', padding: '14px',
            }}>
              <h3 style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <Navigation size={15} /> Mode Cari Terdekat
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                Pastikan Tab ini aktif, lalu klik titik mana saja di peta Kota Padang. Sistem akan otomatis menghitung dan menampilkan kolam renang terdekat dari 46 lokasi terdaftar.
              </p>
            </div>

            {userLocation ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{
                  padding: '10px 14px', background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem',
                }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 700, marginBottom: '3px' }}>
                    Titik Kueri Anda
                  </div>
                  <code style={{ color: 'var(--text-primary)', fontFamily: 'monospace' }}>
                    {userLocation[0].toFixed(6)}, {userLocation[1].toFixed(6)}
                  </code>
                </div>

                {nearestPool && (
                  <div style={{
                    border: '1px solid #a7f3d0', background: '#f0fdf4',
                    borderRadius: 'var(--radius-md)', padding: '14px',
                    display: 'flex', flexDirection: 'column', gap: '8px',
                    borderLeft: '4px solid var(--success)',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="badge badge-success" style={{ fontSize: '0.62rem' }}>Kolam Terdekat</span>
                      <strong style={{ fontSize: '0.88rem', color: 'var(--success)' }}>± {nearestDistance} km</strong>
                    </div>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 700, lineHeight: 1.3 }}>
                      {nearestPool.name}
                    </h4>
                    <p style={{ fontSize: '0.73rem', color: 'var(--text-secondary)' }}>
                      {nearestPool.kategori} · {nearestPool.jenisKolam} · {nearestPool.district}
                    </p>
                    <button
                      className="btn btn-primary"
                      onClick={() => setSelectedPool(nearestPool)}
                      style={{ fontSize: '0.76rem', padding: '7px 12px' }}
                    >
                      Lihat Detail Kolam
                    </button>
                  </div>
                )}

                <button className="btn btn-danger" onClick={clearNearestAnalysis}>
                  Reset Pencarian
                </button>
              </div>
            ) : (
              <div style={{
                textAlign: 'center', padding: '48px 16px',
                color: 'var(--text-muted)', border: '1px dashed var(--border-color)',
                borderRadius: 'var(--radius-md)', display: 'flex',
                flexDirection: 'column', alignItems: 'center', gap: '10px',
              }}>
                <MapPin size={28} style={{ opacity: 0.35 }} />
                <span style={{ fontSize: '0.82rem', lineHeight: 1.5 }}>
                  Belum ada titik yang dipilih.<br />Klik sembarang titik di peta.
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── FOOTER ── */}
      <div className="sidebar-footer">
        <span>AquaMap Padang © 2026</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)' }} />
          46 Lokasi Aktif
        </span>
      </div>
    </div>
  );
};
