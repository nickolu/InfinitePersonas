import {PropsWithChildren} from 'react';
import MainNav from '@/components/Nav/MainNav';
import {Box, Grid, Typography} from '@mui/material';
import '@/components/PageTemplates/BasePageTemplate.module.scss';

export default function BasePageTemplate({
  children,
  onHomeClick,
}: PropsWithChildren<{onHomeClick?: () => void}>) {
  return (
    <Box>
      <Grid container display={'flex'} justifyContent={'center'}>
        <Grid item sm={6} xs={12}>
          <Box
            display={'flex'}
            justifyContent={'center'}
            flexDirection={'column'}
            alignItems={'flex-start'}
          >
            <Typography variant="h1">Speaklore</Typography>
            <MainNav onHomeClick={onHomeClick} />
          </Box>
          <Box
            mt={1.5}
            className="main"
            component="main"
            sx={{
              '@media screen and (max-width: 599px)': {
                padding: '0px 16px',
              },
            }}
          >
            {children}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
