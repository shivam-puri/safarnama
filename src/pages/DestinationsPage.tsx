import { useState, useMemo } from 'react';
import { Search, Filter } from 'lucide-react';
import { DestinationCard } from '../components/destination/DestinationCard';
import { CardSkeletonGrid } from '../components/common/LoadingSkeleton';
import { DoodleMountain, DoodlePlane, DoodleStar } from '../components/common/Doodles';
import { useAsync } from '../hooks/useAsync';
import { publicApi } from '../lib/api';

const ALL_TAGS = ['mountains', 'lakes', 'honeymoon', 'snow', 'adventure', 'beaches', 'backwaters', 'nature', 'wellness', 'family', 'trekking'];

export function DestinationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { data: destinations, loading } = useAsync(() => publicApi.getDestinations(), []);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const filtered = useMemo(() => {
    return (destinations ?? []).filter((dest: any) => {
      const matchesSearch = !searchQuery || dest.name.toLowerCase().includes(searchQuery.toLowerCase()) || dest.shortDescription?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => (dest.tags ?? []).includes(tag));
      return matchesSearch && matchesTags && dest.isActive !== false;
    });
  }, [destinations, searchQuery, selectedTags]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFBF5' }}>
      {/* Page Header */}
      <div className="text-white py-16 px-4 relative overflow-hidden" style={{ backgroundColor: '#3D2C2C' }}>
        <DoodleMountain size={200} color="#FFFBF5" className="absolute right-0 bottom-0 pointer-events-none hidden md:block" opacity={0.08} />
        <DoodlePlane size={48} color="#F4A261" className="absolute right-16 top-8 hidden md:block -rotate-12 pointer-events-none" opacity={0.4} />
        <DoodleStar size={18} color="#F4A261" className="absolute right-36 bottom-6 hidden md:block pointer-events-none" opacity={0.5} />
        <div className="max-w-7xl mx-auto relative">
          <p className="journal-label mb-2" style={{ color: '#F4A261' }}>Explore</p>
          <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: 'Caveat, cursive' }}>All Destinations</h1>
          <p className="max-w-xl" style={{ color: '#C4A898' }}>Discover India's most stunning places. Filter by type, search by name, and find your perfect escape.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search + Filter */}
        <div className="journal-card p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#B5A090' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search destinations..."
                className="journal-input pl-9"
              />
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <Filter size={14} className="shrink-0" style={{ color: '#B5A090' }} />
              {ALL_TAGS.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`journal-tag ${selectedTags.includes(tag) ? 'active' : ''}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <CardSkeletonGrid count={6} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" />
        ) : (
          <>
            <p className="text-sm mb-4" style={{ color: '#8A7060' }}>
              Showing <strong>{filtered.length}</strong> destination{filtered.length !== 1 ? 's' : ''}
            </p>

            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((dest: any) => (
                  <DestinationCard key={dest._id ?? dest.id} destination={dest} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-lg mb-4" style={{ color: '#B5A090' }}>No destinations found matching your filters.</p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedTags([]); }}
                  className="text-sm font-medium hover:underline transition-colors"
                  style={{ color: '#5B7FA6' }}
                >
                  Clear filters
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
