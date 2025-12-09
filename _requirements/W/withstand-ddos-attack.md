---
title: "Withstand DDoS Attack"
tags: [reliable]
related: [resilience, reliability, availability, high-availability, recoverability, intrusion-detection, resistance]
permalink: /requirements/withstand-ddos-attack
---

<div class="quality-requirement" markdown="1">

#### Context

Web application is hosted on cloud-based infrastructure with multiple server instances distributed across different regions.

#### Trigger

Distributed denial of service (DDoS) attack targeting the web application.

#### Acceptance Criteria

- Web application maintains at least 99.9% uptime during DDoS attack, measured over 24-hour period
- Application maintains maximum response time of 500 milliseconds for 95% of legitimate user requests during attack
- Application handles sustained traffic load of 10 times its typical peak traffic during attack without service degradation
- Application effectively identifies and blocks malicious traffic sources with false positive rate of no more than 1%
- In event of server or infrastructure failures caused by attack, application automatically failovers to healthy resources within 2 minutes
- Throughout attack, application ensures data integrity and prevents data corruption with zero data loss or inconsistencies
- Application logs and reports DDoS attack incidents including attack vectors, traffic patterns, and response actions for further analysis

</div><br>

This requirement was created with help from [ChatGPT](https://chat.openai.com) by using the prompt `create a quality attribute scenario to describe a resilience requirement for a web application`.



