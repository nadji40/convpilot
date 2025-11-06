import React, { useEffect } from 'react';
import { PageLoader } from '../components/PageLoader';

export function Platform() {
  useEffect(() => {
    // Redirect to the static HTML page
    window.location.href = '/platform.html';
  }, []);

  return <PageLoader />;
}

