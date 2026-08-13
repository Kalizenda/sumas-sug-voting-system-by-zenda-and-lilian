import { useTheme, CircularProgress, Typography, Box } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { tokens } from "../theme";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from "../../../helper";
import io from 'socket.io-client';

const BarChart = ({ isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [candidate, setCandidate] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    const fetchCandidates = () => {
      setLoading(true);
      axios.get(`${BASE_URL}/getCandidate`)
        .then((response) => {
          console.log('Candidates data:', response.data);
          setCandidate(response.data.candidate || []);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching data: ", err);
          setLoading(false);
        });
    };

    fetchCandidates();

    // Socket.io connection for real-time updates
    const socket = io('http://localhost:5002');
    
    socket.on('voteUpdate', () => {
      console.log('Vote update received, refreshing chart');
      fetchCandidates();
    });

    socket.on('currentResults', (data) => {
      console.log('Current results received:', data);
      if (data.candidates) {
        setCandidate(data.candidates);
        setLoading(false);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [])

  const data = candidate.reduce((acc, candidated) => {
    if (candidated) {
      // Merge fullName with position
      const nameWithPosition = candidated.fullName 
        ? (candidated.position ? `${candidated.fullName} (${candidated.position})` : candidated.fullName)
        : (candidated.position || 'Unknown');
      
      const groupIndex = acc.findIndex(item => item.name === nameWithPosition);
      if (groupIndex > -1) {
        acc[groupIndex].votes += (candidated.votes || 0);
      } else {
        acc.push({ name: nameWithPosition, votes: candidated.votes || 0 });
      }
    }
    return acc;
  }, []);

  return (
    loading ? (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress />
      </Box>
    ) : data.length === 0 ? (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <Typography variant="h6" color={colors.grey[100]}>
          No candidates or votes yet. Results will appear here once candidates are added and voting begins.
        </Typography>
      </Box>
    ) : (
    <ResponsiveBar
      data={data}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: colors.grey[100],
            },
          },
          legend: {
            text: {
              fill: colors.grey[100],
            },
          },
          ticks: {
            line: {
              stroke: colors.grey[100],
              strokeWidth: 1,
            },
            text: {
              fill: colors.grey[100],
            },
          },
        },
        legends: {
          text: {
            fill: colors.grey[100],
          },
        },
      }}
      keys={["votes"]}
      indexBy="name"      
      margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
      padding={0.5}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={{ scheme: "dark2" }}
      defs={[
        {
          id: "dots",
          type: "patternDots",
          background: "inherit",
          color: "#38bcb2",
          size: 4,
          padding: 1,
          stagger: true,
        },
        {
          id: "lines",
          type: "patternLines",
          background: "inherit",
          color: "#eed312",
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
      borderColor={{
        from: "color",
        modifiers: [["darker", "1.6"]],
      }}
      
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "Candidates",
        legendPosition: "middle",
        legendOffset: 32,
      }}
      axisLeft={{
        tickSize: 8,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "Votes",
        legendPosition: "middle",
        legendOffset: -40,
      }}
      enableLabel={false}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{
        from: "color",
        modifiers: [["darker", 1.6]],
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
          itemWidth: 50,
          itemHeight: 20,
          itemDirection: "left-to-right",
          itemOpacity: 0.85,
          symbolSize: 20,
          effects: [
            {
              on: "hover",
              style: {
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
      role="application"
      barAriaLabel={function (e) {
        return e.id + ": " + e.formattedValue + " votes for candidate: " + e.indexValue;
      }}

    />
    )
  );
};

export default BarChart;