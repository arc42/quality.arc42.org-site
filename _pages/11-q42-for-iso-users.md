---
layout: page
title: Q42 for ISO 25010 users
permalink: /q42-for-iso-users/
order: 11
mermaid: true
---

For basic information about using this site see [**how to use this site**](/how-to-use-this-site).

## Mapping ISO 25010 to Q42 Qualities

Version 10

<div class='mermaid'>
  flowchart LR
    root((ISO 25010))
    click root "/articles/iso-25010-update-2023"

    root --- func[Functional Suitablility]
    root --- perf[Performance efficiency]
    root --- compa[Compatibility]
    root --- sec[Security]
    click sec "/qualities/security"
    root --- maint[Maintainability]
    click maint "/qualities/maintainability"
    root --- flex[Flexibility]
    root --- safe[Safety]
    click safe "/qualities/safety"
    root --- intcap[Interaction capability]
    root --- relia[Reliability]

    sec --- conf([Confidentially])
    click conf "/qualities/maintainability"
    sec --- int([Integrity])
    click int "/qualities/maintainability"
    sec --- nonrep([Non-repudiation])
    click nonrep "/qualities/maintainability"
    sec --- acc([Accountability])
    click acc "/qualities/maintainability"
    sec --- auth([Authenticity])
    click auth "/qualities/maintainability"
    sec --- res([Resistance])
    click res "/qualities/maintainability"
    
    maint --- modul([Modularity])
    click modul "/qualities/maintainability"
    maint --- reuse([Reusability])
    click reuse "/qualities/maintainability"
    maint --- analyze([Analysability])
    click analyze "/qualities/maintainability"
    maint --- modify([Modifiability])
    click modify "/qualities/maintainability"
    maint --- test([Testability])
    click test "/qualities/maintainability"

    flex --- adapt([x])
    flex --- scale([x])
    flex --- install([x])
    flex --- replace([x])

    safe --- opconst([x])
    safe --- riskid([x])
    safe --- failsafe([x])
    safe --- hazwarn([x])
    safe --- safeint([x])
    
    func --- fcomp([x])
    func --- fappr([x])
    func --- fcorr([x])

    perf --- time([x])
    perf --- resutil([x])
    perf --- capa([x])

    intcap --- apprec([x])
    intcap --- learn([x])
    intcap --- opera([x])
    intcap --- uerrprot([x])
    intcap --- uengage([x])
    intcap --- inclusiv([x])
    intcap --- uass([x])
    intcap --- selfdesc([x])

    relia --- faultles([x])
    relia --- avail([x])
    relia --- faulttol([x])
    relia --- recover([x])

    compa --- coex([x])
    compa --- interop([x])
</div>



<!-- div class='mermaid'>
 flowchart TB
    root((ISO 25010))
    click root "/articles/iso-25010-update-2023"

    root --- func[Functional Suitablility]
    root --- perf[Performance efficiency]
    root --- compa[Compatibility]
    root --- sec[Security]
    click sec "/qualities/security"
    root --- maint[Maintainability]
    click maint "/qualities/maintainability"
    root --- flex[Flexibility]
    root --- safe[Safety]
    click safe "/qualities/safety"
    root --- intcap[Interaction capability]
    root --- relia[Reliability]

    sec --- Security-Details
    subgraph Security-Details
        direction TB
        conf([Confidentially])
        click conf "/qualities/security"
        int([Integrity])
        nonrep([Non-repudiation])
        acc([Accountability])
        auth([Authenticity])
        res([Resistance])
        conf ~~~ int ~~~ acc ~~~ nonrep ~~~ auth ~~~ res
    end

    maint --- Maintainability-Details
    subgraph Maintainability-Details
        modul([Modularity])
        reuse([Reusability])
        analyse([Analysability])
        modify([Modifiability])
        test([Testability])
    end

    flex --- Flexibility-Details
    subgraph Flexibility-Details
        adapt([x])
        scale([x])
        install([x])
        replace([x])
    end

    safe --- Safety-Details
    subgraph Safety-Details
        opconst([x])
        riskid([x])
        failsafe([x])
        hazwarn([x])
        safeint([x])
    end
    
    func --- Functional-Suitablility-Details
    subgraph Functional-Suitablility-Details
        fcomp([x])
        fappr([x])
        fcorr([x])
    end

    perf --- Performance-efficiency-Details
    subgraph Performance-efficiency-Details
        time([x])
        resutil([x])
        capa([x])
    end

    intcap --- Interaction-capability-Details
    subgraph Interaction-capability-Details
        apprec([x])
        learn([x])
        opera([x])
        uerrprot([x])
        uengage([x])
        inclusiv([x])
        uass([x])
        selfdesc([x])
    end

    relia --- Reliability-Details
    subgraph Reliability-Details
        faultles([x])
        avail([x])
        faulttol([x])
        recover([x])
    end

    compa --- Compatibility-Details
    subgraph Compatibility-Details
        coex([x])
        interop([x])
    end

</div -->






