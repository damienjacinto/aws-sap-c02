# Keywords → answers

Phrases in a question stem that should steer the choice. These are **heuristics, not rules**: always check the rest of the constraints.

## Optimization targets

| The stem says… | Usually favors… | Usually rules out… |
|---|---|---|
| *least operational overhead* / *minimal management* | Managed and serverless services, native integrations, AWS-managed automation | Self-managed EC2 fleets, custom scripts, cron jobs on instances |
| *most cost-effective* | Right-sizing, Spot/Savings Plans, lifecycle to cheaper tiers, removing idle resources | Over-provisioned HA that the requirements don't ask for |
| *least amount of time* / *quickly* | Replatform/rehost, existing tools, config changes | Rewrites, re-architecture |
| *minimal changes to the application* | Transparent infrastructure changes (proxies, endpoints, replicas, caching layers in front) | Code changes, SDK swaps |
| *highest availability* / *most resilient* | Multi-AZ at minimum, multi-Region if stated, health-checked failover | Single points of failure, manual failover |

## Identity & multi-account

| The stem says… | Think… |
|---|---|
| *third party* / *vendor* needs access to our account | IAM role with **External ID** in the trust policy |
| *all accounts in the organization* should access a resource | Resource policy with `aws:PrincipalOrgID` (or `aws:PrincipalOrgPaths`) |
| *prevent* any account / even administrators from doing X | **SCP** (principals) or **RCP** (resources); not IAM policies |
| *delegate* permission management but cap what can be granted | **Permissions boundary** |
| *workforce* single sign-on across many accounts | **IAM Identity Center** + permission sets |
| *scale permissions without editing policies* as teams grow | **ABAC** with tags |

## Network visibility

| The stem says… | Think… |
|---|---|
| inspect the traffic *content* / *payload* / *packets*, run an IDS | **VPC Traffic Mirroring** (copies full packets to an ENI, NLB or GWLB endpoint) |
| who talked to whom, which ports, accepted or rejected | **VPC Flow Logs** (metadata only, never the payload) |
| detect threats / compromised instances automatically | **GuardDuty** (analyzes flow logs, DNS logs, CloudTrail) |
| find software vulnerabilities or unintended network exposure | **Amazon Inspector** |

*This page grows every day. Add a row whenever a practice question teaches a new phrase.*
