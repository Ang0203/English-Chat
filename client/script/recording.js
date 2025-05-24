import { showError } from "./utils.js";

let recognition = null;
let isRecording = false;

/**
 * Checks if voice recording is currently active.
 *
 * @returns {boolean} Returns true if recording is active, otherwise false.
 */
export function isVoiceRecording() {
    return isRecording;
}

/**
 * Starts voice recording using the Web Speech API.
 *
 * Checks for browser support of the Web Speech API, creates a SpeechRecognition instance,
 * and sets up event handlers to update the user input with the recognized speech.
 *
 * @async
 * @param {HTMLInputElement} userInput - The input element where the recognized speech is displayed.
 * @param {HTMLElement} sendIcon - The icon element that indicates the recording state.
 */
export async function startRecording(userInput, sendIcon) {
    if (!("SpeechRecognition" in window) && !("webkitSpeechRecognition" in window)) {
        await showError("errorVoiceNotSupported");
        return;
    }
    const recordingOverlay = document.getElementById("recordingOverlay");
    const stopRecordingBtn = document.getElementById("stopRecordingBtn");
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    recognition = new SpeechRecognition();
    recognition.lang = "en";
    recognition.interimResults = true;

    recognition.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
        }
        userInput.value = transcript;
    };

    recognition.onerror = async () => {
        await showError("errorVoiceRecording");
    };

    recognition.onend = () => {
        sendIcon.classList.replace("bi-stop", "bi-mic");
        isRecording = false;
        recordingOverlay.classList.add("d-none"); // Hide overlay on end
    };

    // Hide over on clicking stop button
    stopRecordingBtn.addEventListener("click", () => {
        stopRecording();
        recordingOverlay.classList.add("d-none");
    });

    // Start recording
    recognition.start();
    isRecording = true;
    sendIcon.classList.replace("bi-mic", "bi-stop");
    recordingOverlay.classList.remove("d-none"); // Show overlay on start 
}

/**
 * Stops the ongoing voice recording.
 *
 * If the SpeechRecognition instance is active, this function stops the recording.
 */
export function stopRecording() {
    if (recognition && isRecording) {
        recognition.stop();
    }
}