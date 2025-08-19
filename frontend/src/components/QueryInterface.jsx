import { useState } from 'react'
import { Send, MessageCircle, Loader2, Bot, User } from 'lucide-react'
import axios from 'axios'

const QueryInterface = ({ selectedDocument, uploadedDocuments }) => {
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversation, setConversation] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!query.trim() || !selectedDocument) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: query,
      timestamp: new Date().toISOString()
    }

    setConversation(prev => [...prev, userMessage])
    setQuery('')
    setIsLoading(true)

    try {
      const response = await axios.post('http://localhost:8000/query', {
        question: query,
        document_name: selectedDocument
      })

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.data.response,
        timestamp: new Date().toISOString()
      }

      setConversation(prev => [...prev, botMessage])
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'error',
        content: error.response?.data?.detail || 'Failed to get response. Please try again.',
        timestamp: new Date().toISOString()
      }

      setConversation(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getMessageIcon = (type) => {
    switch (type) {
      case 'user':
        return <User className="h-5 w-5 text-blue-500" />
      case 'bot':
        return <Bot className="h-5 w-5 text-green-500" />
      case 'error':
        return <Bot className="h-5 w-5 text-red-500" />
      default:
        return <MessageCircle className="h-5 w-5 text-gray-500" />
    }
  }

  const getMessageStyle = (type) => {
    switch (type) {
      case 'user':
        return 'bg-blue-500 text-white ml-auto'
      case 'bot':
        return 'bg-gray-100 text-gray-800'
      case 'error':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (!selectedDocument) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <MessageCircle className="h-5 w-5 mr-2 text-blue-500" />
          Ask Questions
        </h2>
        <div className="text-center py-12">
          <MessageCircle className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg mb-2">No document selected</p>
          <p className="text-sm text-gray-400">
            Please select a document from the library to start asking questions
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 h-full flex flex-col">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <MessageCircle className="h-5 w-5 mr-2 text-blue-500" />
        Ask Questions
      </h2>

      {/* Selected Document Info */}
      <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <span className="font-medium">Document:</span> {selectedDocument}
        </p>
      </div>

      {/* Conversation Area */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 max-h-96">
        {conversation.length === 0 ? (
          <div className="text-center py-8">
            <Bot className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">Start a conversation about your document</p>
            <p className="text-sm text-gray-400 mt-1">
              Ask questions and get intelligent answers
            </p>
          </div>
        ) : (
          conversation.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 ${
                message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div className="flex-shrink-0">
                {getMessageIcon(message.type)}
              </div>
              <div
                className={`px-4 py-2 rounded-lg max-w-xs lg:max-w-md ${
                  getMessageStyle(message.type)
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <Bot className="h-5 w-5 text-green-500" />
            </div>
            <div className="px-4 py-2 rounded-lg bg-gray-100">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                <span className="text-sm text-gray-600">Thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Query Input */}
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask a question about your document..."
          disabled={isLoading}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={!query.trim() || isLoading || !selectedDocument}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>

      {/* Clear Conversation Button */}
      {conversation.length > 0 && (
        <button
          onClick={() => setConversation([])}
          className="mt-3 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          Clear conversation
        </button>
      )}
    </div>
  )
}

export default QueryInterface
