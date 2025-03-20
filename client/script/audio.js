import { showError } from "./utils.js";
import { speakText } from "./tts.js";

let currentAudioBtn = null;

/**
 * Create button for Text to Speech (TTS) using Web Speech API.
 * When pressed, switch between "play" and "stop".
 *
 * @param {string} text - Text to convert.
 * @returns {HTMLButtonElement} TTS button created.
 */
export function createAudioButton(text) {
  const audioBtn = document.createElement("button");
  audioBtn.classList.add("btn", "btn-sm", "ms-2", "btn-light", "border-dark");
  audioBtn.innerHTML = '<i class="bi bi-play-fill"></i>';
  audioBtn.isSpeaking = false; // Field for tracking playing state

  audioBtn.onclick = async () => {
    // Stop if is playing
    if (audioBtn.isSpeaking) {
      window.speechSynthesis.cancel();
      audioBtn.isSpeaking = false;
      audioBtn.innerHTML = '<i class="bi bi-play-fill"></i>';
      return;
    }

    // If there is a button playing, stop it
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      if (currentAudioBtn && currentAudioBtn !== audioBtn) {
        currentAudioBtn.isSpeaking = false;
        currentAudioBtn.innerHTML = '<i class="bi bi-play-fill"></i>';
      }
    }

    // Play the button and set currentAudioBtn
    audioBtn.isSpeaking = true;
    currentAudioBtn = audioBtn;
    audioBtn.innerHTML = '<i class="bi bi-stop-fill"></i>';

    try {
      // Call speakText with callback to reset after finished playing
      speakText(text, () => {
        audioBtn.isSpeaking = false;
        audioBtn.innerHTML = '<i class="bi bi-play-fill"></i>';
      });
    } catch (error) {
      await showError("errorPlayAudio", error.message);
      audioBtn.isSpeaking = false;
      audioBtn.innerHTML = '<i class="bi bi-play-fill"></i>';
    }
  };

  return audioBtn;
}
