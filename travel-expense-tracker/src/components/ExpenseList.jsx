import { useState, useEffect } from 'react';
import { Paper, Text, Group, Stack, ActionIcon, Button, Modal } from '@mantine/core';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import { getTripExpenses, getTripParticipants, deleteExpense, addExpense, updateExpense } from '../db/database';
import ExpenseForm from './ExpenseForm';

function ExpenseList({ tripId, onExpenseChange }) {
  const [expenses, setExpenses] = useState([]);
  const [participants, setParticipants] = useState({});
  const [editingExpense, setEditingExpense] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadExpenses();
    loadParticipants();
  }, [tripId]);

  async function loadExpenses() {
    try {
      const tripExpenses = await getTripExpenses(tripId);
      setExpenses(tripExpenses.sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch (error) {
      console.error('Error loading expenses:', error);
    }
  }

  async function loadParticipants() {
    try {
      const tripParticipants = await getTripParticipants(tripId);
      const participantsMap = {};
      tripParticipants.forEach(p => {
        participantsMap[p.id] = p.name;
      });
      setParticipants(participantsMap);
    } catch (error) {
      console.error('Error loading participants:', error);
    }
  }

  async function handleDeleteExpense(expenseId) {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await deleteExpense(expenseId);
        await loadExpenses();
        onExpenseChange?.();
      } catch (error) {
        console.error('Error deleting expense:', error);
      }
    }
  }

  function handleEditExpense(expense) {
    setEditingExpense(expense);
    setIsModalOpen(true);
  }

  function handleAddExpense() {
    console.log('Opening add expense modal');
    setEditingExpense(null);
    setIsModalOpen(true);
  }

  async function handleExpenseSubmit(expenseData) {
    console.log('Submitting expense:', expenseData);
    try {
      if (editingExpense) {
        await updateExpense({ ...expenseData, id: editingExpense.id });
      } else {
        await addExpense(expenseData);
      }
      setIsModalOpen(false);
      setEditingExpense(null);
      await loadExpenses();
      onExpenseChange?.();
    } catch (error) {
      console.error('Error saving expense:', error);
    }
  }

  function handleModalClose() {
    console.log('Closing modal');
    setIsModalOpen(false);
    setEditingExpense(null);
  }

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <Text size="xl" fw={500}>Expenses</Text>
        <Button onClick={handleAddExpense}>Add Expense</Button>
      </Group>

      {expenses.map((expense) => (
        <Paper key={expense.id} p="md" withBorder>
          <Group justify="space-between" wrap="nowrap">
            <div style={{ flex: 1 }}>
              <Text fw={500}>{expense.description}</Text>
              <Text size="sm" c="dimmed">
                Paid by {participants[expense.paidBy]} • {new Date(expense.date).toLocaleDateString()}
              </Text>
              <Text size="sm" c="dimmed">
                {expense.splitType === 'split' ? 'Split equally' : 'Individual expense'}
              </Text>
            </div>
            <div>
              <Text fw={500} style={{ whiteSpace: 'nowrap' }}>
                ${expense.amount.toFixed(2)}
              </Text>
              <Group gap="xs" mt="xs">
                <ActionIcon
                  variant="subtle"
                  color="blue"
                  onClick={() => handleEditExpense(expense)}
                >
                  <IconPencil size={16} />
                </ActionIcon>
                <ActionIcon
                  variant="subtle"
                  color="red"
                  onClick={() => handleDeleteExpense(expense.id)}
                >
                  <IconTrash size={16} />
                </ActionIcon>
              </Group>
            </div>
          </Group>
        </Paper>
      ))}

      {expenses.length === 0 && (
        <Text c="dimmed" ta="center">
          No expenses added yet
        </Text>
      )}

      <Modal 
        opened={isModalOpen}
        onClose={handleModalClose}
        title={editingExpense ? 'Edit Expense' : 'Add Expense'}
        centered
        size="md"
        zIndex={1000}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
          zIndex: 999
        }}
        styles={{
          inner: {
            zIndex: 1000
          },
          content: {
            zIndex: 1000
          },
          overlay: {
            zIndex: 999
          }
        }}
        transitionProps={{
          transition: 'fade',
          duration: 200
        }}
      >
        <ExpenseForm
          tripId={tripId}
          expense={editingExpense}
          onSubmit={handleExpenseSubmit}
          onCancel={handleModalClose}
        />
      </Modal>
    </Stack>
  );
}

export default ExpenseList;
