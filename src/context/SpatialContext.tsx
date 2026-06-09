import React, { createContext, useContext, useState, useEffect } from 'react';
import * as turf from '@turf/turf';

export interface SwimmingPool {
  id: string;
  name: string;
  category: 'Umum' | 'Hotel' | 'Waterpark';
  description: string;
  address: string;
  district: string;
  ticketPrice: number;
  rating: number;
  openingHours: string;
  latitude: number;
  longitude: number;
  facilities: string[];
  imageDesc: string; // Brief description of what styling to display
}

interface SpatialContextType {
  pools: SwimmingPool[];
  filteredPools: SwimmingPool[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedPool: SwimmingPool | null;
  setSelectedPool: (pool: SwimmingPool | null) => void;
  userLocation: [number, number] | null;
  setUserLocation: (coords: [number, number] | null) => void;
  nearestPool: SwimmingPool | null;
  nearestDistance: number | null;
  nearestRouteGeoJson: any | null;
  findNearestPool: (lat: number, lng: number) => void;
  clearNearestAnalysis: () => void;
  mapCenter: [number, number];
  setMapCenter: (center: [number, number]) => void;
  mapZoom: number;
  setMapZoom: (zoom: number) => void;
  activeTab: 'directory' | 'nearest' | 'detail';
  setActiveTab: (tab: 'directory' | 'nearest' | 'detail') => void;
}

const SpatialContext = createContext<SpatialContextType | undefined>(undefined);

// Padang, Indonesia coordinates
const PADANG_CENTER: [number, number] = [-0.9471, 100.4172];

// Authentic swimming pools dataset in Padang
const POOLS_DATA: SwimmingPool[] = [
  {
    id: 'pool-teratai',
    name: 'Kolam Renang Teratai GOR Agus Salim',
    category: 'Umum',
    description: 'Kolam renang standar olimpiade milik pemerintah kota Padang. Sangat populer untuk latihan atlet renang daerah maupun rekreasi keluarga di akhir pekan. Memiliki tribun penonton yang besar.',
    address: 'Kawasan GOR H. Agus Salim, Rimbo Kaluang, Padang Barat',
    district: 'Padang Barat',
    ticketPrice: 15000,
    rating: 4.2,
    openingHours: '07:00 - 18:00 WIB',
    latitude: -0.9254,
    longitude: 100.3601,
    facilities: ['Kolam Olimpiade', 'Kolam Anak', 'Tribun Penonton', 'Kamar Bilas', 'Loker', 'Kantin'],
    imageDesc: 'public_olympic_pool'
  },
  {
    id: 'pool-ganting',
    name: 'Kolam Renang Wirabraja Ganting',
    category: 'Umum',
    description: 'Kolam renang milik TNI-AD yang dibuka untuk masyarakat umum. Area kolam renang terpelihara dengan sangat bersih dan airnya segar. Tersedia penyewaan ban renang untuk anak-anak.',
    address: 'Jl. Ganting No.1, Ganting Parak Gadang, Padang Timur',
    district: 'Padang Timur',
    ticketPrice: 15000,
    rating: 4.4,
    openingHours: '08:00 - 17:30 WIB',
    latitude: -0.9575,
    longitude: 100.3705,
    facilities: ['Kolam Dewasa', 'Kolam Anak', 'Sewa Ban & Kacamata', 'Kamar Mandi Bilas', 'Parkir Luas', 'Kantin'],
    imageDesc: 'clean_military_pool'
  },
  {
    id: 'pool-mercure',
    name: 'Infinity Pool Mercure Hotel Padang',
    category: 'Hotel',
    description: 'Kolam renang hotel bintang 4 dengan konsep infinity pool yang menghadap langsung ke Pantai Padang. Menawarkan kenyamanan eksklusif, suasana tenang, dan pemandangan matahari terbenam (sunset) yang spektakuler.',
    address: 'Hotel Mercure Padang, Jl. Purus IV No.8, Purus, Padang Barat',
    district: 'Padang Barat',
    ticketPrice: 100000,
    rating: 4.7,
    openingHours: '06:00 - 20:00 WIB',
    latitude: -0.9542,
    longitude: 100.3526,
    facilities: ['Infinity Pool', 'Sunset View', 'Shower Air Hangat', 'Handuk Bersih', 'Kursi Santai', 'Poolside Resto & Bar'],
    imageDesc: 'premium_hotel_pool'
  },
  {
    id: 'pool-chip',
    name: 'CHIP Waterpark (Christine Hakim Idea Park)',
    category: 'Waterpark',
    description: 'Taman bermain air keluarga terintegrasi dengan pusat oleh-oleh Christine Hakim. Menyediakan berbagai wahana air seru mulai dari ember tumpah raksasa hingga seluncuran air melingkar.',
    address: 'Jl. Adinegoro No.11A, Padang Sarai, Koto Tangah',
    district: 'Koto Tangah',
    ticketPrice: 40000,
    rating: 4.3,
    openingHours: '09:00 - 18:00 WIB',
    latitude: -0.8124, // Adjusted to realistic northern Padang location
    longitude: 100.3168,
    facilities: ['Ember Tumpah', 'Water Slides', 'Kolam Arus', 'Gazebo Sewa', 'Food Court', 'Pusat Oleh-oleh'],
    imageDesc: 'family_waterpark'
  },
  {
    id: 'pool-unp',
    name: 'Kolam Renang Universitas Negeri Padang',
    category: 'Umum',
    description: 'Kolam renang ukuran standar kompetisi nasional yang terletak di dalam kompleks Universitas Negeri Padang. Terutama digunakan untuk perkuliahan mahasiswa FIK UNP, namun dibuka untuk umum pada jam tertentu.',
    address: 'Kampus UNP Air Tawar, Jl. Prof. Dr. Hamka, Air Tawar Barat, Padang Utara',
    district: 'Padang Utara',
    ticketPrice: 20000,
    rating: 4.1,
    openingHours: '08:00 - 17:00 WIB',
    latitude: -0.8972,
    longitude: 100.3508,
    facilities: ['Kolam Standar Olimpiade', 'Tribun', 'Kamar Bilas Standar', 'Parkir Kampus'],
    imageDesc: 'academic_sports_pool'
  },
  {
    id: 'pool-mariana',
    name: 'Kolam Renang Mariana',
    category: 'Umum',
    description: 'Kolam renang keluarga legendaris di Padang Timur yang rimbun dan teduh. Memiliki tingkat keamanan yang baik untuk anak-anak dan kedalaman kolam dewasa yang bervariasi.',
    address: 'Jl. Mariana No.22, Alai Parak Kopi, Padang Utara',
    district: 'Padang Utara',
    ticketPrice: 25000,
    rating: 4.3,
    openingHours: '08:00 - 18:00 WIB',
    latitude: -0.9328,
    longitude: 100.3752,
    facilities: ['Kolam Dewasa Teduh', 'Kolam Anak dengan Slide', 'Kamar Mandi Bilas', 'Gazebo Istirahat', 'Kantin'],
    imageDesc: 'shaded_family_pool'
  }
];

export const SpatialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [filteredPools, setFilteredPools] = useState<SwimmingPool[]>(POOLS_DATA);
  const [selectedPool, setSelectedPool] = useState<SwimmingPool | null>(null);
  
  // Spatial Analysis states
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [nearestPool, setNearestPool] = useState<SwimmingPool | null>(null);
  const [nearestDistance, setNearestDistance] = useState<number | null>(null);
  const [nearestRouteGeoJson, setNearestRouteGeoJson] = useState<any>(null);

  // Map state
  const [mapCenter, setMapCenter] = useState<[number, number]>(PADANG_CENTER);
  const [mapZoom, setMapZoom] = useState<number>(12);
  const [activeTab, setActiveTab] = useState<'directory' | 'nearest' | 'detail'>('directory');

  // Trigger filtering when query or category changes
  useEffect(() => {
    let result = POOLS_DATA;

    // Filter by Category
    if (selectedCategory !== 'Semua') {
      result = result.filter(pool => pool.category === selectedCategory);
    }

    // Filter by Search Query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        pool =>
          pool.name.toLowerCase().includes(query) ||
          pool.address.toLowerCase().includes(query) ||
          pool.district.toLowerCase().includes(query) ||
          pool.facilities.some(fac => fac.toLowerCase().includes(query))
      );
    }

    setFilteredPools(result);
  }, [searchQuery, selectedCategory]);

  // Handle pool select: Fly map to location
  const handleSelectPool = (pool: SwimmingPool | null) => {
    setSelectedPool(pool);
    if (pool) {
      setMapCenter([pool.latitude, pool.longitude]);
      setMapZoom(15);
      setActiveTab('detail');
    }
  };

  // Find nearest pool using Turf.js
  const findNearestPool = (lat: number, lng: number) => {
    setUserLocation([lat, lng]);

    let closestPool: SwimmingPool | null = null;
    let minDistance: number = Infinity;

    const clickedPoint = turf.point([lng, lat]);

    POOLS_DATA.forEach(pool => {
      const poolPoint = turf.point([pool.longitude, pool.latitude]);
      const dist = turf.distance(clickedPoint, poolPoint, { units: 'kilometers' });

      if (dist < minDistance) {
        minDistance = dist;
        closestPool = pool;
      }
    });

    if (closestPool) {
      setNearestPool(closestPool);
      setNearestDistance(parseFloat(minDistance.toFixed(2)));

      // Create Route LineString GeoJSON
      const route = turf.lineString([
        [lng, lat],
        [(closestPool as SwimmingPool).longitude, (closestPool as SwimmingPool).latitude]
      ]);

      setNearestRouteGeoJson(route);
      setActiveTab('nearest');
      
      // Calculate map bounds to fit both points
      const avgLat = (lat + (closestPool as SwimmingPool).latitude) / 2;
      const avgLng = (lng + (closestPool as SwimmingPool).longitude) / 2;
      setMapCenter([avgLat, avgLng]);
      setMapZoom(13);
    }
  };

  const clearNearestAnalysis = () => {
    setUserLocation(null);
    setNearestPool(null);
    setNearestDistance(null);
    setNearestRouteGeoJson(null);
    setActiveTab('directory');
  };

  return (
    <SpatialContext.Provider
      value={{
        pools: POOLS_DATA,
        filteredPools,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedPool,
        setSelectedPool: handleSelectPool,
        userLocation,
        setUserLocation,
        nearestPool,
        nearestDistance,
        nearestRouteGeoJson,
        findNearestPool,
        clearNearestAnalysis,
        mapCenter,
        setMapCenter,
        mapZoom,
        setMapZoom,
        activeTab,
        setActiveTab
      }}
    >
      {children}
    </SpatialContext.Provider>
  );
};

export const useSpatial = () => {
  const context = useContext(SpatialContext);
  if (context === undefined) {
    throw new Error('useSpatial must be used within a SpatialProvider');
  }
  return context;
};
