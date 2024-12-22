import { useState, useEffect } from 'react';
import { Paper, Text, Stack, Group, Divider } from '@mantine/core';
import { getTripExpenses, getTripParticipants } from '../db/database';

function ExpenseStats({ tripId }) {
  const [stats, setStats] = useState({
    total: 0,
    participantStats: [],
    averagePerPerson: 0
  });

  useEffect(() => {
    loadStats();
  }, [tripId]);

  async function loadStats() {
    try {
      const [expenses, participants] = await Promise.all([
        getTripExpenses(Number(tripId)),
        getTripParticipants(Number(tripId))
      ]);

      // Calculate total expenses
      const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

      // Calculate expenses per participant
      const participantExpenses = {};
      participants.forEach(p => {
        participantExpenses[p.id] = 0;
      });

      expenses.forEach(expense => {
        if (expense.splitType === 'split') {
          const splitAmount = expense.amount / participants.length;
          participants.forEach(p => {
            participantExpenses[p.id] += splitAmount;
          });
        } else {
          participantExpenses[expense.paidBy] += expense.amount;
        }
      });

      // Create participant stats array
      const participantStats = participants.map(p => ({
        name: p.name,
        spent: participantExpenses[p.id]
      })).sort((a, b) => b.spent - a.spent);

      setStats({
        total,
        participantStats,
        averagePerPerson: total / participants.length
      });

    } catch (error) {
      console.error('Error loading expense stats:', error);
    }
  }

  return (
    <Paper p="md" withBorder>
      <Stack>
        <Text size="lg" fw={500}>Expense Statistics</Text>
        
        <Group justify="space-between" mt="xs">
          <Text size="sm">Total Expenses:</Text>
          <Text fw={500}>${stats.total.toFixed(2)}</Text>
        </Group>

        <Group justify="space-between">
          <Text size="sm">Average per Person:</Text>
          <Text fw={500}>${stats.averagePerPerson.toFixed(2)}</Text>
        </Group>

        <Divider my="sm" />

        <Text size="sm" fw={500}>Expenses by Participant:</Text>
        {stats.participantStats.map((stat, index) => (
          <Group key={index} justify="space-between">
            <Text size="sm">{stat.name}</Text>
            <Text fw={500}>${stat.spent.toFixed(2)}</Text>
          </Group>
        ))}
      </Stack>
    </Paper>
  );
}

export default ExpenseStats;
