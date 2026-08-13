import { ResponsivePie } from "@nivo/pie";
import { tokens } from "../theme";
import { useTheme } from "@mui/material";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../../helper';


const VoterbyAge = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [levelData, setLevelData] = useState([]);

  const groupVotersByLevel = (voters) => {
    const levelGroups = {
      '100 Level': 0,
      '200 Level': 0,
      '300 Level': 0,
      '400 Level': 0,
      '500 Level': 0,
    };

    voters.forEach(voter => {
      if (levelGroups.hasOwnProperty(voter.level + ' Level')) {
        levelGroups[voter.level + ' Level']++;
      }
    });

    return Object.entries(levelGroups).map(([key, value]) => ({
      id: key,
      label: key,
      value: value,
    }));
  };
  useEffect(() => {
    const fetchVoterData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/getVoter`);
        console.log('VoterbyAge response:', response.data);
        const voterData = response.data.voter || [];
        const groupedData = groupVotersByLevel(voterData);
        console.log('Grouped level data:', groupedData);
        setLevelData(groupedData);
      } catch (err) {
        console.log("Error Fetching Data", err);
      }
    };

    fetchVoterData();
  }, []);
  return (
    levelData.length > 0 ? (
    <ResponsivePie
      data={levelData}
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
      margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
      innerRadius={0.5}
      padAngle={0.7}
      cornerRadius={3}
      activeOuterRadiusOffset={8}
      borderColor={{
        from: "color",
        modifiers: [["darker", 0.2]],
      }}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor={colors.grey[100]}
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: "color" }}
      enableArcLabels={false}
      arcLabelsRadiusOffset={0.4}
      arcLabelsSkipAngle={7}
      arcLabelsTextColor={{
        from: "color",
        modifiers: [["darker", 2]],
      }}
      defs={[
        {
          id: "dots",
          type: "patternDots",
          background: "inherit",
          color: "rgba(255, 255, 255, 0.3)",
          size: 4,
          padding: 1,
          stagger: true,
        },
        {
          id: "lines",
          type: "patternLines",
          background: "inherit",
          color: "rgba(255, 255, 255, 0.3)",
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
    />
    ) : (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '300px',
        color: colors.grey[100] 
      }}>
        No voter data available
      </div>
    )
    
  );
};

export default VoterbyAge;