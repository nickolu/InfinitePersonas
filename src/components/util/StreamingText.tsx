import { ReactNode, useEffect, useState } from 'react';

interface StreamingTextProps {
  text: string;
  isComplete?: boolean;
  onComplete?: () => void;
  render?: (text: string) => ReactNode;
}

const StreamingText = ({
  text,
  isComplete = false,
  onComplete,
  render,
}: StreamingTextProps) => {
  const [displayText, setDisplayText] = useState<string>('');
  
  // Update the display text when the content changes
  useEffect(() => {
    setDisplayText(text);
  }, [text]);
  
  // Call onComplete when isComplete is true
  useEffect(() => {
    if (isComplete && onComplete) {
      onComplete();
    }
  }, [isComplete, onComplete]);
  
  // Render the text with the provided render function or just return the text
  if (render) {
    return <>{render(displayText)}</>;
  }
  
  return <>{displayText}</>;
};

export default StreamingText;
