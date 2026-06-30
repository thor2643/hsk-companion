import type { SyntheticEvent } from 'react'
import { useState } from 'react'
import { useAuth } from '../../auth/AuthProvider'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Textarea } from '../../components/ui/Textarea'
import { getDefaultHskLevel } from '../../settings/appSettings'
import { createVocabularyItem } from './vocabulary.api'
import type { VocabularyItem } from './vocabulary.types'

type VocabularyFormProps = {
  onCreated?: (item: VocabularyItem) => void
}

export function VocabularyForm({ onCreated }: VocabularyFormProps) {
  const { session } = useAuth()
  const [hanzi, setHanzi] = useState('')
  const [pinyin, setPinyin] = useState('')
  const [meaning, setMeaning] = useState('')
  const [notes, setNotes] = useState('')
  const [hskLevel, setHskLevel] = useState(() => String(getDefaultHskLevel()))
  const [lesson, setLesson] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!session?.user.id) {
      setError('You need to be signed in to add vocabulary.')
      return
    }

    setError('')
    setMessage('')
    setIsSubmitting(true)

    try {
      const item = await createVocabularyItem(session.user.id, {
        hanzi,
        pinyin,
        meaning,
        notes,
        hsk_level: hskLevel ? Number(hskLevel) : null,
        lesson,
      })

      setHanzi('')
      setPinyin('')
      setMeaning('')
      setNotes('')
      setHskLevel(String(getDefaultHskLevel()))
      setLesson('')
      setMessage('Vocabulary item added.')
      onCreated?.(item)
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Could not add vocabulary item.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="space-y-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Hanzi</span>
          <Input onChange={(event) => setHanzi(event.target.value)} value={hanzi} />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Pinyin</span>
          <Input onChange={(event) => setPinyin(event.target.value)} required value={pinyin} />
        </label>
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">Meaning</span>
        <Input onChange={(event) => setMeaning(event.target.value)} required value={meaning} />
      </label>

      <div className="grid gap-4 sm:grid-cols-[1fr_10rem]">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Notes</span>
          <Textarea onChange={(event) => setNotes(event.target.value)} value={notes} />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">HSK level</span>
          <Input
            max={6}
            min={1}
            onChange={(event) => setHskLevel(event.target.value)}
            type="number"
            value={hskLevel}
          />
        </label>
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">Lesson or type</span>
        <Input
          onChange={(event) => setLesson(event.target.value)}
          placeholder="Lesson 3, textbook, exam prep..."
          value={lesson}
        />
      </label>

      {error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      {message ? <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p> : null}

      <Button disabled={isSubmitting} type="submit">
        {isSubmitting ? 'Adding...' : 'Add vocabulary'}
      </Button>
    </form>
  )
}
