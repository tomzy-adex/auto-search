import React, { useState, useEffect, useRef, useCallback } from 'react';
import debounce from 'lodash.debounce';
import SearchInput from './components/SearchInput';
import SearchResults from './components/SearchResults';
import SelectedUsersList from './components/SelectedUsersList';

const AutoCompleteSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);

  const fetchResults = useCallback(
    debounce(async (searchTerm: string) => {
      if (!searchTerm) {
        setResults([]);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`https://dummyjson.com/users/search?q=${searchTerm}`);
        const data = await res.json();
        setResults(data.users || []);
      } catch (err) {
        setError("Failed to fetch users. Please try again.");
        setResults([]);
      }
      setLoading(false);
    }, 300),
    []
  );

  useEffect(() => {
    fetchResults(query);
  }, [query, fetchResults]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      setActiveIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      setActiveIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && results[activeIndex]) {
      handleSelect(results[activeIndex]);
    }
  };

  const handleSelect = (item: any) => {
    if (!selectedUsers.some(u => u.id === item.id)) {
      setSelectedUsers(prev => [...prev, item]);
    }
    setQuery('');
    setResults([]);
    setActiveIndex(-1);
  };

  const handleClear = () => {
    setSelectedUsers([]);
  };

  return (
    <div style={{ width: '350px', margin: '50px auto', fontFamily: 'Arial' }}>
      <SearchInput value={query} onChange={handleChange} onKeyDown={handleKeyDown} />

      {loading && <div style={{ marginTop: '5px' }}>Loading...</div>}
      {error && <div style={{ color: 'red', marginTop: '5px' }}>{error}</div>}
      {!loading && query && results.length === 0 && !error && (
        <div style={{ marginTop: '5px', fontStyle: 'italic' }}>No users found.</div>
      )}

      {results.length > 0 && (
        <SearchResults
          results={results}
          query={query}
          activeIndex={activeIndex}
          onSelect={handleSelect}
          onHover={setActiveIndex}
        />
      )}

      {selectedUsers.length > 0 && (
        <SelectedUsersList users={selectedUsers} onClear={handleClear} />
      )}
    </div>
  );
};

export default AutoCompleteSearch;
