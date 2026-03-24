const Listings = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Live Donations</h1>
          <p className="text-gray-500 mt-1">Claim surplus food from local restaurants in real-time.</p>
        </div>
        <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
          </span>
          Live Updating
        </div>
      </div>
      
      <div className="bg-white rounded-3xl border border-gray-200 p-16 text-center shadow-sm mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Listings Interface Coming Soon</h2>
        <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
          We've set up the layout. Next, we will build the live feed with countdown timers and claim functionality.
        </p>
      </div>
    </div>
  );
};

export default Listings;
