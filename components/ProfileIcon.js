import styled from "styled-components";
import { useState } from "react";
import Image from "next/image";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useRouter } from "next/router";

const ProfileIconWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  .menu {
    position: absolute;
    bottom: -20rem;
    right: 0.2rem;
    width: 20rem;
    background-color: white;
    border-radius: 0.6rem;
    box-shadow: 0.5rem 0.5rem 0.8rem 0.5rem rgba(0, 0, 0, 0.28);
    z-index: 1000;
    display: flex;
    flex-direction: column;
  }

  a {
    padding: 1.6rem;
    cursor: pointer;
  }
`;

const InvisibleCover = styled.div`
  background-color: rgba(0 0 0 / 10%);
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw; //viewportwidth
  height: 100vh; //viewportheight
  z-index: 990;
`;

const ProfileIcon = ({ className }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const profileImageUrl = true
    ? null
    : localStorage.getItem("profile_image_url");

  const navigateProfile = () => {
    router.push("/investor");
  };

  return (
    <>
      <ProfileIconWrapper className={className}>
        {profileImageUrl ? (
          <img src={profileImageUrl} onClick={() => setIsOpen(!isOpen)} />
        ) : (
          <AccountCircleIcon
            sx={{ fontSize: 40 }}
            onClick={() => setIsOpen(!isOpen)}
          />
        )}

        {isOpen && (
          <div className="menu">
            <a onClick={() => navigateProfile()}>My Portfolio</a>
            <a>Share Ideas</a>
            <a href="/api/auth/logout">Logout</a>
          </div>
        )}
      </ProfileIconWrapper>
      {isOpen && <InvisibleCover onClick={() => setIsOpen(false)} />}
    </>
  );
};

export default ProfileIcon;
