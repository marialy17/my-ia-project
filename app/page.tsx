"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type ChatMessage = {
  id: string;
  role: "user" | "model";
  content: string;
  createdAt: Date;
};

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  // 🔥 AUTOSCROLL
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: input,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    const aiId = crypto.randomUUID();

    setMessages((prev) => [
      ...prev,
      {
        id: aiId,
        role: "model",
        content: "",
        createdAt: new Date(),
      },
    ]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.content }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("API ERROR:", text);

        setMessages((prev) =>
          prev.map((m) =>
            m.id === aiId
              ? { ...m, content: "❌ Error hablando con Gemini." }
              : m
          )
        );

        setLoading(false);
        return;
      }

      const data = (await res.json()) as { content: string };

      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiId ? { ...m, content: data.content } : m
        )
      );
    } catch (err) {
      console.error(err);

      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiId
            ? { ...m, content: "❌ Error de conexión." }
            : m
        )
      );
    }

    setLoading(false);
  }

  return (
    <main className="flex flex-col h-screen max-w-3xl mx-auto">
      <h1 className="text-xl font-semibold py-4 text-center">
        Gemini Chat
      </h1>

      {/* CHAT */}
      <div
        className={cn(
          "flex-1 space-y-4 px-4 py-6 overflow-y-auto"
        )}
      >
        {messages.length === 0 && (
          <p className="text-muted-foreground text-center">
            Escribe tu primer mensaje ✨
          </p>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className={cn(
              "flex gap-3",
              m.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            {m.role === "model" && (
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs">
                🤖
              </div>
            )}

            <div
              className={cn(
                "max-w-[75%] rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap",
                m.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              )}
            >
              <ReactMarkdown>{m.content}</ReactMarkdown>

              <div className="text-[10px] opacity-60 mt-1 text-right">
                {m.createdAt.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>

            {m.role === "user" && (
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-xs text-primary-foreground">
                👤
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs">
              🤖
            </div>

            <div className="bg-muted rounded-2xl px-4 py-2 text-sm animate-pulse">
              Pensando...
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div className="sticky bottom-0 bg-background border-t p-4">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu mensaje..."
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
          />

          <Button onClick={sendMessage} disabled={loading}>
            Enviar
          </Button>
        </div>
      </div>
    </main>
  );
}
