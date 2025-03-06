import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="w-full border-t bg-background py-6 px-4">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Image 
            src="/spirelogo.png" 
            alt="Spire Logo" 
            width={40} 
            height={40} 
            className="object-contain"
          />
          <span className="text-lg font-semibold">Spire</span>
        </div>
        
        <p className="text-sm text-muted-foreground text-center md:text-left">
          Empowering financial decision-making with advanced analytics and visualization tools.
        </p>
        
        <Link 
          href="/home" 
          className="text-sm font-medium hover:underline"
        >
          About Us
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
