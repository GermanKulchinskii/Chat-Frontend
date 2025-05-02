import { useEffect, useRef, useState, useCallback } from 'react';
import { Message } from '@/store/Chat/chatTypes';

export interface UseChatWebSocketOptions {
  chatId: string;
  token?: string;
  initialMessages?: Message[];
  wsUrl?: string;
  currentUserId: string;
}

const useChatWebSocket = ({
  chatId,
  token = localStorage.getItem('accessToken') || '',
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
        if (data.type === "confirmation") {
          setMessages((prev) => {
            const index = prev.findIndex(
              (msg) =>
                msg.status === "pending" &&
                `100${msg.senderId}` === currentUserId &&
                msg.content === data.content
            );
            if (index !== -1) {
              const updatedMessage = { ...prev[index], ...data, messageType: "confirmation" };
              const updatedMessages = [...prev];
              updatedMessages[index] = updatedMessage;
              return updatedMessages;
            }
            return prev;
          });
        } else if (data.type === "message") {
          setMessages((prev) => [...prev, { ...data, messageType: "incoming" }]);
        } else if (data.chat_id && data.content) {
          setMessages((prev) => [...prev, { ...data, messageType: "unknown" }]);
        }
      } catch (error) {
        console.error("Ошибка разбора WS-сообщения", error);
      }
    };

    ws.current.onclose = (event: CloseEvent) => {
      if (event.code !== 1000 && event.code !== 1001 && event.code !== 1005) {
        console.error("WebSocket connection closed unexpectedly:", event.code);
      }
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error", error);
    };

    return () => {
      ws.current?.close();
    };
  }, [token, chatId, wsUrl, currentUserId]);

  const sendMessage = useCallback(
    (content: string, senderId: number) => {
      const payload = { content, chat_id: chatId };
      const pendingMessage: Message = {
        id: Date.now(),
        senderId,
        content,
        chat_id: chatId,
        sentAt: new Date().toISOString(),
        status: "pending",
      };
      setMessages((prev) => [...prev, pendingMessage]);

      if (ws.current) {
        if (ws.current.readyState === WebSocket.OPEN) {
          ws.current.send(JSON.stringify(payload));
        } else {
          const onOpenHandler = () => {
            ws.current?.send(JSON.stringify(payload));
            ws.current?.removeEventListener('open', onOpenHandler);
          };
          ws.current.addEventListener('open', onOpenHandler);
        }
      }
    },
    [chatId]
  );

  return { messages, sendMessage };
};

export default useChatWebSocket;
