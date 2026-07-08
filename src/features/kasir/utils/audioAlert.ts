// src/features/kasir/utils/audioAlert.ts
export function playTimerAlarm() {
  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // Nada Beep tinggi
  gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime); // Volume

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start();
  oscillator.stop(audioCtx.currentTime + 1.5); // Berbunyi selama 1.5 detik
}