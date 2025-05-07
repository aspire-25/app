import React from "react";

const SpireHeader = () => (
  <header className="bg-spire-header p-0 flex flex-col items-center sticky top-0 z-50 shadow">
    <div className="w-full flex justify-between items-center max-w-5xl mx-auto py-4">
      <div className="flex items-center gap-4">
        <img src="/spirelogo.png" alt="Spire Logo" className="h-10 w-auto" />
      </div>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-500">JD</div>
        <div className="text-white">
          <div>John Doe</div>
          <div className="text-sm opacity-80">Executive</div>
        </div>
      </div>
    </div>
    <div className="flex justify-center w-full mt-4">
      <div className="flex bg-white rounded-full shadow px-2 py-2 gap-2">
        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow h-9 font-bold rounded-full px-8 py-3 text-lg transition-colors bg-white text-black hover:bg-gray-100">Analyst View</button>
        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow hover:bg-primary/90 h-9 font-bold rounded-full px-8 py-3 text-lg transition-colors bg-[#F04E23] text-white">Executive View</button>
        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow h-9 font-bold rounded-full px-8 py-3 text-lg transition-colors bg-white text-black hover:bg-gray-100">Auditor View</button>
        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow h-9 font-bold rounded-full px-8 py-3 text-lg transition-colors bg-white text-black hover:bg-gray-100">Admin View</button>
      </div>
    </div>
  </header>
);

export default SpireHeader; 