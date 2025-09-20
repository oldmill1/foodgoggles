export default function FoodInsights() {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm mt-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 font-inter">Food Insights</h3>
      
      <div className="space-y-4">
        <div className="flex items-start">
          <span className="text-2xl mr-3">🍗</span>
          <div>
            <p className="font-medium text-gray-800 font-inter">Top protein source:</p>
            <p className="font-medium text-gray-800 font-inter">Chicken (35%)</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <span className="text-2xl mr-3">🥗</span>
          <div>
            <p className="font-medium text-gray-800 font-inter">Most common meal:</p>
            <p className="font-medium text-gray-800 font-inter">Lunch bowls</p>
          </div>
        </div>
      </div>
    </div>
  )
}
