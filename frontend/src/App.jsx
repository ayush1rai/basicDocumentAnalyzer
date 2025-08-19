import { useState } from 'react'
import DocumentUpload from './components/DocumentUpload'
import DocumentSelector from './components/DocumentSelector'
import QueryInterface from './components/QueryInterface'
import Header from './components/Header'
import './App.css'

function App() {
  const [uploadedDocuments, setUploadedDocuments] = useState([])
  const [selectedDocument, setSelectedDocument] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleDocumentUpload = (newDocument) => {
    setUploadedDocuments(prev => [...prev, newDocument])
  }

  const handleDocumentProcess = async (documentName) => {
    setIsProcessing(true)
    // This will be handled by the DocumentUpload component
    setIsProcessing(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Document Management */}
          <div className="space-y-6">
            <DocumentUpload 
              onDocumentUpload={handleDocumentUpload}
              onDocumentProcess={handleDocumentProcess}
              isProcessing={isProcessing}
            />
            
            <DocumentSelector 
              documents={uploadedDocuments}
              selectedDocument={selectedDocument}
              onDocumentSelect={setSelectedDocument}
            />
          </div>

          {/* Right Column - Query Interface */}
          <div className="space-y-6">
            <QueryInterface 
              selectedDocument={selectedDocument}
              uploadedDocuments={uploadedDocuments}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
