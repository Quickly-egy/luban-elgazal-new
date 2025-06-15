import React from 'react';
import { useParams } from 'react-router-dom';

const TestDetail = () => {
  const { id } = useParams();
  
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>صفحة تفاصيل المقال - تجريبي</h1>
      <p>رقم المقال: {id}</p>
      <p>هذا مكون تجريبي للتأكد من أن التوجيه يعمل</p>
    </div>
  );
};

export default TestDetail; 