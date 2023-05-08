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
    </Box>
  );
};

export default PageLoadingSpinner;
