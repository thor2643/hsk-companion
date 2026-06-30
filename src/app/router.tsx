import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout'
import { LoginPage } from '../features/auth/LoginPage'
import { HomePage } from '../features/home/HomePage'
import { VocabularyForm } from '../features/vocabulary/VocabularyForm'
import { VocabularyList } from '../features/vocabulary/VocabularyList.tsx'
import { SentenceForm } from '../features/sentences/SentenceForm'
import { SentenceList } from '../features/sentences/SentenceList.tsx'
import { GrammarForm } from '../features/grammar/GrammarForm'
import { GrammarList } from '../features/grammar/GrammarList.tsx'
import { TrainingPage } from '../features/training/TrainingPage'
import { StatsPage } from '../features/stats/StatsPage'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'vocabulary', element: <VocabularyList /> },
      { path: 'vocabulary/new', element: <VocabularyForm /> },
      { path: 'sentences', element: <SentenceList /> },
      { path: 'sentences/new', element: <SentenceForm /> },
      { path: 'grammar', element: <GrammarList /> },
      { path: 'grammar/new', element: <GrammarForm /> },
      { path: 'training', element: <TrainingPage /> },
      { path: 'stats', element: <StatsPage /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])
