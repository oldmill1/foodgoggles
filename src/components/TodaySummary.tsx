export default function TodaySummary() {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 font-inter">Today's Summary</h2>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-lg font-light text-gray-700 font-inter">Meals Logged</span>
          <span className="text-2xl font-bold text-gray-600 font-inter">3</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-lg font-light text-gray-700 font-inter">Protein</span>
          <span className="text-2xl font-bold text-gray-600 font-inter">112g</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-lg font-light text-gray-700 font-inter">Carbohydrates</span>
          <span className="text-2xl font-bold text-gray-600 font-inter">180g</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-lg font-light text-gray-700 font-inter">Fats</span>
          <span className="text-2xl font-bold text-gray-600 font-inter">60g</span>
        </div>
      </div>
    </div>
  )
}
