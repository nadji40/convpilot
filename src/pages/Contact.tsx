import React, { useEffect } from 'react';

export function Contact() {
  useEffect(() => {
    // Redirect to the static HTML page
    window.location.href = '/contact.html';
  }, []);

  return <div>Loading...</div>;
}

