import React, { useEffect, useRef } from 'react';

interface ChatGPTWebviewProps {
  className?: string;
}

const ChatGPTWebview: React.FC<ChatGPTWebviewProps> = ({ className = '' }) => {
  // Use any type for now, as Electron's webview doesn't have proper TypeScript definitions in this context
  const webviewRef = useRef<any>(null);

  useEffect(() => {
    const handleDidFinishLoad = () => {
      console.log('ChatGPT webview loaded');
    };

    const handleDomReady = () => {
      console.log('ChatGPT webview DOM ready');
    };

    const webview = webviewRef.current;
    if (webview) {
      webview.addEventListener('did-finish-load', handleDidFinishLoad);
      webview.addEventListener('dom-ready', handleDomReady);
      
      return () => {
        webview.removeEventListener('did-finish-load', handleDidFinishLoad);
        webview.removeEventListener('dom-ready', handleDomReady);
      };
    }
  }, []);

  return (
    <div className={`w-full h-full ${className}`}>
      {/* 
        The webview tag is an Electron-specific element that's not fully 
        typed in React's type definitions. TypeScript might show errors,
        but it will work at runtime.
      */}
      <webview
        ref={webviewRef}
        src="https://chatgpt.com/"
        style={{ width: '100%', height: '100%', border: 'none' }}
        allowpopups
      ></webview>
    </div>
  );
};

export default ChatGPTWebview; 