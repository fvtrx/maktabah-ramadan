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
  const [isAudioSupported, setIsAudioSupported] = useState(true);

  // Handle user interaction
  const handleInteraction = () => {
    if (!hasInteracted && audioRef.current) {
      const audioRefCurrent = audioRef.current;
      setHasInteracted(true);

      // Verify that the src is valid before attempting to play
      if (!src || src.trim() === "") {
        console.error("Audio source is empty or invalid");
        setIsAudioSupported(false);
        // Still call the callback so the page content is shown
        if (onAudioEnabled) {
          onAudioEnabled();
        }
        return;
      }

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
          setIsAudioSupported(false);
          // Still call the callback even if audio fails, so the page content is shown
          if (onAudioEnabled) {
            onAudioEnabled();
          }
        });
    }
  };

  // Verify audio source and format support when src changes
  useEffect(() => {
    if (audioRef.current) {
      // Reset audio support status when src changes
      setIsAudioSupported(true);

      // Check if the src is valid
      if (!src || src.trim() === "") {
        console.error("Audio source is empty or invalid");
        setIsAudioSupported(false);
      }
    }
  }, [src]);

  // Setup audio element when component mounts
  useEffect(() => {
    if (audioRef.current) {
      const audioRefCurrent = audioRef.current;

      // Set up audio event listeners
      const handleEnded = () => setIsPlaying(false);
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      const handleError = (e: Event) => {
        console.error("Audio error:", e);
        setIsAudioSupported(false);
        setIsPlaying(false);
      };

      audioRefCurrent.addEventListener("ended", handleEnded);
      audioRefCurrent.addEventListener("play", handlePlay);
      audioRefCurrent.addEventListener("pause", handlePause);
      audioRefCurrent.addEventListener("error", handleError);

      return () => {
        if (audioRefCurrent) {
          audioRefCurrent.removeEventListener("ended", handleEnded);
          audioRefCurrent.removeEventListener("play", handlePlay);
          audioRefCurrent.removeEventListener("pause", handlePause);
          audioRefCurrent.removeEventListener("error", handleError);
        }
      };
    }
  }, []);

  return (
    <div className="audio-player-container">
      {/* Hidden audio element with multiple source options for better compatibility */}
      <audio ref={audioRef} preload="metadata">
        {src && (
          <>
            {/* Try to determine the type based on file extension */}
            {src.endsWith(".mp3") && <source src={src} type="audio/mpeg" />}
            {src.endsWith(".wav") && <source src={src} type="audio/wav" />}
            {src.endsWith(".ogg") && <source src={src} type="audio/ogg" />}
            {src.endsWith(".m4a") && <source src={src} type="audio/mp4" />}
            {/* Fallback source with no type specified */}
            <source src={src} />
          </>
        )}
        Your browser does not support the audio element.
      </audio>

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

      {/* Optional audio controls (only show if audio is supported) */}
      {hasInteracted && isAudioSupported && (
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
                  audioRef.current.play().catch((err) => {
                    console.error("Error on manual play:", err);
                    setIsAudioSupported(false);
                  });
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

      {/* Error message when audio is not supported */}
      {hasInteracted && !isAudioSupported && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 100,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            padding: "10px",
            borderRadius: "5px",
            color: "white",
          }}
        >
          Audio playback not supported. Please try a different browser or audio
          format.
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;
