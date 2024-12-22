import { useState, useEffect } from 'react';
import { Group, TextInput, Button, Stack, Paper, ActionIcon, Text } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { addParticipant, getTripParticipants, deleteParticipant } from '../db/database';

function ParticipantList({ tripId, onParticipantsChange }) {
  const [participants, setParticipants] = useState([]);
  const [newParticipantName, setNewParticipantName] = useState('');

  useEffect(() => {
    if (tripId) {
      loadParticipants();
    }
  }, [tripId]);

  async function loadParticipants() {
    try {
      const tripParticipants = await getTripParticipants(tripId);
      setParticipants(tripParticipants);
      onParticipantsChange?.();
    } catch (error) {
      console.error('Error loading participants:', error);
    }
  }

  async function handleAddParticipant(e) {
    e.preventDefault();
    if (!newParticipantName.trim()) return;

    try {
      await addParticipant({
        tripId,
        name: newParticipantName.trim()
      });
      setNewParticipantName('');
      await loadParticipants();
    } catch (error) {
      console.error('Error adding participant:', error);
    }
  }

  async function handleDeleteParticipant(participantId) {
    try {
      await deleteParticipant(participantId);
      await loadParticipants();
    } catch (error) {
      console.error('Error deleting participant:', error);
    }
  }

  return (
    <Stack gap="md">
      <Text fw={500} size="lg">Participants</Text>
      
      <form onSubmit={handleAddParticipant}>
        <Group gap="sm">
          <TextInput
            placeholder="Enter participant name"
            value={newParticipantName}
            onChange={(e) => setNewParticipantName(e.target.value)}
            style={{ flex: 1 }}
          />
          <Button type="submit">Add</Button>
        </Group>
      </form>

      <Stack gap="xs">
        {participants.map((participant) => (
          <Paper key={participant.id} p="xs" withBorder>
            <Group justify="space-between">
              <Text>{participant.name}</Text>
              <ActionIcon
                color="red"
                variant="subtle"
                onClick={() => handleDeleteParticipant(participant.id)}
              >
                <IconTrash size={16} />
              </ActionIcon>
            </Group>
          </Paper>
        ))}
      </Stack>

      {participants.length === 0 && (
        <Text c="dimmed" ta="center">
          No participants added yet
        </Text>
      )}
    </Stack>
  );
}

export default ParticipantList;
