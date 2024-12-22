import { useEffect, useState } from 'react';
import { Card, Text, Button, Group, Stack } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { getAllTrips, getTripParticipants } from '../db/database';

function TripList() {
  const [trips, setTrips] = useState([]);
  const [participantCounts, setParticipantCounts] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    loadTrips();
  }, []);

  useEffect(() => {
    loadParticipantCounts();
  }, [trips]);

  async function loadTrips() {
    try {
      const allTrips = await getAllTrips();
      setTrips(allTrips);
    } catch (error) {
      console.error('Error loading trips:', error);
    }
  }

  async function loadParticipantCounts() {
    try {
      const counts = {};
      await Promise.all(
        trips.map(async (trip) => {
          const participants = await getTripParticipants(trip.id);
          counts[trip.id] = participants.length;
        })
      );
      setParticipantCounts(counts);
    } catch (error) {
      console.error('Error loading participant counts:', error);
    }
  }

  // Function to refresh participant counts for a specific trip
  async function refreshParticipantCount(tripId) {
    try {
      const participants = await getTripParticipants(tripId);
      setParticipantCounts(prev => ({
        ...prev,
        [tripId]: participants.length
      }));
    } catch (error) {
      console.error('Error refreshing participant count:', error);
    }
  }

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <Text size="xl" fw={500}>Your Trips</Text>
        <Button onClick={() => navigate('/trips/new')}>New Trip</Button>
      </Group>

      {trips.map((trip) => (
        <Card key={trip.id} shadow="sm" padding="lg" radius="md" withBorder>
          <Group justify="space-between" mb="xs">
            <Text fw={500}>{trip.name}</Text>
            <Text size="sm" c="dimmed">
              {new Date(trip.startDate).toLocaleDateString()} - 
              {new Date(trip.endDate).toLocaleDateString()}
            </Text>
          </Group>

          <Text size="sm" c="dimmed" mb="md">
            {participantCounts[trip.id] || 0} participants
          </Text>

          <Button 
            variant="light" 
            color="blue" 
            fullWidth 
            mt="md" 
            radius="md"
            onClick={() => navigate(`/trips/${trip.id}`)}
          >
            View Details
          </Button>
        </Card>
      ))}

      {trips.length === 0 && (
        <Text ta="center" c="dimmed" mt="xl">
          No trips yet. Create your first trip to get started!
        </Text>
      )}
    </Stack>
  );
}

export default TripList;
