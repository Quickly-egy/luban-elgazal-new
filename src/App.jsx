
import { useEffect } from 'react';
import { messageAPI } from './services/endpoints';

function App() {
  
  useEffect(() => {
    const sendInitialMessage = async () => {
      try {
        console.log('Sending initial message...');
        const response = await messageAPI.sendMessage();
        console.log('Message sent successfully:', response);
      } catch (error) {
        console.error('Failed to send initial message:', error);
      }
    };

    sendInitialMessage();
  }, []);

  return (
    <>
      <div>
        <h1>مرحبا بك في التطبيق</h1>
        <p>تم إرسال رسالة البداية</p>
      </div>
    </>
  )
}

export default App
