import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';

interface Message {
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface ProcessData {
  processes: any[];
  cpu: number;
  memory: {
    total: number;
    used: number;
    free: number;
  };
}

const ProcessChatbot: React.FC<{ systemData: ProcessData }> = ({ systemData }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'bot',
      content: 'Hello! I can help you analyze system processes and performance. What would you like to know?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const analyzeProcesses = (query: string): string => {
    const query_lower = query.toLowerCase();
    
    if (query_lower.includes('cpu')) {
      return `Current CPU usage is ${systemData.cpu.toFixed(1)}%. ${
        systemData.cpu > 80 ? 'The system is under heavy load!' : 
        systemData.cpu > 50 ? 'The system is under moderate load.' :
        'The system is running smoothly.'
      }`;
    }
    
    if (query_lower.includes('memory') || query_lower.includes('ram')) {
      const usedPercentage = (systemData.memory.used / systemData.memory.total * 100).toFixed(1);
      const freeGB = (systemData.memory.free / 1024 / 1024 / 1024).toFixed(2);
      return `Memory usage is at ${usedPercentage}%. You have ${freeGB}GB of free memory available.`;
    }
    
    if (query_lower.includes('process') && query_lower.includes('most')) {
      const sortedProcesses = [...systemData.processes].sort((a, b) => b.cpu - a.cpu).slice(0, 3);
      return `Top 3 CPU-intensive processes:\n${
        sortedProcesses.map(p => `- ${p.name}: ${p.cpu.toFixed(1)}% CPU`).join('\n')
      }`;
    }

    if (query_lower.includes('help') || query_lower.includes('what')) {
      return `I can help you with:
- CPU usage analysis
- Memory usage details
- Most resource-intensive processes
- System performance insights
Just ask me what you'd like to know!`;
    }

    return "I'm not sure about that. You can ask me about CPU usage, memory usage, or running processes.";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    const botMessage: Message = {
      type: 'bot',
      content: analyzeProcesses(input),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage, botMessage]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-[500px] bg-navy-800 rounded-lg shadow-lg overflow-hidden">
      <div className="bg-navy-900 p-4 border-b border-navy-700">
        <h2 className="text-xl font-semibold text-blue-accent-500 flex items-center gap-2">
          <Bot size={24} />
          Process Analysis Assistant
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-slide-in`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div
              className={`flex items-start space-x-2 max-w-[80%] ${
                message.type === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'
              }`}
            >
              <div className={`p-2 rounded-full ${
                message.type === 'user' ? 'bg-blue-accent-500' : 'bg-navy-700'
              }`}>
                {message.type === 'user' ? (
                  <User size={16} className="text-navy-900" />
                ) : (
                  <Bot size={16} className="text-blue-accent-500" />
                )}
              </div>
              <div
                className={`p-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-blue-accent-500 text-navy-900'
                    : 'bg-navy-700 text-slate-300'
                }`}
              >
                <p className="whitespace-pre-line">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-navy-700 bg-navy-900">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about system processes..."
            className="flex-1 bg-navy-800 text-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-accent-500 border border-navy-700"
          />
          <button
            type="submit"
            className="bg-blue-accent-500 text-navy-900 p-2 rounded-lg hover:bg-blue-accent-400 transition-colors duration-200"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProcessChatbot;