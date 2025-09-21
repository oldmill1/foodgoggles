interface FoodInsightsProps {
  userId?: string
}

export default function FoodInsights({ userId }: FoodInsightsProps) {
  if (!userId) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm mt-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 font-inter">Food Insights</h3>
        
        <div className="text-center py-8">
          <div className="text-gray-500 font-inter">Log in to view your insights</div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm mt-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 font-inter">Food Insights</h3>
      
      <div className="text-center py-8">
        <div className="text-lg text-gray-500 font-inter">Food Insights coming soon</div>
      </div>
    </div>
  )
}
