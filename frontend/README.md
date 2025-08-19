# Document Analyzer Frontend

A beautiful, modern React frontend for the Intelligent Document Analyzer application. This frontend provides an intuitive interface for uploading documents, managing document libraries, and asking questions about your documents using AI-powered RAG (Retrieval-Augmented Generation).

## Features

- 🎨 **Beautiful Modern UI** - Clean, responsive design with smooth animations
- 📁 **Drag & Drop Upload** - Easy document upload with drag and drop functionality
- 📚 **Document Library** - Organize and search through uploaded documents
- 💬 **Chat Interface** - Natural conversation interface for asking questions
- 🔍 **Real-time Search** - Search through your document library
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- ⚡ **Fast & Lightweight** - Built with Vite for optimal performance

## Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Axios** - HTTP client for API communication
- **Headless UI** - Accessible UI components

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running on `http://localhost:8000`

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

### 1. Upload Documents
- Drag and drop PDF files onto the upload area
- Or click "browse files" to select files manually
- Only PDF files are supported
- Upload status is shown in real-time

### 2. Select Documents
- View all uploaded documents in the Document Library
- Search through documents using the search bar
- Click on a document to select it for querying
- Selected document is highlighted

### 3. Ask Questions
- Type your question in the chat interface
- Press Enter or click the send button
- View the AI-generated response
- Continue the conversation with follow-up questions

## Project Structure

```
src/
├── components/
│   ├── Header.jsx          # Application header with branding
│   ├── DocumentUpload.jsx  # Document upload component
│   ├── DocumentSelector.jsx # Document library and selection
│   └── QueryInterface.jsx  # Chat interface for questions
├── App.jsx                 # Main application component
├── main.jsx               # Application entry point
├── index.css              # Global styles and Tailwind imports
└── App.css                # Custom component styles
```

## API Integration

The frontend communicates with the backend API at `http://localhost:8000`:

- `POST /process-document` - Upload and process documents
- `POST /query` - Ask questions about documents
- `GET /` - Health check endpoint

## Customization

### Styling
- Modify `tailwind.config.js` for theme customization
- Update `src/App.css` for custom component styles
- Use Tailwind utility classes for rapid styling

### Components
- All components are modular and reusable
- Props are well-documented in component files
- Easy to extend with additional features

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the Intelligent Document Analyzer application.
