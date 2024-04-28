---
layout: page
title: Q42 for ISO 25010 users
permalink: /q42-for-iso-users/
order: 45
mermaid: true
---

For basic information about using this site see [**how to use this site**](/how-to-use-this-site).


From here you can navigate the site based upon the established ISO-25010 tree structure. 
Clicking a node leads to the corresponding Q42 description.

<small>Version 1.0.</small>

<div class='mermaid'>
  flowchart LR
    classDef level1 font-size:30px,font-weight:bold
    classDef level2 font-size:20px,font-weight:bold

    root([ISO 25010<br>2023])
    click root "/articles/iso-25010-update-2023"
    class root level1

    root --- func(3.1 Functional suitablility<br>#suitable)
    root --- perf(3.2 Performance efficiency)
    root --- compa(3.3 Compatibility)
    root --- intcap(3.4 Interaction capability)
    root --- relia(3.5 Reliability)
    root --- sec(3.6 Security)
    root --- maint(3.7 Maintainability)
    root --- flex(3.8 Flexibility)
    root --- safe(3.9 Safety)
    click func "/qualities/functional-suitability"
    click perf "/qualities/performance-efficiency"
    click compa "/qualities/compatibility"
    click intcap "/qualities/interaction-capability"
    click relia "/qualities/reliability"
    click sec "/qualities/security"
    click maint "/qualities/maintainability"
    click flex "/qualities/flexibility"
    click safe "/qualities/safety"
    class func,perf,compa,intcap,relia,sec,maint,flex,safe level2

    func --- fcomp([3.1.1 Functional completeness])
    func --- fcorr([3.1.2 Functional correctness])
    func --- fappr([3.1.3 Functional appropriateness])
    click fcomp "/qualities/functional-completeness"
    click fcorr "/qualities/functional-correctness"
    click fappr "/qualities/functional-appropriateness"

    perf --- time([3.2.1 Time behaviour])
    perf --- resutil([3.2.2 Resource utilization])
    perf --- capa([3.2.3 Capacity])
    click time "/qualities/time-behaviour"
    click resutil "/qualities/resource-utilization"
    click capa "/qualities/capacity"

    compa --- coex([3.3.1 Co-existence])
    compa --- interop([3.3.2 Interoperability])
    click coex "/qualities/co-existence"
    click interop "/qualities/interoperability"

    intcap --- apprec([3.4.1 Appropriateness recognizability])
    intcap --- learn([3.4.2 Learnability])
    intcap --- opera([3.4.3 Operability])
    intcap --- uerrprot([3.4.4 User error protection])
    intcap --- uengage([3.4.5 User engagement])
    intcap --- inclusiv([3.4.6 Inclusivity])
    intcap --- uass([3.4.7 User assistance])
    intcap --- selfdesc([3.4.8 Self-descriptiveness])
    click apprec "/qualities/appropriateness-recognizability"
    click learn "/qualities/learnability"
    click opera "/qualities/operability"
    click uerrprot "/qualities/user-error-protection"
    click uengage "/qualities/user-engagement"
    click inclusiv "/qualities/inclusivity"
    click uass "/qualities/user-assistance"
    click selfdesc "/qualities/self-descriptiveness"

    relia --- faultles([3.5.1 Faultlessness])
    relia --- avail([3.5.2 Availability])
    relia --- faulttol([3.5.3 Fault tolerance])
    relia --- recover([3.5.4 Recoverability])
    click faultles "/qualities/faultlessness"
    click avail "/qualities/availability"
    click faulttol "/qualities/fault-tolerance"
    click recover "/qualities/recoverability"

    sec --- conf([3.6.1 Confidentiality])
    sec --- int([3.6.2 Integrity])
    sec --- nonrep([3.6.3 Non-repudiation])
    sec --- acc([3.6.4 Accountability])
    sec --- auth([3.6.5 Authenticity])
    sec --- res([3.6. Resistance])
    click conf "/qualities/confidentiality"
    click int "/qualities/integrity"
    click nonrep "/qualities/non-repudiation"
    click acc "/qualities/accountability"
    click auth "/qualities/authenticity"
    click res "/qualities/resistance"
    
    maint --- modul([3.7.1 Modularity])
    maint --- reuse([3.7.2 Reusability])
    maint --- analyze([3.7.3 Analysability])
    maint --- modify([3.7.4 Modifiability])
    maint --- test([3.7.5 Testability])
    click modul "/qualities/modularity"
    click reuse "/qualities/reusability"
    click analyze "/qualities/analysability"
    click modify "/qualities/modifiability"
    click test "/qualities/testability"

    flex --- adapt([3.8.1 Adaptability])
    flex --- scale([3.8.2 Scalability])
    flex --- install([3.8.3 Installability])
    flex --- replace([3.8.4 Replaceability])
    click adapt "/qualities/adaptability"
    click scale "/qualities/scalability"
    click install "/qualities/installability"
    click replace "/qualities/replaceability"

    safe --- opconst([3.9.1 Operational constraint])
    safe --- riskid([3.9.2 Risk identification])
    safe --- failsafe([3.9.3 Fail safe])
    safe --- hazwarn([3.9.4 Hazard warning])
    safe --- safeint([3.9.5 Safe integration])
    click opconst "/qualities/operational-constraint"
    click riskid "/qualities/risk-identification"
    click failsafe "/qualities/fail-safe"
    click hazwarn "/qualities/hazard-warning"
    click safeint "/qualities/safe-integration"
</div>







