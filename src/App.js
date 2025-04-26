import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [query, setQuery] = useState("");
  const [field, setField] = useState("title");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const fields = ["category", "title", "published", "author"];

  useEffect(() => {
    if (query.length > 0) {
      setLoading(true);
      axios
        .get("http://localhost:5000/search", {
          params: { q: query, field: field },
        })
        .then((res) => {
          setResults(res.data.response.docs);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Search error:", err);
          setLoading(false);
        });
    } else {
      setResults([]);
    }
  }, [query, field]);

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h2 style={{ fontSize: "2rem" }}>Solr Search UI</h2>

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Start typing..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ padding: "0.5rem", width: "300px", marginRight: "1rem" }}
        />

        <select
          value={field}
          onChange={(e) => setField(e.target.value)}
          style={{ padding: "0.5rem" }}
        >
          {fields.map((f) => (
            <option key={f} value={f}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {loading && <p>Searching...</p>}

      <ul>
        {results.map((doc, index) => (
          <li key={index} style={{ marginBottom: "1rem" }}>
            <strong>{doc.title}</strong> <br />
            <em>Category:</em> {doc.category} <br />
            <em>Published:</em> {doc.published} <br />
            <em>Author:</em> {doc.author}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
