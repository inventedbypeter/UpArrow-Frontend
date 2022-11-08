import styled from '@emotion/styled';
import color from '../../styles/color';

const TagBlock = styled.div`
  padding: 0.3rem 0.8rem;
  border: 1px solid ${color.B80};
  border-radius: 999rem;
`;

const Tag = ({ children }) => {
  return <TagBlock>{children}</TagBlock>;
};

export default Tag;
