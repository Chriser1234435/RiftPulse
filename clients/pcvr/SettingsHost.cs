using System;
using System.ComponentModel;
using BeatSaberMarkupLanguage.Attributes;
using RiftPulse.PCVR.Configuration;

namespace RiftPulse.PCVR
{
    public sealed class SettingsHost : INotifyPropertyChanged
    {
        private readonly LocalConfigStore _store;
        private readonly IPA.Logging.Logger _logger;
        private StoredModuleConfig _config;
        private string _status = "Development foundation — module handlers are not released.";

        public event PropertyChangedEventHandler PropertyChanged;

        public SettingsHost(IPA.Logging.Logger logger)
        {
            _logger = logger;
            _store = new LocalConfigStore(Environment.CurrentDirectory);
            _config = _store.Load(message => _logger?.Warn(message));
            _logger?.Info("RiftPulse local configuration path: " + _store.FilePath);
        }

        [UIValue("chat-enabled")]
        public bool ChatEnabled { get => _config.IsEnabled("chat"); set => _config.SetEnabled("chat", value); }

        [UIValue("word-filter-enabled")]
        public bool WordFilterEnabled { get => _config.IsEnabled("wordFilter"); set => _config.SetEnabled("wordFilter", value); }

        [UIValue("font-filter-enabled")]
        public bool FontFilterEnabled { get => _config.IsEnabled("fontFilter"); set => _config.SetEnabled("fontFilter", value); }

        [UIValue("anti-spam-enabled")]
        public bool AntiSpamEnabled { get => _config.IsEnabled("antiSpam"); set => _config.SetEnabled("antiSpam", value); }

        [UIValue("chatbot-enabled")]
        public bool ChatbotEnabled { get => _config.IsEnabled("chatbot"); set => _config.SetEnabled("chatbot", value); }

        [UIValue("emote-rain-enabled")]
        public bool EmoteRainEnabled { get => _config.IsEnabled("chatEmoteRain"); set => _config.SetEnabled("chatEmoteRain", value); }

        [UIValue("sound-alerts-enabled")]
        public bool SoundAlertsEnabled { get => _config.IsEnabled("soundAlerts"); set => _config.SetEnabled("soundAlerts", value); }

        [UIValue("tts-enabled")]
        public bool TextToSpeechEnabled { get => _config.IsEnabled("textToSpeech"); set => _config.SetEnabled("textToSpeech", value); }

        [UIValue("translation-enabled")]
        public bool TranslationEnabled { get => _config.IsEnabled("automaticTranslation"); set => _config.SetEnabled("automaticTranslation", value); }

        [UIValue("integrations-enabled")]
        public bool IntegrationsEnabled { get => _config.IsEnabled("chatIntegrations"); set => _config.SetEnabled("chatIntegrations", value); }

        [UIValue("song-requests-enabled")]
        public bool SongRequestsEnabled { get => _config.IsEnabled("chatRequest"); set => _config.SetEnabled("chatRequest", value); }

        [UIValue("viewer-count-enabled")]
        public bool ViewerCountEnabled { get => _config.IsEnabled("viewerCount"); set => _config.SetEnabled("viewerCount", value); }

        [UIValue("status")]
        public string Status
        {
            get => _status;
            private set
            {
                _status = value;
                PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(nameof(Status)));
            }
        }

        [UIAction("save-settings")]
        public void Save()
        {
            try
            {
                _store.Save(_config);
                Status = "Configuration saved locally. Unreleased modules will not run yet.";
                _logger?.Info("RiftPulse configuration saved.");
            }
            catch (Exception ex)
            {
                Status = "Save failed. See RiftPulse log for details.";
                _logger?.Error("RiftPulse could not save local settings: " + ex);
            }
        }

        [UIAction("reset-settings")]
        public void Reset()
        {
            _config = StoredModuleConfig.CreateDefaults();
            RaiseAllModuleProperties();
            Status = "Defaults loaded. Press Save settings to persist them.";
        }

        private void RaiseAllModuleProperties()
        {
            string[] names =
            {
                nameof(ChatEnabled), nameof(WordFilterEnabled), nameof(FontFilterEnabled),
                nameof(AntiSpamEnabled), nameof(ChatbotEnabled), nameof(EmoteRainEnabled),
                nameof(SoundAlertsEnabled), nameof(TextToSpeechEnabled), nameof(TranslationEnabled),
                nameof(IntegrationsEnabled), nameof(SongRequestsEnabled), nameof(ViewerCountEnabled)
            };
            foreach (var name in names) PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(name));
        }
    }
}
