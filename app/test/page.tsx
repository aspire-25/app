'use client';

import React from 'react';

export default function TestPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-4">Test Page</h1>
      <h2 className="text-xl mb-6">Demonstrating Header and Footer</h2>
      
      <div className="p-6 border rounded-lg bg-card">
        <p className="mb-4">
          This is a test page that demonstrates how the Footer component works with the layout.
        </p>
        <p>
          The Footer component is included in the app/layout.tsx file, so it appears on every page of the application.
          It includes the Spire logo, a description of the software&apos;s role, and an About Us link.
        </p>
      </div>
      
      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h3 className="font-medium mb-2">Page Structure Example:</h3>
        <pre className="p-3 bg-background rounded border overflow-x-auto">
          {`
import { Footer } from "@/components/Footer"

<Header />
<>
    <h1>Content is here</h1>
    <h2>Subtitle</h2>
<>
<Footer />
          `}
        </pre>
      </div>
    </div>
  );
}
