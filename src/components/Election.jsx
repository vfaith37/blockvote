import React, { useState } from 'react';
import Papa from 'papaparse';
import client from '../api/client';

export default function Election() {
  const [jsonData, setJsonData] = useState(null);
  const [status, setStatus] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const electionId = localStorage.getItem('electionId');

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

          if (!electionId) {
            setStatus('No election selected. Create an election first.');
            return;
          }

          setStatus('Uploading candidates...');
          client
            .post(`candidate/uploadCandidates/${electionId}`, jsonData)
            .then((response) => {
              setStatus(response.data.message || 'Candidates uploaded.');
            })
            .catch((error) => {
              setStatus(
                (error.response &&
                  error.response.data &&
                  error.response.data.message) ||
                  'Upload failed.'
              );
            });
        }
      }
    });
  };

  return (
    <div className='text-white'>
      <h1>Bulk candidate upload (CSV)</h1>
      <input className="" type="file" accept=".csv" onChange={handleFileUpload} />
      {status && <p className='mt-4 text-sm text-neutral-400'>{status}</p>}
      {jsonData && (
        <div>
          <h2>JSON Data:</h2>
          <pre>{JSON.stringify(jsonData, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
