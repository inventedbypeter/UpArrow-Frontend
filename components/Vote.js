import styled from '@emotion/styled';
import { useMutation } from '@tanstack/react-query';
import api from '../apis';

const VoteBlock = styled.div`
  font-size: 2rem;
  display: flex;
  gap: 2rem;
  padding: 2rem;
`;

const Vote = ({ userId, postId }) => {
  const createVote = useMutation(api.vote.post);
  const voteData = { userId, postId };
  console.log('voteData : ', voteData);

  return (
    <VoteBlock>
      <button onClick={() => createVote.mutate({ ...voteData, isAgree: true })}>
        Agree
      </button>
      <button
        onClick={() => createVote.mutate({ ...voteData, isAgree: false })}
      >
        Disagree
      </button>
    </VoteBlock>
  );
};

export default Vote;
