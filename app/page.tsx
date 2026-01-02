"use client";
import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  Home, 
  Building2, 
  Filter, 
  Plus, 
  CheckCircle,
  TrendingUp,
  X,
  Grid,
  List,
  DollarSign,
  Maximize2
} from 'lucide-react';

// --- 1. MOCK DATA & UTILITIES ---
// We keep the logic for "Benidity" (Benefits) even without the visual map
const CITY_CENTER = { lat: 40.7128, lng: -74.0060 }; // New York

const MOCK_AMENITIES = [
  { id: 'a1', name: 'Central Plaza Mall', type: 'mall', lat: 40.7150, lng: -74.0020 },
  { id: 'a2', name: 'Downtown Market', type: 'mall', lat: 40.7100, lng: -74.0090 },
  { id: 'a3', name: 'Tech City Metro', type: 'transport', lat: 40.7135, lng: -74.0050 },
  { id: 'a4', name: 'Westside Bus Terminal', type: 'transport', lat: 40.7180, lng: -74.0100 },
  { id: 'a5', name: 'Greenwood High', type: 'school', lat: 40.7090, lng: -74.0010 },
];

const INITIAL_PROPERTIES = [
  { 
    id: 1, 
    title: "Skyline Penthouse", 
    price: 1200000, 
    type: "Apartment", 
    beds: 3, baths: 2, sqft: 1800,
    lat: 40.7128, lng: -74.0060,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=500&q=80"
  },
  { 
    id: 2, 
    title: "Urban Loft", 
    price: 850000, 
    type: "Condo", 
    beds: 2, baths: 1, sqft: 1100,
    lat: 40.7145, lng: -74.0030,
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=500&q=80"
  },
  { 
    id: 3, 
    title: "Garden Villa", 
    price: 2100000, 
    type: "House", 
    beds: 5, baths: 4, sqft: 3200,
    lat: 40.7095, lng: -74.0085,
    image: "https://images.unsplash.com/photo-1600596542815-60c37c663042?auto=format&fit=crop&w=500&q=80"
  },
  { 
    id: 4, 
    title: "Metro Heights", 
    price: 650000, 
    type: "Apartment", 
    beds: 1, baths: 1, sqft: 800,
    lat: 40.7135, lng: -74.0050,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=500&q=80"
  },
  { 
    id: 5, 
    title: "Suburban Family Home", 
    price: 1450000, 
    type: "House", 
    beds: 4, baths: 3, sqft: 2500,
    lat: 40.7050, lng: -74.0150,
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?auto=format&fit=crop&w=500&q=80"
  }
];

// Helper: Simple Distance Calculation (km)
// const getDistance = (lat1, lng1, lat2, lng2) => {
//   const R = 6371; 
//   const dLat = (lat2 - lat1) * (Math.PI / 180);
//   const dLng = (lng2 - lng1) * (Math.PI / 180);
//   const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * (Math.PI/180)) * Math.cos(lat2 * (Math.PI/180)) * Math.sin(dLng/2) * Math.sin(dLng/2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
//   return R * c; 
// };

// Helper: Smart Score Logic
// const calculateSmartScore = (prop, amenities) => {
//   let score = 50; 
//   const nearestTransport = amenities.find(a => a.type === 'transport' && getDistance(prop.lat, prop.lng, a.lat, a.lng) < 0.5);
//   if (nearestTransport) score += 20;
//   const nearestMall = amenities.find(a => a.type === 'mall' && getDistance(prop.lat, prop.lng, a.lat, a.lng) < 0.8);
//   if (nearestMall) score += 20;
//   const nearestSchool = amenities.find(a => a.type === 'school' && getDistance(prop.lat, prop.lng, a.lat, a.lng) < 1.0);
//   if (nearestSchool) score += 10;
//   return Math.min(score, 100);
// };

// --- 2. MAIN DASHBOARD ---
export default function RealEstateDashboard() {
  const [properties, setProperties] = useState(INITIAL_PROPERTIES);
  const [selectedProp, setSelectedProp] = useState(null); // Used for Detail Modal now
  const [filterType, setFilterType] = useState('All');
  const [priceRange, setPriceRange] = useState(3000000);
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const [newProp, setNewProp] = useState({ title: '', price: '', type: 'Apartment' });

  // const handleAddProperty = (e) => {
  //   e.preventDefault();
  //   const newId = properties.length + 1;
  //   const randomOffsetLat = (Math.random() - 0.5) * 0.01;
  //   const randomOffsetLng = (Math.random() - 0.5) * 0.01;
    
  //   const added = {
  //     id: newId,
  //     ...newProp,
  //     lat: CITY_CENTER.lat + randomOffsetLat,
  //     lng: CITY_CENTER.lng + randomOffsetLng,
  //     price: Number(newProp.price),
  //     beds: Math.floor(Math.random() * 4) + 1,
  //     baths: Math.floor(Math.random() * 3) + 1,
  //     sqft: 1000 + Math.floor(Math.random() * 2000),
  //     image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=500&q=80"
  //   };
    
  //   setProperties([...properties, added]);
  //   setShowAddModal(false);
  // };

  const filteredProperties = useMemo(() => {
    return properties.filter(p => 
      (filterType === 'All' || p.type === filterType) &&
      p.price <= priceRange
    );
  }, [properties, filterType, priceRange]);

  // Smart Analysis for the selected property (Detail View)
  const smartAnalysis = useMemo(() => {
    if (!selectedProp) return null;
    // const score = calculateSmartScore(selectedProp, MOCK_AMENITIES);
    // const nearby = MOCK_AMENITIES.filter(a => getDistance(selectedProp.lat, selectedProp.lng, a.lat, a.lng) < 0.8);
    // return { score, nearby };
  }, [selectedProp]);

  return (
    <div className="flex flex-col h-screen font-sans text-gray-800 bg-gray-100">
      
      {/* HEADER */}
      <header className="bg-white p-4 shadow-sm flex justify-between items-center z-20 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Building2 className="text-white h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">EstateIQ <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full ml-1">ADMIN</span></h1>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="bg-gray-100 rounded-lg p-1 flex items-center">
             <button 
               onClick={() => setViewMode('grid')}
               className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
             >
               <Grid size={18} />
             </button>
             <button 
               onClick={() => setViewMode('list')}
               className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
             >
               <List size={18} />
             </button>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-md font-medium"
          >
            <Plus size={18} /> Add Listing
          </button>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* LEFT SIDEBAR: FILTERS */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col z-10 overflow-y-auto">
          
          {/* Dashboard Stats */}
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Performance</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100">
                <span className="text-2xl font-bold text-indigo-900 block">{properties.length}</span>
                <span className="text-xs text-indigo-600 font-medium">Active Listings</span>
              </div>
              <div className="bg-teal-50 p-3 rounded-xl border border-teal-100">
                <span className="text-2xl font-bold text-teal-900 block">6.4%</span>
                <span className="text-xs text-teal-600 font-medium">Avg. Yield</span>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="p-6">
            <div className="flex items-center gap-2 text-gray-900 font-bold mb-4">
              <Filter size={18} className="text-indigo-600" /> Filters
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                <select 
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="All">All Types</option>
                  <option value="Apartment">Apartment</option>
                  <option value="House">House</option>
                  <option value="Condo">Condo</option>
                </select>
              </div>

              <div>
                <label className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                  <span>Max Price</span>
                  <span className="text-indigo-600 font-bold">${(priceRange/1000000).toFixed(1)}M</span>
                </label>
                <input 
                  type="range" 
                  min="500000" 
                  max="5000000" 
                  step="100000"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>$500k</span>
                  <span>$5M+</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT AREA: PROPERTY GRID */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Available Properties</h2>
                <p className="text-gray-500 mt-1">Found {filteredProperties.length} listings based on your criteria.</p>
              </div>
            </div>

            {/* GRID VIEW */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {filteredProperties.map(prop => {
                  // const score = calculateSmartScore(prop, MOCK_AMENITIES);
                  return (
                    <div 
                      key={prop.id}
                      // onClick={() => setSelectedProp(prop)}
                      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer flex flex-col"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={prop.image} 
                          alt={prop.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-gray-800 shadow-sm">
                          {prop.type}
                        </div>
                        <div className="absolute bottom-3 left-3 flex gap-1">
                         
                        </div>
                      </div>
                      
                      <div className="p-4 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-lg text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors">{prop.title}</h3>
                        </div>
                        <div className="text-xl font-bold text-indigo-600 mb-4">${prop.price.toLocaleString()}</div>
                        
                        <div className="grid grid-cols-3 gap-2 py-3 border-t border-gray-100 mt-auto">
                           <div className="text-center">
                              <span className="block text-gray-400 text-[10px] uppercase font-bold">Beds</span>
                              <span className="text-gray-700 font-semibold text-sm">{prop.beds}</span>
                           </div>
                           <div className="text-center border-l border-gray-100">
                              <span className="block text-gray-400 text-[10px] uppercase font-bold">Baths</span>
                              <span className="text-gray-700 font-semibold text-sm">{prop.baths}</span>
                           </div>
                           <div className="text-center border-l border-gray-100">
                              <span className="block text-gray-400 text-[10px] uppercase font-bold">Sqft</span>
                              <span className="text-gray-700 font-semibold text-sm">{prop.sqft}</span>
                           </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* LIST VIEW */}
            {viewMode === 'list' && (
              <div className="space-y-3">
                 {filteredProperties.map(prop => {
                  //  const score = calculateSmartScore(prop, MOCK_AMENITIES);
                   return (
                     <div 
                        key={prop.id}
                        // onClick={() => setSelectedProp(prop)}
                        className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all border border-gray-100 cursor-pointer flex items-center gap-6"
                     >
                        <img src={prop.image} alt={prop.title} className="w-32 h-24 object-cover rounded-lg" />
                        <div className="flex-1">
                           <h3 className="font-bold text-lg text-gray-900">{prop.title}</h3>
                           <p className="text-gray-500 text-sm mb-2">{prop.type} • {prop.sqft} sqft</p>
                           <div className="flex gap-4 text-sm text-gray-600">
                              <span>{prop.beds} Beds</span>
                              <span>{prop.baths} Baths</span>
                           </div>
                        </div>
                        <div className="text-right">
                           <div className="text-xl font-bold text-indigo-600 mb-1">${prop.price.toLocaleString()}</div>
                          
                        </div>
                     </div>
                   );
                 })}
              </div>
            )}

            {filteredProperties.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                {/* <Search size={48} className="mb-4 opacity-20" /> */}
                <p>No properties match your filters.</p>
                <button onClick={() => {setFilterType('All'); setPriceRange(5000000)}} className="text-indigo-600 font-medium mt-2 hover:underline">Clear Filters</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* DETAIL MODAL (Replaces Map InfoWindow) */}
      {selectedProp && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="relative h-64">
              {/* <img src={selectedProp.image} className="w-full h-full object-cover" alt="detail" /> */}
              <button 
                onClick={() => setSelectedProp(null)}
                className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur transition-all"
              >
                <X size={20} />
              </button>
              {/* <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-20"> */}
                {/* <h2 className="text-3xl font-bold text-white mb-1">{selectedProp.title}</h2> */}
                <div className="flex items-center gap-2 text-white/90">
                  <MapPin size={16} /> 
                  {/* <span>Coordinates: {selectedProp.lat.toFixed(4)}, {selectedProp.lng.toFixed(4)}</span> */}
                </div>
              </div>
            </div>

            <div className="p-6 overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                 <div>
                    {/* <span className="text-gray-500 text-sm uppercase font-bold tracking-wider">{selectedProp.type}</span> */}
                    {/* <div className="text-3xl font-bold text-indigo-600 mt-1">${selectedProp.price.toLocaleString()}</div> */}
                 </div>
                 <div className="flex gap-6 text-center">
                    <div>
                       {/* <div className="text-2xl font-bold text-gray-800">{selectedProp.beds}</div> */}
                       <div className="text-xs text-gray-500 uppercase">Beds</div>
                    </div>
                    <div>
                       {/* <div className="text-2xl font-bold text-gray-800">{selectedProp.baths}</div> */}
                       <div className="text-xs text-gray-500 uppercase">Baths</div>
                    </div>
                    <div>
                       {/* <div className="text-2xl font-bold text-gray-800">{selectedProp.sqft}</div> */}
                       <div className="text-xs text-gray-500 uppercase">Sqft</div>
                    </div>
                 </div>
              </div>

              {/* AI SMART ANALYSIS SECTION (Preserved Logic) */}
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-indigo-600 p-2 rounded-lg text-white">
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-indigo-900 text-lg">AI Investment Analysis</h3>
                    <p className="text-indigo-600 text-xs">Automated "Benidity" Scoring Engine</p>
                  </div>
                  <div className="ml-auto text-right">
                     {/* <span className="text-3xl font-black text-indigo-600">{smartAnalysis.score}</span> */}
                     <span className="text-sm text-indigo-400 font-bold">/100</span>
                  </div>
                </div>

                <div className="space-y-3">
                   <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Nearby Key Assets (Calculated)</h4>
                   {/* {smartAnalysis.nearby.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {smartAnalysis.nearby.map((item) => (
                          <div key={item.id} className="flex items-center gap-2 bg-white p-2 rounded border border-indigo-100 shadow-sm">
                             {item.type === 'mall' ? <ShoppingBag size={14} className="text-blue-500"/> : 
                              item.type === 'transport' ? <Train size={14} className="text-red-500"/> : 
                              <GraduationCap size={14} className="text-green-500"/>}
                             <span className="text-sm text-gray-700 font-medium">{item.name}</span>
                          </div>
                        ))}
                      </div>
                   ) : (
                      <div className="text-gray-500 italic text-sm bg-white p-3 rounded border border-gray-100">
                        No major commercial hubs detected within immediate radius. High privacy score.
                      </div>
                   )} */}
                </div>
              </div>

              <button className="w-full mt-6 bg-gray-900 hover:bg-black text-white font-bold py-3 rounded-lg transition-colors">
                Contact Agent
              </button>
            </div>

          </div>
        // </div>
      )}

      {/* ADD PROPERTY MODAL */}
      {/* {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Add New Listing</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600"><X /></button>
            </div>
            
            <form onSubmit={handleAddProperty} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property Title</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. Sunset Boulevard Villa"
                  className="w-full border rounded p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={newProp.title}
                  onChange={e => setNewProp({...newProp, title: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                  <input 
                    required
                    type="number" 
                    placeholder="500000"
                    className="w-full border rounded p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={newProp.price}
                    onChange={e => setNewProp({...newProp, price: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select 
                    className="w-full border rounded p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={newProp.type}
                    onChange={e => setNewProp({...newProp, type: e.target.value})}
                  >
                    <option>Apartment</option>
                    <option>House</option>
                    <option>Condo</option>
                    <option>Commercial</option>
                  </select>
                </div>
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-colors">
                  Upload Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )} */}

    </div>
  );
}