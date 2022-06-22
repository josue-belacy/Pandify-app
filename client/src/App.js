import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation
} from "react-router-dom";
import { accessToken, getCurrentUserProfile, logout } from "./spotify";
// import { catchError } from "./utils";
import styled from 'styled-components/macro'
import { GlobalStyle } from "./styles";
import { Login, Profile, TopArtists, TopTracks, Playlists, Playlist } from "./pages";


const StyledLogoutButton = styled.button`
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-md);
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: rgba(0,0,0,.7);
  color: var(--white);
  font-size: var(--fz-sm);
  font-weight: 700;
  border-radius: var(--border-radius-pill);
  z-index: 10;
  @media (min-width: 768px) {
    right: var(--spacing-lg);
  }
`;

// Scroll to top of page when changing routes
// https://reactrouter.com/web/guides/scroll-restoration/scroll-to-top
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const [token, setToken] = useState(null)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    setToken(accessToken)

    const fetchData = async () => {
      try {
        const { data } = await getCurrentUserProfile()
        setProfile(data)

        console.log(data)
      } catch (e) {
        console.error(e)
      }
    }

    fetchData()

    // or we can wrap it in a HOF with catchErrors
    // I believe it is over complicated so I'm leaving it out
    // catchErrors(fetchData())

  }, []);

  return (
    <div className="App">
      <GlobalStyle />
      <header className="App-header">
        {!token ? (
          <Login />
        ) : (
          <BrowserRouter>
            <ScrollToTop />
            <>
              <StyledLogoutButton onClick={logout}>Log Out</StyledLogoutButton>
              <Routes>
                <Route path="/" index element={<Profile />} />
                <Route path="/top-artists" element={<TopArtists />} />
                <Route path="/top-tracks" element={<TopTracks />} />
                <Route>
                  <Route path="/playlists" element={<Playlists />} />
                  <Route path="/playlists/:id" element={<Playlist />} />
                </Route>
              </Routes>
            </>
          </BrowserRouter>
        )}
      </header>
    </div>
  );
}

export default App;