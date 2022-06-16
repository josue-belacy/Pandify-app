import { useState, useEffect } from 'react';
import { getTopArtists } from '../spotify';
import { catchErrors } from '../utils';
import { ArtistsGrid, SectionWrapper, TimeRangeButtons } from '../components';

const TopArtists = () => {
  const [topArtists, setTopArtists] = useState(null);
  const [activeRange, setActiveRange] = useState('short');

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getTopArtists(`${activeRange}_term`);
      setTopArtists(data);
    };

    catchErrors(fetchData());
  }, [activeRange]);

  return (
    <main>
      <ul>
        <li><button className={activeRange === 'short' ? 'active': ''} onClick={() => setActiveRange('short')}>This Month</button></li>
        <li><button className={activeRange === 'medium' ? 'active': ''} onClick={() => setActiveRange('medium')}>Last 6 Months</button></li>
        <li><button className={activeRange === 'long' ? 'active': ''} onClick={() => setActiveRange('long')}>All Time</button></li>
      </ul>

      <SectionWrapper title="Top Artists" breadcrumb={true}>
        <TimeRangeButtons
          activeRange={activeRange}
          setActiveRange={setActiveRange}
        />

        {topArtists && topArtists.items && (
          <ArtistsGrid artists={topArtists.items} />
        )}
      </SectionWrapper>
    </main>
  );
};

export default TopArtists;