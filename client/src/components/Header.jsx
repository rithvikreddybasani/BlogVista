import React, { useEffect, useState } from "react";
import {
  Navbar,
  TextInput,
  Button,
  Dropdown,
  Avatar,
  DropdownItem,
} from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../user/themeSlice";
import { signoutSuccess } from "../user/userSlice";

const Header = () => {
  const path = useLocation().pathname;
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const handleSignOut = async (e) => {
    try {
      const res = await fetch(
        "https://mern-blog-api-snowy.vercel.app/api/user/signout",
        {
          method: "POST",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  return (
    <Navbar className="border-b-2">
      <Link
        to={"/"}
        className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
      >
        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
          Blog
        </span>
        Vista
      </Link>
      <form onSubmit={handleSubmit}>
        <TextInput
          type="text"
          placeholder="Search..."
          rightIcon={AiOutlineSearch}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
      <div className="flex items-center gap-2 md:order-2">
        {currentUser && currentUser.validUser ? (
          <>
            <Dropdown
              arrowIcon={false}
              style={{ backgroundColor: "transparent", border: "none" }}
              label={
                <Avatar
                  alt="user"
                  img={currentUser.validUser.profilePicture}
                  rounded
                  style={{ margin: "auto" }}
                />
              }
            >
              <Dropdown.Header>
                <span className="block text-sm">
                  @{currentUser.validUser.username}
                </span>
                <span className="block text-sm font-medium truncate">
                  {currentUser.validUser.email}
                </span>
              </Dropdown.Header>
              <Link to={"/dashboard?tab=profile"}>
                <Dropdown.Item>Profile</Dropdown.Item>
              </Link>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleSignOut}>Sign Out</Dropdown.Item>
              <Dropdown.Divider />
              <DropdownItem
                className="w-12 h-10"
                color="grey"
                onClick={() => dispatch(toggleTheme())}
              >
                Switch Mode
              </DropdownItem>
              <Dropdown.Divider />
              <Dropdown.Item>
                <Link to={"/"}>Home</Link>
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item>
                <Link to={"/about"}>About</Link>
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item>
                <Link to={"/projects"}>Projects</Link>
              </Dropdown.Item>
            </Dropdown>
          </>
        ) : (
          <>
            <Button
              className="w-12 h-10 hidden sm:inline"
              color={"grey"}
              pill
              onClick={() => dispatch(toggleTheme())}
            >
              {theme === "light" ? <FaSun /> : <FaMoon />}
            </Button>
            <Link to="/sign-in">
              <Button gradientDuoTone="purpleToBlue" outline>
                Sign In
              </Button>
            </Link>
          </>
        )}
      </div>
      <Navbar.Collapse>
        <Navbar.Link active={path === "/"} as={"div"}>
          <Link to={"/"}>Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/about"} as={"div"}>
          <Link to={"/about"}>About</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/projects"} as={"div"}>
          <Link to={"/projects"}>Projects</Link>
        </Navbar.Link>
        <Navbar.Link className="hidden" as={"div"}>
          <Link to="/sign-in">
            <Button gradientDuoTone="purpleToBlue" outline>
              Sign In
            </Button>
          </Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
