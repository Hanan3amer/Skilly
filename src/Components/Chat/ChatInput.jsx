import { useState, useRef } from "react";
import PropTypes from "prop-types";
import { PlusIcon } from "lucide-react";

const ChatInput = ({ onSubmit, allowImages = false }) => {
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileType, setFileType] = useState(null);
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim() && !selectedFile) return;
    
    console.log("Sending message:", message, selectedFile);
    onSubmit(message, selectedFile);
    
    // Reset form
    setMessage("");
    setSelectedFile(null);
    setPreviewUrl(null);
    setFileType(null);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size should be less than 10MB');
      return;
    }
    
    setSelectedFile(file);
    
    // Determine file type
    let type = 'other';
    if (file.type.startsWith('image/')) {
      type = 'image';
    } else if (file.type.startsWith('video/')) {
      type = 'video';
    } else if (file.type === 'application/pdf') {
      type = 'pdf';
    } else if (file.type.includes('document') || file.type.includes('sheet') || file.type.includes('presentation')) {
      type = 'document';
    }
    
    setFileType(type);
    
    // Create preview URL for supported file types
    if (type === 'image' || type === 'video') {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setFileType(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const renderFilePreview = () => {
    if (!selectedFile) return null;
    
    if (previewUrl && fileType === 'image') {
      return (
        <img 
          src={previewUrl} 
          alt="Preview" 
          className="h-20 max-w-[200px] object-contain rounded-lg border border-gray-300"
        />
      );
    } else if (previewUrl && fileType === 'video') {
      return (
        <video 
          src={previewUrl}
          className="h-20 max-w-[200px] object-contain rounded-lg border border-gray-300"
          controls
        />
      );
    } else {
      // Generic file preview for other types
      return (
        <div className="flex items-center gap-2 p-2 rounded-lg border border-gray-300 bg-gray-50">
          <div className="text-gray-500">
            {fileType === 'pdf' ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            ) : fileType === 'document' ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a1.875 1.875 0 01-2.652 0l-1.5-1.5a1.875 1.875 0 010-2.652l.932-.931m5.428-5.428a1.875 1.875 0 010-2.652l2.652-2.652a1.875 1.875 0 012.652 0l1.5 1.5a1.875 1.875 0 010 2.652l-2.652 2.652m-5.428 5.428l5.428-5.428" />
              </svg>
            )}
          </div>
          <div className="text-sm truncate max-w-[150px]" dir="ltr">
            {selectedFile.name}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="w-full">
      {selectedFile && (
        <div className="relative mb-2 inline-block">
          {renderFilePreview()}
          <button
            type="button"
            onClick={handleRemoveFile}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      
      <form 
        onSubmit={handleSubmit}
        className="flex w-full gap-2"
      >
        {allowImages && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-sky-500 hover:text-sky-600 transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            <input
              type="file"
              accept="*/*"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
            />
          </button>
        )}
        
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="اكتب رسالتك هنا..."
          className="p-4 w-full text-lg text-right text-black bg-gray-100 rounded-lg min-h-[50px] focus:outline-none focus:ring-1 focus:ring-sky-300 resize-none"
          dir="rtl"
        />
        
        <button
          type="submit"
          className="text-xl font-bold text-white bg-sky-500 rounded-lg cursor-pointer py-2 px-6 hover:bg-sky-600 transition-colors"
          disabled={!message.trim() && !selectedFile}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
        </button>
      </form>
    </div>
  );
};

ChatInput.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  allowImages: PropTypes.bool
};

export default ChatInput;
