import Head from 'next/head';
import BasePageTemplate from '@/components/PageTemplates/BasePageTemplate';

function HomePageContent() {
  return <div>This is where the home page content goes</div>;
}

export default function Home() {
  return (
    <>
      <Head>
        <title>SpeakLore - Chat With any Historical Figure</title>
        <meta name="description" content="Chat With any Historical Figure" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
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
