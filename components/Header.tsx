'use client';

export function Header() {
  return (
    <header className="border-b border-purple-500/30 bg-black/20 backdrop-blur-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="text-2xl">🔬</div>
            <div>
              <h1 className="text-xl font-bold text-cyan-400">BÆKON FL Research</h1>
              <p className="text-sm text-gray-400">Structured Forgotten Languages Analysis Environment</p>
            </div>
          </div>

          {/* Status Indicators */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-400">Backend Online</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
              <span className="text-sm text-gray-400">AI Guide Active</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
