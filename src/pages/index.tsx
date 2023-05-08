import Head from 'next/head';
import BasePageTemplate from '@/components/PageTemplates/BasePageTemplate';
import SelectCharacter from '@/components/characters/SelectCharacter';
import {useState} from 'react';
import CharacterChat from '@/components/characters/CharacterChat';
import {Character} from '@/core/Character';
import {Box, Button} from '@mui/material';

function HomePageContent() {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null
  );

  if (selectedCharacter) {
    return (
      <>
        <CharacterChat character={selectedCharacter} />
        <Box mt={2}>
          <Button
            onClick={() => {
              setSelectedCharacter(null);
            }}
          >
            Chat with someone else
          </Button>
        </Box>
      </>
    );
  }
  return (
    <SelectCharacter
      {...{
        selectedCharacter,
        setSelectedCharacter,
      }}
    />
  );
}

export default function Home() {
  return (
    <>
      <Head>
        <title>Infinite Personas - Chat With Anyone You Can Imagine</title>
        <meta name="description" content="Chat with anyone you can imagine" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        s <link rel="icon" href="/favicon.ico" />
      </Head>

      <BasePageTemplate
        onHomeClick={() => {
          window.location.reload();
        }}
      >
        <HomePageContent />
      </BasePageTemplate>
    </>
  );
}
