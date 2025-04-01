import React, { useState } from 'react'

interface Message {
  id: number
  text: string
  isUser: boolean
}

export default function SimpleChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isListening, setIsListening] = useState(false)

  const handleSend = () => {
    if (inputValue.trim()) {
      const newMessage: Message = {
        id: Date.now(),
        text: inputValue,
        isUser: true
      }
      setMessages([...messages, newMessage])
      setInputValue('')

      // Simulate AI response
      setTimeout(() => {
        const aiResponse: Message = {
          id: Date.now(),
          text: `You said: "${inputValue}". Here are some product recommendations...`,
          isUser: false
        }
        setMessages(prev => [...prev, aiResponse])
      }, 1000)
    }
  }

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Your browser does not support speech recognition. Please use Chrome or Edge.')
      return
    }

    const recognition = new (window as any).webkitSpeechRecognition()
    recognition.lang = 'en-US'
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setInputValue(transcript)
      setIsListening(false)
    }

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
  }

  return (
    <div style={{ 
      maxWidth: '600px', 
      margin: '0 auto', 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif' 
    }}>
      <h1 style={{ 
        textAlign: 'center', 
        fontSize: '24px', 
        marginBottom: '20px' 
      }}>
        Simple Chat Interface
      </h1>

      <div style={{ 
        height: '400px', 
        border: '1px solid #ccc', 
        borderRadius: '8px', 
        padding: '10px', 
        overflowY: 'auto', 
        marginBottom: '10px', 
        backgroundColor: '#f9f9f9' 
      }}>
        {messages.map(message => (
          <div
            key={message.id}
            style={{ 
              display: 'flex', 
              justifyContent: message.isUser ? 'flex-end' : 'flex-start', 
              marginBottom: '10px' 
            }}
          >
            <div
              style={{
                maxWidth: '70%',
                padding: '10px',
                borderRadius: '8px',
                backgroundColor: message.isUser ? '#007bff' : '#e9ecef',
                color: message.isUser ? '#fff' : '#000'
              }}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            fontSize: '16px'
          }}
        />
        <button
          onClick={handleVoiceInput}
          style={{
            padding: '10px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: isListening ? '#dc3545' : '#007bff',
            color: '#fff',
            fontSize: '16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          🎤
        </button>
        <button
          onClick={handleSend}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#007bff',
            color: '#fff',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Send
        </button>
      </div>
    </div>
  )
}