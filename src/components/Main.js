import React, { useState } from 'react';
import axios from 'axios';
import './style.css'

const Main = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState([]);
  const [filteredData, setFilteredData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset error

    // Validate JSON
    try {
      const parsedInput = JSON.parse(jsonInput);
      if (!parsedInput.data || !Array.isArray(parsedInput.data)) {
        setError('Invalid JSON format');
        return;
      }

      // Make POST request to the backend API
      const res = await axios.post('http://localhost:5001/bfhl', parsedInput);
      setResponse(res.data);
      setFilteredData(null); // Reset filtered data
    } catch (err) {
      setError('Invalid JSON or request failed');
    }
  };

  const handleFilterChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFilters([...filters, value]);
    } else {
      setFilters(filters.filter((filter) => filter !== value));
    }
  };

  const handleFilterApply = () => {
    if (!response) return;

    let result = {};

    if (filters.includes('Alphabets')) {
      result.alphabets = response.alphabets;
    }
    if (filters.includes('Numbers')) {
      result.numbers = response.numbers;
    }
    if (filters.includes('Highest lowercase alphabet')) {
      result.highestLowercaseAlphabet = response.highest_lowercase_alphabet;
    }

    setFilteredData(result);
  };

  return (
    <div>
      <h1>JSON Data Processor</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder='Enter JSON here'
          rows='5'
          cols='50'
        ></textarea>
        <br />
        <button type='submit'>Submit</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {response && (
        <div>
          <h3>Filters:</h3>
          <label>
            <input
              type='checkbox'
              value='Alphabets'
              onChange={handleFilterChange}
            />
            Alphabets
          </label>
          <label>
            <input
              type='checkbox'
              value='Numbers'
              onChange={handleFilterChange}
            />
            Numbers
          </label>
          <label>
            <input
              type='checkbox'
              value='Highest lowercase alphabet'
              onChange={handleFilterChange}
            />
            Highest lowercase alphabet
          </label>
          <br />
          <button onClick={handleFilterApply}>Apply Filters</button>

          {filteredData && (
            <div>
              <h3>Filtered Data:</h3>
              <pre>{JSON.stringify(filteredData, null, 2)}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Main;
