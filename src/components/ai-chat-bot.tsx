
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, X, Send, User, Mic, Image as ImageIcon, MessagesSquare } from 'lucide-react';
import { askCropExpert, ChatMessage } from '@/ai/flows/ask-crop-expert';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { translateText } from '@/ai/flows/translate-text';
import { useIsMobile } from '@/hooks/use-mobile';


export function AiChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [language, setLanguage] = useState('en'); 
  const isMobile = useIsMobile();


  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Greet the user when the chat opens
      setMessages([
        {
          role: 'model',
          content: [{ text: 'Hello! I am AgriBot, your AI agriculture assistant. How can I help you today?' }],
        },
      ]);
    }
  }, [isOpen]);

  useEffect(() => {
    // Scroll to bottom when a new message is added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleUserInput = async (text: string, photoDataUri?: string) => {
    if (!text && !photoDataUri) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: [{ text }],
    };
    if (photoDataUri) {
      userMessage.content.push({ media: { url: photoDataUri } });
    }

    setMessages(prev => [...prev, userMessage]);
    setIsThinking(true);

    try {
      const response = await askCropExpert({
        history: messages,
        question: text,
        photoDataUri,
        targetLanguage: language,
      });

      const modelMessage: ChatMessage = {
        role: 'model',
        content: [{ text: response.answer }],
      };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error('Error asking crop expert:', error);
      const errorMessage: ChatMessage = {
        role: 'model',
        content: [{ text: 'Sorry, I encountered an error. Please try again.' }],
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleSend = () => {
    if (input.trim()) {
      handleUserInput(input.trim());
      setInput('');
    }
  };
  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUri = e.target?.result as string;
        handleUserInput(input || "Please analyze this image.", dataUri);
        setInput('');
      };
      reader.readAsDataURL(file);
    }
  };


  if (!isOpen) {
    const buttonClass = isMobile
      ? "absolute -top-16 right-4 h-14 w-14 rounded-full shadow-lg z-50 bg-primary text-primary-foreground"
      : "fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg z-50";

    const Icon = isMobile ? MessagesSquare : Bot;
    
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className={cn(buttonClass, 'hover:bg-primary/90')}
      >
        <Icon className={isMobile ? "h-7 w-7" : "h-8 w-8"} />
      </Button>
    );
  }

  const cardPosition = isMobile 
    ? "fixed inset-0 z-50"
    : "fixed bottom-6 right-6 w-96 h-[600px] z-50";

  return (
    <Card className={cn(
      "flex flex-col shadow-2xl", 
      isMobile ? "rounded-none" : "rounded-2xl",
      cardPosition
      )}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>A</AvatarFallback>
            <AvatarImage src="https://images.unsplash.com/photo-1563233309-c96792900762?w=100&q=80" />
          </Avatar>
          <CardTitle>AgriBot Assistant</CardTitle>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
          <X className="h-5 w-5" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="space-y-4 pr-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  'flex items-start gap-3',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.role === 'model' && (
                    <Avatar className='w-8 h-8'>
                        <AvatarFallback>A</AvatarFallback>
                        <AvatarImage src="https://images.unsplash.com/photo-1563233309-c96792900762?w=100&q=80" />
                    </Avatar>
                )}
                <div
                  className={cn(
                    'max-w-[80%] rounded-2xl p-3 text-sm',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-none'
                      : 'bg-secondary rounded-bl-none'
                  )}
                >
                  {message.content.map((part, partIndex) => (
                    <div key={partIndex}>
                      {part.text}
                      {part.media && <img src={part.media.url} alt="User upload" className="mt-2 rounded-lg" />}
                    </div>
                  ))}
                </div>
                 {message.role === 'user' && (
                     <Avatar className='w-8 h-8'>
                        <AvatarFallback><User/></AvatarFallback>
                    </Avatar>
                )}
              </div>
            ))}
             {isThinking && (
              <div className="flex items-start gap-3 justify-start">
                <Avatar className='w-8 h-8'>
                    <AvatarFallback>A</AvatarFallback>
                    <AvatarImage src="https://images.unsplash.com/photo-1563233309-c96792900762?w=100&q=80" />
                </Avatar>
                <div className="bg-secondary rounded-2xl p-3 text-sm rounded-bl-none">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse delay-0"></span>
                    <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse delay-150"></span>
                    <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse delay-300"></span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className='p-3 border-t'>
         <div className="flex w-full items-center gap-2">
           <Input
            type="text"
            placeholder="Ask a question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1"
          />
           <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
          <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}>
            <ImageIcon className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Mic className="h-5 w-5" />
          </Button>
          <Button size="icon" onClick={handleSend} disabled={isThinking}>
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
