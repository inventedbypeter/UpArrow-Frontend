import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
// import ProfileIcon from "../images/profile.svg";
import { useUser } from '@auth0/nextjs-auth0';
import axios from 'axios';
// import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ProfileIcon from './ProfileIcon';
import { useQuery } from '@tanstack/react-query';

const NavBlock = styled.div`
  display: flex;
  background-color: white;
  color: black;
  font-size: 2.1rem;
  font-family: lato;
  font-weight: 900;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  box-shadow: 0rem 0rem 0.7rem #c4c7cc;
  padding: 1.3rem 2rem;

  .left-items {
    display: flex;
    align-items: center;
  }

  .uparrow-logo {
    /* margin-left: 2rem; */
    margin-right: 4rem;
    font-size: 3rem;
    cursor: pointer;
  }

  .buttons {
    display: flex;
  }

  .stocks {
    margin-right: 2.9rem;
    cursor: pointer;
  }

  .ideas {
    margin-right: 2.9rem;
    cursor: pointer;
  }

  .investors {
    margin-right: auto;
    cursor: pointer;
  }

  .right-items {
    display: flex;
    align-items: center;
  }

  .profile-icon {
    width: 5rem;
    height: 5rem;
    border: 0.1rem solid gray;
    cursor: pointer;
  }

  .user-profile-picture {
    width: 5rem;
    height: 5rem;
    border-radius: 999rem;
    cursor: pointer;
  }

  .admin-button {
    border-radius: 2rem;
    font-size: 1.4rem;
    font-family: lato;
    font-weight: bold;
    padding: 1.2rem;
    background-color: white;
    border: white;
    :hover {
      background-color: rgba(0 0 0 / 10%);
    }

    .profile-menu {
      width: 40rem;
      height: 70rem;
      display: none;
      background-color: red;
    }
  }

  /* @media screen and (max-width: 60rem) {
    font-size: 1rem;

    .uparrow-logo {
      margin-left: 1rem;
      margin-right: 1rem;
      font-size: 1rem;
      cursor: pointer;
    }

    .stocks {
      margin-right: 1rem;
      cursor: pointer;
    }

    .ideas {
      margin-right: 1rem;
      cursor: pointer;
    }
  } */
`;

const Navbar = ({ stockRef, ideaRef, investorRef }) => {
  const router = useRouter();
  const { user, error, isLoading } = useUser();
  const { data } = useQuery(['user', user], () =>
    axios
      .get(`http://localhost:4000/api/v1/user/${user.email}`)
      .then((res) => res.data)
  );
  console.log('this is data', data);

  const [userDocument, setUserDocument] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState('placeholder');

  //const [content, setContent] = useState("Please enter your comment");

  const navigateProfile = () => {
    if (userId.length > 0) {
      router.push('/investor');
    }
  };

  console.log('before useEffect', user);
  useEffect(() => {
    const getUser = async () => {
      console.log('before if', user);
      if (user) {
        console.log('after if', user);
        const email = user.email;
        const userResponse = await axios.get(
          `http://localhost:4000/api/v1/user/${email}`
        );
        console.log('axios in navbar', userResponse.data);
        if (userResponse.data.isAdmin) {
          console.log('this user is an admin');
          setUserId(String(userResponse.data._id));
          localStorage.setItem('investorStrId', String(userResponse.data._id));
          setIsAdmin(true);
        } else {
          localStorage.setItem('investorStrId', String(userResponse.data._id));
        }
      }
    };
    getUser();
  }, [user]);

  const goToIndex = () => {
    router.push('/');
  };

  const goToStocks = () => {
    stockRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const goToIdeas = () => {
    ideaRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const goToInvestors = () => {
    investorRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const goToAdminPage = () => {
    console.log('This is the userId', userId);
    localStorage.setItem('adminUserId', userId);
    router.push('/admin');
  };

  return (
    <NavBlock>
      <div className='left-items'>
        <div className='uparrow-logo' onClick={goToIndex}>
          UpArrow
        </div>

        <div className='buttons'>
          <div className='stocks' onClick={goToStocks}>
            Analyses
          </div>

          <div className='ideas' onClick={goToIdeas}>
            Ideas
          </div>

          <div className='investors' onClick={goToInvestors}>
            Investors
          </div>
        </div>
      </div>

      <div>
        {isAdmin ? (
          <button className='admin-button' onClick={() => goToAdminPage()}>
            Switch to Admin mode{' '}
          </button>
        ) : null}
      </div>

      <div className='right-items'>
        {data ? (
          <img className='user-profile-picture' src={data.profile_image_url} />
        ) : (
          <ProfileIcon />
        )}
      </div>
      <a href='/api/auth/logout'>Logout</a>
    </NavBlock>
  );
};

export default Navbar;
