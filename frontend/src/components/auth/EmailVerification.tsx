import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Link,
  Container,
  Paper,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const VerificationBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
}));

const LeftPanel = styled(Box)(({ theme }) => ({
  flex: 1,
  backgroundColor: '#0A1929',
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  color: 'white',
}));

const RightPanel = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
}));

const Logo = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(8),
  '& svg': {
    fontSize: 32,
    color: theme.palette.primary.main,
  },
}));

const PlanFeature = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
  '& svg': {
    color: theme.palette.primary.main,
  },
}));

const VerificationCode = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

interface EmailVerificationProps {
  email: string;
  onVerify: (code: string) => void;
}

export const EmailVerification: React.FC<EmailVerificationProps> = ({
  email,
  onVerify,
}) => {
  const [code, setCode] = useState(['', '', '', '']);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Auto-focus next input
      if (value && index < 3) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleVerify = () => {
    onVerify(code.join(''));
  };

  return (
    <VerificationBox>
      <LeftPanel>
        <Logo>
          <Typography variant="h5" component="div">
            CarRental
          </Typography>
        </Logo>

        <Typography variant="h6" sx={{ mb: 4 }}>
          Plan includes
        </Typography>

        <PlanFeature>
          <Typography>✓ Unlimited vehicle listings</Typography>
        </PlanFeature>
        <PlanFeature>
          <Typography>✓ Real-time availability tracking</Typography>
        </PlanFeature>
        <PlanFeature>
          <Typography>✓ Advanced booking management</Typography>
        </PlanFeature>
        <PlanFeature>
          <Typography>✓ Customer analytics</Typography>
        </PlanFeature>
      </LeftPanel>

      <RightPanel>
        <Container maxWidth="sm">
          <Box sx={{ textAlign: 'right', mb: 4 }}>
            <Typography variant="body2" color="text.secondary">
              Already a member?{' '}
              <Link href="/login" underline="none">
                Log in
              </Link>
            </Typography>
          </Box>

          <Typography variant="h4" component="h1" gutterBottom>
            Verify your email
          </Typography>

          <Typography color="text.secondary" sx={{ mb: 4 }}>
            We have sent a verification code to your email inbox.
          </Typography>

          <VerificationCode>
            {code.map((digit, index) => (
              <TextField
                key={index}
                id={`code-${index}`}
                variant="outlined"
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                inputProps={{
                  maxLength: 1,
                  style: { textAlign: 'center', fontSize: '1.5rem' },
                }}
                sx={{ width: '64px', height: '64px' }}
              />
            ))}
          </VerificationCode>

          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={handleVerify}
            sx={{ mb: 2 }}
          >
            Verify
          </Button>

          <Typography variant="body2" color="text.secondary" align="center">
            This site is protected by reCAPTCHA and the Google{' '}
            <Link href="#" underline="none">
              Privacy Policy
            </Link>
            .
          </Typography>
        </Container>
      </RightPanel>
    </VerificationBox>
  );
};
