import {Box, Typography} from '@mui/material';
import {useEffect, useState} from 'react';
import AppearingText from './AppearingText';

function RandomPlaceholderText({onClick}: {onClick?: () => void}) {
  const [currentText, setCurrentText] = useState<string>('');
  const [currentPlaceholderElement, setCurrentPlaceholderElement] =
    useState<JSX.Element | null>(null);

  useEffect(() => {
    const randomPlaceholderText = () => {
      const placeholderTexts = [
        'Where does Nick live?',
        'What kinds of services do you offer?',
        'Who is Nick?',
        'What is this website?',
        'What can Nick do for me?',
        'How can Nick help me?',
        'Phone number?',
        "What is Nick's email address?",
        'How can I get in touch with Nick?',
        "What is Nick's LinkedIn profile?",
        'Who is Nick Cunningham?',
        "Show some of Nick's work",
        'Can I look at some testimonials?',
      ];
      const randomIndex = Math.floor(Math.random() * placeholderTexts.length);
      return placeholderTexts[randomIndex];
    };

    const interval = window.setInterval(() => {
      setCurrentText(randomPlaceholderText());
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (currentText) {
      setCurrentPlaceholderElement(null);
    }
  }, [currentText]);

  useEffect(() => {
    if (currentPlaceholderElement === null && currentText) {
      setCurrentPlaceholderElement(
        <AppearingText splitCharacter="" intervalInMs={60}>
          {currentText}
        </AppearingText>
      );
    }
  }, [currentPlaceholderElement, currentText]);

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        color: '#777',
        padding: '16px',
      }}
      onClick={onClick}
    >
      <Box
        sx={{
          overflow: 'hidden',
          whiteSpace: 'nowrap',
        }}
      >
        <Typography>{currentPlaceholderElement}</Typography>
      </Box>
    </Box>
  );
}

export default RandomPlaceholderText;
