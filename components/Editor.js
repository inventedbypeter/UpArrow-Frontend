import { useUser } from '@auth0/nextjs-auth0';
import styled from '@emotion/styled';
import '@toast-ui/editor/dist/toastui-editor.css';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { env } from '../config';
import api from '../apis';
import { Body12Medium, HeadH1Bold } from '../styles/typography';
import color from '../styles/color';
import SearchInput from './common/SearchInput';
import TagPill from './Editor/TagPill';
import { PlusIcon } from './icons';

const EditorBlock = styled.div`
  display: flex;
  justify-content: center;
`;
const ToastEditor = dynamic(() => import('../components/ToastEditor'), {
  ssr: false,
});

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 72rem;
  padding: 3.2rem 0;

  .title-input {
    border: none;
    ${HeadH1Bold};
    color: ${color.B13};

    &:focus {
      outline: none;
    }
    &::placeholder {
      color: ${color.B80};
    }
    margin-bottom: 2.4rem;
  }

  .stock-search-wrapper {
    padding: 0.8rem 0;
    display: flex;
    flex-direction: column;

    .empty {
      flex: 1;
    }
  }
  .stock-search-label {
    margin-bottom: 0.8rem;
    ${Body12Medium}
    color: ${color.B80};
  }

  .stock-search {
    position: relative;
    display: flex;
    gap: 0.8rem;
    height: 3.8rem;

    .stock-search-input {
      ${({ isOpen }) =>
        isOpen
          ? `
        display: block;
      `
          : `
        display: none;
      `}
      top: 0;
      left: 0;
      position: absolute;
      opacity: 1;
      z-index: 100;
      background-color: white;
    }

    .stock-plus {
      ${({ isOpen }) =>
        isOpen
          ? `
        display: none;
      `
          : `
        display: flex;
      `}
      background-color: transparent;
      border: 0.1rem solid ${color.B80};
      border-radius: 999rem;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      width: 3.8rem;
      height: 3.8rem;
    }

    .stock-with-search-input {
      position: relative;
    }
  }
`;

const Editor = ({ editData }) => {
  const { data: stocks } = useQuery(['stock'], api.stock.get);
  const { user } = useUser();
  const [postForm, setPostForm] = useState(
    editData || { title: '', content: '', thumbnailImageUrl: '', stockId: '' }
  );

  const [stockTextForSearch, setStockTextForSearch] = useState('');
  const [stockSearchResult, setStockSearchResult] = useState([]);
  const [selectedStocks, setSelectedStocks] = useState([]);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  useEffect(() => {
    if (stockTextForSearch.length === 0) return;
    const search = async () => {
      const res = (
        await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/stock/search`, {
          params: {
            name: stockTextForSearch,
          },
        })
      ).data;
      setStockSearchResult(res);
    };
    search();
  }, [stockTextForSearch]);

  const submit = () => {
    if (editData) {
      axios.put(`${env.serverUrl}/post/${editData._id}`, {
        ...postForm,
        email: user.email,
      });
    } else {
      axios.post(env.serverUrl + '/post', {
        ...postForm,
        email: user.email,
      });
    }
  };

  return (
    <EditorBlock>
      <InputWrapper isOpen={searchModalOpen}>
        <input
          className='title-input'
          value={postForm.title}
          onChange={(e) =>
            setPostForm((s) => ({ ...s, title: e.target.value }))
          }
          placeholder='Title Here'
        />
        {/* <input
          value={postForm.thumbnailImageUrl}
          type='file'
          onChange={(e) =>
            setPostForm((s) => ({ ...s, thumbnailImageUrl: e.target.value }))
          }
          placeholder='thumbnail image url'
        /> */}
        <div className='stock-search-wrapper'>
          <span className='stock-search-label'>
            What stocks are you writing about?
          </span>
          <div className='stock-search'>
            {selectedStocks.map((stock) => (
              <TagPill
                key={stock._id}
                label={stock.name}
                clean={() => {
                  setSelectedStocks((s) =>
                    s.filter((v) => v._id !== stock._id)
                  );
                }}
              />
            ))}
            <div className='stock-with-search-input'>
              <button
                className='stock-plus'
                onClick={(e) => {
                  setSearchModalOpen(true);
                }}
              >
                <PlusIcon />
              </button>
              <SearchInput
                className='stock-search-input'
                value={stockTextForSearch}
                setValue={setStockTextForSearch}
                searchResult={stockSearchResult.filter(
                  (v) => !selectedStocks.some((s) => s._id === v._id)
                )}
                clean={() => {
                  setStockTextForSearch('');
                  setSearchModalOpen(false);
                  setStockSearchResult([]);
                }}
                onSelect={(v) => {
                  if (selectedStocks.some((s) => s._id === v._id)) return;
                  setSelectedStocks((s) => [...s, v]);
                }}
              />
            </div>
          </div>
        </div>

        <ToastEditor
          placeholder='Write your investment ideas'
          content={postForm.content}
          setPostForm={setPostForm}
        />
      </InputWrapper>
    </EditorBlock>
  );
};

export default Editor;
