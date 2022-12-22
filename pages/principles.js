import React from 'react';
import styled from '@emotion/styled';
import color from '../styles/color';
import Image from 'next/image';

const PrinciplesBlock = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  background-color: ${color.UpArrow_Blue};
`;

const PrincipleCardBlock = styled.div`
  background-color: #4a72ff;
  width: 116rem;
  height: 54rem;
  border-radius: 3.2rem;
  transform: translate(50%, 50%);

  .image-wrapper {
    width: 74rem;
    height: 48rem;
  }
`;

const PrincipleCard = ({ message, author, imageUrl }) => {
  return (
    <PrincipleCardBlock>
      <h1>{message}</h1>
      <span>{author}</span>
      <div className='image-wrapper'>
        <Image src={imageUrl} layout='fill' />
      </div>
    </PrincipleCardBlock>
  );
};

export default function Principles() {
  const messages = [
    {
      message:
        '“Rule No. 1: Never lose money. Rule No. 2: Never forget Rule No. 1.”',
      author: 'Warren Buffet',
      imageUrl: '/images/warren.png',
    },
    {
      message: '“People calculate too much and think too little.”',
      author: 'Charles Munger',
      imageUrl: '/images/charles.png',
    },
    {
      message: '“Surround yourself with people trying to shape the future”',
      author: 'Cathie Wood',
      imageUrl: '/images/cathie.png',
    },
  ];
  return (
    <PrinciplesBlock>
      <div className='principle-card-wrapper'>
        {messages.map((message) => (
          <PrincipleCard key={message.message} {...message} />
        ))}
      </div>
    </PrinciplesBlock>
  );
}
