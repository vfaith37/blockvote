import React, { useState } from 'react';
import Papa from 'papaparse';
import axios from 'axios'; // Import Axios

export default function Election() {
  const [jsonData, setJsonData] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    
    Papa.parse(file, {
      complete: (result) => {
        const csvData = result.data;
        if (csvData && csvData.length > 1) {
          const headers = csvData[0];
          const data = csvData.slice(1);
          const jsonData = data.map((row) => {
            return headers.reduce((obj, header, index) => {
              obj[header] = row[index];
              return obj;
            }, {});
          });
          setJsonData(jsonData);

          // Post JSON data using Axios
          try {
            axios.post('https://blockvote-ql92.onrender.com/api/candidate/populateCandidate', jsonData)
              .then(response => {
                console.log('Post successful:', response.data);
                // You can add more logic here if needed
              })
              .catch(error => {
                console.error('Post error:', error);
              });
          } catch (error) {
            console.error('Axios error:', error);
          }
        }
      }
    });
  };

  return (
    <div className='text-white'>
      <h1>CSV to JSON Converter</h1>
      <input className="" type="file" accept=".csv" onChange={handleFileUpload} />
      {jsonData && (
        <div>
          <h2>JSON Data:</h2>
          <pre>{JSON.stringify(jsonData, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
