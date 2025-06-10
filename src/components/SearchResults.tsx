import React from 'react';

type Props = {
  results: any[];
  query: string;
  activeIndex: number;
  onSelect: (item: any) => void;
  onHover: (index: number) => void;
};

const highlightMatch = (text: string, query: string) => {
  const regex = new RegExp(`(${query})`, 'i');
  const parts = text.split(regex);
  return parts.map((part, idx) =>
    regex.test(part) ? (
      <span key={idx} style={{ backgroundColor: '#ffeeba' }}>{part}</span>
    ) : (
      <span key={idx}>{part}</span>
    )
  );
};

const SearchResults: React.FC<Props> = ({ results, query, activeIndex, onSelect, onHover }) => (
  <ul style={{
    listStyle: 'none',
    margin: 0,
    padding: 0,
    border: '1px solid #ccc',
    borderTop: 'none',
    maxHeight: '200px',
    overflowY: 'auto',
  }}>
    {results.map((user, index) => (
      <li
        key={user.id}
        onClick={() => onSelect(user)}
        onMouseEnter={() => onHover(index)}
        style={{
          padding: '8px',
          backgroundColor: index === activeIndex ? '#f0f0f0' : '#fff',
          cursor: 'pointer',
          transition: 'background-color 0.2s',
        }}
      >
        {highlightMatch(`${user.firstName} ${user.lastName}`, query)}
      </li>
    ))}
  </ul>
);

export default SearchResults;
