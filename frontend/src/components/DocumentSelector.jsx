import { useState } from 'react'
import { FileText, CheckCircle, Clock, Trash2 } from 'lucide-react'

const DocumentSelector = ({ documents, selectedDocument, onDocumentSelect }) => {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'processed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'processing':
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'processed':
        return 'Ready for queries'
      case 'processing':
        return 'Processing...'
      default:
        return 'Unknown status'
    }
  }

  if (documents.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <FileText className="h-5 w-5 mr-2 text-blue-500" />
          Document Library
        </h2>
        <div className="text-center py-8">
          <FileText className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No documents uploaded yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Upload a document to get started
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <FileText className="h-5 w-5 mr-2 text-blue-500" />
        Document Library
      </h2>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search documents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Document List */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {filteredDocuments.map((doc) => (
          <div
            key={doc.name}
            className={`p-4 rounded-lg border cursor-pointer transition-all ${
              selectedDocument === doc.name
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => onDocumentSelect(doc.name)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <FileText className="h-5 w-5 text-gray-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {doc.name}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    {getStatusIcon(doc.status)}
                    <span className="text-xs text-gray-500">
                      {getStatusText(doc.status)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-400">
                  {formatDate(doc.timestamp)}
                </span>
                {selectedDocument === doc.name && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDocuments.length === 0 && documents.length > 0 && (
        <div className="text-center py-4">
          <p className="text-gray-500">No documents match your search</p>
        </div>
      )}

      {/* Selected Document Info */}
      {selectedDocument && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium text-blue-800">
              Selected: {selectedDocument}
            </span>
          </div>
          <p className="text-xs text-blue-600 mt-1">
            You can now ask questions about this document
          </p>
        </div>
      )}
    </div>
  )
}

export default DocumentSelector
