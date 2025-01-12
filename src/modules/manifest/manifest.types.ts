export type ManifestEnvironment = "development" | "production";

export type ManifestIconMimetype =
  | "png"
  | "bmp"
  | "gif"
  | "jpg"
  | "icon"
  | "jpeg";

export type ManifestIcons = Record<string, `${string}.${ManifestIconMimetype}`>;

export interface ManifestAction {
  default_icon?: ManifestIcons;
  default_title?: string;
  default_popup?: string;
}

export interface ManifestChromeOverridesSearchProvider {
  name?: string;
  keyword?: string;
  search_url?: string;
  favicon_url?: string;
  suggest_url?: string;
  instant_url?: string;
  image_url?: string;
  search_url_post_params?: string;
  suggest_url_post_params?: string;
  instant_url_post_params?: string;
  image_url_post_params?: string;
  alternate_urls?: string[];
  encoding?: "UTF-8";
  is_default?: boolean;
}

export interface ManifestChromeOverrideSettings {
  homepage?: string;
  search_provider?: ManifestChromeOverridesSearchProvider;
  startup_pages?: string;
}

export interface ManifestCommandSuggestedKey {
  default?: string;
  mac?: string;
  windows?: string;
  chromeos?: string;
  linux?: string;
}

export interface ManifestCommand {
  suggested_key: ManifestCommandSuggestedKey;
  description?: string;
}

export type ManifestRunAt = "document_start" | "document_end" | "document_idle";

export type ManifestExecutionWorld = "ISOLATED" | "MAIN";

export interface ManifestContentScript {
  matches: string[];
  css?: string[];
  js?: string[];
  run_at?: ManifestRunAt[];
  match_about_blank?: boolean;
  match_origin_as_fallback?: boolean;
  world: ManifestExecutionWorld;
}

export interface ManifestSecurityPolicy {
  extension_pages: string;
  sandbox?: string;
}

export interface ManifestDeclarativeNetRequestRuleSource {
  id: string;
  enabled: boolean;
  path: string;
}

export type ManifestDeclarativeNetRequestPermission =
  | "declarativeNetRequest"
  | "declarativeNetRequestWithHostAccess"
  | "declarativeNetRequest"
  | "declarativeNetRequestFeedback"
  | "declarativeNetRequestWithHostAccess";

export interface ManifestDeclarativeNetRequest {
  rule_resources: ManifestDeclarativeNetRequestRuleSource[];
  permissions: ManifestDeclarativeNetRequestPermission[];
  host_permissions: string;
}

export interface ManifestExternallyConnectable {
  ids: string[];
  matches: string[];
  accepts_lts_channel_id?: boolean;
}

export type ManifestIncognito = "spanning" | "split" | "not_allowed";

export interface ManifestOAuth2 {
  client_id: string;
  scopes: string[];
}

export interface ManifestOmnibox {
  [key: string]: string;
}

export type ManifestPermission =
  | "debugger"
  | "declarativeNetRequest"
  | "devtools"
  | "geolocation"
  | "mdns"
  | "proxy"
  | "tts"
  | "ttsEngine"
  | "wallpaper"
  | "sidePanel"
  | string;

export interface ManifestRequirement {
  features: string[];
}

export interface ManifestSandbox {
  pages: string[];
}

export interface ManifestSidePanel {
  default_path: string;
}

export interface ManifestStorage {
  managed_schema: string;
}

export interface ManifestTTSEngine {
  voices: ManifestTTSEngineVoice[];
}

export type ManifestTTSEngineVoiceEventType =
  | "start"
  | "word"
  | "sentence"
  | "marker"
  | "end"
  | "error";

export interface ManifestTTSEngineVoice {
  voice_name: string;
  lang: string;
  event_types: ManifestTTSEngineVoiceEventType[];
}

export interface ManifestWebAccessibleResource {
  resources: string[];
  matches: string[];
}

export interface Manifest {
  manifest_version: 3;
  name: string;
  version: `${number}.${number}.${number}`;

  // required by Chrome web store
  description?: string;
  icons?: ManifestIcons;

  // optionals
  action?: ManifestAction;
  author?: string;
  background?: string;
  chrome_settings_overrides?: ManifestChromeOverrideSettings;
  chrome_url_overrides?: Record<string, string>;
  commands?: Record<string, ManifestCommand>;
  content_scripts?: ManifestContentScript[];
  content_security_policy?: ManifestSecurityPolicy;
  default_locale?: string;
  devtools_page?: string;
  export?: Record<string, string>;
  externally_connectable?: ManifestExternallyConnectable;
  incognito?: ManifestIncognito;
  key?: string;
  minimum_chrome_version?: string;
  oauth2?: ManifestOAuth2;
  omnibox?: ManifestOmnibox;
  optional_host_permissions?: string[];
  optional_permissions?: ManifestPermission[];
  host_permissions?: string[];
  permissions?: ManifestPermission[];
  requirements?: Record<string, ManifestRequirement>;
  sandbox?: ManifestSandbox;
  short_name?: string;
  side_panel?: ManifestSidePanel;
  storage?: ManifestStorage;
  tts_engine?: ManifestTTSEngine;
  update_url?: string;
  version_name?: string;
  web_accessible_resources?: ManifestWebAccessibleResource[];

  cross_origin_embedder_policy?: string; //! not secure
  cross_origin_opener_policy?: string; //! not secure
  declarative_net_request?: ManifestDeclarativeNetRequest; //! not secure
}
