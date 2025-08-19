import { Brain, FileText } from 'lucide-react'

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div className="p-2 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Intelligent Document Analyzer
            </h1>
            <p className="text-gray-600 mt-1">
              Upload documents, ask questions, get intelligent answers
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
