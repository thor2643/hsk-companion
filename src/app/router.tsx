import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '../auth/ProtectedRoute'
import { AppLayout } from '../components/layout/AppLayout'
import { AddPage } from '../pages/AddPage'
import { HomePage } from '../pages/HomePage'
import { LibraryPage } from '../pages/LibraryPage'
import { LoginPage } from '../pages/LoginPage'
import { SettingsPage } from '../pages/SettingsPage'
import { StatsPage } from '../pages/StatsPage'
import { TrainingPage } from '../pages/TrainingPage'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <HomePage /> },
      { path: 'add', element: <AddPage /> },
      { path: 'library', element: <LibraryPage /> },
      { path: 'training', element: <TrainingPage /> },
      { path: 'stats', element: <StatsPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])
