import React, { useState, useEffect, useRef, useCallback } from "react";
import debounce from "lodash.debounce";

const HIGHLIGHT_STYLE = { backgroundColor: "#ffeeba" };

const AutoCompleteSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const resultsRef = useRef<HTMLUListElement>(null);

  const fetchResults = useCallback(
    debounce(async (searchTerm: string) => {
      if (!searchTerm) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(
          `https://dummyjson.com/users/search?q=${searchTerm}`
        );
        const data = await res.json();
        setResults(data.users || []);
      } catch (error) {
        console.error("Error fetching:", error);
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
    if (e.key === "ArrowDown") {
      setActiveIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && results[activeIndex]) {
      handleSelect(results[activeIndex]);
    }
  };

  const handleSelect = (item: any) => {
    if (!selectedUsers.some((u) => u.id === item.id)) {
      setSelectedUsers((prev) => [...prev, item]);
    }
    setQuery("");
    setResults([]);
    setActiveIndex(-1);
  };

  const handleClear = () => {
    setSelectedUsers([]);
  };

  const highlightMatch = (text: string) => {
    const regex = new RegExp(`(${query})`, "i");
    const parts = text.split(regex);
    return parts.map((part, idx) =>
      regex.test(part) ? (
        <span key={idx} style={HIGHLIGHT_STYLE}>
          {part}
        </span>
      ) : (
        <span key={idx}>{part}</span>
      )
    );
  };

  return (
    <div style={{ width: "350px", margin: "50px auto", fontFamily: "Arial" }}>
      <input
        type="text"
        placeholder="Search users..."
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
      />
      {loading && <div>Loading...</div>}
      {results.length > 0 && (
        <ul
          ref={resultsRef}
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            border: "1px solid #ccc",
            borderTop: "none",
            maxHeight: "200px",
            overflowY: "auto",
          }}
        >
          {results.map((user, index) => (
            <li
              key={user.id}
              onClick={() => handleSelect(user)}
              style={{
                padding: "8px",
                backgroundColor: index === activeIndex ? "#f0f0f0" : "#fff",
                cursor: "pointer",
              }}
            >
              {highlightMatch(`${user.firstName} ${user.lastName}`)}
            </li>
          ))}
        </ul>
      )}

      {selectedUsers.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h4>Selected Users:</h4>
          <ul style={{ paddingLeft: "16px" }}>
            {selectedUsers.map((user) => (
              <li key={user.id}>
                {user.firstName} {user.lastName}
              </li>
            ))}
          </ul>
          <button
            onClick={handleClear}
            style={{
              marginTop: "10px",
              padding: 10,
              backgroundColor: "red",
              color: "white",
              border: 0,
              borderRadius: 8,
            }}
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
};

export default AutoCompleteSearch;
