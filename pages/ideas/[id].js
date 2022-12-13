import { useUser } from '@auth0/nextjs-auth0';
import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import api from '../../apis';
import Vote from '../../components/Vote';
import { env } from '../../config';
import Youtube from '../../components/Youtube';
import InvestorProfile from '../../components/common/InvestorProfile';
import { getInvestorProfileInfo } from '../../utils/investor';
import { Body14Regular, HeadH1Bold } from '../../styles/typography';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import color from '../../styles/color';
import TagPill from '../../components/Editor/TagPill';
import IdeaVote from '../../components/IdeaVote';
import CommentInput from '../../components/CommentInput';
import Button from '../../components/common/Button';
TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo('en-US');

const IdeasBlock = styled.div`
  display: flex;

  .tag-pill-wrapper {
    display: flex;
    gap: 0.8rem;
    margin-bottom: 2.4rem;
  }

  .vote-wrapper {
    margin-bottom: 3.2rem;
  }

  .thumbnail-wrapper {
    width: 100%;
    margin-bottom: 2.4rem;
    & > img {
      width: 100%;
    }
  }

  .comment-submit-button {
    margin-left: auto;
  }

  .comment-input-wrapper {
    margin-bottom: 1.6rem;
  }
`;

const PostBlock = styled.div`
  padding: 3.2rem 1.2rem;
  display: flex;
  flex-direction: column;

  .post-title {
    ${HeadH1Bold}
    margin-bottom: 1.6rem;
  }
  .post-info {
    ${Body14Regular};
    color: ${color.B40};
    margin-bottom: 1.6rem;
  }
`;

const IdeaContent = styled.div`
  // normal-text
  p {
    color: ${color.B13};
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
  }
`;

export default function Ideas({ investor, post, rank, stocksWithPrices }) {
  const {
    description,
    followers,
    followings,
    profile_image_url,
    // purchases,
    totalAssets,
    totalInvestment,
    totalProfits,
    username,
    websiteUrl,
  } = investor;
  const availableCash = totalAssets - totalInvestment;
  const router = useRouter();
  const { id } = router.query;
  const { user } = useUser();
  const { data, isLoading } = useQuery(
    ['user', user?.email],
    api.user.getByEmail(user?.email)
  );
  const {
    data: voteData,
    isLoading: isVoteDataLoading,
    refetch,
  } = useQuery(['voteByPostId', id], api.vote.getByPostId(id));
  const [comment, setComment] = useState('');

  if (isLoading || isVoteDataLoading) {
    return null;
  }

  const { agreeCount, disagreeCount } = voteData.data.reduce(
    (acc, vote) => {
      if (vote.isAgree) {
        return {
          ...acc,
          agreeCount: acc.agreeCount + 1,
        };
      }
      return {
        ...acc,
        disagreeCount: acc.disagreeCount + 1,
      };
    },
    { agreeCount: 0, disagreeCount: 0 }
  );

  return (
    <IdeasBlock>
      <div>
        <InvestorProfile
          profile_image_url={profile_image_url}
          username={username}
          investedCompanies={stocksWithPrices}
          followers={followers}
          followings={followings}
          description={description}
          websiteUrl={websiteUrl}
          availableCash={availableCash}
          totalInvestment={totalInvestment}
          totalProfits={totalProfits}
          totalAssets={totalAssets}
          rank={rank}
        />
      </div>
      <PostBlock>
        <h1 className='post-title'>{post.title}</h1>
        <div className='post-info'>
          by {post.username} · {timeAgo.format(new Date(post.date))}
        </div>
        <div className='tag-pill-wrapper'>
          {stocksWithPrices.map((stock) => (
            <TagPill
              key={stock._id}
              stockImageUrl={stock.profile_image_url}
              label={stock.name}
            />
          ))}
        </div>
        <div className='vote-wrapper'>
          <IdeaVote agreeCount={agreeCount} disagreeCount={disagreeCount} />
        </div>
        <div className='thumbnail-wrapper'>
          <img src={post.thumbnailImageUrl} />
        </div>

        {post.youtubeCode && <Youtube youtubeCode={post.youtubeCode} />}

        <IdeaContent dangerouslySetInnerHTML={{ __html: post.content }} />
        <div>
          <div>likes : {post.likes.length}</div>
          <div>comments : {post.comments.length}</div>
          <button
            onClick={() => {
              router.push(`/editor/${id}`);
            }}
          >
            edit
          </button>
        </div>

        <Vote userId={data._id} postId={id} refetch={refetch} />
        <CommentInput
          className='comment-input-wrapper'
          value={comment}
          setValue={setComment}
        />
        <Button className='comment-submit-button'>Comment</Button>
      </PostBlock>
    </IdeasBlock>
  );
}

export const getServerSideProps = async (context) => {
  const { id } = context.params;
  const post = (await axios.get(env.serverUrl + '/post/' + id)).data;
  const { investor, prices, stockPurchaseInfos, userPosts, userRank } =
    await getInvestorProfileInfo(post.userId);
  const stockIds = Object.keys(stockPurchaseInfos);

  const stocks = (
    await Promise.all(
      stockIds.map((id) =>
        axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/stock/${id}`)
      )
    )
  ).map((v) => v.data);

  const stocksWithPrices = stocks.map((stock) => {
    return {
      ...stock,
      ...stockPurchaseInfos[stock._id],
      totalValue: stockPurchaseInfos[stock._id].quantity * prices[stock.ticker],
    };
  });

  return {
    props: {
      post,
      investor: { ...investor.data },
      prices,
      stockPurchaseInfos,
      stocksWithPrices,
      userPosts,
      userRank,
      rank: userRank,
    },
  };
};
