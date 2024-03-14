import React, { useState } from 'react';

const ImageToBase64Converter = () => {
  const [base64Image, setBase64Image] = useState('');

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setBase64Image(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };
console.log(2, base64Image);
  return (
    <div>
      <input type="file" onChange={handleFileInputChange} />
      {base64Image && <img src={base64Image} alt="Converted to Base64" />}
    </div>
  );
};

export default ImageToBase64Converter;
