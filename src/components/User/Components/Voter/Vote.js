import './Vote.css';
import UserNavbar from '../../../Navbar/UserNavbar';
import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import ScrollReveal from "scrollreveal";
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import { BASE_URL } from '../../../../helper';
import Cookies from 'js-cookie';
import io from 'socket.io-client';
import { Card, CardContent, CardMedia, Typography, Chip, Grid, Alert } from '@mui/material';
import ThemeSwitcher from '../../../ThemeSwitcher/ThemeSwitcher';
import { useTheme } from '../../../../context/ThemeContext';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'rgb(255, 255, 255)',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        color: theme.palette.common.white,
        fontSize: 16,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

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

export default function CustomizedTables() {
    const { currentTheme } = useTheme();
    const revealRefBottom = useRef(null);
    const revealRefLeft = useRef(null);
    const revealRefTop = useRef(null);
    const revealRefRight = useRef(null);

    const [candidate, setCandidate] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [groupedCandidates, setGroupedCandidates] = useState({});
    const [voter, setVoter] = useState({});
    const [loading, setLoading] = useState(true);
    const [electionActive, setElectionActive] = useState(true);
    const [votedPositions, setVotedPositions] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const voterid = Cookies.get('myCookie');

    useEffect(() => {
        // Socket.io connection for real-time updates
        const socket = io('http://localhost:5002');
        
        socket.on('voteUpdate', (data) => {
            console.log('Vote update received:', data);
            setCandidates(prevCandidates => 
                prevCandidates.map(c => 
                    c._id === data.candidateId 
                        ? { ...c, votes: data.votes } 
                        : c
                )
            );
        });

        socket.on('currentResults', (data) => {
            console.log('Current results received:', data);
            if (data.candidates) {
                setCandidate(data.candidates);
                setCandidates(data.candidates);
                groupCandidatesByPosition(data.candidates);
            }
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        const fetchVoterData = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/getVoter/${voterid}`);
                setVoter(response.data.voter);
                setVotedPositions(response.data.voter?.votedPositions || []);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching voter data:', error);
                setLoading(false);
            }
        };

        const fetchCandidates = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/getCandidate`);
                setCandidate(response.data.candidate);
                setCandidates(response.data.candidate);
                groupCandidatesByPosition(response.data.candidate);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching candidates:', error);
                setLoading(false);
            }
        };

        const checkElectionStatus = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/election/active`);
                setElectionActive(!!response.data.election);
            } catch (error) {
                console.error('Error checking election status:', error);
            }
        };

        if (voterid) {
            fetchVoterData();
            fetchCandidates();
            checkElectionStatus();
        }
    }, [voterid]);

    const groupCandidatesByPosition = (candidatesData) => {
        const grouped = {};
        candidatesData.forEach(cand => {
            const position = cand.position || 'Other';
            if (!grouped[position]) {
                grouped[position] = [];
            }
            grouped[position].push(cand);
        });
        setGroupedCandidates(grouped);
    };

    const handleVote = async (candidateId, position) => {
        if (!electionActive) {
            alert('Election is not currently active');
            return;
        }

        if (votedPositions.includes(position)) {
            alert(`You have already voted for ${position}`);
            return;
        }

        if (voter.voteStatus) {
            alert("You Have Already Voted");
            return;
        }

        try {
            console.log('Attempting to vote:', { candidateId, position, voterid, voter });
            
            const response = await axios.patch(`${BASE_URL}/getCandidate/${candidateId}`, {
                voterId: voterid,
                position: position
            });
            
            console.log('Vote response:', response.data);
            
            if (response.data.success) {
                setVotedPositions([...votedPositions, position]);
                setVoter({ ...voter, voteStatus: true });
                setSuccessMessage(`You have successfully voted for ${response.data.candidate.fullName} for ${position}!`);
                
                // Update local state
                setCandidates(prevCandidates => 
                    prevCandidates.map(c => 
                        c._id === candidateId 
                            ? { ...c, votes: response.data.votes } 
                            : c
                    )
                );
            } else {
                alert('Vote failed: ' + (response.data.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error casting vote:', error);
            console.error('Error response:', error.response?.data);
            alert('Error casting vote: ' + (error.response?.data?.message || error.message || 'Please try again.'));
        }
    };

    const handleClose = () => {
        setSuccessMessage('');
    };

    if (loading) {
        return (
            <div className="vote-container">
                <UserNavbar />
                <div className="loading">
                    <div className="spinner"></div>
                    <p>Loading voting interface...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="vote-container" style={{ background: currentTheme.background, minHeight: '100vh', transition: 'background 0.5s ease' }}>
            <UserNavbar />
            <ThemeSwitcher position="top-right" />
            
            <div className="vote-header">
                <h1>SUG Election Voting</h1>
                <p>University of Medical and Applied Sciences, Igbo-Eno</p>
                {!electionActive && (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        Election is not currently active. Please check back later.
                    </Alert>
                )}
                {successMessage && (
                    <Alert severity="success" onClose={handleClose} sx={{ mb: 2 }}>
                        {successMessage}
                    </Alert>
                )}
            </div>

            <div className="voting-section">
                {sugPositions.map((position, index) => {
                    const positionCandidates = groupedCandidates[position] || [];
                    const hasVotedForPosition = votedPositions.includes(position);
                    
                    if (positionCandidates.length === 0) return null;

                    return (
                        <div key={position} className="position-section" ref={index === 0 ? revealRefTop : undefined}>
                            <h2 className="position-title">{position}</h2>
                            <p className="position-description">
                                {hasVotedForPosition ? 
                                    `✓ You have voted for ${position}` : 
                                    'Select your preferred candidate below'
                                }
                            </p>
                            
                            <Grid container spacing={3} className="candidates-grid">
                                {positionCandidates.map((candidate) => (
                                    <Grid item xs={12} sm={6} md={4} key={candidate._id}>
                                        <Card 
                                            className="candidate-card" 
                                            sx={{ 
                                                borderRadius: 0,
                                                backgroundColor: 'rgba(255, 215, 0, 0.15)',
                                                border: '2px solid rgba(255, 215, 0, 0.4)'
                                            }}
                                        >
                                            <CardMedia
                                                component="img"
                                                height="400"
                                                image={candidate.photo || candidate.image || `https://via.placeholder.com/200?text=${candidate.fullName}`}
                                                alt={candidate.fullName}
                                                className="candidate-photo"
                                                sx={{ borderRadius: 0 }}
                                            />
                                            <CardContent>
                                                <Typography gutterBottom variant="h5" component="div" className="candidate-name">
                                                    {candidate.fullName}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" className="candidate-department">
                                                    {candidate.department}
                                                </Typography>
                                                <Chip 
                                                    label={candidate.position}
                                                    size="small"
                                                    className="position-chip"
                                                    color="primary"
                                                />
                                                <Typography variant="body2" className="candidate-manifesto" sx={{ mt: 2 }}>
                                                    {candidate.manifesto ? 
                                                        candidate.manifesto.substring(0, 150) + '...' : 
                                                        candidate.bio
                                                    }
                                                </Typography>
                                                {candidate.campaignSlogan && (
                                                    <Typography variant="caption" display="block" className="campaign-slogan">
                                                        "{candidate.campaignSlogan}"
                                                    </Typography>
                                                )}
                                                <Button
                                                    variant="contained"
                                                    fullWidth
                                                    className="vote-button"
                                                    onClick={() => handleVote(candidate._id, position)}
                                                    disabled={!electionActive || hasVotedForPosition || voter.voteStatus}
                                                    sx={{ mt: 2 }}
                                                >
                                                    {hasVotedForPosition ? 'Voted' : 'Vote'}
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </div>
                    );
                })}
            </div>

            {Object.keys(groupedCandidates).length === 0 && (
                <div className="no-candidates">
                    <p>No candidates are currently registered for the election.</p>
                </div>
            )}
        </div>
    );
}