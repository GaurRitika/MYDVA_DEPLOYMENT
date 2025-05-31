

import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Grid,

  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import {
  LocalDining,
  DirectionsRun,
  Spa,
  Healing,
  Assessment,
  Psychology,
  
  NaturePeople,
  MonitorHeart,
  SaveAlt,
  InfoOutlined,
  SummarizeOutlined,
} from '@mui/icons-material';

const ConsultationResults = ({ results, doshaProfile }) => {
  const parseRecommendations = (text) => {
    if (!text) {
      console.error('No recommendations text provided.');
      return {};
    }
  
    // Parse JSON if needed
    let parsedText = text;
    try {
      if (typeof text === 'string' && text.startsWith('{')) {
        const parsed = JSON.parse(text);
        if (parsed.recommendations) {
          parsedText = parsed.recommendations;
        }
      }
    } catch (error) {
      console.error('Error parsing JSON:', error);
    }
  
    // Convert array to string if needed
    if (Array.isArray(parsedText)) {
      parsedText = parsedText.join('\n');
    }
  
    const sections = {
      doshaProfile: [],
      dietary: [],
      lifestyle: [],
      exercise: [],
      herbs: [],
      therapies: [],
      stress: [],
      monitoring: [],
      importantConsiderations: [],
      recommendationSummary: [],
      consultation: [],
    };
  
    try {
      let currentSection = null;
      const lines = parsedText.split('\n');
  
      lines.forEach(line => {
        const cleanLine = line.trim()
          .replace(/\*\*/g, '')
          .replace(/^\d+\.\s*/, '')
          .replace(/\\t\*/g, '')
          .replace(/\\t/g, '')
          .replace(/^[-•]\s*/, '');
  
        if (!cleanLine) return;
  
        // Determine section based on headers
        if (cleanLine.includes('Dosha Profile Analysis') || cleanLine.includes('Introduction to Ayurveda')) {
          currentSection = 'doshaProfile';
        } else if (cleanLine.includes('Diet:')) {
          currentSection = 'dietary';
        } else if (cleanLine.includes('Lifestyle:')) {
          currentSection = 'lifestyle';
        } else if (cleanLine.includes('Herbal Remedies:')) {
          currentSection = 'herbs';
        } else if (cleanLine.includes('Panchakarma and Body Therapies:')) {
          currentSection = 'therapies';
        } else if (cleanLine.includes('Stress Management')) {
          currentSection = 'stress';
        } else if (cleanLine.includes('Monitoring and Adjustments:')) {
          currentSection = 'monitoring';
        } else if (currentSection && cleanLine.length > 0) {
          // Add content to current section if it's not a header
          if (!cleanLine.includes('Ayurvedic Recommendations:')) {
            sections[currentSection].push(cleanLine);
          }
        }
      });
  
      // Clean up and combine fragmented sentences in each section
      Object.keys(sections).forEach(key => {
        sections[key] = sections[key]
          .filter(item => item && item.length > 0)
          .reduce((acc, curr) => {
            if (acc.length === 0) return [curr];
            
            const lastItem = acc[acc.length - 1];
            // If last item doesn't end with a period and current item starts with lowercase
            if (!lastItem.endsWith('.') && 
                curr.charAt(0).toLowerCase() === curr.charAt(0) &&
                !curr.startsWith('+')) {
              acc[acc.length - 1] = `${lastItem} ${curr}`;
            } else {
              // Remove '+' from the start of lines and trim
              acc.push(curr.replace(/^\+\s*/, '').trim());
            }
            return acc;
          }, [])
          .filter(item => item.length > 0); // Remove any empty items
      });
  
      return sections;
    } catch (error) {
      console.error('Error parsing recommendations:', error);
      return sections;
    }
  };
  
  const getRecommendationsText = () => {
    const recommendations = results?.data?.recommendations || results?.recommendations;

    if (!recommendations) {
      console.error('No recommendations found in results.');
      return '';
    }

    console.log('Raw recommendations:', recommendations);

    if (Array.isArray(recommendations)) {
      return recommendations.join('\n');
    } else if (typeof recommendations === 'string') {
      return recommendations;
    } else if (typeof recommendations === 'object') {
      return JSON.stringify(recommendations);
    }

    return '';
  };

  const recommendationsText = getRecommendationsText();
  console.log('Processed Recommendations Text:', recommendationsText);

  const parsedSections = parseRecommendations(recommendationsText);

  const sectionConfigs = {
    doshaProfile: {
      title: "Dosha Profile Analysis",
      icon: <Assessment color="primary" />,
      content: parsedSections.doshaProfile,
    },
    dietary: {
      title: "Dietary Recommendations",
      icon: <LocalDining color="primary" />,
      content: parsedSections.dietary,
    },
    lifestyle: {
      title: "Lifestyle Modifications",
      icon: <DirectionsRun color="primary" />,
      content: parsedSections.lifestyle,
    },
    exercise: {
      title: "Exercise Recommendations",
      icon: <NaturePeople color="primary" />,
      content: parsedSections.exercise,
    },
    herbs: {
      title: "Herbal Remedies",
      icon: <Spa color="primary" />,
      content: parsedSections.herbs,
    },
    therapies: {
      title: "Therapeutic Treatments",
      icon: <Healing color="primary" />,
      content: parsedSections.therapies,
    },
    stress: {
      title: "Stress Management",
      icon: <Psychology color="primary" />,
      content: parsedSections.stress,
    },
    monitoring: {
      title: "Progress Monitoring",
      icon: <MonitorHeart color="primary" />,
      content: parsedSections.monitoring,
    },
    importantConsiderations: {
      title: "Important Considerations",
      icon: <InfoOutlined color="primary" />,
      content: parsedSections.importantConsiderations,
    },
    recommendationSummary: {
      title: "Recommendation Summary",
      icon: <SummarizeOutlined color="primary" />,
      content: parsedSections.recommendationSummary,
    },
    consultation: {
      title: "Consultation with an Ayurvedic Practitioner",
      icon: <InfoOutlined color="primary" />,
      content: parsedSections.consultation,
    },
  };

  const renderSection = (sectionData, gridSize = 12) => {
    if (!sectionData.content || sectionData.content.length === 0) return null;

    return (
      <Grid item xs={12} md={gridSize}>
        <Card
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
              transform: 'scale(1.02)',
              boxShadow: '0 6px 15px rgba(0,0,0,0.2)',
            },
            borderRadius: '10px',
          }}
        >
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 2,
                pb: 1,
                borderBottom: '1px solid rgba(0,0,0,0.1)',
              }}
            >
              {sectionData.icon}
              <Typography
                variant="h6"
                sx={{
                  ml: 1,
                  color: 'primary.main',
                  fontWeight: 500,
                }}
              >
                {sectionData.title}
              </Typography>
            </Box>
            <List>
              {sectionData.content.map((item, index) => (
                <ListItem
                  key={index}
                  sx={{
                    py: 0.5,
                    '&:hover': {
                      bgcolor: 'rgba(0,0,0,0.02)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: '32px' }}>
                    <Typography color="primary">•</Typography>
                  </ListItemIcon>
                  <ListItemText
                    primary={item}
                    sx={{
                      '& .MuiTypography-root': {
                        fontSize: '0.95rem',
                        lineHeight: 1.5,
                        color: 'text.primary',
                      },
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
    );
  };

  if (!recommendationsText) {
    return (
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h6" align="center">
          No recommendations available. Please try again.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        bgcolor: 'linear-gradient(135deg, #e0f7fa, #e8f5e9)',
        borderRadius: '15px',
      }}
    >
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{
          color: 'primary.main',
          fontWeight: 600,
          mb: 3,
        }}
      >
        Your Personalized Ayurvedic Wellness Plan
      </Typography>

      <Typography
        variant="subtitle1"
        align="center"
        sx={{
          mb: 4,
          color: 'text.secondary',
          maxWidth: '800px',
          mx: 'auto',
        }}
      >
        This comprehensive plan is tailored to your unique constitution and current health needs.
        Follow these recommendations consistently for optimal results.
      </Typography>

      {doshaProfile && (
        <Box
          sx={{
            mb: 4,
            p: 3,
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: 2,
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              color: 'primary.main',
              textAlign: 'center',
              mb: 2,
            }}
          >
            Current Dosha Balance
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Typography
                align="center"
                sx={{
                  fontWeight: 500,
                  fontSize: '1.1rem',
                }}
              >
                Vata: {doshaProfile.vata}%
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography
                align="center"
                sx={{
                  fontWeight: 500,
                  fontSize: '1.1rem',
                }}
              >
                Pitta: {doshaProfile.pitta}%
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography
                align="center"
                sx={{
                  fontWeight: 500,
                  fontSize: '1.1rem',
                }}
              >
                Kapha: {doshaProfile.kapha}%
              </Typography>
            </Grid>
          </Grid>
        </Box>
      )}

      <Grid container spacing={3}>
        {Object.entries(sectionConfigs).map(([key, section]) =>
          renderSection(section, key === 'stress' || key === 'monitoring' ? 6 : 12)
        )}
      </Grid>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button
          variant="contained"
          color="success"
          startIcon={<SaveAlt />}
          onClick={() => alert('Recommendations saved successfully!')}
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1rem',
            bgcolor: 'linear-gradient(135deg, #66bb6a, #43a047)',
            '&:hover': {
              bgcolor: 'linear-gradient(135deg, #43a047, #388e3c)',
            },
          }}
        >
          Save Recommendations
        </Button>
      </Box>
    </Paper>
  );
};

export default ConsultationResults;



  





