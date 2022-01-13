import { useRef, useState, useEffect } from "react";
import { Player, PlayerEvent } from "bitmovin-player";
import { UIFactory } from "bitmovin-player-ui";
import "bitmovin-player/bitmovinplayer-ui.css";

const BitmovinPlayer = () => {
  const [copyPlayer, setPlayer] = useState(null);
  const playerContainer = useRef();
  const playerConfig = {
    key: "keykey",
  };

  const plyaerSource = {
    dash: "https://bitdash-a.akamaihd.net/content/MI201109210084_1/mpds/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.mpd",
    hls: "https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8",
    poster:
      "https://bitdash-a.akamaihd.net/content/MI201109210084_1/poster.jpg",
  };

  const setupPlayer = () => {
    const player = new Player(playerContainer.current, playerConfig);
    UIFactory.buildDefaultSmallScreenUI(player);
    player.load(plyaerSource).then(
      () => {
        setPlayer(player);
        console.log("Successfully loaded source");
      },
      () => {
        console.log("Error while loading source");
      }
    );
  };

  useEffect(() => {
    if (copyPlayer === null) {
      setupPlayer();
    }

    return () => {
      if (copyPlayer !== null) {
        copyPlayer.destroy();
        setPlayer(null);
      }
    };
  }, [copyPlayer]);

  const playerKeyboardControl = (e) => {
    if (e.key === "ArrowLeft") {
      console.log("press left arrow");
      copyPlayer?.seek(Math.max(0, copyPlayer.getCurrentTime() - 10));
    }

    if (e.key === "ArrowRight") {
      console.log("press right arrow");
      copyPlayer?.seek(
        Math.min(copyPlayer.getDuration(), copyPlayer.getCurrentTime() + 10)
      );
    }
  };
  // 전체페이지 접속했을 때
  // useEffect(() => {
  //   document.addEventListener('keydown', playerKeyboardControl)
  //   return () => {
  //     document.removeEventListener('keydown', playerKeyboardControl)
  //   }
  // }, [copyPlayer])

  // 재생중일 때 이벤트를 추가하고, 멈췄을 때 이벤트 제거
  useEffect(() => {
    if (copyPlayer) {
      console.log("asdf");
      copyPlayer.on(PlayerEvent.Play, () =>
        document.addEventListener("keydown", playerKeyboardControl)
      );

      copyPlayer.on(PlayerEvent.Paused, () => {
        document.removeEventListener("keydown", playerKeyboardControl);
      })

      copyPlayer.on(PlayerEvent.PlaybackFinished, () => {
        document.removeEventListener("keydown", playerKeyboardControl);
      })
    }


    return () => {
      document.removeEventListener("keydown", playerKeyboardControl);
    };
  }, [copyPlayer]);
  return (
    <>
      <div
        ref={playerContainer}
        style={{ width: 500, height: 500 }}
        // 영상에 포커싱 시키거나 뗏을 떼,
        // onFocus={(e) =>
        //   document.addEventListener("keydown", playerKeyboardControl)
        // }
        // onBlur={() => document.removeEventListener('keydown', playerKeyboardControl)}
      />
      {console.log("asdffs", copyPlayer?.isPlaying())}
    </>
  );
};

export default BitmovinPlayer;
