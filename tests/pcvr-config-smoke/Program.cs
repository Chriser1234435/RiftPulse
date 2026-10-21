using System;
using System.IO;
using RiftPulse.PCVR.Configuration;

static void Require(bool condition, string message)
{
    if (!condition) throw new InvalidOperationException(message);
}

var root = Path.Combine(Path.GetTempPath(), "RiftPulse.ConfigSmoke." + Guid.NewGuid().ToString("N"));
Directory.CreateDirectory(root);
try
{
    var store = new LocalConfigStore(root);
    var warnings = 0;
    var config = store.Load(_ => warnings++);
    Require(config.SchemaVersion == 1, "default schema version must be 1");
    Require(StoredModuleConfig.ModuleIds.Length == 12, "the config must expose twelve stable modules");
    Require(StoredModuleConfig.ModuleIds.All(id => !config.IsEnabled(id)), "every module must default off");
    Require(warnings == 0, "missing config should not be treated as corruption");

    config.SetEnabled("wordFilter", true);
    config.SetEnabled("antiSpam", true);
    store.Save(config);
    Require(File.Exists(store.FilePath), "Save must write config.json");
    var json = File.ReadAllText(store.FilePath);
    Require(json.Contains("\"schemaVersion\":1", StringComparison.Ordinal), "written JSON must carry schemaVersion 1");
    Require(json.Contains("\"wordFilter\":true", StringComparison.Ordinal), "written JSON must include the selected state");

    var loaded = store.Load(_ => warnings++);
    Require(loaded.IsEnabled("wordFilter"), "enabled preference must survive reload");
    Require(loaded.IsEnabled("antiSpam"), "second enabled preference must survive reload");
    Require(!loaded.IsEnabled("chat"), "unselected modules must remain disabled");

    File.WriteAllText(store.FilePath, "{\"schemaVersion\":999,\"modules\":{\"wordFilter\":true}}");
    var versionFallback = store.Load(_ => warnings++);
    Require(versionFallback.SchemaVersion == 1 && !versionFallback.IsEnabled("wordFilter"), "unsupported schema must use safe defaults");
    Require(File.ReadAllText(store.FilePath).Contains("999", StringComparison.Ordinal), "unsupported original config must remain preserved");

    File.WriteAllText(store.FilePath, "{broken json");
    var malformedFallback = store.Load(_ => warnings++);
    Require(malformedFallback.SchemaVersion == 1 && !malformedFallback.IsEnabled("antiSpam"), "malformed config must use safe defaults");
    Require(File.ReadAllText(store.FilePath) == "{broken json", "malformed original config must remain preserved");

    Require(warnings == 2, "schema mismatch and malformed config should each emit a warning");
    Console.WriteLine("PCVR config smoke tests passed: 12 safe-off defaults, JSON persistence/reload, version mismatch fallback, malformed-config fallback, and corrupt-file preservation.");
}
finally
{
    try { Directory.Delete(root, true); } catch { }
}
