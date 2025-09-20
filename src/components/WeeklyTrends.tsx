export default function WeeklyTrends() {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center mb-6">
        <img src="/assets/trends.png" alt="Trends" className="w-8 h-8 mr-3" />
        <h2 className="text-xl font-semibold text-gray-800 font-inter">Weekly Trends</h2>
      </div>
      
      {/* Calories Chart */}
      <div className="mb-6">
        <h3 className="text-base text-gray-600 mb-3 font-inter">Calories</h3>
        <div className="relative h-20 bg-orange-50 rounded-lg p-3">
          <svg className="w-full h-full" viewBox="0 0 200 50">
            <path d="M5,35 Q50,15 100,25 Q150,35 195,20" stroke="#ff6b35" strokeWidth="2" fill="none"/>
          </svg>
        </div>
        <div className="flex justify-between text-sm text-gray-500 mt-2 font-inter">
          <span>Su</span>
          <span>M</span>
          <span>T</span>
          <span>F</span>
          <span>S</span>
        </div>
      </div>

      {/* Protein Chart */}
      <div className="mb-6">
        <h3 className="text-base text-gray-600 mb-3 font-inter">Protein</h3>
        <div className="relative h-20 bg-green-50 rounded-lg p-3">
          <svg className="w-full h-full" viewBox="0 0 200 50">
            <path d="M5,30 Q50,25 100,15 Q150,10 195,5" stroke="#10b981" strokeWidth="2" fill="none"/>
          </svg>
        </div>
        <div className="flex justify-between text-sm text-gray-500 mt-2 font-inter">
          <span>S</span>
          <span>M</span>
          <span>T</span>
          <span>F</span>
          <span>S</span>
        </div>
      </div>
    </div>
  )
}
