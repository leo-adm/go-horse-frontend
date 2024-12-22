import { useState } from "react";

export default function useMessage() {
  const [message, setMessage] = useState("");
  const [messageTimeout, setMessageTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  function showMessage(message: string, duration: number = 5000) {
    if (messageTimeout) {
      clearTimeout(messageTimeout);
    }

    setMessage(message);

    const timeout = setTimeout(() => {
      setMessage("");
      setMessageTimeout(null);
    }, duration);

    setMessageTimeout(timeout);
  }

  return {
    message,
    showMessage,
  };
}
