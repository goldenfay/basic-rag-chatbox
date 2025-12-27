import { ChatWidget } from '@/components/ChatWidget';

/**
 * Embeddable Widget Page
 * 
 * This page can be embedded via iframe:
 * <iframe src="YOUR_URL/widget" width="400" height="600"></iframe>
 */
const Widget = () => {
  return (
    <div className="min-h-screen bg-transparent">
      <ChatWidget />
    </div>
  );
};

export default Widget;
