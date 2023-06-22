import {PropsWithChildren} from 'react';
import {Box, Grid, Typography} from '@mui/material';

export default function BasePageTemplate({
  children,
  onHomeClick,
}: PropsWithChildren<{onHomeClick?: () => void}>) {
  return (
    <Box maxWidth={'1600px'} margin={'0 auto'}>
      <Grid container display={'flex'} justifyContent={'center'}>
        <Grid item xs={12} md={8}>
          <Typography variant="h2">Infinite Personas</Typography>
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
