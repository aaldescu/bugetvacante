import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Title, Group, Button, Stack, Text, Grid } from '@mantine/core';
import { getTrip, getTripParticipants } from '../db/database';
import ParticipantList from '../components/ParticipantList';
import ExpenseStats from '../components/ExpenseStats';

function TripDetailsPage() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [participantCount, setParticipantCount] = useState(0);

  useEffect(() => {
    loadTrip();
    loadParticipantCount();
  }, [tripId]);

  async function loadTrip() {
    try {
      const tripData = await getTrip(Number(tripId));
      if (!tripData) {
        navigate('/trips');
        return;
      }
      setTrip(tripData);
    } catch (error) {
      console.error('Error loading trip:', error);
      navigate('/trips');
    }
  }

  async function loadParticipantCount() {
    try {
      const participants = await getTripParticipants(Number(tripId));
      setParticipantCount(participants.length);
    } catch (error) {
      console.error('Error loading participant count:', error);
    }
  }

  if (!trip) {
    return null;
  }

  return (
    <Container size="lg">
      <Stack gap="xl">
        <Group justify="space-between">
          <div>
            <Title order={2}>{trip.name}</Title>
            <Text c="dimmed">
              {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
            </Text>
            <Text size="sm" mt="xs">
              {participantCount} {participantCount === 1 ? 'participant' : 'participants'}
            </Text>
          </div>
          <Group>
            <Button variant="light" onClick={() => navigate('/trips')}>
              Back to Trips
            </Button>
            <Button onClick={() => navigate(`/trips/${tripId}/expenses`)}>
              Manage Expenses
            </Button>
          </Group>
        </Group>

        {trip.description && (
          <Text>{trip.description}</Text>
        )}

        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <ParticipantList 
              tripId={Number(tripId)} 
              onParticipantsChange={loadParticipantCount}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <ExpenseStats tripId={Number(tripId)} />
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  );
}

export default TripDetailsPage;
