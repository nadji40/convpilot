import React, { useEffect } from 'react';
import { PageLoader } from '../components/PageLoader';

export function PrivacyPolicy() {
  useEffect(() => {
    // Redirect to the static HTML page
    window.location.href = '/privacy-policy.html';
  }, []);

  return <PageLoader />;
}

