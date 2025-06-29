import { useState, useRef, useEffect } from 'react'
import { Send, Paperclip, X, FileText, Image, File, Loader2, Upload } from 'lucide-react'
import { motion } from 'framer-motion'
import AudioRecorder from './AudioRecorder'

export default function InputAreaFixed({ onSend, onFileUpload, onFinancialAnalysis, isProcessing = false, uploadProgress = null }) {
  const [text, setText] = useState('')
  const [files, setFiles] = useState([])
  const [audioData, setAudioData] = useState(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [pendingTranscription, setPendingTranscription] = useState(null)
  const textareaRef = useRef(null)
  const fileInputRef = useRef(null)

  // Auto-resize textarea from 3 to 6 lines
  useEffect(() => {
    if (textareaRef.current) {
      const textarea = textareaRef.current
      textarea.style.height = 'auto'
      const scrollHeight = textarea.scrollHeight
      const lineHeight = 24 // Base line height
      const maxHeight = lineHeight * 6 + 16 // 6 lines + padding
      const minHeight = lineHeight * 3 + 16 // 3 lines + padding
      textarea.style.height = `${Math.min(Math.max(scrollHeight, minHeight), maxHeight)}px`
    }
  }, [text])

  const handleSend = () => {
    if (!text.trim() && files.length === 0 && !audioData) return
    if (isProcessing) return
    
    const finalText = text || (audioData?.transcription ? audioData.transcription : '')
    
    if (audioData) {
      onSend(finalText, files, audioData)
    } else {
      onSend(finalText, files)
    }
    
    setText('')
    setFiles([])
    setAudioData(null)
    setPendingTranscription(null)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const droppedFiles = Array.from(e.dataTransfer.files)
    if (droppedFiles.length > 0) {
      setFiles(prev => [...prev, ...droppedFiles])
      if (onFileUpload && droppedFiles.length > 0) {
        onFileUpload(droppedFiles[0])
      }
    }
  }

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files)
    if (selectedFiles.length > 0) {
      setFiles(prev => [...prev, ...selectedFiles])
      if (onFileUpload && selectedFiles.length > 0) {
        onFileUpload(selectedFiles[0])
      }
    }
    e.target.value = ''
  }

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleTranscriptionComplete = (transcription) => {
    setPendingTranscription(transcription)
  }

  const acceptTranscription = () => {
    setText(pendingTranscription)
    setPendingTranscription(null)
  }

  const rejectTranscription = () => {
    setPendingTranscription(null)
  }

  const isDisabled = isProcessing || uploadProgress !== null

  return (
    <div className="px-4 py-4 bg-white dark:bg-gray-900">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.xls,.jpg,.jpeg,.png,.gif,.zip,.rar"
        onChange={handleFileSelect}
        className="hidden"
      />
      <div 
        className={`w-full transition-all duration-300 ${isDragOver ? 'scale-105' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Drag overlay */}
        {isDragOver && (
          <div className="fixed inset-0 bg-blue-500 bg-opacity-20 z-50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border-2 border-dashed border-blue-500">
              <Upload size={48} className="mx-auto text-blue-500 mb-4" />
              <p className="text-lg font-medium text-gray-900 dark:text-white text-center">
                Solte os arquivos aqui
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-center mt-2">
                PDF, Excel, Imagens, Documentos
              </p>
            </div>
          </div>
        )}

        {/* Transcription preview */}
        {pendingTranscription && (
          <div className="mb-4 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-purple-900 dark:text-purple-100">
                🎤 Transcrição de Áudio
              </h4>
              <button
                onClick={rejectTranscription}
                className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200"
              >
                <X size={16} />
              </button>
            </div>
            <div className="transcription-text">
              "{pendingTranscription}"
            </div>
            <div className="transcription-actions">
              <button
                onClick={rejectTranscription}
                className="transcription-btn reject"
              >
                ✗ Cancelar
              </button>
              <button
                onClick={acceptTranscription}
                className="transcription-btn accept"
              >
                ✓ Usar Texto
              </button>
            </div>
          </div>
        )}

        <div className="relative border border-gray-600 dark:border-gray-400 rounded-3xl bg-white dark:bg-gray-900 shadow-sm min-h-[80px]">
          
          {/* File attachments preview */}
          {files.length > 0 && (
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap gap-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2">
                    {file.type.startsWith('image/') ? (
                      <Image size={16} className="text-blue-500" />
                    ) : file.type === 'application/pdf' ? (
                      <FileText size={16} className="text-red-500" />
                    ) : (
                      <File size={16} className="text-gray-500" />
                    )}
                    <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-32">
                      {file.name}
                    </span>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-gray-500 hover:text-red-500 p-1"
                      disabled={isDisabled}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload progress */}
          {uploadProgress && (
            <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <Loader2 size={16} className="animate-spin text-blue-500" />
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Processando arquivo...</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{uploadProgress.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${uploadProgress.progress}%` }}
                    />
                  </div>
                  {uploadProgress.fileName && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {uploadProgress.fileName}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Container interno sem borda - só conteúdo */}
          <div className="relative flex flex-col rounded-3xl overflow-hidden">
            
            {/* Textarea interna pura - sem ícones sobrepostos */}
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="w-full resize-none border-0 outline-none bg-transparent text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-400 px-2 pt-2 pb-1 text-base leading-6 overflow-y-auto transition-all duration-200"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
                // Enter simples agora quebra linha
              }}
              disabled={isDisabled}
              rows={2}
              style={{ 
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch',
                touchAction: 'pan-y'
              }}
            />

            {/* Área dos ícones - separada da textarea */}
            <div className="flex justify-between items-center px-2 pb-2">
              
              {/* Ícones esquerda */}
              <div className="flex items-center gap-1">
                {/* Ícone de anexar */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors bg-transparent"
                  disabled={isDisabled}
                  title="Anexar arquivo"
                >
                  <Paperclip size={20} />
                </button>

                {/* Botão de análise financeira */}
                {onFinancialAnalysis && (
                  <button
                    onClick={onFinancialAnalysis}
                    className="p-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors bg-transparent"
                    disabled={isDisabled}
                    title="Análise Financeira"
                  >
                    <FileText size={20} />
                  </button>
                )}
              </div>

              {/* Ícones direitos */}
              <div className="flex items-center gap-2">
                
                {/* Audio recorder sem fundo */}
                <div className="bg-transparent">
                  <AudioRecorder
                    onTranscriptionComplete={handleTranscriptionComplete}
                    onAudioReady={setAudioData}
                    disabled={isDisabled}
                  />
                </div>

                {/* Send button */}
                <button
                  onClick={handleSend}
                  disabled={(!text.trim() && files.length === 0 && !audioData) || isDisabled}
                  className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 disabled:text-gray-600 dark:disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center bg-transparent transition-colors"
                  title="Enviar mensagem"
                >
                  {isProcessing ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <Send size={20} />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}