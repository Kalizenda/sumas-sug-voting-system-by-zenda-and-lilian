import { Box, IconButton, useTheme } from "@mui/material";
import { useContext, useState } from "react";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from 'react-router-dom';
import ThemeSwitcher from '../../../ThemeSwitcher/ThemeSwitcher';

const Topbar = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const colorMode = useContext(ColorModeContext);
    const [redirectToHome, setRedirectToHome] = useState(false);
    

    const handleLogout = () => {
        setRedirectToHome(true);
    };

    if (redirectToHome) {
        navigate('/');
    }


    return (
        <Box 
            display="flex" 
            justifyContent="space-between" 
            p={2}
            sx={{
                background: 'linear-gradient(135deg, #1a5f2a 0%, #008751 50%, #1e3a5f 100%)',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                mb: 2
            }}
        >
            {/* Search Bar */}
            <Box 
                display="flex" 
                backgroundColor="rgba(255, 255, 255, 0.1)" 
                borderRadius="25px"
                sx={{
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)'
                }}
            >
                <InputBase 
                    sx={{ 
                        ml: 2, 
                        flex: 1,
                        color: 'white',
                        '& .MuiInputBase-input::placeholder': {
                            color: 'rgba(255, 255, 255, 0.7)'
                        }
                    }} 
                    placeholder="Search..." 
                />
                <IconButton type="Button" sx={{ p: 1, color: '#ffd700' }}>
                    <SearchIcon />
                </IconButton>
            </Box>
            <Box display="flex" gap={1} alignItems="center">
                <ThemeSwitcher position="inline" />
                <IconButton 
                    onClick={colorMode.toggleColorMode}
                    sx={{ 
                        color: 'white',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            backgroundColor: 'rgba(255, 215, 0, 0.2)',
                            transform: 'scale(1.1)'
                        }
                    }}
                >
                    {theme.palette.mode === "dark" ? (
                        <DarkModeOutlinedIcon />
                    ) : (
                        <LightModeOutlinedIcon />
                    )}
                </IconButton>
                <IconButton 
                    sx={{ 
                        color: 'white',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            backgroundColor: 'rgba(255, 215, 0, 0.2)',
                            transform: 'scale(1.1)'
                        }
                    }}
                >
                    <NotificationsOutlinedIcon />
                </IconButton>
                <IconButton 
                    sx={{ 
                        color: 'white',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            backgroundColor: 'rgba(255, 215, 0, 0.2)',
                            transform: 'scale(1.1)'
                        }
                    }}
                >
                    <SettingsOutlinedIcon />
                </IconButton>
                <IconButton 
                    onClick={handleLogout}
                    sx={{ 
                        color: '#ffd700',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            backgroundColor: 'rgba(255, 215, 0, 0.3)',
                            transform: 'scale(1.1)'
                        }
                    }}
                >
                    <LogoutOutlinedIcon />
                </IconButton>
            </Box>
        </Box>
    )
}

export default Topbar;