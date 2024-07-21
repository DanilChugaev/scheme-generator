type HTMLElementEvent<T extends HTMLInputElement> = Event & {
  target: T;
}

const DARK_MODE = 'dark-mode'

export default () => {
  const useDark: MediaQueryList = window.matchMedia('(prefers-color-scheme: dark)')
  let isDark: boolean = getDarkModeFromLocalStorage() === null
    ? useDark.matches
    : getDarkModeFromLocalStorage() === 'true'

  toggleDarkModeClass(isDark)

  useDark.addEventListener('change',mediaEvent => {
    // TODO: при изменении системной темы менять положение переключалки
    toggleDarkModeClass(mediaEvent.matches)
  })

  return (event: HTMLElementEvent<HTMLInputElement>): void | boolean => {
    if (event) {
      toggleDarkModeClass(event.target.checked)
      isDark = event.target.checked
    } else {
      return isDark
    }
  }
}

const toggleDarkModeClass = (isDark: boolean) => {
  document.documentElement.classList.toggle(DARK_MODE, isDark)
  setDarkModeToLocalStorage(isDark)
}

const setDarkModeToLocalStorage = (isDark: boolean) => {
  localStorage.setItem(DARK_MODE, String(isDark))
}

const getDarkModeFromLocalStorage = (): string | null => {
  return localStorage.getItem(DARK_MODE)
}
