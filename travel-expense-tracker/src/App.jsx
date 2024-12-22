import { HashRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import { MantineProvider, AppShell, Burger, Group, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import TripsPage from './pages/TripsPage';
import NewTripPage from './pages/NewTripPage';
import TripDetailsPage from './pages/TripDetailsPage';
import ExpensePage from './pages/ExpensePage';
import TripSidebar from './components/TripSidebar';

function App() {
  const [opened, { toggle }] = useDisclosure();

  return (
    <MantineProvider
      theme={{
        components: {
          Modal: {
            styles: {
              root: {
                position: 'fixed',
                zIndex: 1000,
              },
              inner: {
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                padding: '20px',
                width: '100%',
                maxWidth: '100vw',
                display: 'flex',
                justifyContent: 'center'
              },
              content: {
                position: 'relative',
                width: 'auto',
                margin: '0 auto',
                maxWidth: '500px'
              }
            }
          }
        }
      }}
    >
      <Router>
        <AppShell
          header={{ height: 60 }}
          navbar={{
            width: 300,
            breakpoint: 'sm',
            collapsed: { mobile: !opened },
          }}
          padding="md"
        >
          <AppShell.Header>
            <Group h="100%" px="md">
              <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
              <Group justify="space-between" style={{ flex: 1 }}>
                <Group>
                  <NavLink 
                    to="/trips"
                    style={({ isActive }) => ({
                      fontWeight: isActive ? 'bold' : 'normal',
                      textDecoration: 'none',
                      color: 'inherit'
                    })}
                  >
                    Travel Expense Tracker
                  </NavLink>
                </Group>
              </Group>
            </Group>
          </AppShell.Header>

          <AppShell.Navbar p="md">
            <TripSidebar />
          </AppShell.Navbar>

          <AppShell.Main>
            <Routes>
              <Route path="/" element={<TripsPage />} />
              <Route path="/trips" element={<TripsPage />} />
              <Route path="/trips/new" element={<NewTripPage />} />
              <Route path="/trips/:tripId" element={<TripDetailsPage />} />
              <Route path="/trips/:tripId/expenses" element={<ExpensePage />} />
              <Route path="*" element={<TripsPage />} />
            </Routes>
          </AppShell.Main>
        </AppShell>
      </Router>
    </MantineProvider>
  );
}

export default App;
