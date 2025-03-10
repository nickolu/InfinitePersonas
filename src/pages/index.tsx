import Head from 'next/head';
import BasePageTemplate from '@/components/PageTemplates/BasePageTemplate';
import SelectCharacter from '@/components/characters/SelectCharacter';
import {useState} from 'react';
import CharacterChat from '@/components/characters/CharacterChat';
import Character from '@/core/Character';
import {Box, Button, Stack, Typography} from '@mui/material';
import { Helmet } from 'react-helmet';


function HomePageContent() {
    const [selectedCharacter, setSelectedCharacter] =
        useState<Character | null>(null);

    let characterChat = <SelectCharacter
        {...{
            selectedCharacter,
            setSelectedCharacter,
        }}
    />

    if (selectedCharacter) {
        characterChat = (
            <CharacterChat character={selectedCharacter}>
                <Box mt={2}>
                    <Button
                        onClick={() => {
                            setSelectedCharacter(null);
                        }}
                    >
                        Chat with someone else
                    </Button>
                </Box>
            </CharacterChat>
        );  
    }
    return (
        <>
            {characterChat}
            <Stack justifyContent="flex-start" width="100%" mt={2}>
                <Typography variant="caption">
                    character model: {process.env.NEXT_PUBLIC_CHARACTER_CONVERSATION_GPT_MODEL}; 
                    rate truthfulness model: {process.env.NEXT_PUBLIC_RATE_TRUTHFULNESS_GPT_MODEL}; 
                </Typography>
            </Stack>
        </>
        
    );
}

export default function Home() {
    return (
        <>
            <Head>
                <title>
                    Infinite Personas - Chat With Anyone You Can Imagine
                </title>
                <meta
                    name="description"
                    content="Chat with anyone you can imagine"
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Helmet>
                <meta property="og:title" content="Chat with anyone you can imagine" />
                <meta
                property="og:description"
                content="Use GPT4 to simulate a chat with anyone you can describe. Has a built in lie detector to help you find out if they're telling the truth."
                />
            </Helmet>

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
