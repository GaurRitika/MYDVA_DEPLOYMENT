// src/components/ExpertTalk/ExpertList.jsx
import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Rating,
  Box,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Avatar,
  Divider,
  Alert
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn,
  Language,
  AccessTime,
} from '@mui/icons-material';

const experts = [
  {
    id: 1,
    name: "Dr. Ayush Sharma",
    specialization: "Vata Dosha Specialist",
    experience: "15+ years",
    rating: 4.8,
    reviewCount: 128,
    image: "https://example.com/expert1.jpg",
    availability: "Available Now",
    languages: ["English", "Hindi", "Sanskrit"],
    location: "New Delhi, India",
    consultationFee: "USD 50",
    expertise: ["Panchakarma", "Pulse Diagnosis", "Herbal Medicine"],
    nextAvailable: "Today",
    description: "Specializing in Vata dosha management and chronic condition treatment through traditional Ayurvedic methods."
  },
  {
    id: 2,
    name: "Dr. Priya Patel",
    specialization: "Pitta Dosha Expert",
    experience: "12+ years",
    rating: 4.7,
    reviewCount: 95,
    image: "https://example.com/expert2.jpg",
    availability: "Next Available: 2 PM",
    languages: ["English", "Gujarati", "Hindi"],
    location: "Mumbai, India",
    consultationFee: "USD 45",
    expertise: ["Diet Planning", "Stress Management", "Women's Health"],
    nextAvailable: "Tomorrow",
    description: "Expert in Pitta imbalance disorders and modern lifestyle disease management through Ayurveda."
  },
  // Add more experts as needed
];

const ExpertList = ({ onExpertSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredExperts, setFilteredExperts] = useState(experts);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    
    const filtered = experts.filter(expert => 
      expert.name.toLowerCase().includes(query) ||
      expert.specialization.toLowerCase().includes(query) ||
      expert.expertise.some(skill => skill.toLowerCase().includes(query)) ||
      expert.languages.some(lang => lang.toLowerCase().includes(query))
    );
    
    setFilteredExperts(filtered);
  };

  return (
    <Box>
      <Alert severity="info" sx={{ mb: 3 }}>
        This is a demo version with simulated experts. Try the demo video call feature to test the consultation experience.
      </Alert>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search by name, specialization, expertise, or language..."
        value={searchQuery}
        onChange={handleSearch}
        sx={{ mb: 4 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconButton>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Grid container spacing={3}>
        {filteredExperts.map((expert) => (
          <Grid item xs={12} md={6} lg={4} key={expert.id}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                }
              }}
            >
              <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                <Avatar
                  src={expert.image}
                  sx={{ width: 80, height: 80 }}
                  alt={expert.name}
                />
                <Box sx={{ ml: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    {expert.name}
                  </Typography>
                  <Typography color="textSecondary" variant="subtitle2">
                    {expert.specialization}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Rating value={expert.rating} precision={0.1} readOnly size="small" />
                    <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                      ({expert.reviewCount} reviews)
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Divider />

              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <AccessTime sx={{ fontSize: 20, mr: 1 }} />
                    Experience: {expert.experience}
                  </Typography>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOn sx={{ fontSize: 20, mr: 1 }} />
                    {expert.location}
                  </Typography>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                    <Language sx={{ fontSize: 20, mr: 1 }} />
                    {expert.languages.join(", ")}
                  </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary" paragraph>
                  {expert.description}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  {expert.expertise.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      size="small"
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                  ))}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                  <Typography variant="h6" color="primary">
                    {expert.consultationFee}
                  </Typography>
                  <Chip
                    label={expert.nextAvailable}
                    color={expert.nextAvailable === 'Today' ? 'success' : 'primary'}
                    size="small"
                  />
                </Box>
              </CardContent>

              <Box sx={{ p: 2, pt: 0 }}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => onExpertSelect(expert)}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1rem',
                    mb: 1
                  }}
                >
                  Book Consultation
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => onExpertSelect({ ...expert, isDemoCall: true })}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1rem'
                  }}
                >
                  Try Demo Call
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ExpertList;
