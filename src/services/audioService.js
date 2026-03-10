/**
 * Централизованный сервис для воспроизведения аудио.
 * Работает с локальными файлами из public/assets/audio
 * и корректно собирает URL для Vite + GitHub Pages.
 */

function resolveAudioUrl(src) {
  if (!src || typeof src !== "string") return "";

  // Внешние ссылки оставляем как есть
  if (/^https?:\/\//i.test(src)) {
    return src;
  }

  // Убираем ./ или / в начале
  const normalized = src.replace(/^\.?\//, "");

  // BASE_URL нужен для GitHub Pages, например /NN_FINEc/
  const base = import.meta.env.BASE_URL || "/";

  return `${base}${normalized}`.replace(/([^:]\/)\/+/g, "$1");
}

class AudioService {
  constructor() {
    this.audio = new Audio();
    this.audio.preload = "metadata";

    this.currentSrc = "";
    this.speed = 1;
    this.status = "idle";
    this.error = null;
    this.listeners = new Set();

    this.audio.addEventListener("play", () => {
      this.status = "playing";
      this.error = null;
      this.emit();
    });

    this.audio.addEventListener("pause", () => {
      if (this.audio.currentTime > 0 && !this.audio.ended) {
        this.status = "paused";
        this.emit();
      }
    });

    this.audio.addEventListener("ended", () => {
      this.status = "ended";
      this.emit();
    });

    this.audio.addEventListener("error", () => {
      this.status = "error";
      this.error = "Аудиофайл недоступен или поврежден.";
      this.emit();
    });

    this.audio.addEventListener("loadedmetadata", () => {
      this.emit();
    });
  }

  subscribe(listener) {
    this.listeners.add(listener);
    listener(this.getState());

    return () => {
      this.listeners.delete(listener);
    };
  }

  emit() {
    const state = this.getState();
    this.listeners.forEach((listener) => listener(state));
  }

  getState() {
    return {
      src: this.currentSrc,
      resolvedSrc: resolveAudioUrl(this.currentSrc),
      speed: this.speed,
      status: this.status,
      error: this.error,
      duration: Number.isFinite(this.audio.duration) ? this.audio.duration : 0,
      currentTime: this.audio.currentTime || 0,
    };
  }

  setSource(src) {
    if (!src) {
      this.stop();
      this.currentSrc = "";
      this.audio.removeAttribute("src");
      this.audio.load();
      this.status = "idle";
      this.error = null;
      this.emit();
      return;
    }

    if (src === this.currentSrc) return;

    this.currentSrc = src;
    this.audio.src = resolveAudioUrl(src);
    this.audio.playbackRate = this.speed;
    this.status = "ready";
    this.error = null;
    this.emit();
  }

  async play(src) {
    if (src) {
      this.setSource(src);
    }

    if (!this.currentSrc) {
      this.status = "error";
      this.error = "Для этой точки не задан аудиофайл.";
      this.emit();
      return;
    }

    try {
      await this.audio.play();
    } catch (error) {
      this.status = "error";
      this.error = "Не удалось запустить воспроизведение.";
      this.emit();
    }
  }

  pause() {
    this.audio.pause();
  }

  stop() {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.status = "stopped";
    this.emit();
  }

  setSpeed(speed) {
    this.speed = speed;
    this.audio.playbackRate = speed;
    this.emit();
  }
}

const audioService = new AudioService();

export { resolveAudioUrl };
export default audioService;