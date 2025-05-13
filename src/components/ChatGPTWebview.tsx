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
      
      // Inject custom CSS to hide unwanted elements
      if (webviewRef.current) {
        const customCSS = `
          /* Hide profile picture and user section */
          nav a[role="button"],
          button[aria-label*="user"],
          .rounded-full.overflow-hidden,
          .h-8.w-8.rounded-full,
          [data-testid="user-menu"],
          nav .flex-shrink-0 {
            display: none !important;
          }
          
          /* Hide specific elements requested by user */
          #conversation-header-actions > button.btn.relative.btn-secondary.text-token-text-primary,
          #radix-\\:raf\\: > svg,
          #thread-bottom-container > div.text-token-text-secondary.relative.mt-auto.flex.min-h-8.w-full.items-center.justify-center.p-2.text-center.text-xs.md\\:px-\\[60px\\] > div,
          #thread > div > div.flex.basis-auto.flex-col.shrink.min-\\[510px\\]\\:max-\\[768px\\]\\:mt-\\[25dvh\\]\\!.\\@max-\\[31\\.9rem\\]\\/thread\\:grow.\\@max-\\[31\\.9rem\\]\\/thread\\:justify-center.\\@lg\\/thread\\:mt-\\[calc\\(30dvh\\+25px\\)\\] > div > div.mb-7.hidden.text-center.\\@lg\\/thread\\:block.\\@lg\\/thread\\:block > div > div > div > h1 > div {
            display: none !important;
          }
          
          /* Generic selectors for hiding common UI elements */
          [id^="radix-"] > svg,
          #conversation-header-actions button,
          #thread-bottom-container div.text-token-text-secondary,
          .flex.basis-auto.flex-col div.mb-7 h1 div,
          .text-token-text-secondary.relative.mt-auto,
          [id$="-header-actions"] button {
            display: none !important;
          }
        `;
        
        webviewRef.current.insertCSS(customCSS).catch((err: Error) => {
          console.error('Error injecting CSS:', err);
        });
      }
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