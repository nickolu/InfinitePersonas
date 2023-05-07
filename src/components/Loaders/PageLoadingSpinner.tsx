import {CircularProgress, Box, Typography} from '@mui/material';

const PageLoadingSpinner = () => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      width="100%"
    >
      <CircularProgress />
      <Typography variant="h6" mt={2}>
        AI is thinking up some new content for this page, it may take a
        second...
      </Typography>
    </Box>
  );
};

export default PageLoadingSpinner;
