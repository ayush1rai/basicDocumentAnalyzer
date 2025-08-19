import { useState, useRef } from 'react'
import { Upload, FileText, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import axios from 'axios'

const DocumentUpload = ({ onDocumentUpload, onDocumentProcess, isProcessing }) => {
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [uploadStatus, setUploadStatus] = useState({})
  const fileInputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = async (files) => {
    const fileArray = Array.from(files)
    
    for (const file of fileArray) {
      if (file.type === 'application/pdf') {
        await uploadFile(file)
      } else {
        setUploadStatus(prev => ({
          ...prev,
          [file.name]: { status: 'error', message: 'Only PDF files are supported' }
        }))
      }
    }
  }

  const uploadFile = async (file) => {
    setUploadStatus(prev => ({
      ...prev,
      [file.name]: { status: 'uploading', message: 'Uploading...' }
    }))

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await axios.post('http://localhost:8000/process-document', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      setUploadStatus(prev => ({
        ...prev,
        [file.name]: { status: 'success', message: 'Document processed successfully!' }
      }))

      onDocumentUpload({
        name: file.name,
        status: 'processed',
        timestamp: new Date().toISOString()
      })

    } catch (error) {
      setUploadStatus(prev => ({
        ...prev,
        [file.name]: { 
          status: 'error', 
          message: error.response?.data?.detail || 'Upload failed' 
        }
      }))
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'uploading':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <Upload className="h-5 w-5 mr-2 text-blue-500" />
        Upload Documents
      </h2>

      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600 mb-2">
          Drag and drop your PDF files here, or{' '}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-blue-500 hover:text-blue-600 font-medium"
          >
            browse files
          </button>
        </p>
        <p className="text-sm text-gray-500">
          Only PDF files are supported
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Upload Status */}
      {Object.keys(uploadStatus).length > 0 && (
        <div className="mt-6 space-y-3">
          <h3 className="text-sm font-medium text-gray-700">Upload Status</h3>
          {Object.entries(uploadStatus).map(([fileName, status]) => (
            <div key={fileName} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700 truncate">
                  {fileName}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(status.status)}
                <span className={`text-xs ${
                  status.status === 'success' ? 'text-green-600' :
                  status.status === 'error' ? 'text-red-600' :
                  'text-blue-600'
                }`}>
                  {status.message}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DocumentUpload
