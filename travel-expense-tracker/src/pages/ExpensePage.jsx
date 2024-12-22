import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Title, Group, Button, Stack, Text, Grid, Paper } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';
import { getTrip, getTripExpenses, getTripParticipants } from '../db/database';
import { generateExpenseCSV, downloadCSV } from '../utils/csvExport';
import ExpenseList from '../components/ExpenseList';

function ExpensePage() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    perPerson: 0,
    byParticipant: {}
  });

  useEffect(() => {
    loadTripData();
  }, [tripId]);

  async function loadTripData() {
    try {
      const tripData = await getTrip(Number(tripId));
      if (!tripData) {
        navigate('/trips');
        return;
      }
      setTrip(tripData);

      const [tripExpenses, tripParticipants] = await Promise.all([
        getTripExpenses(Number(tripId)),
        getTripParticipants(Number(tripId))
      ]);

      setExpenses(tripExpenses);
      setParticipants(tripParticipants);
      calculateSummary(tripExpenses, tripParticipants);
    } catch (error) {
      console.error('Error loading trip data:', error);
      navigate('/trips');
    }
  }

  function calculateSummary(tripExpenses, tripParticipants) {
    const total = tripExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const splitExpenses = tripExpenses.filter(e => e.splitType === 'split');
    const individualExpenses = tripExpenses.filter(e => e.splitType === 'individual');
    
    const totalSplit = splitExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const perPerson = tripParticipants.length > 0 ? totalSplit / tripParticipants.length : 0;

    const byParticipant = {};
    tripParticipants.forEach(participant => {
      byParticipant[participant.id] = {
        name: participant.name,
        paid: 0,
        owes: perPerson
      };
    });

    tripExpenses.forEach(expense => {
      if (byParticipant[expense.paidBy]) {
        byParticipant[expense.paidBy].paid += expense.amount;
      }
    });

    Object.values(byParticipant).forEach(participant => {
      participant.balance = participant.paid - participant.owes;
    });

    setSummary({
      total,
      perPerson,
      byParticipant
    });
  }

  function handleExportCSV() {
    if (!trip || !expenses || !participants) return;

    const csvContent = generateExpenseCSV(trip, expenses, participants);
    const filename = `${trip.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_expenses.csv`;
    downloadCSV(csvContent, filename);
  }

  if (!trip) {
    return null;
  }

  return (
    <Container size="lg">
      <Stack gap="xl">
        <Group justify="space-between">
          <div>
            <Title order={2}>{trip.name} - Expenses</Title>
            <Text c="dimmed">
              {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
            </Text>
          </div>
          <Group>
            <Button 
              variant="light" 
              leftSection={<IconDownload size={16} />}
              onClick={handleExportCSV}
            >
              Export CSV
            </Button>
            <Button variant="light" onClick={() => navigate(`/trips/${tripId}`)}>
              Back to Trip Details
            </Button>
          </Group>
        </Group>

        <Grid>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Paper p="md" withBorder>
              <Stack gap="md">
                <Text fw={500} size="lg">Summary</Text>
                <div>
                  <Text>Total Expenses</Text>
                  <Text fw={500} size="xl">${summary.total.toFixed(2)}</Text>
                </div>
                <div>
                  <Text>Per Person (Split Expenses)</Text>
                  <Text fw={500}>${summary.perPerson.toFixed(2)}</Text>
                </div>
              </Stack>
            </Paper>

            <Paper p="md" withBorder mt="md">
              <Stack gap="md">
                <Text fw={500} size="lg">Balances</Text>
                {Object.values(summary.byParticipant).map(participant => (
                  <div key={participant.name}>
                    <Group justify="space-between">
                      <Text>{participant.name}</Text>
                      <Text fw={500} c={participant.balance >= 0 ? 'green' : 'red'}>
                        {participant.balance >= 0 ? '+' : ''}{participant.balance.toFixed(2)}
                      </Text>
                    </Group>
                    <Text size="xs" c="dimmed">
                      Paid: ${participant.paid.toFixed(2)} • Owes: ${participant.owes.toFixed(2)}
                    </Text>
                  </div>
                ))}
              </Stack>
            </Paper>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 8 }}>
            <ExpenseList 
              tripId={Number(tripId)} 
              onExpenseChange={loadTripData}
            />
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  );
}

export default ExpensePage;
