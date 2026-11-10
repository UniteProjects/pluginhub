# Deine kostenlose Plugin-Website: Schritt für Schritt

Das Projekt ist eine **statische Website**. Du brauchst dafür **keinen eigenen Server, keine Datenbank und kein kostenpflichtiges Abo**. Es gibt einen Katalog und einen lokalen Editor.

## Was ist enthalten?

- `index.html`: öffentliche Plugin-Download-Seite
- `admin.html`: lokaler Editor zum Bearbeiten des Katalogs
- `plugins.js`: Plugin-Liste und Website-Einstellungen (diese Datei wird beim Export neu erzeugt)
- `app.js`, `admin.js`, `styles.css`: Funktionen und Design
- `demo-plugin.zip`: ein **Testdownload**, kein installierbares echtes Plugin
- `favicon.svg`: Logo im Browser-Tab
- `.nojekyll`: GitHub-Pages-Hilfsdatei

## 1. Die Website kostenlos online stellen

1. Erstelle einen kostenlosen Account auf [github.com](https://github.com).
2. Gehe zu **https://github.com/new** und lege ein neues Repository mit dem Namen `pluginhub` an. Stelle es auf **Public**. (Bei GitHub Free muss das Repository für GitHub Pages öffentlich sein.)
3. Öffne das Repository. Klicke auf **Add file → Upload files** (Datei hinzufügen → Dateien hochladen).
4. Entpacke diese Projekt-ZIP **auf deinem Computer**. Lade die **Dateien aus dem entpackten Ordner** hoch (nicht nur die Projekt-ZIP), sodass `index.html` direkt im Hauptverzeichnis des Repositorys liegt. Die Datei `.nojekyll` ist optional.
5. Klicke unten auf **Commit changes**.
6. Öffne im Repository **Settings → Pages**.
7. Bei **Build and deployment** stelle **Source** auf **Deploy from a branch**, wähle **main** und **/(root)**, dann **Save**.
8. Deine Website wird unter `https://DEIN-GITHUB-NAME.github.io/pluginhub/` erreichbar sein. Den Link findest du auch bei **Settings → Pages → Visit site**. Die erste Veröffentlichung kann einige Minuten dauern.

**Wichtig:** Der Name `DEIN-GITHUB-NAME` muss durch deinen tatsächlichen GitHub-Nutzernamen ersetzt werden. Verwende keine Zugangsdaten/Passwörter in den Dateien.

## 2. Echte Plugins bereitstellen

### Option A: Kleine Dateien direkt hochladen

1. Öffne dein GitHub-Repository und klicke **Add file → Upload files**.
2. Lade z. B. `meinplugin.zip` oder `meinplugin.jar` in das **Hauptverzeichnis** des Repositorys hoch (gleiche Ebene wie `index.html`).
3. Klicke auf **Commit changes**.
4. Öffne `admin.html` auf deinem Computer im Browser oder besuche `https://DEIN-GITHUB-NAME.github.io/pluginhub/admin.html`.
5. Klicke **+ Neues Plugin** und trage Name, Beschreibung, Version, Plattform, Kategorie ein. Bei **Download-Link oder Dateiname** gib exakt `meinplugin.zip` ein.
6. Klicke **↓ plugins.js herunterladen**.
7. Lade die neue `plugins.js` auf GitHub hoch und ersetze die alte Datei. Unter GitHub ist das am einfachsten, indem du die Datei in der Repository-Ansicht öffnest, das Bearbeiten-Menü nutzt oder die bestehende Datei vor dem erneuten Upload entfernst. Achte darauf, dass nur die neue `plugins.js` im Hauptordner liegt.
8. Nach der Veröffentlichung zeigt dein Katalog das neue Plugin. Besucher können es herunterladen.

### Option B: GitHub Releases (praktisch für größere Downloads / Versionen)

1. Öffne dein Repository bei GitHub und klicke auf **Releases → Draft a new release**.
2. Erstelle einen Tag, z. B. `v1.0.0`, und gib dem Release einen Titel.
3. Hänge die Plugin-Datei unter **Attach binaries** an und klicke auf **Publish release**.
4. Kopiere den direkten Download-Link des Release-Assets. Dieser sieht ungefähr so aus:
   `https://github.com/DEIN-GITHUB-NAME/DEIN-REPO/releases/download/v1.0.0/meinplugin.zip`
5. Füge diesen Link im lokalen Editor ins Feld **Download-Link oder Dateiname** ein, exportiere `plugins.js` und ersetze die Datei bei GitHub.

Bei GitHub Releases sind Dateien und Versionen übersichtlich getrennt. Das ist meine Empfehlung, wenn du regelmäßig Updates veröffentlichst.

## 3. Die Website bearbeiten

- Website-Namen und Startseitentexte kannst du unten in `admin.html` ändern.
- Kategorien, Beschreibung, Icons, Kompatibilität und Download-Links stehen beim jeweiligen Plugin.
- Mit **Alle Demo-Plugins entfernen** löschst du die Testeinträge aus deinem lokalen Entwurf.
- Mit **↓ plugins.js herunterladen** speicherst du den aktuellen Entwurf als Datei. **Erst nach dem Hochladen auf GitHub ist die Änderung öffentlich**.
- Der Editor speichert Entwürfe zusätzlich lokal im jeweiligen Browser. Du kannst eine frühere `plugins.js` über **Vorhandene Datei importieren** wieder einlesen.

**Kein echtes Online-Admin-Backend:** `admin.html` kann jeder öffnen. Andere Leute können dadurch deine öffentliche Website aber **nicht** verändern, weil der Editor weder Zugang zum GitHub-Konto noch Schreibrechte auf den Server besitzt. Nur wer an deinem GitHub-Repository Schreibrechte hat, kann neue Versionen veröffentlichen. Die Dateiauswahl im Editor überträgt noch keine Datei ins Internet.

## 4. So funktioniert das technisch

- **HTML** (`index.html`): Inhalt und Aufbau der Seite.
- **CSS** (`styles.css`): Farben, Schriften und Layout.
- **JavaScript** (`app.js`): Suche, Filter, Sortierung, Plugin-Details und Download-Links.
- **Katalogdatei** (`plugins.js`): Liste deiner Plugins und Einstellungen. Die Website liest diese Datei beim Laden.
- **GitHub Pages**: stellt die statischen Dateien öffentlich zur Verfügung.
- **GitHub Releases oder dein Repository**: speichert die Plugin-Dateien.

Das heißt: Die Website *zeigt* deine Downloads an. Die eigentlichen Dateien werden von GitHub bereitgestellt.

## 5. Häufige Fragen

**Ist das wirklich kostenlos?** Für ein öffentliches Repository und GitHub Pages kannst du den kostenlosen GitHub-Tarif nutzen, innerhalb der geltenden GitHub-Limits. Eine eigene `.de`-Domain ist in der Regel nicht kostenlos; die `github.io`-Adresse ist es.

**Brauchen Besucher einen GitHub-Account?** Nein, für eine öffentliche Website und öffentliche Download-Dateien in der Regel nicht.

**Warum sehe ich Änderungen nicht?** Prüfe, ob du die neue `plugins.js` tatsächlich auf GitHub hochgeladen hast. Warte, bis GitHub Pages neu veröffentlicht ist, und lade die Seite neu (bei Bedarf Browsercache leeren).

**Warum funktionieren die Downloads nicht?** Der Dateiname muss exakt stimmen (Groß-/Kleinschreibung beachten), und die Datei muss in dem Ordner liegen, auf den der Link zeigt. Ein GitHub-Releases-Link muss auf ein veröffentlichtes Asset zeigen.

**Kann ich die Seite ohne GitHub testen?** Ja. Öffne `index.html` per Doppelklick. Die Demo funktioniert auch lokal. Zum Bearbeiten öffne `admin.html`.

**Kann ich Passwort-Login und echte Drag-and-drop-Uploads für Administratoren bekommen?** Ja, das erfordert aber ein anderes Setup mit serverseitiger Authentifizierung/Dateispeicherung. Diese kostenlose Startversion enthält bewusst keinen solchen Backend-Dienst.

## 6. Links zur offiziellen Hilfe

- [GitHub Pages erstellen](https://docs.github.com/de/pages/getting-started-with-github-pages/creating-a-github-pages-site)
- [GitHub Pages aus Branch veröffentlichen](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [GitHub Releases erstellen](https://docs.github.com/de/repositories/releasing-projects-on-github/managing-releases-in-a-repository)
