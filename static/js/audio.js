const player = document.getElementById("music-player");
player.volume = 0.1;
const audio_on_button = document.getElementById("audi_on");
const audio_off_button = document.getElementById("audio_off");
const audio_wave = document.getElementById("audio_wave");

audio_on = () => {
  player.volume = 0.0;
  audio_on_button.style.display = "none";
  audio_off_button.style.display = "inline";
  audio_wave.style.display = "none";
};
audio_off = () => {
  player.volume = 0.1;
  audio_on_button.style.display = "inline";
  audio_off_button.style.display = "none";
  audio_wave.style.display = "inline";
};

audio_on_button.addEventListener("click", audio_on);
audio_off_button.addEventListener("click", audio_off);
