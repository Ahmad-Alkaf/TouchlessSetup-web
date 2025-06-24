export type WinGetCategory = {
  name: string;
  apps: (WinGetApp & { icon: string; })[];
}

/**
 * Normalised information derived from a root winget manifest
 * (`*.yaml`) plus (optionally) its related installer / locale files.
 *
 * All fields except the first six are optional so that your code base
 * continues to compile even when an upstream manifest omits them.
 */
export interface WinGetApp {
  /** `PackageIdentifier` – the canonical ID used by winget (e.g. `"Microsoft.VisualStudioCode"`). */
  id: string;

  /** `PackageName` / `Name` – product’s display name (`"Visual Studio Code"`). */
  name: string;

  /** `PackageVersion` / `Version` – semantic version string (`"1.90.0"`). */
  version: string;

  /** `ShortDescription` / `Description` – one-line summary shown in search results. */
  shortDescription: string;

  /** `Publisher` / `Author` – company or individual who owns the software (`"Microsoft"`). */
  publisher: string;

  /** `Tags[]` – keywords that help users filter (`["editor", "code", "microsoft"]`). */
  tags: string[];

  /** Custom field `VerifiedSilence` – whether the app is verified to be installed silently. */
  verifiedSilence: boolean;

  /** Custom field `Icon` – the icon of the app. */
  icon?: string;

  /** `PublisherUrl` – vendor’s web page. */
  publisherUrl?: string;

  /** `Description` – summary of the package. */
  description?: string;

  /** `ReleaseDate` – first availability of this version; may be absent. */
  releaseDate?: Date;

  /** `Moniker` – the short alias accepted by the CLI (`winget install vscode`). */
  moniker?: string;

  /** `PackageUrl` / `Homepage` – official product web page. */
  packageUrl?: string;

  /** `PublisherSupportUrl` / `SupportUrl` – vendor’s support URL page, for help desk or issue tracker. */
  supportUrl?: string;

  /** `Copyright` – copyright notice. */
  copyright?: string;

  /** `CopyrightUrl` – copyright URL. */
  copyrightUrl?: string;

  /** `License` – SPDX string or plain text (`"MIT"`, `"Proprietary"`). */
  license?: string;

  /** `LicenseUrl` – link to full licence document. */
  licenseUrl?: string;

  /** `ReleaseNotes` (or `ReleaseNotesUrl`) – “What’s new” text or link. */
  // releaseNotes?: string;

  /** `Channel` – distinguishes stable/beta/nightly release streams. */
  // channel?: string;

  /** `MinimumOSVersion` – guard rail for outdated Windows builds. */
  // minOSVersion?: string;

  /** From `Installers[].InstallerType` – MSI, EXE, MSIX, ZIP … */
  installerType?: string;

  /** Approx. download size in **bytes** (useful for metered connections). */
  installerSize?: number;

  /** Primary `InstallerUrl` – direct download link for the installer binary. */
  downloadUrl?: string;

  /** `ProductCode` (MSI GUID) – needed for scripted uninstall/upgrade. */
  productCode?: string;

  /** Result of an Authenticode check on the installer’s signature. */
  // signatureVerified?: boolean;

  /** ISO locale codes present in `*.locale.<lang>.yaml` manifests (`["en-US", "fr-FR"]`). */
  // locales?: string[];

  /** `Icons[].Url` – small square logo for storefront UI. */
  // iconUrl?: string;

  /** External popularity metric (e.g. GitHub release downloads). */
  // downloadCount?: number;
}
