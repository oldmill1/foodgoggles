export default function RecentMeals() {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm mt-6">
      <div className="flex items-center mb-6">
        <img src="/assets/fruit.jpg" alt="Fruit" className="w-8 h-8 mr-3" />
        <h3 className="text-xl font-semibold text-gray-800 font-inter">Recent Meals</h3>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <span className="text-2xl">🥗</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 font-inter">Quinoa Salad</h4>
              <p className="text-sm text-gray-500 font-light font-inter">420 kcal</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-gray-800 font-inter">420</div>
            <div className="text-sm text-gray-500 font-inter">22g</div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-3">
              <span className="text-2xl">🍣</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 font-inter">Salmon Bowl</h4>
              <p className="text-sm text-gray-500 font-light font-inter">620 kcal</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-gray-800 font-inter">620</div>
            <div className="text-sm text-gray-500 font-inter">40g</div>
          </div>
        </div>
      </div>
    </div>
  )
}
