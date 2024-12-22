import { useState } from 'react';
import { TextInput, Button, Group, Stack, Divider, Text } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useNavigate } from 'react-router-dom';
import { addTrip, updateTrip, getTripParticipants } from '../db/database';
import ParticipantList from './ParticipantList';

function TripForm({ trip, onSubmit }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: trip?.name || '',
    startDate: trip?.startDate ? new Date(trip.startDate) : null,
    endDate: trip?.endDate ? new Date(trip.endDate) : null,
    description: trip?.description || ''
  });
  const [savedTripId, setSavedTripId] = useState(trip?.id || null);
  const [participantCount, setParticipantCount] = useState(0);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (trip?.id) {
        await updateTrip({ ...trip, ...formData });
        setSavedTripId(trip.id);
      } else {
        const newTripId = await addTrip(formData);
        setSavedTripId(newTripId);
      }
      if (onSubmit) {
        onSubmit();
      }
    } catch (error) {
      console.error('Error saving trip:', error);
    }
  }

  async function handleParticipantsChange() {
    if (savedTripId) {
      const participants = await getTripParticipants(savedTripId);
      setParticipantCount(participants.length);
    }
  }

  return (
    <Stack gap="xl">
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <TextInput
            required
            label="Trip Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <DatePickerInput
            required
            label="Start Date"
            value={formData.startDate}
            onChange={(date) => setFormData({ ...formData, startDate: date })}
          />

          <DatePickerInput
            required
            label="End Date"
            value={formData.endDate}
            onChange={(date) => setFormData({ ...formData, endDate: date })}
            minDate={formData.startDate}
          />

          <TextInput
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <Group justify="space-between">
            <Button variant="subtle" onClick={() => navigate('/trips')}>
              Cancel
            </Button>
            <Button type="submit">
              {trip?.id ? 'Update Trip' : 'Save Trip'}
            </Button>
          </Group>
        </Stack>
      </form>

      {savedTripId && (
        <>
          <Divider />
          <Stack gap="md">
            <Text fw={500} size="lg">Add Participants</Text>
            <Text size="sm" c="dimmed">
              {participantCount} {participantCount === 1 ? 'participant' : 'participants'} added
            </Text>
            <ParticipantList 
              tripId={savedTripId}
              onParticipantsChange={handleParticipantsChange}
            />
          </Stack>
          
          <Group justify="center">
            <Button onClick={() => navigate('/trips')}>
              Finish
            </Button>
          </Group>
        </>
      )}
    </Stack>
  );
}

export default TripForm;
