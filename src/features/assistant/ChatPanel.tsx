import React from 'react';
import { motion } from 'framer-motion';
import styles from './ChatPanel.module.css';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: number;
}

interface ChatPanelProps {
  messages: ChatMessage[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ messages, messagesEndRef }) => {
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={styles.chatPanel}>
      {messages.map((message, index) => (
        <motion.div
          key={message.id}
          className={`${styles.messageWrapper} ${
            message.sender === 'user' ? styles.userMessage : styles.assistantMessage
          }`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: index === messages.length - 1 ? 0 : 0 }}
        >
          <div className={styles.message}>
            <div className={styles.messageText}>{message.text}</div>
            <div className={styles.messageTime}>{formatTime(message.timestamp)}</div>
          </div>
        </motion.div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};
