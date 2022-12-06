import styled from '@emotion/styled';
import color from '../../styles/color';
import { Body16Regular } from '../../styles/typography';
import { XIcon } from '../icons';

const TagPillBlock = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  ${Body16Regular}
  gap:0.8rem;
  padding: 0.8rem;
  padding-left: 1.6rem;
  border: 0.1rem solid ${color.B80};
  height: 3.8rem;
  border-radius: 12rem;

  .x-icon {
    cursor: pointer;
  }
`;

const TagPill = ({ label, clean }) => {
  return (
    <TagPillBlock>
      <span>{label}</span>
      <XIcon className='x-icon' onClick={() => clean()} />
    </TagPillBlock>
  );
};

export default TagPill;
