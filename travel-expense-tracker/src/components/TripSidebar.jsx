import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Text, Stack, Group } from '@mantine/core';
import { getAllTrips } from '../db/database';

function TripSidebar() {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    loadTrips();
  }, []);

  async function loadTrips() {
    try {
      const allTrips = await getAllTrips();
      setTrips(allTrips);
    } catch (error) {
      console.error('Error loading trips:', error);
      setTrips([]);
    }
  }

  return (
    <Stack>
      <Text size="sm" fw={500} c="dimmed" mb="xs">
        My Trips
      </Text>
      
      <NavLink 
        to="/trips"
        style={({ isActive }) => ({
          padding: '8px 16px',
          borderRadius: '4px',
          backgroundColor: isActive ? '#e9ecef' : 'transparent',
          textDecoration: 'none',
          color: 'inherit',
          display: 'block',
          marginBottom: '8px'
        })}
        end
      >
        All Trips
      </NavLink>

      {trips.map(trip => (
        <NavLink
          key={trip.id}
          to={`/trips/${trip.id}`}
          style={({ isActive }) => ({
            padding: '8px 16px',
            borderRadius: '4px',
            backgroundColor: isActive ? '#e9ecef' : 'transparent',
            textDecoration: 'none',
            color: 'inherit',
            display: 'block',
            marginBottom: '4px'
          })}
        >
          <Group>
            <Text size="sm" truncate>
              {trip.name}
            </Text>
          </Group>
        </NavLink>
      ))}
    </Stack>
  );
}

export default TripSidebar;
