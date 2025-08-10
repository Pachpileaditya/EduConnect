import React from 'react'

const Queries = () => {
  const handleAskQuery = () => {
    alert('Ask Query button clicked! (Implement query form/modal here)');
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Existing content can go here */}
      <button
        onClick={handleAskQuery}
        style={{
          position: 'fixed',
          bottom: '32px',
          right: '32px',
          padding: '16px 24px',
          backgroundColor: '#1976d2',
          color: 'white',
          border: 'none',
          borderRadius: '50px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          fontSize: '18px',
          cursor: 'pointer',
          zIndex: 1000,
        }}
      >
        Ask Query
      </button>
    </div>
  );
}

export default Queries