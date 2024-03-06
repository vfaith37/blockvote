import React, { useState } from 'react'

const PreviewImage = ({file, classnames}) => {
    const [preview, setPreview] = useState(null);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        setPreview(reader.result);
    }
  return (
    <img src={preview} alt="preview" className={classnames} />
  )
}

export default PreviewImage;