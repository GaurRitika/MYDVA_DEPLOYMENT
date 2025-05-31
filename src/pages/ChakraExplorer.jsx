// // src/pages/ChakraExplorer.jsx
// import React from 'react';
// import { Box, Typography } from '@mui/material';
// import { chakraData } from '../data/chakraData';
// import { useNavigate } from 'react-router-dom';

// const ChakraExplorer = () => {
//   const navigate = useNavigate();

//   const handleChakraClick = (chakraId) => {
//     navigate(`/dashboard/chakra/${chakraId}`);
//   };

//   return (
//     <Box sx={{ p: 4 }}>
//       <Typography variant="h4" gutterBottom>
//         Chakra Explorer
//       </Typography>
//       <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
//         {chakraData.map((chakra) => (
//           <Box
//             key={chakra.id}
//             onClick={() => handleChakraClick(chakra.id)}
//             sx={{
//               p: 3,
//               borderRadius: 2,
//               bgcolor: 'background.paper',
//               cursor: 'pointer',
//               display: 'flex',
//               alignItems: 'center',
//               gap: 2,
//               '&:hover': {
//                 transform: 'translateX(10px)',
//                 boxShadow: 3,
//                 transition: 'all 0.3s ease'
//               }
//             }}
//           >
//             <Box
//               sx={{
//                 width: 50,
//                 height: 50,
//                 borderRadius: '50%',
//                 bgcolor: chakra.color
//               }}
//             />
//             <Box>
//               <Typography variant="h6">{chakra.name}</Typography>
//               <Typography variant="body2" color="text.secondary">
//                 {chakra.description}
//               </Typography>
//             </Box>
//           </Box>
//         ))}
//       </Box>
//     </Box>
//   );
// };

// export default ChakraExplorer;
// src/pages/ChakraExplorer.jsx
import React from 'react';
import ChakraHumanBody from '../components/chakra/ChakraHumanBody';

const ChakraExplorer = () => {
  return <ChakraHumanBody />;
};

export default ChakraExplorer;

