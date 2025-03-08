import { PauseIcon, PlayIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface AudioPlayerProps {
  src: string;
  autoplay?: boolean;
  onAudioEnabled?: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, onAudioEnabled }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Handle user interaction
  const handleInteraction = () => {
    const audioRefCurrent = audioRef.current;
    if (!hasInteracted && audioRefCurrent) {
      setHasInteracted(true);

      audioRefCurrent
        .play()
        .then(() => {
          setIsPlaying(true);
          console.log("Audio playing successfully");
          // Notify parent component that audio is enabled
          if (onAudioEnabled) {
            onAudioEnabled();
          }
        })
        .catch((error) => {
          console.error("Audio playback failed:", error);
          setIsPlaying(false);
          // Still call the callback even if audio fails, so the page content is shown
          if (onAudioEnabled) {
            onAudioEnabled();
          }
        });
    }
  };

  // Setup audio element when component mounts
  useEffect(() => {
    const audioRefCurrent = audioRef.current;
    if (audioRefCurrent) {
      // Set up audio event listeners
      const handleEnded = () => setIsPlaying(false);
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);

      audioRefCurrent.addEventListener("ended", handleEnded);
      audioRefCurrent.addEventListener("play", handlePlay);
      audioRefCurrent.addEventListener("pause", handlePause);

      return () => {
        if (audioRefCurrent) {
          audioRefCurrent.removeEventListener("ended", handleEnded);
          audioRefCurrent.removeEventListener("play", handlePlay);
          audioRefCurrent.removeEventListener("pause", handlePause);
        }
      };
    }
  }, []);

  return (
    <div className="audio-player-container">
      {/* Hidden audio element */}
      <audio ref={audioRef} src={src} loop />

      {/* Interaction overlay - shown until user interacts */}
      {!hasInteracted && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              padding: "20px 40px",
              backgroundColor: "white",
              borderRadius: "8px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "15px",
            }}
          >
            <h2 className="text-black font-bold" style={{ margin: 0 }}>
              Enable Audio
            </h2>
            <p
              className="text-black"
              style={{ margin: 0, textAlign: "center" }}
            >
              This page contains audio content.
              <br />
              Click the button below to enable audio playback.
            </p>
            <button
              onClick={handleInteraction}
              className="px-8 py-4 mt-4 text-lg font-semibold bg-yellow-500 text-emerald-900 
        rounded-full shadow-lg hover:shadow-xl 
        transition-all duration-300 hover:-translate-y-1 
        relative overflow-hidden group cursor-pointer"
            >
              Play audio first?
            </button>
          </div>
        </div>
      )}

      {/* Optional audio controls (you can show/hide based on your needs) */}
      {hasInteracted && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 100,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          <button
            onClick={() => {
              if (audioRef.current) {
                if (isPlaying) {
                  audioRef.current.pause();
                } else {
                  audioRef.current.play();
                }
              }
            }}
            style={{
              background: "none",
              border: "none",
              color: "white",
              cursor: "pointer",
              fontSize: "16px",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            {isPlaying ? (
              <>
                <PauseIcon /> Pause audio
              </>
            ) : (
              <>
                <PlayIcon /> Play audio
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;
