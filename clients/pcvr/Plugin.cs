using System;
using BeatSaberMarkupLanguage.Settings;
using BeatSaberMarkupLanguage.Util;
using IPA;
using IPA.Logging;
using RiftPulse.PCVR.Configuration;

namespace RiftPulse.PCVR
{
    [Plugin(RuntimeOptions.DynamicInit)]
    public sealed class Plugin
    {
        private static Logger _logger;
        private bool _settingsMenuRegistered;
        private SettingsHost _settingsHost;

        [Init]
        public void Init(Logger logger)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _settingsHost = new SettingsHost(_logger);
            _logger.Info("RiftPulse PCVR foundation initialized. Runtime modules remain explicitly unreleased.");
        }

        [OnEnable]
        public void OnEnable()
        {
            MainMenuAwaiter.MainMenuInitializing -= RegisterSettingsMenu;
            MainMenuAwaiter.MainMenuInitializing += RegisterSettingsMenu;
            _logger?.Info("RiftPulse waiting for Beat Saber main menu initialization.");
        }

        [OnDisable]
        public void OnDisable()
        {
            MainMenuAwaiter.MainMenuInitializing -= RegisterSettingsMenu;
            RemoveSettingsMenu();
        }

        [OnExit]
        public void OnApplicationQuit()
        {
            MainMenuAwaiter.MainMenuInitializing -= RegisterSettingsMenu;
            RemoveSettingsMenu();
            _logger?.Info("RiftPulse PCVR foundation stopped.");
        }

        internal static void LogInfo(string message) => _logger?.Info(message);
        internal static void LogWarn(string message) => _logger?.Warn(message);

        private void RegisterSettingsMenu()
        {
            if (_settingsMenuRegistered || _settingsHost == null) return;

            try
            {
                BSMLSettings.Instance.AddSettingsMenu(
                    name: "RiftPulse",
                    resource: "RiftPulse.Settings.bsml",
                    host: _settingsHost);
                _settingsMenuRegistered = true;
                _logger?.Info("RiftPulse in-game Settings tab registered.");
            }
            catch (Exception ex)
            {
                _logger?.Error("RiftPulse could not register its BSML Settings tab: " + ex);
            }
        }

        private void RemoveSettingsMenu()
        {
            if (!_settingsMenuRegistered || _settingsHost == null) return;

            try
            {
                BSMLSettings.Instance.RemoveSettingsMenu(_settingsHost);
                _settingsMenuRegistered = false;
            }
            catch (Exception ex)
            {
                _logger?.Warn("RiftPulse could not remove its BSML Settings tab cleanly: " + ex.Message);
            }
        }
    }
}
