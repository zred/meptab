class SpeechSynthesisService {
    constructor() {
        this.synth = window.speechSynthesis;
        this.voices = [];
        this.chineseVoice = null;
    }

    async initialize() {
        await this.setVoices();
    }

    async setVoices() {
        return new Promise((resolve) => {
            const loadVoices = () => {
                this.voices = this.synth.getVoices();
                this.chineseVoice = this.voices.find(voice => voice.lang.includes('zh'));
                resolve();
            };

            if (this.synth.getVoices().length > 0) {
                loadVoices();
            } else {
                this.synth.onvoiceschanged = loadVoices;
            }
        });
    }

    speak(text, isEnglish) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = isEnglish ? null : this.chineseVoice;
        utterance.lang = isEnglish ? 'en-US' : 'zh-CN';
        this.synth.speak(utterance);
    }
}

export async function initializeSpeech() {
    const speechService = new SpeechSynthesisService();
    await speechService.initialize();
    return speechService;
}