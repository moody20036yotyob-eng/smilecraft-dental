import { useEffect, useRef } from 'react'

const DEFAULT_OPTIONS = {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px',
}

export function useScrollReveal() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
        observer.unobserve(entry.target)
      }
    }, DEFAULT_OPTIONS)

    // Observe all .reveal children
    const targets = el.querySelectorAll('.reveal')
    targets.forEach(t => observer.observe(t))

    return () => observer.disconnect()
  }, [])

  return ref
}

export function useRevealOnce(delay = 0) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    el.classList.add('reveal')

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), delay)
        observer.unobserve(entry.target)
      }
    }, DEFAULT_OPTIONS)

    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])

  return ref
}
