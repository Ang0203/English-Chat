import { showError } from "./utils";


/**
 * Get the list of voices after they are loaded.
 *
 * @returns {Promise<SpeechSynthesisVoice[]>} A promise returning an array of voices.
 */
function loadVoices() {
  return new Promise((resolve) => {
    let voices = window.speechSynthesis.getVoices();
    if (voices.length !== 0) {
      resolve(voices);
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        voices = window.speechSynthesis.getVoices();
        resolve(voices);
      };
    }
  });
}

/**
 * Text to Speech using Web Speech API.
 *
 * @async
 * @param {string} text - Text to convert.
 * @param {function} onEnd - Callback after playing.
 */
export async function speakText(text, onEnd) {
    if (!("speechSynthesis" in window)) {
      await showError("errorWebSpeech");
    }
    
    // Get voices available
    const voices = await loadVoices();

    // Create SpeechSynthesisUtterance object with input text
    const utterance = new SpeechSynthesisUtterance(text);
  
    // If there is "Microsoft David", use it, else use first
    const selectedVoice = voices.find(v => v.name.includes("Microsoft David")) || voices[0];
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
  
    // Speech speed
    utterance.rate = 0.9;
  
    // Callback onEnd
    utterance.onend = onEnd;
  
    // Speak
    window.speechSynthesis.speak(utterance);
  }
  