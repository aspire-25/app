import React from 'react';
import { Header } from './Header';

// Placeholder Footer component
const Footer = () => (
  <footer className="w-full bg-gray-100 p-4 text-center">
    <p>Footer Content</p>
  </footer>
);

export function ExamplePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header userName="John Doe" userRole="Analyst" />
      
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Content is here</h1>
        <h2 className="text-xl mb-6">Subtitle</h2>
        
        {/* Page content would go here */}
      </main>
      
      <Footer />
    </div>
  );
}
