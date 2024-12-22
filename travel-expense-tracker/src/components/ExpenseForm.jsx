import { useState, useEffect } from 'react';
import { TextInput, Button, Group, Stack, Radio, Select, NumberInput } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { getTripParticipants } from '../db/database';

function ExpenseForm({ tripId, expense, onSubmit, onCancel }) {
  const [participants, setParticipants] = useState([]);
  const [formData, setFormData] = useState({
    description: expense?.description || '',
    amount: expense?.amount || '',
    date: expense?.date ? new Date(expense.date) : new Date(),
    paidBy: expense?.paidBy ? String(expense.paidBy) : '',
    splitType: expense?.splitType || 'split'
  });

  useEffect(() => {
    if (tripId) {
      loadParticipants();
    }
  }, [tripId]);

  async function loadParticipants() {
    try {
      const tripParticipants = await getTripParticipants(tripId);
      console.log('Loaded participants:', tripParticipants);
      setParticipants(tripParticipants || []);
    } catch (error) {
      console.error('Error loading participants:', error);
      setParticipants([]);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!formData.paidBy || !formData.amount || !formData.description) {
      return;
    }

    onSubmit({
      ...formData,
      amount: Number(formData.amount),
      tripId,
      paidBy: Number(formData.paidBy)
    });
  }

  const handleParticipantChange = (value) => {
    setFormData(prev => ({
      ...prev,
      paidBy: value
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <TextInput
          required
          label="Description"
          placeholder="What was this expense for?"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
        />

        <NumberInput
          required
          label="Amount"
          placeholder="0.00"
          min={0}
          precision={2}
          value={formData.amount}
          onChange={(value) => setFormData(prev => ({ ...prev, amount: value }))}
          styles={{
            input: {
              cursor: 'text'
            }
          }}
          hideControls
        />

        <DatePickerInput
          label="Date"
          value={formData.date}
          onChange={(date) => setFormData(prev => ({ ...prev, date }))}
          popoverProps={{
            withinPortal: true,
            zIndex: 1100,
            shadow: "md",
            styles: {
              dropdown: {
                zIndex: 1100
              }
            }
          }}
        />

        <div style={{ marginBottom: '8px' }}>
          <label style={{ 
            display: 'block', 
            fontSize: '14px',
            marginBottom: '4px'
          }}>
            Paid by <span style={{ color: 'red' }}>*</span>
          </label>
          <select
            required
            value={formData.paidBy}
            onChange={(e) => handleParticipantChange(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ced4da',
              fontSize: '14px'
            }}
          >
            <option value="">Select participant</option>
            {participants.map((participant) => (
              <option key={participant.id} value={participant.id}>
                {participant.name}
              </option>
            ))}
          </select>
        </div>

        <Radio.Group
          label="Split type"
          value={formData.splitType}
          onChange={(value) => setFormData(prev => ({ ...prev, splitType: value }))}
        >
          <Group mt="xs">
            <Radio value="split" label="Split equally" />
            <Radio value="individual" label="Individual expense" />
          </Group>
        </Radio.Group>

        <Group justify="flex-end" mt="md">
          <Button variant="subtle" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {expense ? 'Update Expense' : 'Add Expense'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}

export default ExpenseForm;
