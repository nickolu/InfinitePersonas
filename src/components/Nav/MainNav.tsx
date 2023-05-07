import React from 'react';
import Link from 'next/link';
import {Box} from '@mui/material';
import '@/components/Nav/MainNav.module.scss';

type NavItem = {
  href: string;
  label: string;
};

const navItems: NavItem[] = [
  {href: '/', label: 'Home'},
  {href: '/contact', label: 'Contact'},
  {href: '/services', label: 'Services'},
];

const MainNav = ({onHomeClick}: {onHomeClick?: () => void}) => {
  return (
    <Box
      className="MainNav"
      display="flex"
      width="100%"
      justifyContent="flex-start"
    >
      {navItems.map((item, index) => (
        <Box key={index} pr={1}>
          <Box
            p={2}
            mt={-4}
            sx={{
              fontSize: '0.8rem',
              textDecoration: 'none',
              '&:visited': {
                color: 'black',
              },
              '&:active': {
                color: 'black',
              },
              '&:hover': {
                textDecoration: 'underline',
              },
              '&:first-child': {
                paddingLeft: 0,
              },
              '&:last-child': {
                paddingRight: 0,
              },
            }}
          >
            <Link
              style={{color: 'inherit', textDecoration: 'none'}}
              className="MainNav__Link"
              href={item.href}
              onClick={(e) => {
                if (item.href === '/' && onHomeClick) {
                  e.preventDefault();
                  onHomeClick();
                }
              }}
            >
              {item.label}
            </Link>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default MainNav;
