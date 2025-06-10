import React from 'react';

type Props = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

const SearchInput: React.FC<Props> = ({ value, onChange, onKeyDown }) => (
  <input
    type="text"
    placeholder="Search users..."
    value={value}
    onChange={onChange}
    onKeyDown={onKeyDown}
    style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
  />
);

export default SearchInput;
