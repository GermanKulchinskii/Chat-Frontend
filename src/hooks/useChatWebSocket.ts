import { useEffect, useRef, useState, useCallback } from 'react';
import { Message } from '@/store/Chat/chatTypes';

export interface UseChatWebSocketOptions {
  chatId: number;
  token: string;
  initialMessages?: Message[];
  wsUrl?: string;
  currentUserId: number;
}

const useChatWebSocket = ({
  chatId,
  token,
  initialMessages = [],
  currentUserId,
  wsUrl = "ws://localhost:8000/ws",
}: UseChatWebSocketOptions) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!token || !chatId) return;

    const url = `${wsUrl}?token=Bearer%20${token}&chat_id=${chatId}`;
    ws.current = new WebSocket(url);

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("WS received:", data);

        // Если получено подтверждение доставки вашего отправленного сообщения:
        if (data.type === "confirmation") {
          setMessages((prev) => {
            // Ищем сообщение с состоянием "pending", совпадающее по senderId и content.
            const index = prev.findIndex(
              (msg) =>
                msg.status === "pending" &&
                msg.senderId === currentUserId &&
                msg.content === data.content
            );
            if (index !== -1) {
              // Обновляем найденное сообщение новыми данными из сервера.
              const updatedMessage = { ...prev[index], ...data, messageType: "confirmation" };
              const updatedMessages = [...prev];
              updatedMessages[index] = updatedMessage;
              return updatedMessages;
            }
            return prev;
          });
        }
        // Если получено новое входящее сообщение от собеседника:
        else if (data.type === "message") {
          setMessages((prev) => [...prev, { ...data, messageType: "incoming" }]);
        }
        // Обработка fallback, если поле type отсутствует:
        else if (data.chat_id && data.content) {
          setMessages((prev) => [...prev, { ...data, messageType: "unknown" }]);
        }
      } catch (error) {
        console.error("Ошибка разбора WS-сообщения", error);
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
  }, [token, chatId, wsUrl, currentUserId]);

  const sendMessage = useCallback((content: string, senderId: number) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      const pendingMessage: Message = {
        id: Date.now(),
        senderId,
        content,
        chat_id: chatId,
        sentAt: new Date().toISOString(),
        status: "pending",
      };
      setMessages((prev) => [...prev, pendingMessage]);

      const payload = { content, chat_id: chatId };
      console.log("WS: Отправка сообщения", payload);
      ws.current.send(JSON.stringify(payload));
    }
  }, [chatId]);

  return { messages, sendMessage };
};

export default useChatWebSocket;
