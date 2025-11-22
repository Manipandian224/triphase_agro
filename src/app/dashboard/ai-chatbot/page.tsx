"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bot,
  Loader2,
  Paperclip,
  Send,
  Sparkles,
  User,
  Languages,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  askCropExpert,
  type AskCropExpertInput,
  type ChatMessage,
} from "@/ai/flows/ask-crop-expert";

export default function AiChatbotPage() {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState("");
  const [image, setImage] = useState<{ dataUri: string; file: File } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [targetLang, setTargetLang] = useState("en");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the bottom of the chat history when it updates
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);


  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUri = e.target?.result as string;
        setImage({ dataUri, file });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() && !image) return;

    setIsLoading(true);

    const userMessage: ChatMessage = {
      role: "user",
      content: [{ text: userInput }],
    };
    if (image) {
      userMessage.content.push({ media: { url: image.dataUri } });
    }

    setChatHistory((prev) => [...prev, userMessage]);
    
    // Clear input fields after sending
    setUserInput("");
    setImage(null);
    if(fileInputRef.current) fileInputRef.current.value = "";


    try {
      const input: AskCropExpertInput = {
        history: chatHistory,
        question: userInput,
        photoDataUri: image?.dataUri,
        targetLanguage: targetLang,
      };

      const result = await askCropExpert(input);
      
      const aiMessage: ChatMessage = {
        role: "model",
        content: [{ text: result.answer }],
      };

      setChatHistory((prev) => [...prev, aiMessage]);

    } catch (error) {
      console.error("AI chat failed:", error);
      const errorMessage: ChatMessage = {
        role: "model",
        content: [{ text: "Sorry, I encountered an error. Please try again." }],
      };
      setChatHistory((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const ChatBubble = ({ message }: { message: ChatMessage }) => {
    const isUser = message.role === "user";
    const imagePart = message.content.find((p) => p.media)?.media;
    const textPart = message.content.find((p) => p.text)?.text;

    return (
      <div className={cn("flex items-start gap-4", isUser && "justify-end")}>
        {!isUser && (
          <Avatar className="h-8 w-8 border">
            <AvatarFallback>
              <Bot className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
        )}
        <div
          className={cn(
            "max-w-[75%] rounded-2xl p-4",
            isUser
              ? "bg-primary text-primary-foreground rounded-br-lg"
              : "bg-muted rounded-bl-lg"
          )}
        >
          {imagePart && (
            <Image
              src={imagePart.url}
              alt="Uploaded context"
              width={300}
              height={200}
              className="rounded-lg mb-2"
            />
          )}
          {textPart && <p className="whitespace-pre-wrap">{textPart}</p>}
        </div>
        {isUser && (
          <Avatar className="h-8 w-8 border">
            <AvatarFallback>
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    );
  };

  return (
    <Card className="h-[calc(100vh-120px)] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <Sparkles className="h-6 w-6 text-primary" />
          <div>
            <CardTitle>AI Crop Health Assistant</CardTitle>
            <CardDescription>
              Ask questions, upload images, and get expert advice.
            </CardDescription>
          </div>
        </div>
        <div className="flex items-center gap-2">
            <Languages className="h-5 w-5 text-muted-foreground"/>
             <Select value={targetLang} onValueChange={setTargetLang} disabled={isLoading}>
                <SelectTrigger id="language-select" className="w-40">
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="hi">Hindi</SelectItem>
                  <SelectItem value="ja">Japanese</SelectItem>
                  <SelectItem value="pt">Portuguese</SelectItem>
                  <SelectItem value="ta">Tamil</SelectItem>
                  <SelectItem value="te">Telugu</SelectItem>
                  <SelectItem value="bn">Bengali</SelectItem>
                </SelectContent>
              </Select>
        </div>
      </CardHeader>
      <CardContent ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-6">
        {chatHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <Bot className="h-16 w-16 mb-4" />
            <p className="text-lg font-medium">I am your AI Crop Assistant.</p>
            <p>Ask me about diseases, pests, or soil conditions.</p>
          </div>
        ) : (
          chatHistory.map((msg, index) => <ChatBubble key={index} message={msg} />)
        )}
         {isLoading && (
            <div className="flex items-start gap-4">
              <Avatar className="h-8 w-8 border">
                <AvatarFallback>
                  <Bot className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded-2xl p-4 rounded-bl-lg">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            </div>
          )}

      </CardContent>
      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          {image && (
            <div className="relative">
              <Image
                src={image.dataUri}
                alt={image.file.name}
                width={40}
                height={40}
                className="rounded-md object-cover"
              />
               <button
                type="button"
                onClick={() => {
                  setImage(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="absolute -top-2 -right-2 bg-muted rounded-full p-0.5 border"
              >
                <span className="text-xs">✕</span>
              </button>
            </div>
          )}
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading || !!image}
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          <Input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />
          <Input
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Ask about your crop's health..."
            autoComplete="off"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || (!userInput.trim() && !image)}>
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </form>
      </div>
    </Card>
  );
}
