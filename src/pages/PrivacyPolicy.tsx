import React, { useEffect } from 'react';

export function PrivacyPolicy() {
  useEffect(() => {
    // Redirect to the static HTML page
    window.location.href = '/privacy-policy.html';
  }, []);

  return <div>Loading...</div>;
}

