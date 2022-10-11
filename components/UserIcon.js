import styled from '@emotion/styled';

const UserIconWrapper = styled.div`
  & > img {
    width: 15rem;
    height: 15rem;
    border-radius: 999rem;
    object-fit: cover;
  }
`;

const UserIcon = ({ src }) => {
  return (
    <UserIconWrapper>
      <img src={src} />
    </UserIconWrapper>
  );
};

export default UserIcon;
