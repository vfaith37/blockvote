import React, { useState } from 'react'
// import { parse } from 'csv-parse';
import Papa from 'papaparse';

export default function Election() {
  const [csvData, setCsvData] = useState(null);
  const [jsonData, setJsonData] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    
    Papa.parse(file, {
      complete: (result) => {
        setCsvData(result.data);
      }
    });
  };

  const convertToJSON = () => {
    if (csvData) {
      const headers = csvData[0];
      const data = csvData.slice(1);
      const jsonData = data.map((row) => {
        return headers.reduce((obj, header, index) => {
          obj[header] = row[index];
          return obj;
        }, {});
      });
      setJsonData(jsonData);
    }
  };

  return (
    <div className='text-white'>Election
     <h1>CSV to JSON Converter</h1>
      <input className="" type="file" accept=".csv" onChange={handleFileUpload} />
      <button onClick={convertToJSON}>Convert to JSON</button>
      {jsonData && (
        <div>
          <h2>JSON Data:</h2>
          <pre>{JSON.stringify(jsonData, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
