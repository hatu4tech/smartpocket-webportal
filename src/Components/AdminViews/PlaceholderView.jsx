import { AlertCircle } from 'lucide-react';  

const PlaceholderView = ({ title, description }) => (
  <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <AlertCircle className="w-8 h-8 text-green-600" />
    </div>
    <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
    <p className="text-gray-500 max-w-md mx-auto">{description}</p>
  </div>
);

export { PlaceholderView };