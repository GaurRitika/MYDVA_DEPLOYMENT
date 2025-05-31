// import React from 'react';
// import {
//   Paper,
//   Typography,
//   Box,
//   Grid,
//   LinearProgress,
//   Divider,
//   Button
// } from '@mui/material';
// import { useNavigate } from 'react-router-dom';

// const DoshaDescriptions = {
//   vata: {
//     title: "Vata (Air & Space)",
//     traits: [
//       "Quick thinking and adaptable",
//       "Creative and enthusiastic",
//       "Light and agile in movement",
//       "Variable energy and appetite"
//     ]
//   },
//   pitta: {
//     title: "Pitta (Fire & Water)",
//     traits: [
//       "Intelligent and sharp-minded",
//       "Goal-oriented and organized",
//       "Strong digestion and metabolism",
//       "Natural leaders with strong will"
//     ]
//   },
//   kapha: {
//     title: "Kapha (Earth & Water)",
//     traits: [
//       "Patient and thoughtful",
//       "Calm and steady",
//       "Strong and enduring",
//       "Nurturing and supportive"
//     ]
//   }
// };

// const Results = ({ results }) => {
//   const navigate = useNavigate();

//   const getDoshaColor = (dosha) => {
//     const colors = {
//       vata: '#9C27B0',
//       pitta: '#F44336',
//       kapha: '#4CAF50'
//     };
//     return colors[dosha] || '#000';
//   };

//   return (
//     <Paper elevation={3} sx={{ p: 4 }}>
//       <Typography variant="h4" gutterBottom align="center">
//         Your Dosha Analysis Results
//       </Typography>

//       <Box sx={{ mt: 4 }}>
//         <Grid container spacing={3}>
//           {['vata', 'pitta', 'kapha'].map((dosha) => (
//             <Grid item xs={12} md={4} key={dosha}>
//               <Box sx={{ p: 2, textAlign: 'center' }}>
//                 <Typography variant="h6" gutterBottom>
//                   {dosha.toUpperCase()}
//                 </Typography>
//                 <Box sx={{ position: 'relative', pt: 1 }}>
//                   <LinearProgress
//                     variant="determinate"
//                     value={results[`${dosha}_percentage`]}
//                     sx={{
//                       height: 10,
//                       borderRadius: 5,
//                       backgroundColor: '#eee',
//                       '& .MuiLinearProgress-bar': {
//                         backgroundColor: getDoshaColor(dosha)
//                       }
//                     }}
//                   />
//                   <Typography
//                     variant="body2"
//                     sx={{ mt: 1 }}
//                   >
//                     {`${Math.round(results[`${dosha}_percentage`])}%`}
//                   </Typography>
//                 </Box>
//               </Box>
//             </Grid>
//           ))}
//         </Grid>
//       </Box>

//       <Divider sx={{ my: 4 }} />

//       <Box sx={{ mt: 4 }}>
//         <Typography variant="h5" gutterBottom>
//           Your Primary Dosha: {results.primary_dosha.toUpperCase()}
//         </Typography>
//         <Box sx={{ mt: 2 }}>
//           {DoshaDescriptions[results.primary_dosha].traits.map((trait, index) => (
//             <Typography key={index} paragraph>
//               • {trait}
//             </Typography>
//           ))}
//         </Box>
//       </Box>

//       {results.secondary_dosha && (
//         <Box sx={{ mt: 4 }}>
//           <Typography variant="h5" gutterBottom>
//             Secondary Influence: {results.secondary_dosha.toUpperCase()}
//           </Typography>
//           <Box sx={{ mt: 2 }}>
//             {DoshaDescriptions[results.secondary_dosha].traits.map((trait, index) => (
//               <Typography key={index} paragraph>
//                 • {trait}
//               </Typography>
//             ))}
//           </Box>
//         </Box>
//       )}

//       <Box sx={{ mt: 4 }}>
//         <Typography variant="h5" gutterBottom>
//           Next Steps
//         </Typography>
//         <Typography paragraph>
//           Based on your Dosha analysis, we recommend getting a personalized consultation
//           to receive specific recommendations for your constitution.
//         </Typography>
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={() => navigate('/consultation')}
//           sx={{ mt: 2 }}
//         >
//           Get Personalized Consultation
//         </Button>
//       </Box>
//     </Paper>
//   );
// };

// export default Results;

import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Grid,
  LinearProgress,
  Divider,
  Button,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const DoshaDescriptions = {
  vata: {
    title: "Vata (Air & Space)",
    traits: [
      "Quick thinking and adaptable",
      "Creative and enthusiastic",
      "Light and agile in movement",
      "Variable energy and appetite"
    ]
  },
  pitta: {
    title: "Pitta (Fire & Water)",
    traits: [
      "Intelligent and sharp-minded",
      "Goal-oriented and organized",
      "Strong digestion and metabolism",
      "Natural leaders with strong will"
    ]
  },
  kapha: {
    title: "Kapha (Earth & Water)",
    traits: [
      "Patient and thoughtful",
      "Calm and steady",
      "Strong and enduring",
      "Nurturing and supportive"
    ]
  }
};

const Results = ({ results }) => {
  const navigate = useNavigate();

  const getDoshaColor = (dosha) => {
    const colors = {
      vata: '#9C27B0',
      pitta: '#F44336',
      kapha: '#4CAF50'
    };
    return colors[dosha] || '#000';
  };

  const analyzeDoshaBalance = () => {
    const vata = results.vata_percentage;
    const pitta = results.pitta_percentage;
    const kapha = results.kapha_percentage;
    
    // Calculate deviation from ideal balance (33.33% each)
    const deviation = Math.max(
      Math.abs(vata - 33.33),
      Math.abs(pitta - 33.33),
      Math.abs(kapha - 33.33)
    );

    // Determine balance status and message
    if (deviation <= 10) {
      return {
        status: 'balanced',
        message: 'Your doshas are well-balanced, indicating good overall health and harmony.',
        severity: 'success'
      };
    } else if (deviation <= 20) {
      return {
        status: 'slightly-imbalanced',
        message: `Your doshas show a slight imbalance with elevated ${results.primary_dosha.toUpperCase()}. Minor lifestyle adjustments may be beneficial.`,
        severity: 'info'
      };
    } else {
      return {
        status: 'imbalanced',
        message: `Your doshas show a significant ${results.primary_dosha.toUpperCase()} predominance. Focused lifestyle and dietary changes are recommended.`,
        severity: 'warning'
      };
    }
  };

  const balanceAnalysis = analyzeDoshaBalance();

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Your Dosha Analysis Results
      </Typography>

      {/* Dosha Balance Status */}
      <Box sx={{ mt: 3, mb: 4 }}>
        <Alert 
          severity={balanceAnalysis.severity}
          sx={{ 
            '& .MuiAlert-message': { 
              fontSize: '1rem' 
            }
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
            Dosha Balance Status: {balanceAnalysis.status.split('-').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ')}
          </Typography>
          {balanceAnalysis.message}
        </Alert>
      </Box>

      {/* Dosha Percentages */}
      <Box sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          {['vata', 'pitta', 'kapha'].map((dosha) => (
            <Grid item xs={12} md={4} key={dosha}>
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  {dosha.toUpperCase()}
                </Typography>
                <Box sx={{ position: 'relative', pt: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={results[`${dosha}_percentage`]}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: '#eee',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: getDoshaColor(dosha)
                      }
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ mt: 1 }}
                  >
                    {`${Math.round(results[`${dosha}_percentage`])}%`}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Primary Dosha */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Your Primary Dosha: {results.primary_dosha.toUpperCase()}
        </Typography>
        <Box sx={{ mt: 2 }}>
          {DoshaDescriptions[results.primary_dosha].traits.map((trait, index) => (
            <Typography key={index} paragraph>
              • {trait}
            </Typography>
          ))}
        </Box>
      </Box>

      {/* Secondary Dosha (if present) */}
      {results.secondary_dosha && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Secondary Influence: {results.secondary_dosha.toUpperCase()}
          </Typography>
          <Box sx={{ mt: 2 }}>
            {DoshaDescriptions[results.secondary_dosha].traits.map((trait, index) => (
              <Typography key={index} paragraph>
                • {trait}
              </Typography>
            ))}
          </Box>
        </Box>
      )}

      {/* Next Steps */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Next Steps
        </Typography>
        <Typography paragraph>
          Based on your Dosha analysis, we recommend getting a personalized consultation
          to receive specific recommendations for your constitution and balance status.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/consultation')}
          sx={{ mt: 2 }}
        >
          Get Personalized Consultation
        </Button>
      </Box>
    </Paper>
  );
};

export default Results;
