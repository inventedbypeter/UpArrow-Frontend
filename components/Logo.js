import React from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/router';
import styled from 'styled-components';

const LogoBlock = styled.img`
  width: 20rem;
  height: 20rem;
  border: solid 0.1rem #dee0e3;
  box-shadow: 0rem 0rem 0.2rem #c4c7cc;
  border-radius: 0.6rem;
  cursor: pointer;
  :hover {
    border: 0.1rem solid gray;
  }
`;

const Logo = (props) => {
  const { user, error, isLoading } = useUser();
  const router = useRouter();

  const checkAuthentication = (abc) => {
    if (user) {
      var stockIdStr = String(abc._id);
      localStorage.setItem('stockIdStr', stockIdStr);
      localStorage.removeItem('stockIdStrModal');
      router.push('/stock');
    } else {
      router.push('/api/auth/login');
    }
  };

  return (
    <LogoBlock
      src={props.stockJSON.profile_image_url}
      onClick={() => checkAuthentication(props.stockJSON)}
    />
  );
};

export default Logo;
