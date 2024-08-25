import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [jsonData, setJsonData] = useState('');      // To store input JSON
  const [error, setError] = useState('');            // To display errors (if any)
  const [response, setResponse] = useState(null);    // To store backend response
  const [selectedOptions, setSelectedOptions] = useState([]);  // To store selected filters

  // Handle text input changes
  const handleChange = (e) => {
    setJsonData(e.target.value);
    setError('');
  };

  // Validate the input JSON structure
  const validateJSON = (jsonStr) => {
    try {
      const parsed = JSON.parse(jsonStr); // Parse the input
      if (parsed.data) return true;       // Check if 'data' key exists
      setError('Invalid JSON structure: Missing "data" key.');
    } catch (err) {
      setError('Invalid JSON format');    // Catch parsing errors
    }
    return false;
  };

  // Handle form submission (JSON Input Submission)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateJSON(jsonData)) return;  // Validate JSON format
    
    try {
      // Send a POST request to the backend API with the JSON data
      const result = await axios.post('http://localhost:5001/bfhl', {
        data: JSON.parse(jsonData).data,
      });
      setResponse(result.data);           // Store the backend response
    } catch (err) {
      setError('Error in API request');
    }
  };

  // Handle multi-select dropdown change
  const handleOptionChange = (e) => {
    const options = Array.from(e.target.selectedOptions, (option) => option.value);
    setSelectedOptions(options);   // Update selected filters
  };

  // Render the filtered response based on selected dropdown options
  const renderFilteredResponse = () => {
    if (!response) return null;

    // Filter data based on selected options
    let filteredData = [];
    if (selectedOptions.includes('Alphabets')) {
      filteredData = [...filteredData, ...response.alphabets];  // Add alphabets if selected
    }
    if (selectedOptions.includes('Numbers')) {
      filteredData = [...filteredData, ...response.numbers];    // Add numbers if selected
    }
    if (selectedOptions.includes('Highest lowercase alphabet')) {
      filteredData = [...filteredData, ...response.highest_lowercase_alphabet]; // Add highest lowercase alphabet
    }

    return (
      <div>
        <h3>Filtered Response:</h3>
        <pre>{JSON.stringify(filteredData, null, 2)}</pre>  {/* Render filtered data */}
      </div>
    );
  };

  return (
    <div>
      <h1>{'Your_Roll_Number'}</h1>  {/* Display roll number in the title */}
      
      <form onSubmit={handleSubmit}>
        <label>
          JSON Input:
          <textarea value={jsonData} onChange={handleChange} />  {/* Input field for JSON */}
        </label>
        <button type="submit">Submit</button>  {/* Submit button */}
      </form>

      {/* Display error message (if any) */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Show filter dropdown and response if valid response received */}
      {response && (
        <>
          <label>
            Filter Response:
            <select multiple={true} onChange={handleOptionChange}>  {/* Multi-select dropdown */}
              <option value="Alphabets">Alphabets</option>
              <option value="Numbers">Numbers</option>
              <option value="Highest lowercase alphabet">Highest lowercase alphabet</option>
            </select>
          </label>
          
          {/* Render the filtered response */}
          {renderFilteredResponse()}
        </>
      )}
    </div>
  );
};

export default App;
