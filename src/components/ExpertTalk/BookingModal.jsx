// src/components/ExpertTalk/BookingModal.jsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,

  Grid,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
//   Chip,
  Avatar,
  
} from '@mui/material';
import { 
//   AccessTime, 
  VideoCameraFront,
  Phone,
  Message,
  Payment
} from '@mui/icons-material';

const steps = ['Select Time', 'Consultation Type', 'Payment'];

const timeSlots = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'
];

const consultationTypes = [
  {
    type: 'video',
    icon: <VideoCameraFront />,
    label: 'Video Call',
    description: 'Face-to-face consultation via video call'
  },
  {
    type: 'audio',
    icon: <Phone />,
    label: 'Audio Call',
    description: 'Voice-only consultation'
  },
  {
    type: 'chat',
    icon: <Message />,
    label: 'Chat',
    description: 'Text-based consultation'
  }
];

const BookingModal = ({ open, onClose, expert, onBookingConfirm }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [consultationType, setConsultationType] = useState('video');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = () => {
    // Here you would typically make an API call to save the booking
    console.log({
      expert,
      date: selectedDate,
      time: selectedTime,
      consultationType,
      notes,
      paymentMethod
    });
    onBookingConfirm();
    onClose();
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <TextField
              fullWidth
              type="date"
              label="Select Date"
              InputLabelProps={{ shrink: true }}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              sx={{ mb: 3 }}
            />
            <Typography variant="subtitle1" gutterBottom>
              Available Time Slots
            </Typography>
            <Grid container spacing={1}>
              {timeSlots.map((slot) => (
                <Grid item xs={6} sm={4} key={slot}>
                  <Button
                    variant={selectedTime === slot ? 'contained' : 'outlined'}
                    fullWidth
                    onClick={() => setSelectedTime(slot)}
                    sx={{ mb: 1 }}
                  >
                    {slot}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Grid container spacing={2}>
              {consultationTypes.map((type) => (
                <Grid item xs={12} key={type.type}>
                  <Box
                    onClick={() => setConsultationType(type.type)}
                    sx={{
                      p: 2,
                      border: 1,
                      borderColor: consultationType === type.type ? 'primary.main' : 'grey.300',
                      borderRadius: 1,
                      cursor: 'pointer',
                      bgcolor: consultationType === type.type ? 'primary.light' : 'background.paper',
                      '&:hover': {
                        borderColor: 'primary.main',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {type.icon}
                      <Typography variant="h6" sx={{ ml: 2 }}>
                        {type.label}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {type.description}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Notes for the Expert"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              sx={{ mt: 3 }}
            />
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Booking Summary
            </Typography>
            <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1, mb: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Date & Time
                  </Typography>
                  <Typography variant="body1">
                    {selectedDate} at {selectedTime}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Consultation Type
                  </Typography>
                  <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                    {consultationType}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Fee
                  </Typography>
                  <Typography variant="h6" color="primary">
                    {expert?.consultationFee}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            <Typography variant="subtitle1" gutterBottom>
              Select Payment Method
            </Typography>
            <RadioGroup
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <FormControlLabel value="card" control={<Radio />} label="Credit/Debit Card" />
              <FormControlLabel value="upi" control={<Radio />} label="UPI" />
              <FormControlLabel value="netbanking" control={<Radio />} label="Net Banking" />
            </RadioGroup>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            src={expert?.image}
            sx={{ width: 56, height: 56, mr: 2 }}
          />
          <Box>
            <Typography variant="h6">
              Book Consultation with {expert?.name}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              {expert?.specialization}
            </Typography>
          </Box>
        </Box>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </DialogTitle>

      <DialogContent dividers>
        {getStepContent(activeStep)}
      </DialogContent>

      <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
        <Button
          onClick={handleBack}
          disabled={activeStep === 0}
        >
          Back
        </Button>
        <Box>
          <Button
            onClick={onClose}
            sx={{ mr: 1 }}
          >
            Cancel
          </Button>
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              startIcon={<Payment />}
            >
              Confirm & Pay
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={
                (activeStep === 0 && (!selectedDate || !selectedTime)) ||
                (activeStep === 1 && !consultationType)
              }
            >
              Next
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default BookingModal;
