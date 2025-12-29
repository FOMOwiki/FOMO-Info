import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from '../../hooks';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;


const TeamSection = () => {
  const [team, setTeam] = useState([]);
  const [flippedCards, setFlippedCards] = useState(new Set());
  const scrollContainerRef = useRef(null);
  const scrollContainerRef2 = useRef(null);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await axios.get(`${API}/team-members`);
        setTeam(response.data.sort((a, b) => a.order - b.order));
      } catch (error) {
        console.error('Error fetching team:', error);
      }
    };
    fetchTeam();
  }, []);

  const toggleFlip = (id) => {
    setFlippedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const scroll = (direction, ref) => {
    if (ref.current) {
      const scrollAmount = 400;
      ref.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const coreTeam = team.filter(m => m.member_type === 'main');
  const teamMembers = team.filter(m => m.member_type === 'team_member');

  if (team.length === 0) {
    return null;
  }

  return (
    <section id="team" className="py-16 bg-white overflow-hidden" data-testid="team-section">
      {/* Core Team */}
      {coreTeam.length > 0 && (
        <>
          <div className="max-w-7xl mx-auto px-6 mb-12">
            <div className="text-center">
              <span className="inline-block px-4 py-2 bg-gray-100 rounded-full text-gray-600 text-sm font-medium mb-4">Our Team</span>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Core Team</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                The founding members who built FOMO from the ground up
              </p>
            </div>
          </div>

          <div className="team-slider-container">
            <button 
              onClick={() => scroll('left', scrollContainerRef)} 
              className="team-nav-button team-nav-left"
              aria-label="Scroll left"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="team-slider-scroll" ref={scrollContainerRef}>
              <div className="team-slider-track">
                {coreTeam.map((member) => (
              <div 
                key={member.id}
                className={`team-card ${flippedCards.has(member.id) ? 'flipped' : ''}`}
                onClick={() => toggleFlip(member.id)}
                data-testid={`team-card-${member.id}`}
              >
                <div className="team-card-inner">
                  {/* Front Side */}
                  <div className="team-card-front">
                    <div className="team-card-image">
                      {member.image_url ? (
                        <img 
                          src={member.image_url.startsWith('/') ? `${BACKEND_URL}${member.image_url}` : member.image_url}
                          alt={member.name_en}
                        />
                      ) : (
                        <div className="team-avatar-placeholder">
                          <span>{(member.name_en || 'U').charAt(0)}</span>
                        </div>
                      )}
                    </div>
                    <div className="team-card-info">
                      <h3 className="team-member-name">{member.name_en}</h3>
                      <p className="team-member-position">{member.position_en}</p>
                    </div>
                  </div>

                  {/* Back Side */}
                  <div className="team-card-back">
                    <div className="team-card-back-content">
                      <h3 className="team-member-name-back">{member.name_en}</h3>
                      <p className="team-member-position-back">{member.position_en}</p>
                      <div className="team-member-bio">
                        {member.bio_en}
                      </div>
                      <div className="team-social-links">
                        {member.displayed_socials?.map((socialKey) => {
                          const link = member.social_links?.[socialKey];
                          if (!link) return null;
                          
                          return (
                            <a 
                              key={socialKey}
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="team-social-link"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {socialKey === 'twitter' && <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" /></svg>}
                              {socialKey === 'linkedin' && <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>}
                              {socialKey === 'github' && <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>}
                              {socialKey === 'telegram' && <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161l-1.764 8.318c-.132.593-.478.74-.968.46l-2.67-1.968-1.287 1.24c-.143.143-.262.262-.537.262l.192-2.718 4.957-4.476c.215-.192-.047-.298-.334-.106l-6.126 3.859-2.638-.824c-.573-.18-.584-.573.12-.849l10.307-3.971c.478-.18.895.108.738.849z"/></svg>}
                              {socialKey === 'medium' && <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/></svg>}
                              {socialKey === 'behance' && <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14h-8.027c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988h-6.466v-14.967h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zm-3.466-8.988h3.584c2.508 0 2.906-3-.312-3h-3.272v3zm3.391 3h-3.391v3.016h3.341c3.055 0 2.868-3.016.05-3.016z"/></svg>}
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
              </div>
            </div>

            <button 
              onClick={() => scroll('right', scrollContainerRef)} 
              className="team-nav-button team-nav-right"
              aria-label="Scroll right"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </>
      )}

      {/* Team Members - Separate Section Below */}
      {teamMembers.length > 0 && (
        <>
          <div className="max-w-7xl mx-auto px-6 mb-12 mt-24">
            <div className="text-center">
              <span className="inline-block px-4 py-2 bg-gray-100 rounded-full text-gray-600 text-sm font-medium mb-4">Our People</span>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Team Members</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Talented professionals driving innovation and excellence every day
              </p>
            </div>
          </div>

          <div className="team-slider-container">
            <button 
              onClick={() => scroll('left', scrollContainerRef2)} 
              className="team-nav-button team-nav-left"
              aria-label="Scroll left"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="team-slider-scroll" ref={scrollContainerRef2}>
              <div className="team-slider-track">
                {teamMembers.map((member) => (
              <div 
                key={member.id}
                className={`team-card team-card-small ${flippedCards.has(member.id) ? 'flipped' : ''}`}
                onClick={() => toggleFlip(member.id)}
                data-testid={`team-card-${member.id}`}
              >
                <div className="team-card-inner">
                  {/* Front Side */}
                  <div className="team-card-front">
                    <div className="team-card-image">
                      {member.image_url ? (
                        <img 
                          src={member.image_url.startsWith('/') ? `${BACKEND_URL}${member.image_url}` : member.image_url}
                          alt={member.name_en}
                        />
                      ) : (
                        <div className="team-avatar-placeholder">
                          <span>{(member.name_en || 'U').charAt(0)}</span>
                        </div>
                      )}
                    </div>
                    <div className="team-card-info">
                      <h3 className="team-member-name">{member.name_en}</h3>
                      <p className="team-member-position">{member.position_en}</p>
                    </div>
                  </div>

                  {/* Back Side */}
                  <div className="team-card-back">
                    <div className="team-card-back-content">
                      <h3 className="team-member-name-back">{member.name_en}</h3>
                      <p className="team-member-position-back">{member.position_en}</p>
                      <div className="team-member-bio">
                        {member.bio_en}
                      </div>
                      <div className="team-social-links">
                        {member.displayed_socials?.map((socialKey) => {
                          const link = member.social_links?.[socialKey];
                          if (!link) return null;
                          
                          return (
                            <a 
                              key={socialKey}
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="team-social-link"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {socialKey === 'twitter' && <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" /></svg>}
                              {socialKey === 'linkedin' && <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>}
                              {socialKey === 'github' && <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>}
                              {socialKey === 'telegram' && <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161l-1.764 8.318c-.132.593-.478.74-.968.46l-2.67-1.968-1.287 1.24c-.143.143-.262.262-.537.262l.192-2.718 4.957-4.476c.215-.192-.047-.298-.334-.106l-6.126 3.859-2.638-.824c-.573-.18-.584-.573.12-.849l10.307-3.971c.478-.18.895.108.738.849z"/></svg>}
                              {socialKey === 'medium' && <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/></svg>}
                              {socialKey === 'behance' && <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14h-8.027c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988h-6.466v-14.967h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zm-3.466-8.988h3.584c2.508 0 2.906-3-.312-3h-3.272v3zm3.391 3h-3.391v3.016h3.341c3.055 0 2.868-3.016.05-3.016z"/></svg>}
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
              </div>
            </div>

            <button 
              onClick={() => scroll('right', scrollContainerRef2)} 
              className="team-nav-button team-nav-right"
              aria-label="Scroll right"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </>
      )}
    </section>
  );
};



export default TeamSection;
