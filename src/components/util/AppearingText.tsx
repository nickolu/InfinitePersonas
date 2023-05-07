import {useCallback, useEffect, useRef, useState} from 'react';

const AppearingText = ({
  children,
  initialDelayInMs = 0,
  intervalInMs = 40,
  onComplete = () => null,
  splitCharacter = ' ',
  text,
}: {
  children?: string | ((text: string) => JSX.Element);
  initialDelayInMs?: number;
  intervalInMs?: number;
  onComplete?: () => void;
  splitCharacter?: string;
  text?: string;
}) => {
  if (typeof children === 'string') {
    text = children as string;
    children = (text: string) => <>{text}</>;
  }

  if (!text) {
    throw new Error('AppearingText requires a text prop');
  }

  const words = text.split(splitCharacter);
  const [currentText, setCurrentText] = useState<string>('');
  const [hasInitialDelayCompleted, setHasInitialDelayCompleted] =
    useState<boolean>(false);
  const intervalRef = useRef<number | null>(null);
  const initialTimeoutRef = useRef<number | null>(null);

  const setInterval = useCallback(() => {
    intervalRef.current = window.setInterval(() => {
      if (!currentText && words?.length > 0) {
        setCurrentText(words[0]);
        return;
      }
      const currentWords = currentText.split(splitCharacter);
      const currentWordCount = currentWords.length;

      if (currentWordCount === words.length) {
        onComplete();
        window.clearInterval(intervalRef.current as number);
        return;
      }
      setCurrentText(
        `${currentText}${splitCharacter}${words[currentWordCount]}`
      );
    }, intervalInMs);
  }, [currentText, intervalInMs, onComplete, splitCharacter, words]);

  useEffect(() => {
    if (hasInitialDelayCompleted) {
      setInterval();
    }
  }, [hasInitialDelayCompleted, setInterval]);

  useEffect(() => {
    if (!window) return;

    initialTimeoutRef.current = window.setTimeout(() => {
      setHasInitialDelayCompleted(true);
    }, initialDelayInMs);

    return () => {
      window.clearTimeout(initialTimeoutRef.current as number);
      window.clearInterval(intervalRef.current as number);
    };
  }, [
    currentText,
    initialDelayInMs,
    intervalInMs,
    onComplete,
    splitCharacter,
    text,
    words,
  ]);

  return <>{children ? children(currentText) : currentText}</>;
};

export default AppearingText;
