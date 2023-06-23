import React, { useState } from 'react'

const Resume = () => {
  const [optimizedResume, setOptimizedResume] = useState('')

  return (
    <div className='displayArea'>
      <p>Optimized Resume:</p>
      <p dangerouslySetInnerHTML={{__html: optimizedResume}} />
    </div>
  );
};

export default Resume;
