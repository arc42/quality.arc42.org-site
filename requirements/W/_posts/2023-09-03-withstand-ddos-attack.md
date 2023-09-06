---
title: "Withstand DDoS Attack"
tags: reliable
related: resilience, reliability, availability, high availability, recoverability, intrusion detection, resistance
permalink: /requirements/withstand-ddos-attack
---

<div class="quality-requirement" markdown="1">

**Stimulus**: A distributed denial of service (DDoS) attack targeting the web application.
Environment: The web application is hosted on a cloud-based infrastructure with multiple server instances distributed across different regions.
**Response**: The web application should effectively withstand and mitigate the DDoS attack, ensuring service availability and acceptable performance levels. Precise metrics to determine when the requirement is met include:


1. **Availability**: The web application should maintain at least 99.9% uptime during the DDoS attack, measured over a 24-hour period. Uptime is defined as the percentage of time the application remains accessible and responsive to legitimate user requests.

2. **Response Time**: The application should maintain a maximum response time of 500 milliseconds for 95% of legitimate user requests during the DDoS attack. Response time is measured as the time taken to respond to a request from the moment it's received.

3. **Traffic Handling**: The application should be capable of handling a sustained traffic load of 10 times its typical peak traffic during the attack without service degradation. This is measured by monitoring the incoming request rate and system resource utilization.

4. **Security**: The application should effectively identify and block malicious traffic sources during the DDoS attack, with a false positive rate of no more than 1%. False positives refer to legitimate users or traffic mistakenly identified as malicious and blocked.

5. **Failover and Recovery**: In the event of server or infrastructure failures caused by the DDoS attack, the application should automatically failover to healthy resources within 2 minutes, minimizing downtime.

6. **Data Integrity**: Throughout the attack, the application should ensure data integrity and prevent data corruption, with zero data loss or inconsistencies.

7. **Logs and Reporting**: The application should log and report DDoS attack incidents, including the attack vectors, traffic patterns, and response actions, for further analysis and improvement.

By meeting these precise metrics, the web application demonstrates its resilience by maintaining service availability, acceptable performance, and security even in the face of a DDoS attack. These metrics help ensure that the application not only survives the attack but also continues to provide a satisfactory user experience and maintains data integrity.
</div><br>

This requirement was created with help from [ChatGPT](https://chat.openai.com) by using the prompt `create a quality attribute scenario to describe a resilience requirement for a web application`.



