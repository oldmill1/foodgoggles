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
        <div className="w-full bg-gray-200 rounded-full h-4 mb-2 shadow-sm">
          <div className="bg-green-300 h-4 rounded-full shadow-sm" style={{width: '85%'}}></div>
        </div>
        <div className="flex justify-between text-lg text-gray-500 font-inter">
          <span>Goal: <span className="font-bold">85%</span></span>
          <span>100%</span>
        </div>
      </div>
    </div>
  )
}
