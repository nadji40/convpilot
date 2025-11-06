import React, { useEffect } from 'react';
import { PageLoader } from '../components/PageLoader';

export function TermsAndConditions() {
  useEffect(() => {
    // Redirect to the static HTML page
    window.location.href = '/terms-and-conditions.html';
  }, []);

  return <PageLoader />;
}

