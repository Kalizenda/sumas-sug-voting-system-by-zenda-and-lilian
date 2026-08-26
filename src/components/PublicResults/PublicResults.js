import React, { useState, useEffect } from 'react';
import { Pie } from '@nivo/pie';
import { ResponsiveBar } from '@nivo/bar';
import axios from 'axios';
import { BASE_URL } from '../../helper';
import io from 'socket.io-client';
import './PublicResults.css';

const sugPositions = [
    "President",
    "Vice President",
    "Secretary General",
    "Assistant Secretary General",
    "Treasurer",
    "Financial Secretary",
    "Director of Socials",
    "Director of Sports",
    "Director of Welfare",
    "Public Relations Officer",
    "Women Affairs Commissioner",
    "Student Senate Representative"
];

const PublicResults = () => {
    const [candidates, setCandidates] = useState([]);
    const [groupedResults, setGroupedResults] = useState({});
    const [totalVotes, setTotalVotes] = useState(0);
    const [loading, setLoading] = useState(true);
    const [lastUpdate, setLastUpdate] = useState(null);
    const [electionInfo, setElectionInfo] = useState(null);
    const [bgTheme, setBgTheme] = useState(0);

    const bgThemes = [
        'linear-gradient(135deg, #1a237e 0%, #16213e 100%)',
        'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
        'linear-gradient(135deg, #134e5e 0%, #71b280 100%)',
        'linear-gradient(135deg, #141e30 0%, #243b55 100%)',
        'linear-gradient(135deg, #200122 0%, #6f0000 100%)',
        'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
    ];

    const changeBackground = () => {
        setBgTheme((prev) => (prev + 1) % bgThemes.length);
    };

    useEffect(() => {
        // Connect to Socket.io
        const socket = io('http://localhost:5002');
        
        socket.on('connect', () => {
            console.log('Connected to voting system');
            socket.emit('requestResults');
        });

        socket.on('currentResults', (data) => {
            console.log('Received results:', data);
            setCandidates(data.candidates);
            calculateResults(data.candidates);
            setLastUpdate(new Date().toLocaleTimeString());
            setLoading(false);
        });

        socket.on('voteUpdate', (data) => {
            console.log('Vote update received:', data);
            fetchCandidates();
        });

        // Initial fetch
        fetchCandidates();

        return () => {
            socket.disconnect();
        };
    }, []);

    const fetchCandidates = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/getCandidate`);
            setCandidates(response.data.candidate);
            calculateResults(response.data.candidate);
            setLastUpdate(new Date().toLocaleTimeString());
            setLoading(false);
        } catch (error) {
            console.error('Error fetching candidates:', error);
            setLoading(false);
        }
    };

    const calculateResults = (candidatesData) => {
        const total = candidatesData.reduce((sum, candidate) => sum + (candidate.votes || 0), 0);
        setTotalVotes(total);

        // Group candidates by position
        const grouped = {};
        candidatesData.forEach(candidate => {
            const position = candidate.position || 'Other';
            if (!grouped[position]) {
                grouped[position] = [];
            }
            grouped[position].push(candidate);
        });

        // Sort each position's candidates by votes (descending)
        Object.keys(grouped).forEach(position => {
            grouped[position].sort((a, b) => (b.votes || 0) - (a.votes || 0));
        });

        setGroupedResults(grouped);
    };

    const pieData = Object.keys(groupedResults).map(position => {
        const positionVotes = groupedResults[position].reduce((sum, candidate) => sum + (candidate.votes || 0), 0);
        return {
            id: position,
            label: position,
            value: positionVotes
        };
    });

    const barData = Object.keys(groupedResults).map(position => {
        const positionVotes = groupedResults[position].reduce((sum, candidate) => sum + (candidate.votes || 0), 0);
        return {
            position: position,
            votes: positionVotes
        };
    });

    if (loading) {
        return (
            <div className="public-results-loading">
                <div className="loader"></div>
                <p>Loading voting results...</p>
            </div>
        );
    }

    return (
        <div className="public-results" style={{ background: bgThemes[bgTheme] }}>
            <div className="results-header">
                <div className="header-logo-section">
                    <img 
                        src="/school-logo.jpeg" 
                        alt="SUMAS Logo" 
                        className="school-logo"
                    />
                    <div className="header-text">
                        <h1>🗳️ Official SUG Election Results</h1>
                        <div className="university-info">
                            <p>University of Medical and Applied Sciences, Igbo-Eno</p>
                            <p className="published-by">Published by SUG Electoral Commission</p>
                        </div>
                    </div>
                </div>
                <div className="header-controls">
                    <div className="live-indicator">
                        <span className="live-dot"></span>
                        <span>LIVE</span>
                    </div>
                    <div className="last-update">
                        Last updated: {lastUpdate}
                    </div>
                    <button 
                        className="bg-switcher-btn" 
                        onClick={changeBackground}
                        title="Change Background Theme"
                    >
                        🎨 Change Theme
                    </button>
                </div>
            </div>

            <div className="results-stats">
                <div className="stat-card">
                    <h3>Total Votes Cast</h3>
                    <div className="stat-number">{totalVotes}</div>
                </div>
                <div className="stat-card">
                    <h3>Positions Contested</h3>
                    <div className="stat-number">{Object.keys(groupedResults).length}</div>
                </div>
                <div className="stat-card">
                    <h3>Total Candidates</h3>
                    <div className="stat-number">{candidates.length}</div>
                </div>
            </div>

            <div className="charts-container">
                <div className="chart-card">
                    <h2>Vote Distribution by Position</h2>
                    <div className="chart-wrapper">
                        {barData.length > 0 ? (
                            <ResponsiveBar
                                data={barData}
                                keys={["votes"]}
                                indexBy="position"
                                layout="horizontal"
                                margin={{ top: 10, right: 50, bottom: 50, left: 150 }}
                                padding={0.3}
                                valueScale={{ type: "linear" }}
                                indexScale={{ type: "band", round: true }}
                                colors={{ scheme: "set3" }}
                                borderColor={{
                                    from: "color",
                                    to: "color"
                                }}
                                axisTop={null}
                                axisRight={null}
                                axisBottom={{
                                    tickSize: 5,
                                    tickPadding: 5,
                                    tickRotation: 0,
                                    legend: "Votes",
                                    legendPosition: "middle",
                                    legendOffset: 40,
                                    tickTextColor: "#ffffff"
                                }}
                                axisLeft={{
                                    tickSize: 5,
                                    tickPadding: 5,
                                    tickRotation: 0,
                                    legend: "Position",
                                    legendPosition: "middle",
                                    legendOffset: -80,
                                    tickTextColor: "#ffffff"
                                }}
                                enableLabel={true}
                                labelSkipWidth={12}
                                labelSkipHeight={12}
                                labelTextColor="#ffffff"
                                label={(datum) => `${datum.value} votes`}
                                theme={{
                                    labels: {
                                        text: {
                                            fill: "#ffffff",
                                            fontSize: 12,
                                            fontWeight: 600
                                        }
                                    },
                                    axis: {
                                        ticks: {
                                            text: {
                                                fill: "#ffffff"
                                            }
                                        }
                                    }
                                }}
                            />
                        ) : (
                            <p className="no-data">No voting data available yet</p>
                        )}
                    </div>
                </div>

                <div className="chart-card">
                    <h2>Votes by Position</h2>
                    <div className="chart-wrapper">
                        {barData.length > 0 ? (
                            <ResponsiveBar
                                data={barData}
                                keys={["votes"]}
                                indexBy="position"
                                margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                                padding={0.3}
                                valueScale={{ type: "linear" }}
                                indexScale={{ type: "band", round: true }}
                                colors={{ scheme: "nivo" }}
                                borderColor={{
                                    from: "color",
                                    to: "color"
                                }}
                                axisTop={null}
                                axisRight={null}
                                axisBottom={{
                                    tickSize: 5,
                                    tickPadding: 5,
                                    tickRotation: 0,
                                    legend: "Position",
                                    legendPosition: "middle",
                                    legendOffset: 32,
                                    tickTextColor: "#ffffff"
                                }}
                                axisLeft={{
                                    tickSize: 5,
                                    tickPadding: 5,
                                    tickRotation: 0,
                                    legend: "Votes",
                                    legendPosition: "middle",
                                    legendOffset: -40,
                                    tickTextColor: "#ffffff"
                                }}
                                enableLabel={false}
                                labelSkipWidth={12}
                                labelSkipHeight={12}
                                labelTextColor={{
                                    from: "color",
                                    to: "color"
                                }}
                                legends={[
                                    {
                                        dataFrom: "keys",
                                        anchor: "bottom-right",
                                        direction: "column",
                                        justify: false,
                                        translateX: 120,
                                        translateY: 0,
                                        itemsSpacing: 2,
                                        itemWidth: 20,
                                        itemHeight: 20,
                                        itemDirection: "left-to-right",
                                        itemOpacity: 0.85,
                                        symbolSize: 20,
                                        effects: [
                                            {
                                                on: "hover",
                                                style: {
                                                    itemOpacity: 1
                                                }
                                            }
                                        ]
                                    }
                                ]}
                                theme={{
                                    labels: {
                                        text: {
                                            fill: "#ffffff"
                                        }
                                    },
                                    legends: {
                                        text: {
                                            fill: "#ffffff"
                                        }
                                    },
                                    axis: {
                                        ticks: {
                                            text: {
                                                fill: "#ffffff"
                                            }
                                        }
                                    }
                                }}
                            />
                        ) : (
                            <p className="no-data">No voting data available yet</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="position-results">
                <h2>Detailed Results by Position</h2>
                {sugPositions.map((position) => {
                    const positionCandidates = groupedResults[position] || [];
                    if (positionCandidates.length === 0) return null;

                    const positionTotal = positionCandidates.reduce((sum, candidate) => sum + (candidate.votes || 0), 0);
                    const winner = positionCandidates[0];

                    return (
                        <div key={position} className="position-result-card">
                            <div className="position-header">
                                <h3>{position}</h3>
                                <div className="position-total">
                                    Total Votes: {positionTotal}
                                </div>
                            </div>
                            
                            <div className="candidates-list">
                                {positionCandidates.map((candidate, index) => {
                                    const percentage = positionTotal > 0 
                                        ? ((candidate.votes || 0) / positionTotal * 100).toFixed(1) 
                                        : 0;
                                    
                                    return (
                                        <div key={candidate._id} className="candidate-result" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px', position: 'relative', minHeight: '100px' }}>
                                            <div className="candidate-rank">
                                                #{index + 1}
                                            </div>
                                            <div className="candidate-photo">
                                                <img 
                                                    src={candidate.photo || candidate.image || `https://via.placeholder.com/70?text=${candidate.fullName.charAt(0)}`}
                                                    alt={candidate.fullName}
                                                    style={{ width: '70px', height: '70px', borderRadius: '8px', objectFit: 'cover' }}
                                                />
                                            </div>
                                            <div className="candidate-info" style={{ flexGrow: 1 }}>
                                                <h4 style={{ margin: '0 0 0.5rem 0', color: '#ffffff', fontSize: '1.2rem', fontWeight: '600' }}>{candidate.fullName}</h4>
                                                <p className="department" style={{ margin: '0 0 0.5rem 0', color: '#e0e0e0', fontSize: '0.9rem' }}>{candidate.department}</p>
                                                {candidate.campaignSlogan && (
                                                    <p className="slogan" style={{ margin: 0, color: '#ff6f00', fontStyle: 'italic', fontSize: '0.85rem' }}>"{candidate.campaignSlogan}"</p>
                                                )}
                                            </div>
                                            <div className="candidate-votes" style={{ textAlign: 'right', minWidth: '100px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                                                <div className="vote-count" style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#00ff00', lineHeight: 1 }}>{candidate.votes || 0}</div>
                                                <div className="vote-percentage" style={{ fontSize: '0.9rem', color: '#e0e0e0' }}>{percentage}%</div>
                                            </div>
                                            <div className="vote-bar">
                                                <div 
                                                    className="vote-bar-fill" 
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {winner && positionTotal > 0 && (
                                <div className="winner-announcement">
                                    <span className="winner-label">🏆 Leading:</span>
                                    <span className="winner-name">{winner.fullName}</span>
                                    <span className="winner-votes">({winner.votes || 0} votes)</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="results-footer">
                <p>© 2026 SUG Electoral Commission - University of Medical and Applied Sciences, Igbo-Eno</p>
                <p>Official SUG Election Results | All times are Nigerian Standard Time (GMT+1)</p>
            </div>
        </div>
    );
};

export default PublicResults;