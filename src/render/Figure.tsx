import type { Item, Slot } from '../game/data/items'
import { drawGarment } from './garments'

type FigureProps = {
  equipped: Partial<Record<Slot, Item>>
}

export function Figure({ equipped }: FigureProps) {
  return (
    <svg
      viewBox="0 0 240 500"
      width="100%"
      height="100%"
      role="img"
      aria-label="Styled figure"
      className="fashion-figure"
    >
      <defs>
        <linearGradient id="skin" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F7DFC4" />
          <stop offset=".48" stopColor="#E8C4A5" />
          <stop offset="1" stopColor="#C99B7D" />
        </linearGradient>
        <radialGradient id="face-light" cx=".38" cy=".28" r=".78">
          <stop offset="0" stopColor="#FFEBD2" />
          <stop offset=".63" stopColor="#EBC8A9" />
          <stop offset="1" stopColor="#C99679" />
        </radialGradient>
        <linearGradient id="hair" x1=".15" y1="0" x2=".85" y2="1">
          <stop offset="0" stopColor="#241B1D" />
          <stop offset=".38" stopColor="#4A3636" />
          <stop offset=".72" stopColor="#2B2023" />
          <stop offset="1" stopColor="#151116" />
        </linearGradient>
        <radialGradient id="iris" cx=".35" cy=".3" r=".75">
          <stop offset="0" stopColor="#DDB79D" />
          <stop offset=".45" stopColor="#845F52" />
          <stop offset="1" stopColor="#3B2929" />
        </radialGradient>
        <filter id="soft-body-shadow" x="-30%" y="-20%" width="160%" height="160%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#2D2020" floodOpacity=".2" />
        </filter>
        <filter id="fabric-grain" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency=".55" numOctaves="2" seed="8" result="noise" />
          <feColorMatrix in="noise" type="saturate" values="0" result="mono" />
          <feComponentTransfer in="mono" result="faintNoise">
            <feFuncA type="table" tableValues="0 .075" />
          </feComponentTransfer>
          <feComposite in="faintNoise" in2="SourceGraphic" operator="in" result="texture" />
          <feBlend in="SourceGraphic" in2="texture" mode="soft-light" />
        </filter>
      </defs>

      <ellipse cx="120" cy="486" rx="54" ry="7" fill="#2D2927" opacity=".12" />

      {/* Hair mass behind the face and shoulders. */}
      <path
        d="M84 66 C80 31 98 14 123 14 C154 14 166 38 162 76 L158 132
           C150 143 139 148 128 146 L130 72 Z"
        fill="url(#hair)"
        stroke="#21191B"
        strokeWidth="1.2"
        filter="url(#soft-body-shadow)"
      />
      <path
        d="M88 55 C82 76 82 111 87 139 C92 145 99 148 107 148 L110 65 Z"
        fill="url(#hair)"
        stroke="#21191B"
        strokeWidth="1.2"
      />

      {/* Softly modelled body, kept beneath all clothing layers. */}
      <g fill="url(#skin)" stroke="#B8876C" strokeWidth=".8" filter="url(#soft-body-shadow)">
        <path d="M106 105 C108 119 106 127 100 133 L140 133 C134 127 132 119 134 105 Z" />
        <path d="M91 133 C101 126 139 126 149 133 C157 161 155 206 146 238
                 C139 251 101 251 94 238 C85 204 83 160 91 133 Z" />
        <path d="M91 137 C79 140 72 148 68 162 L49 249 C47 259 52 270 61 273
                 C68 275 73 267 72 258 L81 199 L99 151 Z" />
        <path d="M149 137 C161 140 168 148 172 162 L191 249 C193 259 188 270 179 273
                 C172 275 167 267 168 258 L159 199 L141 151 Z" />
        <path d="M96 235 C86 264 88 300 94 333 L98 457 C98 471 106 480 117 476
                 L119 327 L120 264 C113 246 105 236 96 235 Z" />
        <path d="M144 235 C154 264 152 300 146 333 L142 457 C142 471 134 480 123 476
                 L121 327 L120 264 C127 246 135 236 144 235 Z" />
      </g>
      <g fill="none" stroke="#B8876C" strokeWidth=".6" opacity=".72" strokeLinecap="round">
        <path d="M53 255 Q56 266 60 270 M57 253 Q60 264 64 268 M62 252 Q64 261 68 264" />
        <path d="M187 255 Q184 266 180 270 M183 253 Q180 264 176 268 M178 252 Q176 261 172 264" />
      </g>

      {/* Head and face */}
      <ellipse
        cx="120"
        cy="70"
        rx="34"
        ry="39"
        fill="url(#face-light)"
        stroke="#B8876C"
        strokeWidth=".9"
        filter="url(#soft-body-shadow)"
      />

      {/* Ears */}
      <g fill="url(#skin)" stroke="#B8876C" strokeWidth=".8">
        <path d="M88 65 C78 61 78 80 89 84 C93 83 94 76 92 69 Z" />
        <path d="M152 65 C162 61 162 80 151 84 C147 83 146 76 148 69 Z" />
      </g>
      <path d="M84 70 Q89 66 90 76" fill="none" stroke="#C9977D" strokeWidth=".8" />
      <path d="M156 70 Q151 66 150 76" fill="none" stroke="#C9977D" strokeWidth=".8" />

      {/* Large almond eyes with warm brown irises */}
      <g>
        <path d="M92 64 Q101 52 112 63 Q102 76 92 64 Z" fill="#FFFDF9" stroke="#3A2A2B" strokeWidth="1.1" />
        <path d="M128 63 Q139 52 148 64 Q138 76 128 63 Z" fill="#FFFDF9" stroke="#3A2A2B" strokeWidth="1.1" />
        <ellipse cx="103" cy="64" rx="6.2" ry="8.2" fill="url(#iris)" stroke="#5A3B35" strokeWidth=".6" />
        <ellipse cx="137" cy="64" rx="6.2" ry="8.2" fill="url(#iris)" stroke="#5A3B35" strokeWidth=".6" />
        <ellipse cx="103" cy="65" rx="2.8" ry="4.4" fill="#21191B" />
        <ellipse cx="137" cy="65" rx="2.8" ry="4.4" fill="#21191B" />
        <circle cx="101" cy="61" r="1.8" fill="white" opacity=".92" />
        <circle cx="135" cy="61" r="1.8" fill="white" opacity=".92" />
        <path d="M91 62 Q101 51 113 61" fill="none" stroke="#2B2023" strokeWidth="2.1" strokeLinecap="round" />
        <path d="M127 61 Q139 51 149 62" fill="none" stroke="#2B2023" strokeWidth="2.1" strokeLinecap="round" />
      </g>

      {/* Brows, nose, freckles, and mouth */}
      <path d="M93 48 Q102 43 111 47" fill="none" stroke="#35282A" strokeWidth="4" strokeLinecap="round" />
      <path d="M129 47 Q138 43 147 48" fill="none" stroke="#35282A" strokeWidth="4" strokeLinecap="round" />
      <path d="M119 65 C117 74 115 80 120 82 C124 82 126 80 126 78" fill="none" stroke="#B77E68" strokeWidth="1.1" strokeLinecap="round" />
      <ellipse cx="108" cy="80" rx="12" ry="5" fill="#D98F84" opacity=".12" />
      <ellipse cx="136" cy="80" rx="12" ry="5" fill="#D98F84" opacity=".12" />
      <g fill="#B77965" opacity=".38">
        <circle cx="101" cy="76" r=".65" /><circle cx="105" cy="78" r=".55" />
        <circle cx="109" cy="76" r=".6" /><circle cx="132" cy="76" r=".6" />
        <circle cx="136" cy="78" r=".55" /><circle cx="140" cy="76" r=".65" />
      </g>
      <path d="M108 92 Q120 88 132 92 Q121 99 108 92 Z" fill="#C98783" stroke="#9C6665" strokeWidth=".6" />
      <path d="M110 92 Q120 94 130 92" fill="none" stroke="#F4C7BC" strokeWidth=".8" />

      {/* Sculpted, side-swept bob and separated hair ribbons */}
      <path
        d="M86 61 C84 35 99 17 122 16 C108 22 101 37 98 54 C94 61 90 65 86 66 Z"
        fill="url(#hair)"
        stroke="#21191B"
        strokeWidth="1.1"
      />
      <path
        d="M98 53 C102 26 124 14 144 25 C137 26 132 32 127 40 C119 51 108 58 98 60 Z"
        fill="url(#hair)"
        stroke="#21191B"
        strokeWidth="1.1"
      />
      <g fill="none" stroke="#795E5C" strokeWidth="1" opacity=".42" strokeLinecap="round">
        <path d="M91 56 C91 39 99 25 111 21" />
        <path d="M98 51 C104 31 118 21 134 22" />
        <path d="M107 48 C116 32 127 25 142 26" />
        <path d="M91 82 C89 103 92 124 97 140" />
        <path d="M153 61 C157 87 155 114 150 135" />
      </g>

      {equipped.dress ? (
        drawGarment(equipped.dress)
      ) : (
        <>
          {equipped.bottom && drawGarment(equipped.bottom)}
          {equipped.top && drawGarment(equipped.top)}
        </>
      )}
      {equipped.shoes && drawGarment(equipped.shoes)}
      {equipped.outerwear && drawGarment(equipped.outerwear)}
      {equipped.bag && drawGarment(equipped.bag)}
      {equipped.jewelry && drawGarment(equipped.jewelry)}
    </svg>
  )
}
