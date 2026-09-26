'use client'

import React, { useState } from 'react'
import { Play } from 'lucide-react'
import { assetPath } from '@/lib/assetPath'

type LiteYouTubeEmbedProps = {
  videoId: string
  title: string
  thumbnail: string
}

const LiteYouTubeEmbed: React.FC<LiteYouTubeEmbedProps> = ({ videoId, title, thumbnail }) => {
  const [playing, setPlaying] = useState(false)

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play video: ${title}`}
          className="group absolute inset-0 h-full w-full focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#ff6900]"
        >
          <img
            src={assetPath(thumbnail)}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#ff6900] text-white shadow-lg transition-transform group-hover:scale-110">
            <Play aria-hidden="true" className="h-8 w-8 translate-x-0.5" fill="currentColor" />
          </span>
        </button>
      )}
    </div>
  )
}

export default LiteYouTubeEmbed
