import React from 'react';

interface SearchProps {
  onSearch: (term: string) => void;
}

const Search: React.FC<SearchProps> = ({ onSearch }) => {
  return (
    <div style={{ 
      padding: '10px', 
      borderBottom: '1px solid #e1e1e1',
      width: '200px',
      boxSizing: 'border-box'
    }}>
      <input 
        type="text"
        placeholder="Search Blogs"
        onChange={(e) => onSearch(e.target.value)}
        style={{
          width: '100%',
          padding: '8px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          fontSize: '14px'
        }}
      />
    </div>
  );
};

export default Search;