import { useState } from 'react'
import type { ContentTabId } from '../components/ui/ContentTabs'
import { ContentTabs } from '../components/ui/ContentTabs'
import { PageShell } from '../components/ui/PageShell'
import { GrammarForm } from '../features/grammar/GrammarForm'
import { SentenceForm } from '../features/sentences/SentenceForm'
import { VocabularyForm } from '../features/vocabulary/VocabularyForm'

export function AddPage() {
  const [activeTab, setActiveTab] = useState<ContentTabId>('vocabulary')

  return (
    <PageShell title="Add" description="Create study material for your personal library.">
      <ContentTabs activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'vocabulary' ? <VocabularyForm /> : null}
      {activeTab === 'sentences' ? <SentenceForm /> : null}
      {activeTab === 'grammar' ? <GrammarForm /> : null}
    </PageShell>
  )
}
