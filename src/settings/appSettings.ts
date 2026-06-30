import { useState } from 'react'

const DEFAULT_HSK_LEVEL = 1
const HSK_LEVEL_STORAGE_KEY = 'hsk-companion:default-hsk-level'

function normalizeHskLevel(value: number) {
  if (!Number.isInteger(value) || value < 1 || value > 6) {
    return DEFAULT_HSK_LEVEL
  }

  return value
}

export function getDefaultHskLevel() {
  if (typeof window === 'undefined') {
    return DEFAULT_HSK_LEVEL
  }

  const storedValue = window.localStorage.getItem(HSK_LEVEL_STORAGE_KEY)

  if (!storedValue) {
    return DEFAULT_HSK_LEVEL
  }

  return normalizeHskLevel(Number(storedValue))
}

export function setDefaultHskLevel(level: number) {
  const nextLevel = normalizeHskLevel(level)
  window.localStorage.setItem(HSK_LEVEL_STORAGE_KEY, String(nextLevel))

  return nextLevel
}

export function useDefaultHskLevel() {
  const [defaultHskLevel, setDefaultHskLevelState] = useState(getDefaultHskLevel)

  function updateDefaultHskLevel(level: number) {
    const nextLevel = setDefaultHskLevel(level)
    setDefaultHskLevelState(nextLevel)
  }

  return {
    defaultHskLevel,
    updateDefaultHskLevel,
  }
}
