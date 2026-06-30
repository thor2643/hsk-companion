import { useState } from 'react'
import type { ContentTabId } from '../components/ui/ContentTabs'
import { ContentTabs } from '../components/ui/ContentTabs'
import { PageShell } from '../components/ui/PageShell'
import { GrammarList } from '../features/grammar/GrammarList'
import { SentenceList } from '../features/sentences/SentenceList'
import { VocabularyList } from '../features/vocabulary/VocabularyList'

export function LibraryPage() {
  const [activeTab, setActiveTab] = useState<ContentTabId>('vocabulary')

  return (
    <PageShell title="Library" description="Browse and maintain the study material you have saved.">
      <ContentTabs activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'vocabulary' ? <VocabularyList /> : null}
      {activeTab === 'sentences' ? <SentenceList /> : null}
      {activeTab === 'grammar' ? <GrammarList /> : null}
    </PageShell>
  )
}
