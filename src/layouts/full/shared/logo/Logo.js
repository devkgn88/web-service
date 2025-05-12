import { Link } from 'react-router-dom';
import { styled, Typography } from '@mui/material';

const LinkStyled = styled(Link)(() => ({
  height: '70px',
  width: '180px',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textDecoration: 'none',
}));

const Logo = () => {
  return (
    <LinkStyled to="/">
      <Typography
        variant="h4"
        fontWeight="bold"
        color="primary"
        sx={{ fontFamily: 'sans-serif' }}
      >
        Roomi
      </Typography>
    </LinkStyled>
  );
};

export default Logo;
