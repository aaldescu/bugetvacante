import { Container, Title } from '@mantine/core';
import TripForm from '../components/TripForm';

function NewTripPage() {
  return (
    <Container size="sm">
      <Title order={2} mb="xl">Create New Trip</Title>
      <TripForm />
    </Container>
  );
}

export default NewTripPage;
