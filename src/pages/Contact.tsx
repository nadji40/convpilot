import React, { useEffect } from 'react';
import { PageLoader } from '../components/PageLoader';

export function Contact() {
  useEffect(() => {
    // Redirect to the static HTML page
    window.location.href = '/contact.html';
  }, []);

  return <PageLoader />;
}

