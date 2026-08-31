import { useEffect, useRef, useState } from 'react'
import { Check, Copy, Mail } from 'lucide-react'
import MosaicBand from '../components/MosaicBand'

const CONTACT_EMAIL = 'wmzhi001@gmail.com'

function JoinPage() {
  const [copied, setCopied] = useState(false)
  const resetTimer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(resetTimer.current), [])

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL)
    } catch {
      /* Clipboard access can be denied; fall back to the mail client. */
      window.location.href = `mailto:${CONTACT_EMAIL}`
      return
    }
    setCopied(true)
    window.clearTimeout(resetTimer.current)
    resetTimer.current = window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="route-page join-page">
      <MosaicBand ground="light" field />
      <section className="join-heading">
        <h1>Work with us.</h1>
        <p>We welcome enquiries from prospective researchers and collaborators.</p>
        <button className="join-contact" type="button" onClick={copyEmail} data-copied={copied || undefined}>
          <span><Mail size={18} /> {copied ? 'Copied to clipboard' : 'Copy email address'}</span>
          <strong>{CONTACT_EMAIL}</strong>
          {copied ? <Check size={20} /> : <Copy size={20} />}
        </button>
        <span className="sr-only" role="status">{copied ? 'Email address copied to clipboard' : ''}</span>
      </section>
      <div className="join-types">
        <span>PhD &amp; student research</span>
        <span>Academic collaboration</span>
        <span>Industry partnerships</span>
      </div>
    </main>
  )
}

export default JoinPage
