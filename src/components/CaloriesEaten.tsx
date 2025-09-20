export default function CaloriesEaten() {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center mb-6">
        <img src="/assets/flame.jpg" alt="Flame" className="w-8 h-8 mr-3" />
        <h2 className="text-xl font-semibold text-gray-800 font-inter">Calories Eaten</h2>
      </div>
      
      <div className="text-left mb-6">
        <div className="text-4xl font-bold text-gray-800 mb-2 font-inter">2,150 <span className="text-lg text-gray-500 font-light font-inter">kcal</span></div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-5 mb-2 shadow-inner relative">
          <div 
            className="h-5 rounded-full relative overflow-hidden transition-all duration-1000 ease-out" 
            style={{
              width: '85%',
              background: 'linear-gradient(to bottom, #86efac, #6ee7b7)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -1px 0 rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.1)',
              animation: 'growProgress 1.2s ease-out forwards'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/10 to-transparent"></div>
            <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-white/40 to-transparent rounded-l-full"></div>
          </div>
        </div>
        <div className="flex justify-between text-lg text-gray-500 font-inter">
          <span>Goal: <span className="font-bold">85%</span></span>
          <span>100%</span>
        </div>
      </div>
    </div>
  )
}
