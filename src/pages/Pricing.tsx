import React, { useEffect } from 'react';

export function Pricing() {
  useEffect(() => {
    // Redirect to the static HTML page
    window.location.href = '/pricing.html';
  }, []);

  return <div>Loading...</div>;
}

