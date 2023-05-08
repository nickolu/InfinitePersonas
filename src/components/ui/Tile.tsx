import {Box, BoxProps, Paper, Typography} from '@mui/material';

const Tile = ({
  children,
  sx,
  hoverColor = 'lightgray',
  ...rest
}: BoxProps & {hoverColor?: string}) => {
  return (
    <Box
      m={2}
      sx={{
        cursor: 'pointer',
        ...sx,
      }}
      {...rest}
    >
      <Paper>
        <Box
          p={3}
          sx={{
            border: '1px solid black',
            '&:hover': {
              backgroundColor: hoverColor,
            },
          }}
        >
          {children}
        </Box>
      </Paper>
    </Box>
  );
};

export default Tile;
