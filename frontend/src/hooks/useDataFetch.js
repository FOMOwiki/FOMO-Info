import { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

/**
 * Custom hook for fetching all site data
 * @returns {Object} { data, loading, error }
 */
export const useDataFetch = () => {
  const [data, setData] = useState({
    cards: [],
    team: [],
    platformSettings: null,
    roadmapData: null,
    partnersData: [],
    footerSettings: null,
    faqData: [],
    communitySettings: null,
    heroSettings: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [
          cardsRes,
          teamRes,
          platformRes,
          roadmapRes,
          partnersRes,
          footerRes,
          faqRes,
          communityRes,
          heroRes
        ] = await Promise.all([
          axios.get(`${API}/drawer-cards`),
          axios.get(`${API}/team-members`),
          axios.get(`${API}/platform-settings`),
          axios.get(`${API}/roadmap`),
          axios.get(`${API}/partners`),
          axios.get(`${API}/footer-settings`),
          axios.get(`${API}/faq`),
          axios.get(`${API}/community-settings`),
          axios.get(`${API}/hero-settings`)
        ]);

        setData({
          cards: cardsRes.data,
          team: teamRes.data,
          platformSettings: platformRes.data,
          roadmapData: roadmapRes.data,
          partnersData: partnersRes.data,
          footerSettings: footerRes.data,
          faqData: faqRes.data,
          communitySettings: communityRes.data,
          heroSettings: heroRes.data
        });
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  return { data, loading, error };
};
