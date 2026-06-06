import React from 'react';

interface LogoProps {
  className?: string;
  size?: number | string;
}

export default function Logo({ className = '', size = '100%' }: LogoProps) {
  return (
    <svg
      id="dryza-brand-logo"
      className={className}
      width={size}
      height={size}
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Gradients for natural tones */}
        <linearGradient id="leafGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1B4D3E" /> {/* Deep forest green */}
          <stop offset="60%" stopColor="#2D8A4E" /> {/* Rich mid green */}
          <stop offset="100%" stopColor="#8ADE53" /> {/* Bright leaf green */}
        </linearGradient>

        <linearGradient id="leafGradSecondary" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#15803D" />
          <stop offset="100%" stopColor="#4ADE80" />
        </linearGradient>

        <linearGradient id="bowlGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#D97706" /> {/* Amber */}
          <stop offset="50%" stopColor="#EA580C" /> {/* Strong Orange */}
          <stop offset="100%" stopColor="#F97316" /> {/* Bright orange */}
        </linearGradient>

        <linearGradient id="dryzaGreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1B4332" />
          <stop offset="100%" stopColor="#2D8A4E" />
        </linearGradient>

        <linearGradient id="dryzaOrangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EA580C" />
          <stop offset="100%" stopColor="#F97316" />
        </linearGradient>

        {/* Text curve helper path (Radius ~ 190 pixels) */}
        <path
          id="textCurvePath"
          d="M 68,212 A 190,192 0 0,1 432,212"
          fill="none"
        />
      </defs>

      {/* 1. Base container: Outer circular badge with elegant shadows */}
      <circle cx="250" cy="250" r="238" fill="#FFFDF8" stroke="#E6E0CB" strokeWidth="3" />
      <circle cx="250" cy="250" r="232" fill="#FDFBF4" stroke="#D3CBB3" strokeWidth="1" />
      
      {/* 2. Concentric Inner Ring Frame */}
      <circle cx="250" cy="250" r="222" fill="none" stroke="#1E4D2B" strokeWidth="5" />
      <circle cx="250" cy="250" r="215" fill="none" stroke="#EA580C" strokeWidth="1" />
      <circle cx="250" cy="250" r="172" fill="none" stroke="#1E4D2B" strokeWidth="2.5" />

      {/* 3. Curved Banners (Bridges top and bottom of inner circle) */}
      {/* Top Banner (Deep forest green filled arc) */}
      <path
        d="M 65,220 C 100,105 400,105 435,220 C 390,174 110,174 65,220 Z"
        fill="#1E4D2B"
      />
      {/* Top Banner Border Accents (Orange lines) */}
      <path
        d="M 65,220 C 100,105 400,105 435,220"
        stroke="#EA580C"
        strokeWidth="3"
        fill="none"
      />
      <path
        d="M 80,210 C 115,115 385,115 420,210"
        stroke="#FFF"
        strokeWidth="1.5"
        strokeDasharray="4 3"
        fill="none"
        opacity="0.8"
      />
      <path
        d="M 110,174 C 180,160 320,160 390,174"
        stroke="#EA580C"
        strokeWidth="3.5"
        fill="none"
      />

      {/* Bottom Banner Curve (Dark green decorative footer link arc) */}
      <path
        d="M 94,375 C 130,442 370,442 406,375 C 360,402 140,402 94,375 Z"
        fill="#1E4D2B"
      />
      <path
        d="M 94,375 C 130,442 370,442 406,375"
        stroke="#EA580C"
        strokeWidth="3"
        fill="none"
      />
      <path
        d="M 140,402 C 180,412 320,412 360,402"
        stroke="#EA580C"
        strokeWidth="3"
        fill="none"
      />

      {/* 4. Upper Arch Banner Text: "PREMIUM DEHYDRATED SPICES" */}
      <text fontFamily="'Space Grotesk', 'Inter', sans-serif" fontWeight="700" fontSize="19.5" fill="#FAF9F5" letterSpacing="4.2">
        <textPath href="#textCurvePath" startOffset="50%" textAnchor="middle">
          PREMIUM DEHYDRATED SPICES
        </textPath>
      </text>

      {/* Tiny decorative leaves flanking the top text */}
      <g transform="translate(62, 218) rotate(-40) scale(0.7)">
        {/* Left leaf */}
        <path d="M 0 0 C 10 -15 20 -15 25 -5 C 15 5 5 5 0 0" fill="#EA580C" />
        <path d="M 0 0 C -10 -15 -20 -15 -25 -5 C -15 5 -5 5 0 0" fill="#E26A11" />
      </g>
      <g transform="translate(438, 218) rotate(40) scale(0.7)">
        {/* Right leaf */}
        <path d="M 0 0 C 10 -15 20 -15 25 -5 C 15 5 5 5 0 0" fill="#EA580C" />
        <path d="M 0 0 C -10 -15 -20 -15 -25 -5 C -15 5 -5 5 0 0" fill="#E26A11" />
      </g>

      {/* 5. Center Iconography Block (Leaf standing on orange boat-crescent) */}
      <g id="center-leaf-crest" transform="translate(0, -5)">
        {/* Sparkling star directly to the right of the central foliage */}
        <path
          d="M 298,131 L 301,136 L 307,137 L 302,141 L 304,147 L 298,143 L 292,147 L 294,141 L 289,137 L 295,136 Z"
          fill="#8ADE53"
        />

        {/* Dynamic Stylized Green leaf standing tall */}
        {/* Back stem path */}
        <path
          d="M 235,175 C 230,135 245,100 270,85 C 255,115 250,145 250,175 Z"
          fill="url(#leafGrad)"
        />
        <path
          d="M 250,175 C 250,145 255,115 270,85 C 280,110 275,135 255,175 Z"
          fill="#A3E635"
          opacity="0.35"
        />
        {/* Center leaf rib */}
        <path
          d="M 250,175 C 248,145 253,115 270,85"
          stroke="#FAF9F5"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.9"
        />

        {/* Dual Orange Bowl/Crescent base */}
        <path
          d="M 172,154 C 182,174 212,185 250,185 C 288,185 318,174 328,154 C 304,179 265,181 250,181 C 235,181 196,179 172,154 Z"
          fill="url(#bowlGrad)"
        />
        <path
          d="M 185,152 C 205,171 228,175 250,175 C 272,175 295,171 315,152 C 295,166 272,169 250,169 C 228,169 205,166 185,152 Z"
          fill="#FFF"
          opacity="0.25"
        />
      </g>

      {/* 6. Dominant Brand Name Typography: DRYZA */}
      <g id="brand-typography-dryza" transform="translate(0, -6)">
        {/* We build the custom styled "DRYZA" text with vector leaves sprouting on letters */}
        
        {/* Custom text positioning */}
        {/* D - green with leaf decoration */}
        <text
          x="142"
          y="288"
          fontFamily="'Space Grotesk', 'Inter', sans-serif"
          fontWeight="900"
          fontSize="76"
          fill="url(#dryzaGreenGrad)"
          letterSpacing="-3"
        >
          D
        </text>

        {/* Sprouting leaf on letter D */}
        <g transform="translate(136, 252) rotate(-22) scale(0.6)">
          <path
            d="M 0,0 C 25,-12 35,5 15,22 C -5,5 -15,-5 0,0"
            fill="url(#leafGradSecondary)"
            stroke="#1B4332"
            strokeWidth="1"
          />
          {/* Accent rib */}
          <path d="M 0,0 Q 15,4 15,22" fill="none" stroke="#FAF9F5" strokeWidth="0.8" />
        </g>
        <g transform="translate(122, 274) rotate(-50) scale(0.48)">
          <path
            d="M 0,0 C 25,-12 35,5 15,22 C -5,5 -15,-5 0,0"
            fill="url(#leafGradSecondary)"
            stroke="#1B4332"
            strokeWidth="1"
          />
        </g>

        {/* R - Rich green */}
        <text
          x="198"
          y="288"
          fontFamily="'Space Grotesk', 'Inter', sans-serif"
          fontWeight="900"
          fontSize="76"
          fill="#2D8A4E"
          letterSpacing="-3"
        >
          R
        </text>

        {/* Y - Dual color transition green-orange */}
        <text
          x="251"
          y="288"
          fontFamily="'Space Grotesk', 'Inter', sans-serif"
          fontWeight="900"
          fontSize="76"
          fill="url(#dryzaGreenGrad)"
          letterSpacing="-3"
        >
          Y
        </text>

        {/* Z - Bold gold orange */}
        <text
          x="294"
          y="288"
          fontFamily="'Space Grotesk', 'Inter', sans-serif"
          fontWeight="900"
          fontSize="76"
          fill="url(#dryzaOrangeGrad)"
          letterSpacing="-3"
        >
          Z
        </text>

        {/* A - Hot orange with leaf decoration */}
        <text
          x="346"
          y="288"
          fontFamily="'Space Grotesk', 'Inter', sans-serif"
          fontWeight="900"
          fontSize="76"
          fill="url(#dryzaOrangeGrad)"
          letterSpacing="-3"
        >
          A
        </text>

        {/* Sprouting leaf on letter A */}
        <g transform="translate(422, 240) scale(-0.6, 0.6) rotate(65)">
          <path
            d="M 0,0 C 25,-12 35,5 15,22 C -5,5 -15,-5 0,0"
            fill="url(#leafGradSecondary)"
            stroke="#1B4332"
            strokeWidth="1"
          />
          {/* Accent rib */}
          <path d="M 0,0 Q 15,4 15,22" fill="none" stroke="#FAF9F5" strokeWidth="0.8" />
        </g>
      </g>

      {/* 7. Underlining descriptor: "SPICES" */}
      <g id="brand-spices-text" transform="translate(0, 5)">
        {/* Spaced "SPICES" flanked by corporate precision lines */}
        <text
          x="250"
          y="328"
          fontFamily="'Space Grotesk', 'Inter', sans-serif"
          fontWeight="800"
          fontSize="30"
          fill="#F56F14"
          letterSpacing="12.5"
          textAnchor="middle"
        >
          SPICES
        </text>

        {/* Left triple line accent */}
        <line x1="86" y1="318" x2="155" y2="318" stroke="#1E4D2B" strokeWidth="3" strokeLinecap="round" />
        <line x1="120" y1="324" x2="155" y2="324" stroke="#EA580C" strokeWidth="1.5" strokeLinecap="round" />

        {/* Right triple line accent */}
        <line x1="345" y1="318" x2="414" y2="318" stroke="#1E4D2B" strokeWidth="3" strokeLinecap="round" />
        <line x1="345" y1="324" x2="380" y2="324" stroke="#EA580C" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* 8. Hindi Tagline: "शुद्ध । सूखा । स्वादिष्ट ।" (Pure | Dry | Delicious) */}
      <g id="hindi-tagline" transform="translate(0, 10)">
        <text
          x="250"
          y="361"
          fontFamily="'Inter', 'Noto Sans Devanagari', sans-serif"
          fontWeight="700"
          fontSize="20.5"
          fill="#1C3D27"
          letterSpacing="1"
          textAnchor="middle"
        >
          शुद्ध  ।  सूखा  ।  स्वादिष्ट  ।
        </text>
      </g>

      {/* 9. Botanic wheat/leaf design ornament below Hindi tagline */}
      <g id="bottom-botanic-ornament" transform="translate(250, 395) scale(0.95)">
        {/* Core stems */}
        <path d="M -70,-8 Q 0,16 70,-8" stroke="#EE7F22" strokeWidth="2.2" fill="none" />
        
        {/* Center leaf */}
        <path d="M 0,-15 C -8,-2 -6,12 0,14 C 6,12 8,-2 0,-15" fill="#EE7F22" />

        {/* Left leaf 1 */}
        <path d="M -22,-14 C -29,-3 -22,10 -16,11 C -10,12 -15,-1 -22,-14" fill="#EE7F22" />
        {/* Left leaf 2 */}
        <path d="M -46,-10 C -52,1 -41,11 -35,11 C -29,11 -39,1 -46,-10" fill="#EE7F22" />

        {/* Right leaf 1 */}
        <path d="M 22,-14 C 15,-1 10,12 16,11 C 22,10 29,-3 22,-14" fill="#EE7F22" />
        {/* Right leaf 2 */}
        <path d="M 46,-10 C 39,1 29,11 35,11 C 41,11 52,1 -46,-10" fill="#EE7F22" />
      </g>
    </svg>
  );
}
