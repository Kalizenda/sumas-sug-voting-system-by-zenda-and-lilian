import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { mockDataTeam } from "../../data/mockData";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "../../theme";
import {
    Box,
    List,
    ListItem,
    ListItemText,
    Typography,
    useTheme,
} from "@mui/material";
import Header from "../../newComponents/Header";
import Topbar from "../global/Topbar";
import Sidebar from "../global/Sidebar";
import { tokens } from "../../theme";
import ThemeSwitcher from '../../../ThemeSwitcher/ThemeSwitcher';
import { useTheme as useCustomTheme } from '../../../../context/ThemeContext';

const Calendar = () => {
    const formatDate = (date) => {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    };

    const getCurrentDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const getSpecificDate = (year, month, day) => {
        const date = new Date(year, month - 1, day);
        return date.toISOString().split('T')[0];
    };

    const getFutureDate = (days) => {
        const date = new Date();
        date.setDate(date.getDate() + days);
        return date.toISOString().split('T')[0];
    };

    const [theme, colorMode] = useMode();
    const colors = tokens(theme.palette.mode);
    const { currentTheme } = useCustomTheme();
    const [currentEvents, setCurrentEvents] = useState([]);

    const handleDateClick = (selected) => {
        const title = prompt("Please enter a new title for your event");
        const calendarApi = selected.view.calendar;
        calendarApi.unselect();

        if (title) {
            calendarApi.addEvent({
                id: `${selected.dateStr}-${title}`,
                title,
                start: selected.startStr,
                end: selected.endStr,
                allDay: selected.allDay,
            });
        }
    };

    const handleEventClick = (selected) => {
        if (
            window.confirm(
                `Are you sure you want to delete the event '${selected.event.title}'`
            )
        ) {
            selected.event.remove();
        }
    };
    const renderEventContent = (eventInfo) => {
        return (
            <div style={{ color: 'white', textDecoration: 'none' }}>
                <b>{eventInfo.timeText}</b>
                <i>{eventInfo.event.title}</i>
            </div>
        );
    };

    return (<ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <div className="appNew fade-in">
                <Sidebar />
                <main className="content">
                    <Topbar />
                    <Box m="20px">
                        <Header title="Calendar" subtitle="Full Calendar Interactive Page" />

                        <Box display="flex" justifyContent="space-between">
                            {/* CALENDAR SIDEBAR */}
                            <Box
                                flex="1 1 20%"
                                backgroundColor={colors.primary[400]}
                                p="20px"
                                borderRadius="16px"
                                boxShadow="0 4px 20px rgba(0, 0, 0, 0.15)"
                                className="fade-in-up stagger-1"
                                sx={{
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.25)'
                                    }
                                }}
                            >
                                <Typography variant="h5" fontWeight="600" color={colors.grey[100]} mb="15px">
                                    Events
                                </Typography>
                                <List>
                                    {currentEvents.map((event) => (
                                        <ListItem
                                            key={event.id}
                                            sx={{
                                                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                                                backdropFilter: 'blur(10px)',
                                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                                margin: "10px 0",
                                                borderRadius: "12px",
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 215, 0, 0.1))',
                                                    transform: 'translateX(5px)'
                                                }
                                            }}
                                            className="hover-lift"
                                        >
                                            <ListItemText
                                                primary={
                                                    <Typography fontWeight="600" color={colors.greenAccent[500]}>
                                                        {event.title}
                                                    </Typography>
                                                }
                                                secondary={
                                                    <Typography color={colors.grey[200]}>
                                                        {formatDate(event.start, {
                                                            year: "numeric",
                                                            month: "short",
                                                            day: "numeric",
                                                        })}
                                                    </Typography>
                                                }
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>

                            {/* CALENDAR */}
                            <Box 
                                flex="1 1 100%" 
                                ml="20px" 
                                className="fade-in-up stagger-2"
                                sx={{
                                    background: currentTheme.background,
                                    borderRadius: '16px',
                                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                                    padding: '20px',
                                    transition: 'all 0.5s ease',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.25)'
                                    }
                                }}
                            >
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb="15px">
                                    <Typography variant="h6" fontWeight="600" color={colors.grey[100]}>
                                        Calendar View
                                    </Typography>
                                    <ThemeSwitcher position="inline" />
                                </Box>
                                <Box
                                    sx={{
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        backdropFilter: 'blur(10px)',
                                        borderRadius: '12px',
                                        padding: '15px',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        transition: 'all 0.5s ease',
                                    }}
                                >
                                    <FullCalendar
                                    height="75vh"
                                    plugins={[
                                        dayGridPlugin,
                                        timeGridPlugin,
                                        interactionPlugin,
                                        listPlugin,
                                    ]}
                                    headerToolbar={{
                                        left: "prev,next today",
                                        center: "title",
                                        right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
                                    }}
                                    initialView="dayGridMonth"
                                    editable={true}
                                    selectable={true}
                                    selectMirror={true}
                                    dayMaxEvents={true}
                                    select={handleDateClick}
                                    eventClick={handleEventClick}
                                    eventsSet={(events) => setCurrentEvents(events)}
                                    eventContent={renderEventContent} 
                                    initialEvents={[
                                        {
                                            id: "5123",
                                            title: "Timed event",
                                            date: getSpecificDate(2026, 9, 28),
                                        },
                                        {
                                            id: "5124",
                                            title: "Voting Period Starts",
                                            date: getSpecificDate(2026, 10, 5),
                                        },
                                        {
                                            id: "5125",
                                            title: "Candidate Registration Deadline",
                                            date: getSpecificDate(2026, 10, 12),
                                        },
                                        {
                                            id: "5126",
                                            title: "Election Day",
                                            date: getSpecificDate(2026, 10, 19),
                                        },
                                    ]}
                                    dayCellClassNames={() => 'custom-day-cell'}
                                />
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </main>
            </div>
            <style>
                {`
                    h2{
                        color:white;
                    }
                    a {
                        color: white;
                        text-decoration: none;
                    }
                    .custom-day-cell .fc-daygrid-day-top {
                        color: white;
                        text-decoration: none;
                    }
                    .fc-theme-standard td, .fc-theme-standard th {
                        border-color: rgba(255, 255, 255, 0.1);
                    }
                    .fc-daygrid-day-number {
                        color: white;
                    }
                    .fc-col-header-cell-cushion {
                        color: white;
                    }
                    .fc-toolbar-title {
                        color: white;
                    }
                    .fc-button {
                        background: rgba(255, 255, 255, 0.1);
                        border: 1px solid rgba(255, 255, 255, 0.2);
                        color: white;
                    }
                    .fc-button:hover {
                        background: rgba(255, 255, 255, 0.2);
                    }
                    .fc-event {
                        background: rgba(255, 215, 0, 0.8);
                        border: none;
                    }
                    `}
            </style>
        </ThemeProvider>
    </ColorModeContext.Provider>

    )
};

export default Calendar;
