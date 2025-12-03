# Qualitätsanforderungen konkret formulieren: Vom vagen "sicher" zum testbaren Akzeptanzkriterium

**Draft für INNOQ Blog**

---

## Eine Geschichte aus dem Projektalltag

Es war ein Dienstagmorgen im Sprint-Planning. Das Team saß zusammen, um die User Stories für den kommenden Sprint zu besprechen. Der Product Owner präsentierte eine neue Story: "Als Nutzer möchte ich, dass das System sicher ist."

"Gut", sagte die Tech-Lead, "aber was genau bedeutet 'sicher' für euch?"

"Na ja, halt sicher", kam die etwas hilflose Antwort. "Keine Sicherheitslücken, Daten geschützt, ihr wisst schon..."

Die Entwickler schauten sich an. Eine fragte nach: "Brauchen wir Multi-Faktor-Authentifizierung? Wie lange dürfen Sessions aktiv bleiben? Müssen wir jeden Login-Versuch loggen? Was ist mit Datenverschlüsselung?"

Der Product Owner zögerte. "Das... müsst ihr doch wissen. Macht es einfach sicher."

Drei Wochen später, im Review: Das Team hatte ein aufwändiges Verschlüsselungssystem implementiert, komplett mit Hardware-Security-Modulen. Der Product Owner war entsetzt: "Das dauert ja ewig beim Login! Und wir brauchen jetzt teure HSM-Infrastruktur? Ich wollte doch nur, dass Passwörter nicht im Klartext gespeichert werden!"

**Kommt euch bekannt vor?**

Diese Situation entsteht immer wieder, wenn Qualitätsanforderungen vage bleiben. "Das System soll sicher sein", "Es muss schnell reagieren", "Die Daten müssen korrekt sein" – solche Aussagen helfen niemandem weiter. Sie sind zu abstrakt, nicht messbar und führen unweigerlich zu Missverständnissen zwischen Product Ownern, Entwicklungsteams und Stakeholdern.

Qualität ist ein dermaßen vager und überladener Begriff, dass er für Softwareentwicklungsprojekte konkretisiert werden muss. Aber wie?

---

## Die Herausforderung: Qualität greifbar machen

Betrachten wir einige Beispiele für **konkrete** Qualitätsanforderungen:

> * Ein authentifizierter Benutzer fordert über die grafische Oberfläche die Generierung des täglichen Verkaufsberichts im PDF-Format an. Das System erzeugt diesen Bericht in weniger als 10 Sekunden.
> * Wenn ein Nutzer einen Krankenversicherungsvertrag konfiguriert, berechnet das System eine Preisschätzung basierend auf den aktuell verfügbaren Informationen. Diese Schätzung muss innerhalb einer Marge von ±15% zum finalen Preis liegen.
> * Der Nutzer-Registrierungsservice muss 7×24h zu 99% verfügbar sein.
> * Ein neuer Versicherungstarif kann in weniger als 10 Tagen im System implementiert werden.
> * Ein Service ist zur Laufzeit abgestürzt. Er kann innerhalb von 30 Sekunden in einen voll funktionsfähigen Zustand zurückversetzt werden.

Diese Sätze beschreiben in natürlicher Sprache die Anforderungen oder Erwartungen von Stakeholdern auf eine sehr **konkrete und messbare** Art. So formulierte Anforderungen ermöglichen es dem Entwicklungsteam zu verstehen, was erreicht werden muss und was _gut genug_ ist.

---

## Der SEI-Ansatz: Quality Attribute Scenarios

Len Bass und seine Kollegen vom _Software Engineering Institute_ (SEI) haben für solche strukturierten Qualitätsanforderungen den Begriff "Quality Attribute Scenarios" geprägt (siehe Bass et al., 2021, "Software Architecture in Practice").

Das SEI-Template umfasst sechs Elemente:

* **Source of stimulus**: Die Entität (Person, System oder anderer Akteur), die den Stimulus erzeugt
* **Event/stimulus**: Jede Bedingung oder jedes Ereignis, das im System ankommt
* **Artifact**: Der Teil des Systems, der vom Stimulus betroffen ist
* **Environment**: Die Bedingungen oder der Kontext, unter dem der Stimulus auftritt
* **Response**: Wie das System auf den Stimulus reagieren soll
* **Metric** (Response Measure): Messbare Kriterien, um objektiv zu beurteilen, ob die Anforderung erfüllt ist

### Warum das vollständige SEI-Template in der Praxis oft unpraktisch ist

Obwohl das SEI-Template in der akademischen Welt und bei Großprojekten weit verbreitet ist, hat es in der Praxis einige Nachteile:

* **Zeitaufwändig**: Die detaillierte Natur macht es langsam auszufüllen, besonders wenn viele Szenarien dokumentiert werden müssen
* **Over-Engineering**: Teams fühlen sich verpflichtet, alle sechs Abschnitte detailliert auszufüllen, auch wenn einige Elemente offensichtlich oder unnötig sind
* **Schlechte Passung für agile Entwicklung**: Der umfassende Ansatz passt nicht gut zu schnellen, iterativen Entwicklungsmethoden
* **Redundanz**: Source, Artifact und Environment wiederholen oft Informationen, die aus dem Kontext klar sind

In der Praxis ist häufig ein schlankerer Ansatz ausreichend, während Klarheit und Messbarkeit erhalten bleiben.

---

## Der pragmatische Ansatz: Zweistufige Qualitätsanforderungen

Wir schlagen einen flexiblen **zweistufigen Ansatz** vor, der Einfachheit mit dem Bedarf nach Kontext in Einklang bringt. Dieser Ansatz fokussiert auf das Wesentliche: **Anforderungen als Akzeptanzkriterien nutzbar** zu machen.

### Stufe 1: Einfache Anforderungen

Diese Struktur eignet sich für unkomplizierte Anforderungen, bei denen der Kontext offensichtlich oder minimal ist.

**Wann verwenden:**
- Die Anforderung ist selbsterklärend
- Kontext ist aus dem Titel offensichtlich
- Einzelner Akteur oder Auslöser
- 1-3 einfache Akzeptanzkriterien
- Beispiele: Performance-Schwellwerte, einfache Kapazitätsanforderungen, Testausführungszeit

**Struktur:**
```markdown
#### Anforderung
[Eine klare Aussage, was erreicht werden muss]

#### Akzeptanzkriterien
- [Spezifisches, messbares Kriterium mit numerischem Schwellwert]
- [Weitere Kriterien bei Bedarf]
- [Konkrete Metriken verwenden: Prozentsätze, Zeitrahmen, Schwellwerte]
```

**Beispiel: Schnelle Unit-Tests**

> **Anforderung**
>
> Alle automatisierten Unit-Tests eines Subsystems müssen schnell ausführbar sein, um während der Entwicklung schnelles Feedback zu ermöglichen.
>
> **Akzeptanzkriterien**
> - Alle Unit-Tests eines Subsystems werden in weniger als 180 Sekunden abgeschlossen
> - Die Testausführungszeit wird auf Standard-CI/CD-Infrastruktur gemessen

---

### Stufe 2: Komplexe Anforderungen

Diese Struktur verwenden, wenn geschäftlicher oder technischer Kontext zum Verständnis der Anforderung wesentlich ist.

**Wann verwenden:**
- Geschäftlicher/regulatorischer Kontext ist wichtig
- Mehrere Stakeholder oder komplexe Szenarien
- 4+ Akzeptanzkriterien
- Compliance- oder Security-Anforderungen
- Beispiele: Zugriffskontrolle, Datenqualität, Fairness, regulatorische Compliance

**Struktur:**
```markdown
#### Kontext
[1-3 Sätze, die das System, geschäftliche Einschränkungen oder erklären, warum dies wichtig ist]

#### Auslöser
[Wer oder was initiiert diese Anforderung - Benutzeraktion, Systemereignis, etc.]

#### Akzeptanzkriterien
- [Spezifisches, messbares Kriterium mit numerischem Schwellwert]
- [Weitere Kriterien...]
```

**Beispiel: Durchsetzung von Zugriffskontrolle**

> **Kontext**
>
> Das System arbeitet in einer Mehrbenutzer-Umgebung mit unterschiedlichen Benutzerrollen und Berechtigungen. Sensible Funktionen und vertrauliche Informationen erfordern rollenbasierte Zugriffskontrolle (RBAC) und Audit-Trails zur Wahrung der Datensicherheit und Privatsphäre.
>
> **Auslöser**
>
> Ein Benutzer versucht auf eine sensible Funktion oder vertrauliche Information innerhalb des Systems zuzugreifen.
>
> **Akzeptanzkriterien**
> - 100% der Zugriffsversuche müssen authentifiziert werden, bevor Zugriff auf sensible Daten gewährt wird
> - Multi-Faktor-Authentifizierung (MFA) ist für hochsensible Daten implementiert
> - Benutzerrollen sind präzise definiert mit Least-Privilege-Zugriff
> - 100% der Zugriffsversuche werden in einem manipulationssicheren Audit-Trail protokolliert (Benutzeridentität, Zeitstempel, zugegriffene Daten, Ergebnis)
> - Zugriffsberechtigungen können sofort widerrufen werden, Änderungen sind innerhalb von 60 Sekunden wirksam
> - Benutzersitzungen laufen nach 30 Minuten Inaktivität automatisch ab
> - Zugriffskontrollverletzungen werden innerhalb von 5 Minuten protokolliert und gemeldet

---

## Effektive Akzeptanzkriterien schreiben

Unabhängig davon, welche Stufe verwendet wird, sollten Akzeptanzkriterien diese Best Practices befolgen:

**1. Spezifisch sein** - Konkrete Zahlen, Prozentsätze, Zeitrahmen verwenden
- ✅ "Antwortzeit < 500 Millisekunden für 95% der Anfragen"
- ❌ "System soll schnell sein"

**2. Messbar machen** - Jedes Kriterium sollte testbar sein
- ✅ "99,9% der doppelten Patientendatensätze werden erkannt"
- ❌ "System erkennt die meisten doppelten Datensätze"

**3. Einheiten angeben** - Immer Einheiten für Messungen spezifizieren
- ✅ "Deployment wird in weniger als 2 Stunden abgeschlossen"
- ❌ "Deployment ist schnell"

**4. Schwellwerte verwenden** - Akzeptable Bereiche definieren
- ✅ "Datensynchronisierungslatenz ≤ 30 Sekunden"
- ❌ "Daten synchronisieren sich schnell"

**5. Testbar sein** - Kriterien sollten direkt auf Testfälle abbildbar sein
- ✅ "100% der fehlgeschlagenen Login-Versuche werden innerhalb von 5 Sekunden protokolliert"
- ❌ "Fehlgeschlagene Logins werden angemessen verfolgt"

### Übliche Metriken

- **Prozentsätze**: "95% der Nutzer", "99,9% Genauigkeit", "100% Compliance"
- **Zeitgrenzen**: "innerhalb 500 msec", "weniger als 2 Stunden", "maximal 30 Minuten"
- **Schwellwerte**: "±10% Marge", "20% Reduktion", "≤ 0,05 Differenz"
- **Zählwerte**: "null kritische Schwachstellen", "weniger als 2 Issues pro Seite"
- **Verfügbarkeit**: "99,99% Verfügbarkeit", "SLA von 99,9%"

---

## Beispiele aus verschiedenen Domänen

### Performance-Anforderungen (meist Stufe 1)

> **Anforderung**
>
> Suchergebnisse müssen nahezu sofort angezeigt werden, um die Nutzerinteraktion aufrechtzuerhalten.
>
> **Akzeptanzkriterien**
> - Erstes Suchergebnis erscheint innerhalb von 500 Millisekunden
> - Weitere Ergebnisse laden progressiv ohne UI-Blockierung
> - 95. Perzentil der Antwortzeit bleibt unter 800 Millisekunden

### Datenqualitäts-Anforderungen (meist Stufe 2)

> **Kontext**
>
> Das Gesundheitssystem verwaltet Patientendaten über mehrere Abteilungen hinweg, wobei schlechte Datenqualität zu falschen Diagnosen oder Medikationsfehlern führen könnte.
>
> **Auslöser**
>
> Patientendaten werden während der gesamten Behandlung eingegeben, aktualisiert oder abgerufen.
>
> **Akzeptanzkriterien**
> - Duplikaterkennungsrate bei Patientenidentifikation ≥ 99,9%
> - Kritische klinische Felder (Allergien, Medikamente, Diagnosen) sind zu 100% vollständig
> - Laborergebnisse sind innerhalb von 5 Minuten mit 99,9% Zuverlässigkeit verfügbar
> - Datenvalidierung verhindert 100% der unmöglichen Werte und fehlenden Pflichtfelder
> - Vollständiger Audit-Trail mit 100% Nachvollziehbarkeit wird geführt

### Accessibility-Anforderungen (oft Stufe 2)

> **Kontext**
>
> Die Webanwendung muss WCAG 2.1 Level AA Standards erfüllen, um Barrierefreiheit für Nutzer mit Behinderungen sicherzustellen.
>
> **Auslöser**
>
> Ein Nutzer mit Sehbehinderung navigiert die Anwendung mit einem Screenreader.
>
> **Akzeptanzkriterien**
> - 95% der interaktiven Elemente sind mit Screenreader navigierbar
> - 98% des Inhalts ist zugänglich und konsumierbar
> - 95% der Funktionalität kann ohne Barrierefreiheitshindernisse genutzt werden
> - Nachrichten und Fehler werden mit 99% Genauigkeit angesagt
> - Seitenladezeiten bleiben trotz Barrierefreiheits-Verbesserungen unter 3 Sekunden
> - Null kritische WCAG-Verstöße in automatisierten Tests
> - Maximal 2 Issues pro Seite in manuellen Tests

---

## Migration vom SEI-Format

Falls ihr aktuell das vollständige SEI-Template verwendet, könnt ihr einfach zu diesem pragmatischen Ansatz migrieren:

**SEI-Format:**
```markdown
Background: Entwickler deployt eine neue Version der Anwendung
Source: Entwickler
Stimulus: Deployt neue Version
Artifact: Produktionsanwendung
Environment: Produktionsumgebung
Reaction: Anwendung ist vollständig ausgerollt
Metric: Deployment dauert weniger als 2 Stunden
```

**Pragmatisches Format (Stufe 2):**
```markdown
Kontext: Das Entwicklungsteam muss Anwendungsupdates häufig
mit minimaler Downtime deployen.

Auslöser: Entwickler initiiert Deployment einer neuen Version
in die Produktion.

Akzeptanzkriterien:
- Deployment auf alle Produktionsserver wird in weniger als 2 Stunden abgeschlossen
- Zero Downtime während des Deployments
- Rollback-Fähigkeit innerhalb von 5 Minuten verfügbar, falls Probleme erkannt werden
```

Die pragmatische Version konsolidiert die sechs SEI-Elemente in drei fokussierte Abschnitte und eliminiert Redundanz, während alle wesentlichen Informationen erhalten bleiben.

---

## Zurück zu unserer Story

Erinnert ihr euch an unser Sprint-Planning vom Anfang? Was hätte dort anders laufen können?

Statt der vagen Anforderung "Das System soll sicher sein" hätte das Team gemeinsam mit dem Product Owner konkrete Qualitätsszenarien formulieren können:

> **Kontext**: Das System verarbeitet personenbezogene Daten und unterliegt der DSGVO. Unbefugter Zugriff könnte zu Bußgeldern und Reputationsverlust führen.
>
> **Auslöser**: Ein Nutzer versucht, sich am System anzumelden.
>
> **Akzeptanzkriterien**:
> - Passwörter werden mit bcrypt (mindestens 12 Rounds) gehasht gespeichert
> - Fehlgeschlagene Login-Versuche werden nach dem 3. Versuch für 15 Minuten geblockt
> - Alle Login-Versuche (erfolgreich und fehlgeschlagen) werden mit Zeitstempel und IP-Adresse protokolliert
> - Sessions laufen nach 30 Minuten Inaktivität automatisch ab
> - Implementierungsaufwand: 5 Story Points

Mit dieser Formulierung wäre für alle Beteiligten klar gewesen:
- Was genau implementiert werden muss
- Wie der Erfolg gemessen wird
- Dass keine teure HSM-Infrastruktur benötigt wird
- Wie der Aufwand einzuschätzen ist

Das Team hätte die Anforderung korrekt umsetzen können, und im Review wären alle glücklich gewesen.

---

## Fazit: Qualität ist das, was messbar ist

Die abstrakte Forderung "Das System soll schnell/sicher/zuverlässig sein" hilft niemandem. Solche Aussagen führen zu:
- **Missverständnissen** zwischen Stakeholdern und Entwicklungsteam
- **Over-Engineering** (das Team implementiert mehr als nötig)
- **Under-Engineering** (das Team unterschätzt, was gemeint war)
- **Nicht-testbaren Anforderungen** (wann ist das System "schnell genug"?)
- **Frustrierten Product Ownern** im Review

Der hier vorgestellte **zweistufige Q42-Ansatz** bietet eine praktikable Lösung:

**Stufe 1 (Einfach)** für unkomplizierte Anforderungen:
- Minimaler Overhead
- Schnell zu dokumentieren
- Direkt testbar
- Ideal für Performance-, Kapazitäts- und einfache Verfügbarkeitsanforderungen

**Stufe 2 (Komplex)** für anspruchsvolle Szenarien:
- Kontextinformationen, wo sie wirklich helfen
- Auslöser macht Trigger-Bedingungen explizit
- Umfassende Akzeptanzkriterien für komplexe Domänen
- Ideal für Security, Compliance, Datenqualität, Barrierefreiheit

### Vorteile gegenüber dem SEI-Template

- **Schneller**: 3 statt 6 Abschnitte, weniger Redundanz
- **Agil-freundlicher**: Just enough documentation, nicht mehr
- **Fokussiert auf Akzeptanzkriterien**: Das, was wirklich getestet werden muss
- **Flexibel**: Stufe 1 für einfache, Stufe 2 für komplexe Anforderungen
- **Praxiserprobt**: Hunderte von Beispielen auf quality.arc42.org

### Empfehlung für euer nächstes Projekt

1. **Startet mit Stufe 1** für die meisten Qualitätsanforderungen
2. **Wechselt zu Stufe 2** nur wenn Kontext wirklich Mehrwert bietet
3. **Schreibt spezifische, messbare Akzeptanzkriterien** - mit Zahlen, Prozentsätzen, Zeitgrenzen
4. **Macht sie testbar** - jedes Kriterium sollte direkt auf einen Test abbildbar sein
5. **Reviewt sie gemeinsam** - Product Owner, Entwicklungsteam und ggf. Operations

Die Zeit, die ihr in klare Qualitätsanforderungen investiert, spart ihr mehrfach:
- Weniger Missverständnisse im Sprint
- Weniger Überraschungen im Review
- Weniger Nacharbeit wegen falscher Annahmen
- Klarere Testfälle
- Zufriedenere Stakeholder

**Qualität ist kein vages Konzept – sie ist das, was wir messbar und testbar machen.**

Probiert den Q42-Ansatz in eurem nächsten Sprint aus. Die Balance zwischen Präzision und Pragmatismus macht ihn zur idealen Methode für agile Entwicklungsteams.

---

## Weiterführende Ressourcen

- **quality.arc42.org**: Über 140 Beispiele für Qualitätsanforderungen aus verschiedenen Domänen
- **Bass et al., 2021**: "Software Architecture in Practice" - Das Standardwerk zu Quality Attribute Scenarios
- **ISO 25010**: Software Quality Model - Internationale Standards für Softwarequalität
- **WCAG 2.1**: Web Content Accessibility Guidelines - Standards für Barrierefreiheit

---

**Über den Autor**

_[Platzhalter für Autoreninfo - ggf. Gernot Starke's Bio]_

**Links**
- arc42 Quality Model: https://quality.arc42.org
- GitHub Repository: https://github.com/arc42/quality.arc42.org-site
