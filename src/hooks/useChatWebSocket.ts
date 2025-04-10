import { useEffect, useRef, useState, useCallback } from 'react';
import { Message } from '@/store/Chat/chatTypes';

export interface UseChatWebSocketOptions {
  chatId: number;
  token: string;
  initialMessages?: Message[];
  wsUrl?: string;
}

const useChatWebSocket = ({
  chatId,
  token,
  initialMessages = [],
  wsUrl = "ws://localhost:8000/ws",
}: UseChatWebSocketOptions) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!token || !chatId) return;
    const url = `${wsUrl}?token=Bearer%20${token}`;
    ws.current = new WebSocket(url);

    ws.current.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // Если сервер возвращает статус (например, "sending" или "delivered")
        if (data.status) {
          if (data.status === "delivered") {
            // При получении подтверждения обновляем все сообщения со статусом "pending"
            setMessages(prev =>
              prev.map(msg => (msg.status === "pending" ? { ...msg, status: "delivered" } : msg))
            );
          }
        }
        // Если получено сообщение с данными (например, от другого пользователя)
        else if (data.chat_id && data.content) {
          setMessages(prev => [...prev, data]);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message", error);
      }
    };

    ws.current.onclose = () => {
      console.log("WebSocket connection closed");
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      ws.current?.close();
    };
  }, [token, chatId, wsUrl]);

  const sendMessage = useCallback((content: string, senderId: number) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      // Создаем локальное сообщение с временным идентификатором и статусом "pending"
      const newMessage: Message = {
        id: Date.now(), // используется временное значение; на сервере может быть своя генерация id
        senderId,
        content,
        chat_id: chatId,
        sentAt: new Date().toISOString(),
        status: "pending",
      };
      setMessages(prev => [...prev, newMessage]);
      // Отправляем полезную нагрузку на сервер
      const payload = { content, chat_id: chatId };
      ws.current.send(JSON.stringify(payload));
    }
  }, [chatId]);

  return { messages, sendMessage };
};

export default useChatWebSocket;
