import React, { useEffect } from 'react';
import { PageLoader } from '../components/PageLoader';

export function Pricing() {
  useEffect(() => {
    // Redirect to the static HTML page
    window.location.href = '/pricing.html';
  }, []);

  return <PageLoader />;
}

