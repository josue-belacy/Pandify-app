import { catchErrors } from "../utils";
import axios from "axios";
import { useEffect, useState } from "react";
import { getCurrentUserPlaylists } from "../spotify";
import { SectionWrapper, PlaylistsGrid, Loader } from "../components";

const Playlists = () => {
  const [playlistsData, setPlaylistsData] = useState(null);
  const [playlists, setPlaylists] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getCurrentUserPlaylists();
      setPlaylistsData(data);
    };

    catchErrors(fetchData());
  }, []);

  useEffect(() => {
    if (!playlistsData) {
      return;
    }

    const fetchMoreData = async () => {
      if (playlistsData.next) {
        const { data } = await axios.get(playlistsData.next);
        setPlaylistsData(data);
      }
    };

    setPlaylists((playlists) => [
      ...(playlists ? playlists : []),
      ...playlistsData.items,
    ]);

    catchErrors(fetchMoreData());
  }, [playlistsData]);

  return (
    <main>
      <SectionWrapper title="Playlists" breadcrumb="true">
        {playlistsData && playlistsData.items ? (
          <PlaylistsGrid playlists={playlistsData.items} />
        ) : (
          <Loader />
        )}
      </SectionWrapper>
    </main>
  );
};

export default Playlists;