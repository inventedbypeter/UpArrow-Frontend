import { useConfig } from '../../hooks/useConfig';
import styled from '@emotion/styled';

const BannerBlock = styled.div`
  background-color: gray;
  & > img {
    width: 100%;
    height: 40rem;
    object-fit: cover;
  }
`;
const Banner = () => {
  const { config } = useConfig();
  const bannerImageUrl = config.bannerImageUrl;

  return (
    <BannerBlock>
      <img src={bannerImageUrl} />
    </BannerBlock>
  );
};

export default Banner;
