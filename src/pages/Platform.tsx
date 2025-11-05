import React, { useEffect } from 'react';

export function Platform() {
  useEffect(() => {
    // Redirect to the static HTML page
    window.location.href = '/platform.html';
  }, []);

  return <div>Loading...</div>;
}

