import React, { useEffect } from 'react';

export function TermsAndConditions() {
  useEffect(() => {
    // Redirect to the static HTML page
    window.location.href = '/terms-and-conditions.html';
  }, []);

  return <div>Loading...</div>;
}

