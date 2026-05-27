// Server component — pure <a> tag, no client JS.
// Per D-13: Lucide MessageCircle icon (NOT official Zalo logo — legal-safe).
// Per D-14/D-15: bg-burgundy text-bone, icon-only, 56×56px round.
// Per D-16: static — hover:scale-105 + shadow-lg, active:scale-95. NO pulse/bounce.
// Per D-18: HTTPS-only zalo.me URL via zaloHref().
import { MessageCircle } from 'lucide-react'
import { zaloHref } from '@/lib/site'

export default function FloatingZalo() {
  return (
    <a
      href={zaloHref()}
      rel="noopener"
      aria-label="Chat Zalo với Khang Thịnh"
      className="
        fixed bottom-4 right-4 z-50
        w-14 h-14 rounded-full
        bg-burgundy text-bone
        flex items-center justify-center
        shadow-md
        transition-transform duration-150
        hover:scale-105 hover:shadow-lg
        active:scale-95
        motion-reduce:transition-none motion-reduce:hover:scale-100
      "
    >
      <MessageCircle className="w-7 h-7" aria-hidden="true" />
    </a>
  )
}
