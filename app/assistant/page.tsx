'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Send, 
  Bot, 
  User, 
  MapPin, 
  Utensils, 
  Calendar, 
  Star,
  Loader2,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'

const suggestedQuestions = [
  { icon: MapPin, text: 'What are the must-see attractions in Richmond?' },
  { icon: Utensils, text: 'Where can I eat in Richmond?' },
  { icon: Star, text: 'Tell me about Kronosaurus Korner' },
  { icon: Calendar, text: 'What events are happening in Richmond?' },
]

export default function AssistantPage() {
  const { messages, input, handleInputChange, handleSubmit, status, setInput } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  })

  const isLoading = status === 'streaming' || status === 'submitted'

  const handleSuggestedQuestion = (question: string) => {
    setInput(question)
  }

  // Helper to extract text from message parts
  const getMessageText = (message: typeof messages[0]): string => {
    if (!message.parts || !Array.isArray(message.parts)) return ''
    return message.parts
      .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
      .map((p) => p.text)
      .join('')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-terracotta/10 mb-4">
              <Sparkles className="h-8 w-8 text-terracotta" />
            </div>
            <h1 className="text-3xl font-bold">AI Travel Assistant</h1>
            <p className="mt-2 text-muted-foreground max-w-lg mx-auto">
              Ask me anything about Richmond, Queensland - attractions, dining, events, and travel tips!
            </p>
          </div>

          {/* Chat Container */}
          <Card className="min-h-[500px] flex flex-col">
            <CardHeader className="border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bot className="h-5 w-5 text-terracotta" />
                Richmond Travel Guide
              </CardTitle>
              <CardDescription>
                Powered by AI - Your personal guide to the outback
              </CardDescription>
            </CardHeader>
            
            <CardContent className="flex-1 p-0 flex flex-col">
              <ScrollArea className="flex-1 p-4">
                {messages.length === 0 ? (
                  <div className="space-y-6">
                    {/* Welcome Message */}
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-terracotta/10 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-terracotta" />
                      </div>
                      <div className="flex-1 bg-muted rounded-lg p-4">
                        <p className="text-sm">
                          {"G'day! I'm your AI travel assistant for Richmond, Queensland. I can help you with:"}
                        </p>
                        <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                          <li>{"- Local attractions like Kronosaurus Korner and Lake Fred Tritton"}</li>
                          <li>{"- Dining options at Midway Restaurant and Mudhut Pub"}</li>
                          <li>{"- Upcoming events like Field Days and Starry Nights"}</li>
                          <li>{"- Travel tips and accommodation advice"}</li>
                        </ul>
                        <p className="mt-2 text-sm">What would you like to know?</p>
                      </div>
                    </div>

                    {/* Suggested Questions */}
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider px-11">
                        Suggested Questions
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 px-11">
                        {suggestedQuestions.map((q, i) => (
                          <button
                            key={i}
                            onClick={() => handleSuggestedQuestion(q.text)}
                            className="flex items-center gap-2 p-3 rounded-lg border border-border bg-background hover:bg-muted text-left text-sm transition-colors"
                          >
                            <q.icon className="h-4 w-4 text-terracotta flex-shrink-0" />
                            <span className="line-clamp-1">{q.text}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div key={message.id} className="flex gap-3">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          message.role === 'assistant' 
                            ? 'bg-terracotta/10' 
                            : 'bg-sage/10'
                        }`}>
                          {message.role === 'assistant' ? (
                            <Bot className="h-4 w-4 text-terracotta" />
                          ) : (
                            <User className="h-4 w-4 text-sage" />
                          )}
                        </div>
                        <div className={`flex-1 rounded-lg p-4 ${
                          message.role === 'assistant' 
                            ? 'bg-muted' 
                            : 'bg-terracotta/5 border border-terracotta/10'
                        }`}>
                          <p className="text-sm whitespace-pre-wrap">{getMessageText(message)}</p>
                        </div>
                      </div>
                    ))}
                    
                    {isLoading && (
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-terracotta/10 flex items-center justify-center">
                          <Bot className="h-4 w-4 text-terracotta" />
                        </div>
                        <div className="flex-1 bg-muted rounded-lg p-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Thinking...
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </ScrollArea>

              {/* Input */}
              <div className="border-t p-4">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <Input
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Ask about Richmond..."
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button 
                    type="submit" 
                    disabled={isLoading || !input.trim()}
                    className="bg-terracotta hover:bg-terracotta/90"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link href="/order" className="block">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2 bg-terracotta/10 rounded-lg">
                    <Utensils className="h-5 w-5 text-terracotta" />
                  </div>
                  <div>
                    <p className="font-medium">Pre-Order Food</p>
                    <p className="text-xs text-muted-foreground">Skip the wait</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link href="/attractions" className="block">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2 bg-sage/10 rounded-lg">
                    <MapPin className="h-5 w-5 text-sage" />
                  </div>
                  <div>
                    <p className="font-medium">Explore Attractions</p>
                    <p className="text-xs text-muted-foreground">Plan your visits</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link href="/events" className="block">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2 bg-ochre/10 rounded-lg">
                    <Calendar className="h-5 w-5 text-ochre" />
                  </div>
                  <div>
                    <p className="font-medium">Local Events</p>
                    <p className="text-xs text-muted-foreground">{"See what's on"}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
