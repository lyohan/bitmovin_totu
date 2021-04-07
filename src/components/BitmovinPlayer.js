import { useRef, useState, useEffect } from 'react'
import { Player } from 'bitmovin-player'
import { UIFactory } from 'bitmovin-player-ui'
import 'bitmovin-player/bitmovinplayer-ui.css'

const BitmovinPlayer = () => {
  const [copyPlayer, setPlayer] = useState(null)
  const playerContainer = useRef()
  const playerConfig = {
    key: 'keykey'
  }

  const plyaerSource = {
    dash: 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/mpds/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.mpd',
    hls: 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8',
    poster: 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/poster.jpg'
  }

  const setupPlayer = () => {
    const player = new Player(playerContainer.current, playerConfig)
    UIFactory.buildDefaultSmallScreenUI(player)
    player.load(plyaerSource).then(() => {
      setPlayer(player)
      console.log('Successfully loaded source')
    },
    () => {
      console.log('Error while loading source')
    }
    )
  }

  
  useEffect(() => {
    if (copyPlayer === null) {
      setupPlayer()
    }

    return () => {
      if (copyPlayer !== null) {
        copyPlayer.destroy()
        setPlayer(null)  
      }
    }
  }, [copyPlayer])

  return <div ref={playerContainer} />
}

export default BitmovinPlayer
