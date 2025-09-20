export default function MiddleRecentMeals() {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm mt-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 font-inter">Recent Meals</h3>
      
      <div className="space-y-4">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
            <span className="text-lg">🥗</span>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-800 font-inter">Quinoa Salad</h4>
            <p className="text-sm text-gray-500 font-inter">420 g • 22 prot</p>
          </div>
        </div>

        <div className="flex items-center">
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
            <span className="text-lg">🍔</span>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-800 font-inter">Burger & Fries</h4>
            <p className="text-sm text-gray-500 font-inter">800 g • 35 prot</p>
          </div>
        </div>

        <div className="flex items-center">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
            <span className="text-lg">🍣</span>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-800 font-inter">Salmon Bowl</h4>
            <p className="text-sm text-gray-500 font-inter">620 g • 40 prot</p>
          </div>
        </div>
      </div>
    </div>
  )
}
