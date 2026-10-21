using System;
using System.Collections.Generic;
using System.IO;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;

namespace RiftPulse.PCVR.Configuration
{
    [DataContract]
    public sealed class StoredModuleConfig
    {
        public const int CurrentSchemaVersion = 1;

        [DataMember(Name = "schemaVersion", Order = 1)]
        public int SchemaVersion { get; set; }

        [DataMember(Name = "modules", Order = 2)]
        public Dictionary<string, bool> Modules { get; set; }

        public static readonly string[] ModuleIds =
        {
            "chat", "wordFilter", "fontFilter", "antiSpam", "chatbot",
            "chatEmoteRain", "soundAlerts", "textToSpeech", "automaticTranslation",
            "chatIntegrations", "chatRequest", "viewerCount"
        };

        public static StoredModuleConfig CreateDefaults()
        {
            var modules = new Dictionary<string, bool>(StringComparer.Ordinal);
            foreach (var id in ModuleIds) modules[id] = false;
            return new StoredModuleConfig { SchemaVersion = CurrentSchemaVersion, Modules = modules };
        }

        public void EnsureKnownModules()
        {
            if (Modules == null) Modules = new Dictionary<string, bool>(StringComparer.Ordinal);
            foreach (var id in ModuleIds)
            {
                if (!Modules.ContainsKey(id)) Modules[id] = false;
            }
            var known = new HashSet<string>(ModuleIds, StringComparer.Ordinal);
            var remove = new List<string>();
            foreach (var id in Modules.Keys)
            {
                if (!known.Contains(id)) remove.Add(id);
            }
            foreach (var id in remove) Modules.Remove(id);
        }

        public bool IsEnabled(string id)
        {
            bool enabled;
            return Modules != null && Modules.TryGetValue(id, out enabled) && enabled;
        }

        public void SetEnabled(string id, bool enabled)
        {
            if (Array.IndexOf(ModuleIds, id) < 0) throw new ArgumentOutOfRangeException(nameof(id));
            if (Modules == null) Modules = new Dictionary<string, bool>(StringComparer.Ordinal);
            Modules[id] = enabled;
        }
    }

    public sealed class LocalConfigStore
    {
        private readonly string _path;

        public string FilePath => _path;

        public LocalConfigStore(string gameDirectory)
        {
            if (string.IsNullOrWhiteSpace(gameDirectory)) throw new ArgumentException("Game directory is required.", nameof(gameDirectory));
            _path = Path.Combine(gameDirectory, "UserData", "RiftPulse", "config.json");
        }

        public StoredModuleConfig Load(Action<string> warn)
        {
            if (!File.Exists(_path)) return StoredModuleConfig.CreateDefaults();

            try
            {
                var serializer = CreateSerializer();
                using (var stream = File.OpenRead(_path))
                {
                    var config = serializer.ReadObject(stream) as StoredModuleConfig;
                    if (config == null || config.SchemaVersion != StoredModuleConfig.CurrentSchemaVersion)
                    {
                        warn?.Invoke("RiftPulse configuration schema is unsupported; safe defaults are active. The original file was preserved.");
                        return StoredModuleConfig.CreateDefaults();
                    }
                    config.EnsureKnownModules();
                    return config;
                }
            }
            catch (Exception ex)
            {
                warn?.Invoke("RiftPulse configuration could not be read; safe defaults are active. The original file was preserved. " + ex.Message);
                return StoredModuleConfig.CreateDefaults();
            }
        }

        public void Save(StoredModuleConfig config)
        {
            if (config == null) throw new ArgumentNullException(nameof(config));
            config.SchemaVersion = StoredModuleConfig.CurrentSchemaVersion;
            config.EnsureKnownModules();

            var folder = Path.GetDirectoryName(_path);
            if (string.IsNullOrWhiteSpace(folder)) throw new IOException("Could not determine the configuration directory.");
            Directory.CreateDirectory(folder);

            var temporaryPath = _path + ".tmp";
            var backupPath = _path + ".bak";
            try
            {
                using (var stream = new FileStream(temporaryPath, FileMode.Create, FileAccess.Write, FileShare.None))
                {
                    CreateSerializer().WriteObject(stream, config);
                    stream.Flush(true);
                }

                if (File.Exists(_path))
                {
                    File.Replace(temporaryPath, _path, backupPath, true);
                }
                else
                {
                    File.Move(temporaryPath, _path);
                }
            }
            finally
            {
                if (File.Exists(temporaryPath)) File.Delete(temporaryPath);
            }
        }

        private static DataContractJsonSerializer CreateSerializer()
        {
            return new DataContractJsonSerializer(
                typeof(StoredModuleConfig),
                new DataContractJsonSerializerSettings { UseSimpleDictionaryFormat = true });
        }
    }
}
