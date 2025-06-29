import { useState, useRef } from 'react'
import { Send, Paperclip, X, FileText, Image, File, Loader2, Check } from 'lucide-react'
import { motion } from 'framer-motion'
import AudioRecorder from './AudioRecorder'

export default function InputArea({ onSend, onFileUpload, isProcessing = false, uploadProgress = null }) {
  const [text, setText] = useState('')
  const [files, setFiles] = useState([])
  const [audioData, setAudioData] = useState(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [pendingTranscription, setPendingTranscription] = useState(null)
  const textareaRef = useRef(null)
  const fileInputRef = useRef(null)

  const handleSend = () => {
    if (!text.trim() && files.length === 0 && !audioData) return
    if (isProcessing) return // Prevent multiple sends during processing
    
    const finalText = text || (audioData?.transcription ? audioData.transcription : '')
    
    // Enviar com dados de áudio se houver
    if (audioData) {
      onSend(finalText, files, audioData)
    } else {
      onSend(finalText, files)
    }
    
    setText('')
    setFiles([])
    setAudioData(null)
    setPendingTranscription(null) // Clear pending transcription
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
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain',
      'text/csv',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'image/jpeg',
      'image/png'
    ]
    
    const validFiles = droppedFiles.filter(file => allowedTypes.includes(file.type))
    if (validFiles.length > 0) {
      setFiles(prev => [...prev, ...validFiles])
    }
  }

  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) {
      return <Image size={16} className="text-green-600" />
    } else if (file.type.includes('pdf') || file.type.includes('document') || file.type.includes('word')) {
      return <FileText size={16} className="text-red-600" />
    } else {
      return <File size={16} className="text-blue-600" />
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleAudioReady = (audio) => {
    // Verificar configuração salva no localStorage
    const savedSettings = localStorage.getItem('financeai-settings')
    const settings = savedSettings ? JSON.parse(savedSettings) : { audio: { transcriptionVerification: true } }
    const verificationEnabled = settings.audio?.transcriptionVerification ?? true
    
    if (verificationEnabled && audio?.transcription) {
      // Modo verificação: mostrar transcrição na caixa de texto para edição
      setPendingTranscription(audio)
      setText(audio.transcription)
    } else {
      // Modo direto: anexar áudio imediatamente
      setAudioData(audio)
    }
  }

  const handleConfirmTranscription = () => {
    // Confirmar transcrição editada e anexar áudio
    if (pendingTranscription) {
      setAudioData({
        ...pendingTranscription,
        transcription: text // Usar o texto editado pelo usuário
      })
      setPendingTranscription(null)
    }
  }

  const handleCancelTranscription = () => {
    // Cancelar transcrição e limpar texto
    setPendingTranscription(null)
    setText('')
  }

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files || [])
    setFiles(prev => [...prev, ...selectedFiles])
  }

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
    // Enter sem Shift = nova linha (comportamento padrão)
  }

  return (
    <div className="max-w-3xl mx-auto input-container-mobile">
      <div className="relative">
        {/* Arquivos anexados */}
        {files.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {files.map((file, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg"
              >
                {getFileIcon(file)}
                <div className="flex flex-col">
                  <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                  <span className="text-xs text-gray-500">{formatFileSize(file.size)}</span>
                </div>
                <button 
                  onClick={() => removeFile(index)}
                  className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                >
                  <X size={14} />
                </button>
              </motion.div>
            ))}
          </div>
        )}

        {/* Upload progress indicator */}
        {uploadProgress !== null && (
          <div className="mb-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Loader2 size={16} className="animate-spin text-blue-600" />
              <span className="text-sm text-blue-700 dark:text-blue-300">Processando arquivos...</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Preview de áudio usando o componente compartilhado */}
        {audioData && (
          <AudioRecorder 
            onAudioReady={handleAudioReady}
            variant="blue"
            className="mb-3"
          />
        )}

        {/* Container do input - sem bordas e ocupando toda área */}
        <div 
          className={`relative h-32 bg-white dark:bg-[#40414F] transition-all ${
            isDragOver ? 'bg-blue-50 dark:bg-blue-900/20' : ''
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          
          {/* Input de arquivo oculto */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.xlsx,.xls,.csv,.jpg,.jpeg,.png,.txt"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          {/* Textarea - ocupa toda a área disponível */}
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Envie uma mensagem..."
            className="input-textarea-fixed w-full h-full bg-transparent border-0 outline-none resize-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 scrollbar-hide mobile-textarea-scroll"
          />

          {/* Botão de anexo - canto inferior esquerdo, sem fundo */}
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-2 left-3 p-1.5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors bg-transparent"
            title="Anexar arquivo"
          >
            <Paperclip size={18} />
          </button>

          {/* Botões de ação - canto inferior direito */}
          <div className="absolute bottom-2 right-3 flex items-center gap-2">
            {/* Sistema de transcrição pendente com botões X e ✓ */}
            {pendingTranscription ? (
              <>
                {/* Botão cancelar transcrição (X) */}
                <motion.button
                  type="button"
                  onClick={handleCancelTranscription}
                  whileTap={{ scale: 0.95 }}
                  className="p-1.5 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                  title="Cancelar transcrição"
                >
                  <X size={18} />
                </motion.button>

                {/* Botão confirmar transcrição (✓) */}
                <motion.button
                  type="button"
                  onClick={handleConfirmTranscription}
                  whileTap={{ scale: 0.95 }}
                  className="p-1.5 text-green-500 hover:text-green-600 dark:text-green-400 dark:hover:text-green-300 transition-colors"
                  title="Confirmar transcrição"
                >
                  <Check size={18} />
                </motion.button>
              </>
            ) : (
              <>
                {/* Componente de áudio normal */}
                <AudioRecorder 
                  onAudioReady={handleAudioReady}
                  variant="blue"
                  size={18}
                />

                {/* Botão de envio - mesma cor dos demais ícones, sem fundo */}
                <motion.button
                  type="button"
                  onClick={handleSend}
                  disabled={isProcessing || (!text.trim() && files.length === 0 && !audioData)}
                  whileTap={{ scale: 0.95 }}
                  className={`p-1.5 transition-colors bg-transparent ${
                    text.trim() || files.length > 0 || audioData
                      ? 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
                      : 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  }`}
                  title="Enviar mensagem"
                >
                  <Send size={18} />
                </motion.button>
              </>
            )}
          </div>

          {/* Drag and Drop Overlay */}
          {isDragOver && (
            <div className="absolute inset-0 bg-blue-500/10 border-2 border-dashed border-blue-500 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <Upload className="mx-auto mb-2 text-blue-600" size={32} />
                <p className="text-blue-600 font-medium">Solte os arquivos aqui</p>
                <p className="text-blue-500 text-sm">PDF, DOC, XLS, CSV, IMG</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}