# SAP-C02 Curriculum

Day-by-day plan from **Sun 27 Sep** to the **first exam attempt on Sun 1 Nov 2026**, built from the full lecture lists of three Udemy courses, the Tutorials Dojo practice exams, and AWS docs.

## Resources

| Code | Resource | Length | Role | Speed |
|---|---|---|---|---|
| **M** | [Ultimate AWS Certified SA Professional — Stephane Maarek](https://www.udemy.com/course/aws-solutions-architect-professional/) | 16.5h | Backbone: every lecture is scheduled | 1× |
| **N** | [AWS Certified SA – Professional 2026 [NEW]](https://www.udemy.com/course/aws-certified-solutions-architect-professional/) | 44.9h | Depth: multi-account, networking, security, storage, DB | 1.25× |
| **D** | [AWS Certified SA Professional SAP-C02 — Neal Davis](https://www.udemy.com/course/aws-certified-solutions-architect-professional-training/) | 22.3h | Targeted gap-fillers only; the rest is optional (see appendix) | 1.25× |
| **TD** | [Tutorials Dojo SAP practice exams](https://portal.tutorialsdojo.com/courses/aws-certified-solutions-architect-professional-practice-exams/) | 6 timed + 6 review + 4 section-based + randomized + flashcards | Evenings & exam simulation | — |
| **SB** | AWS Skill Builder official practice exam | 75 q | Final check (Thu 29 Oct) | — |

Total scheduled video: **~55h raw → ~47h at the speeds above** (M fully, N ~75 %, D ~15 %).

## Weekly overview

| Week | Dates | Theme | Video (eff.) |
|---|---|---|---|
| 1 | 27 Sep – 3 Oct | Identity, multi-account, VPC, hybrid connectivity | 11.3h |
| 2 | 4 – 10 Oct | DNS, network & data protection, detective controls, governance | 10.5h |
| 3 | 11 – 17 Oct | Compute, load balancing, containers, storage, databases, edge, DR | 13.7h |
| 4 | 18 – 24 Oct | Integration, data, deployment, operations, migration, cost | 11.4h |

---

## Week 1 — Identity, multi-account, VPC, hybrid connectivity

### Day 1 · Sun 27 Sep — IAM deep dive & policy evaluation

**🌅 Lectures** — 2h52 raw, ~2h25 at speed

- **[M] §1 Course Introduction** (7m)
    - Course Introduction - Please Watch · 4m
    - About your instructor · 3m
- **[M] §3 Identity & Federation** (28m)
    - IAM · 13m
    - IAM Access Analyzer · 3m
    - STS · 12m
- **[N] §2 Multi-Account Based Architectures** (2h17)
    - Multi-AWS Account Strategy for Enterprises · 14m
    - Identity Account Architecture · 7m
    - Practical - Cross Account IAM Roles · 9m
    - IAM Policy Types · 14m
    - Overview of IAM Permission Boundaries · 7m
    - Practical - IAM Permission Boundary · 4m
    - IAM Policy Evaluation Logic · 21m
    - AWS Secure Token Service (STS) · 12m
    - IAM - Service Role vs Pass Role · 18m
    - Attribute-Based Access Control - NEW · 11m
    - Overview of External ID · 13m
    - External ID - Practical · 7m

**🌳 Decision trees**

- [Will this request be allowed? (policy evaluation logic)](decisions/identity/policy-evaluation.md)
- [Cross-account access: IAM role vs resource-based policy](decisions/identity/cross-account-access.md)

**📖 Read**

- [IAM policy evaluation logic](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html)
- [The confused deputy problem (External ID)](https://docs.aws.amazon.com/IAM/latest/UserGuide/confused-deputy.html)

**🛠️ Lab — Sandbox setup + cross-account IAM**

- [ ] Create an AWS Budget with email alerts at low thresholds on the management account
- [ ] Create an AWS Organization with 4 accounts: management, security (log-archive), workload-dev, workload-prod
- [ ] From dev, assume a role in prod that requires an External ID; prove the call fails without it
- [ ] Apply a permissions boundary that blocks an action the identity policy allows; explain the effective permissions
- [ ] ABAC: allow ec2:StartInstances/StopInstances only when resource tag `team` matches the principal tag

💰 Free

**🌙 Evening:** TD Section-Based: *Design Solutions for Organizational Complexity* (first chunk) + TD Flashcards on IAM

### Day 2 · Mon 28 Sep — AWS Organizations, SCPs, Control Tower

**🌅 Lectures** — 1h38 raw, ~1h23 at speed

- **[M] §3 Identity & Federation** (21m)
    - AWS Organizations · 6m
    - AWS Organizations Policies · 11m
    - AWS Control Tower · 4m
- **[N] §2 Multi-Account Based Architectures** (57m)
    - Overview of AWS Organizations · 19m
    - Practical - AWS Organizations · 5m
    - Practical - Service Control Policies · 3m
    - Practical - Tag Policies · 3m
    - AWS Organization Policies - Authorization vs Management · 4m
    - Organizational Units (OUs) in AWS Organization · 7m
    - Practical - Organizational Units (OUs) · 4m
    - Strategies for using SCPs · 8m
    - Switching from Deny List to Allow List SCPs · 4m
- **[N] §8 Security Services** (16m)
    - AWS Control Tower · 16m
- **[D] §2 AWS Accounts and Organizations** (4m)
    - SCP Strategies and Inheritance · 4m

**🌳 Decision trees**

- Which guardrail? SCP vs RCP vs permissions boundary vs identity policy
- OU structure for a multi-account landing zone

**📖 Read**

- [Organizing your AWS environment using multiple accounts (whitepaper)](https://docs.aws.amazon.com/whitepapers/latest/organizing-your-aws-environment/organizing-your-aws-environment.html)
- [Service control policies](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html)
- [Resource control policies](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_rcps.html)

**🛠️ Lab — Organizations guardrails**

- [ ] Create OUs: Security, Workloads/Prod, Workloads/Dev, Sandbox and move the accounts
- [ ] SCP: deny all actions outside your home region (exempt global services); prove it blocks dev but not the management account
- [ ] SCP: deny `organizations:LeaveOrganization` and deny disabling CloudTrail
- [ ] Switch the Sandbox OU from deny-list to allow-list (remove FullAWSAccess) and observe what breaks
- [ ] Tag policy enforcing allowed values for `env`
- [ ] Control Tower: read + paper design only (enabling it on this sandbox is heavy to undo)

💰 Free

**🌙 Evening:** TD Section-Based: Organizational Complexity (continue) + flashcards

### Day 3 · Tue 29 Sep — Federation, Directory Service, IAM Identity Center, Cognito

**🌅 Lectures** — 1h40 raw, ~1h26 at speed

- **[M] §3 Identity & Federation** (31m)
    - Identity Federation & Cognito · 9m
    - AWS Directory Services · 13m
    - AWS IAM Identity Center · 7m
    - Summary of Identity & Federation · 2m
- **[N] §2 Multi-Account Based Architectures** (1h04)
    - Basics of Active Directory · 4m
    - Introducing AWS Directory Service · 9m
    - Federation · 13m
    - Understanding SAML for SSO · 11m
    - Overview of IAM Identity Center · 10m
    - IAM Identity Center Concepts · 4m
    - IAM Identity Center Practicals · 5m
    - Amazon Cognito · 8m
- **[D] §3 Identity Management and Permissions** (5m)
    - Access Control Methods - RBAC & ABAC · 5m

**🌳 Decision trees**

- Workforce identity: IAM Identity Center vs IAM SAML federation vs Directory Service (Managed AD / AD Connector / Simple AD)
- Customer identity: Cognito user pool vs identity pool

**📖 Read**

- [IAM Identity Center user guide](https://docs.aws.amazon.com/singlesignon/latest/userguide/what-is.html)
- [AWS Directory Service admin guide](https://docs.aws.amazon.com/directoryservice/latest/admin-guide/what_is.html)
- [What is Amazon Cognito](https://docs.aws.amazon.com/cognito/latest/developerguide/what-is-amazon-cognito.html)

**🛠️ Lab — Identity Center & Cognito**

- [ ] Enable IAM Identity Center; create groups and permission sets (ReadOnly, PowerUser) assigned per account
- [ ] Sign in through the access portal and switch between accounts; inspect the role created in each account
- [ ] Cognito: user pool + identity pool that gives each user access only to `s3://bucket/${cognito-identity.amazonaws.com:sub}/*`
- [ ] Paper: when would you pick AD Connector vs AWS Managed Microsoft AD vs Simple AD?

💰 Free (skip Managed AD — billed hourly)

**🌙 Evening:** TD Section-Based: Organizational Complexity (continue) + flashcards

### Day 4 · Wed 30 Sep — Cross-account patterns: S3, logging, RAM, StackSets, Service Catalog

**🌅 Lectures** — 2h22 raw, ~1h55 at speed

- **[M] §3 Identity & Federation** (5m)
    - AWS Resource Access Manager - RAM · 5m
- **[M] §12 Deployment and Instance Management** (4m)
    - Service Catalog · 4m
- **[N] §2 Multi-Account Based Architectures** (2h13)
    - Centralized Logging Architectures · 7m
    - Practical - Cross Account CloudTrail Logging · 6m
    - Considerations - S3 Bucket Policy for Cross Account CloudTrail · 5m
    - Overview of AWS License Manager · 5m
    - Practical - AWS License Manager · 5m
    - Overview of AWS Service Catalog · 9m
    - Important Concepts - AWS Service Catalog · 8m
    - Practical - AWS Service Catalog · 13m
    - S3 Bucket Policies · 13m
    - Regaining Access to Locked S3 Bucket · 5m
    - Cross Account S3 Bucket Configuration · 13m
    - Canned ACLs · 9m
    - S3 - Cross Account Replication · 5m
    - Cross Account Replication Practical · 6m
    - Overview of CloudFormation Stack Sets · 5m
    - Practical - CloudFormation StackSets · 12m
    - Resource Access Manager · 7m

**🌳 Decision trees**

- Sharing across accounts: RAM vs StackSets vs Service Catalog
- Centralized logging architecture
- S3 cross-account access: bucket policy vs role vs access point vs Object Ownership

**📖 Read**

- [Creating a trail for an organization](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/creating-trail-organization.html)
- [CloudFormation StackSets](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/what-is-cfnstacksets.html)
- [AWS RAM user guide](https://docs.aws.amazon.com/ram/latest/userguide/what-is.html)

**🛠️ Lab — Cross-account plumbing**

- [ ] Organization trail delivering to a bucket in the security account (write the bucket policy yourself)
- [ ] Cross-account S3 access two ways: bucket policy only vs assumed role; note who owns the uploaded objects
- [ ] S3 cross-account replication to the security account
- [ ] StackSets (service-managed) deploying a read-only audit role to every account of an OU, with auto-deployment on
- [ ] Service Catalog portfolio shared from management to dev; launch a product with a launch constraint

💰 Free / pennies

**🌙 Evening:** TD Section-Based: Organizational Complexity (finish) + flashcards

### Day 5 · Thu 1 Oct — VPC core, endpoints, PrivateLink, VPC sharing

**🌅 Lectures** — 2h29 raw, ~2h07 at speed

- **[M] §15 VPC** (38m)
    - VPC - Basics · 13m
    - VPC Peering · 7m
    - VPC Endpoints · 6m
    - VPC Endpoint Policies · 7m
    - PrivateLink · 5m
- **[N] §3 VPC Endpoints** (1h27)
    - Overview of VPC Endpoints · 11m
    - Architecture of Gateway VPC Endpoints · 5m
    - Gateway VPC Endpoints - Practical Steps · 6m
    - Implementing Gateway VPC Endpoints · 13m
    - Gateway VPC Endpoint Policies · 6m
    - Overview of Interface Endpoints · 9m
    - Implementing Interface Endpoints · 7m
    - Overview of Endpoint Services · 13m
    - Implementing VPC Endpoint Services · 14m
    - Terminating Endpoint Services Resources · 3m
- **[N] §2 Multi-Account Based Architectures** (12m)
    - VPC Sharing in AWS · 12m
- **[D] §5 Advanced Amazon VPC** (12m)
    - VPC Routing Deep Dive · 6m
    - Using IPv6 in a VPC · 6m

**🌳 Decision trees**

- Connect VPCs: peering vs Transit Gateway vs PrivateLink vs VPC sharing
- Private access to AWS services: gateway vs interface endpoint

**📖 Read**

- [Building a scalable and secure multi-VPC network (whitepaper)](https://docs.aws.amazon.com/whitepapers/latest/building-scalable-secure-multi-vpc-network-infrastructure/welcome.html)
- [AWS PrivateLink guide](https://docs.aws.amazon.com/vpc/latest/privatelink/what-is-privatelink.html)

**🛠️ Lab — VPC connectivity**

- [ ] Two VPCs + peering: prove peering is non-transitive with a third VPC
- [ ] S3 gateway endpoint with an endpoint policy limited to one bucket + bucket policy on `aws:SourceVpce`
- [ ] Interface endpoints for SSM so a private instance with no NAT is reachable by Session Manager
- [ ] Endpoint service (NLB + PrivateLink) consumed from another account whose VPC has an overlapping CIDR
- [ ] VPC sharing: share a subnet from prod to dev with RAM and launch an instance in it from dev

💰 Interface endpoints and NLB are billed hourly — tear down tonight

**🌙 Evening:** TD flashcards (networking) + redo today's wrong answers from the week

### Day 6 · Fri 2 Oct — Hybrid connectivity: VPN, Direct Connect, Transit Gateway

**🌅 Lectures** — 2h26 raw, ~2h03 at speed

- **[M] §15 VPC** (32m)
    - Transit Gateway · 10m
    - AWS S2S VPN · 11m
    - AWS Client VPN · 3m
    - Direct Connect · 6m
    - On-Premise Redundant Connections · 2m
- **[N] §7 Networking Primer** (1h47)
    - Virtual Private Networks · 13m
    - AWS Client VPN · 11m
    - ClientVPN Architectures · 5m
    - Site to Site VPNs · 7m
    - Understanding Direct Connect · 10m
    - DX - Public & Private VIF · 7m
    - Direct Connect Gateway · 4m
    - High Availability for Direct Connect · 5m
    - Overview of Transit Gateways · 6m
    - Base Transit Gateway Concepts · 3m
    - Transit Gateway Practical · 8m
    - Routes in Transit Gateway · 7m
    - Attachment Level Routing - Transit Gateways · 8m
    - Transit Gateway - VPN Attachment · 5m
    - Transit Gateways and Direct Connect · 2m
    - Transit Gateway Sharing · 6m
- **[D] §6 Hybrid Connectivity** (7m)
    - AWS VPN CloudHub · 2m
    - AWS Direct Connect Gateway · 5m

**🌳 Decision trees**

- Hybrid connectivity: Site-to-Site VPN vs Direct Connect vs both
- Direct Connect resiliency and DX Gateway vs Transit Gateway
- TGW segmentation with route tables

**📖 Read**

- [Hybrid connectivity (whitepaper)](https://docs.aws.amazon.com/whitepapers/latest/hybrid-connectivity/hybrid-connectivity.html)
- [Direct Connect resiliency recommendations](https://aws.amazon.com/directconnect/resiliency-recommendation/)
- [Transit Gateway FAQ](https://aws.amazon.com/transit-gateway/faqs/)

**🛠️ Lab — Transit Gateway + simulated on-prem**

- [ ] TGW with 3 VPCs (dev, prod, shared): dev and prod both reach shared but not each other (separate route tables)
- [ ] Simulate on-prem with a VPC running a strongSwan/Libreswan EC2 and connect it to TGW with a Site-to-Site VPN (BGP)
- [ ] Share the TGW with another account via RAM
- [ ] Paper: design DX with maximum resiliency + VPN backup, and a DX Gateway serving two regions

💰 TGW attachments and VPN connections are billed hourly — tear down tonight

**🌙 Evening:** [N] section 2 quiz: Practice Test - Domain 1

### Sat 3 Oct — Consolidation week 1

Re-read this week's trees, redo every mistake logged this week, finish any lab left open, verify no resources are left running (Cost Explorer / Tag Editor).

**🌙 Evening:** Flashcards + mistakes review

---

## Week 2 — DNS, network & data protection, detective controls, governance

### Day 7 · Sun 4 Oct — Route 53 & hybrid DNS

**🌅 Lectures** — 2h24 raw, ~2h00 at speed

- **[M] §5 Compute & Load Balancing** (25m)
    - Route 53 - Part 1 · 12m
    - Route 53 - Part 2 · 6m
    - Route 53 - Resolvers & Hybrid DNS · 7m
- **[N] §11 Route53 and Hybrid DNS** (1h59)
    - Advanced Route53 Configurations · 4m
    - Route53 - Understanding Health Checks · 5m
    - Implementing Route53 Health Checks · 7m
    - Route53 Health Check Types · 9m
    - Overview of Routing Policies · 4m
    - Understanding Failover Routing · 5m
    - Implementing Failover Routing · 9m
    - Route53 - Weighted Routing Policy · 5m
    - Route53 - Geolocation Routing Policy · 5m
    - Route53 - Multi-Value Answer Routing Policy · 6m
    - Route53 - Latency Based Routing Policy · 6m
    - Overview of Route53 DNS Resolver · 6m
    - Overview of Hybrid DNS · 9m
    - Route53 Resolver Endpoints · 6m
    - Route53 Resolver - Inbound Endpoint · 3m
    - Creating Inbound Endpoints · 4m
    - Creating Outbound Endpoints · 5m
    - Route53 Resolver - Outbound Endpoints · 5m
    - CNAME vs ALIAS Records · 4m
    - Associating Private Hosted Zone Across AWS Accounts · 5m
    - Cross Account PHZ Association Practical · 7m

**🌳 Decision trees**

- Hybrid DNS: Resolver inbound vs outbound endpoints, forwarding rules
- Route 53 routing policy choice
- Private hosted zones across accounts

**📖 Read**

- [Route 53 Resolver](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resolver.html)
- [Choosing a routing policy](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy.html)

**🛠️ Lab — Hybrid DNS**

- [ ] In your simulated on-prem VPC run a DNS server (BIND/dnsmasq) for `corp.example`
- [ ] Outbound endpoint + forwarding rule so AWS resolves `corp.example`; share the rule with another account via RAM
- [ ] Inbound endpoint so on-prem resolves a private hosted zone
- [ ] Associate a private hosted zone with a VPC in another account (CLI authorization flow)
- [ ] Failover routing with health checks between two endpoints

💰 Resolver endpoints are billed per ENI-hour — tear down tonight

**🌙 Evening:** TD Section-Based: Organizational Complexity — second pass on wrong answers only

### Day 8 · Mon 5 Oct — Network protection: Shield, WAF, Firewall Manager, Network Firewall, NACLs, Flow Logs

**🌅 Lectures** — 2h37 raw, ~2h12 at speed

- **[M] §4 Security** (20m)
    - DDoS and AWS Shield · 6m
    - AWS WAF - Web Application Firewall · 6m
    - AWS Firewall Manager · 3m
    - Blocking an IP Address · 5m
- **[M] §15 VPC** (12m)
    - VPC Flow Logs · 6m
    - AWS Network Firewall · 6m
- **[N] §8 Security Services** (1h43)
    - Understanding DOS Attacks · 9m
    - Mitigating DDOS attacks · 4m
    - AWS Shield · 4m
    - Overview of Web Application Firewalls (WAF) · 14m
    - Introduction to AWS WAF · 15m
    - Components of AWS WAF · 10m
    - Practical - AWS WAF · 10m
    - Overview of Network Firewall · 9m
    - Deploying Network Firewall · 21m
    - Firewall Manager · 7m
- **[N] §10 Logs and Analytics** (13m)
    - VPC Flow Logs · 13m
- **[N] §7 Networking Primer** (6m)
    - Gateway Load Balancers · 6m
- **[D] §17 Security: Defense in Depth** (3m)
    - Network Firewall and DNS Firewall · 3m

**🌳 Decision trees**

- Edge & network protection: Shield Std/Advanced vs WAF vs Network Firewall vs SG/NACL vs Firewall Manager
- Block an IP address: where and how

**📖 Read**

- [Best practices for DDoS resiliency (whitepaper)](https://docs.aws.amazon.com/whitepapers/latest/aws-best-practices-ddos-resiliency/welcome.html)
- [AWS Network Firewall FAQ](https://aws.amazon.com/network-firewall/faqs/)
- [AWS Firewall Manager](https://docs.aws.amazon.com/waf/latest/developerguide/fms-chapter.html)

**🛠️ Lab — Network protection**

- [ ] WAF web ACL on an ALB: managed rule group, rate-based rule, geo match, IP set block
- [ ] Block one IP three ways (NACL, WAF, SG) and write down why SG can't do it
- [ ] VPC Flow Logs to S3 and query them with Athena
- [ ] Paper (or quick build if budget allows): centralized inspection VPC with Network Firewall + TGW appliance mode

💰 Network Firewall endpoints are expensive per hour — paper design unless you tear down within the hour

**🌙 Evening:** TD flashcards (security) + redo wrong answers from the Org Complexity section

### Day 9 · Tue 6 Oct — Encryption & secrets: KMS, CloudHSM, ACM/TLS, Secrets Manager, Parameter Store

**🌅 Lectures** — 2h28 raw, ~2h06 at speed

- **[M] §4 Security** (39m)
    - KMS · 8m
    - Parameter Store · 4m
    - Secrets Manager · 6m
    - RDS Security · 1m
    - SSL Encryption, SNI & MITM · 8m
    - AWS Certificate Manager - ACM · 4m
    - CloudHSM · 5m
    - Solution Architecture - SSL on ELB · 3m
- **[N] §8 Security Services** (1h32)
    - AWS CloudHSM · 6m
    - Important Pointers - CloudHSM · 3m
    - AWS Key Management Service · 6m
    - Creating our first Customer Managed Key (CMK) · 11m
    - Envelope Encryption with KMS · 7m
    - Schedule Key Deletion · 7m
    - Understanding HTTPS Connections · 17m
    - Overview of AWS Certificate Manager · 10m
    - Issuing Certificates with ACM · 3m
    - Overview of AWS Secrets Manager · 10m
    - Creating First Secret in AWS Secrets Manager · 2m
    - Rotating Secrets · 5m
    - Replicating Secrets Across Regions · 5m
- **[N] §16 Systems Manager & Integration Services** (17m)
    - Overview of Parameter Store · 6m
    - Practical - Parameter Store · 3m
    - Point to Note - Parameter Store · 8m

**🌳 Decision trees**

- [Key management: AWS owned vs AWS managed vs customer managed KMS key vs CloudHSM vs external key store](decisions/security/kms-key-types.md)
- [Secrets Manager vs Parameter Store](decisions/security/secrets-storage.md)
- Where to terminate TLS (CloudFront / ALB / NLB / instance)

**📖 Read**

- [AWS KMS concepts](https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html)
- [AWS KMS FAQ](https://aws.amazon.com/kms/faqs/)
- [Secrets Manager FAQ](https://aws.amazon.com/secrets-manager/faqs/)

**🛠️ Lab — Encryption**

- [ ] Customer managed key whose key policy lets the dev account encrypt but not decrypt
- [ ] Envelope encryption by hand with `generate-data-key`
- [ ] Multi-Region key: encrypt in one region, decrypt in another
- [ ] Secrets Manager secret with a rotation Lambda; replicate it to a second region
- [ ] ALB HTTPS listener with two ACM certs (SNI)

💰 KMS keys bill monthly until deleted (minimum 7-day deletion window)

**🌙 Evening:** TD Section-Based: *Continuous Improvement for Existing Solutions* (first chunk)

### Day 10 · Wed 7 Oct — S3 security, CloudTrail & detective controls

**🌅 Lectures** — 2h10 raw, ~1h55 at speed

- **[M] §4 Security** (55m)
    - CloudTrail · 6m
    - CloudTrail - EventBridge Integration · 2m
    - CloudTrail - SA Pro · 7m
    - S3 Security · 10m
    - S3 Access Points · 4m
    - S3 Multi-Region Access Points · 3m
    - S3 Multi-Region Access Points - Hands On · 4m
    - S3 Object Lambda · 3m
    - Amazon Inspector · 2m
    - AWS Managed Logs · 1m
    - Amazon GuardDuty · 3m
    - IAM Advanced Policies · 4m
    - EC2 Instance Connect · 2m
    - AWS Security Hub · 3m
    - Amazon Detective · 1m
- **[N] §8 Security Services** (1h15)
    - Overview of Amazon Macie · 6m
    - Practical - Amazon Macie · 6m
    - Amazon GuardDuty · 12m
    - Practical - Amazon GuardDuty · 5m
    - Amazon GuardDuty - Centralized Findings Architecture · 5m
    - Practical - GuardDuty Centralized Findings · 4m
    - Overview of Amazon Inspector · 5m
    - AWS Inspector Vulnerability Scans · 11m
    - Overview of AWS Security Hub · 8m
    - IAM Access Analyzer · 9m
    - Generating Findings on Shared Resources · 4m

**🌳 Decision trees**

- Detective controls: GuardDuty vs Inspector vs Macie vs Security Hub vs Detective vs Config vs CloudTrail
- S3 access control: bucket policy, ACLs, access points, Block Public Access, Object Ownership
- [CloudTrail: react, alert or keep the logs?](decisions/security/cloudtrail.md)

**📖 Read**

- [AWS Security Reference Architecture](https://docs.aws.amazon.com/prescriptive-guidance/latest/security-reference-architecture/welcome.html)
- [S3 security best practices](https://docs.aws.amazon.com/AmazonS3/latest/userguide/security-best-practices.html)

**🛠️ Lab — Security tooling at org level**

- [ ] GuardDuty and Security Hub with the security account as delegated administrator
- [ ] Macie scan on a bucket containing fake PII
- [ ] S3 access points with distinct policies for two teams on the same bucket
- [ ] EventBridge rule: root user console sign-in → SNS email

💰 30-day free trials — disable GuardDuty/Macie/Security Hub when done

**🌙 Evening:** TD Section-Based: Continuous Improvement (continue)

### Day 11 · Thu 8 Oct — Governance & observability: Config, CloudWatch, EventBridge, Audit Manager

**🌅 Lectures** — 2h02 raw, ~1h44 at speed

- **[M] §4 Security** (4m)
    - AWS Config · 4m
- **[M] §11 Monitoring** (28m)
    - CloudWatch · 6m
    - CloudWatch Logs · 8m
    - Amazon EventBridge · 7m
    - X-Ray · 1m
    - AWS Personal Health Dashboard · 6m — *now called AWS Health Dashboard*
- **[N] §9 Deployment Services** (38m)
    - Revising AWS Config · 15m
    - Practical - AWS Config · 7m
    - AWS Config - Rule Evaluation Mode ( Detective vs Proactive) · 8m
    - AWS Config Aggregator · 5m
    - Configuring Config Aggregator · 3m
- **[N] §8 Security Services** (12m)
    - AWS Audit Manager · 12m
- **[N] §2 Multi-Account Based Architectures** (21m)
    - VPC Traffic Mirroring · 6m
    - VPC Traffic Mirroring Practicals · 15m
- **[D] §16 Monitoring, Logging and Auditing** (19m)
    - AWS CloudTrail · 11m
    - Metric Analysis and Tracing · 5m
    - Architecture Patterns - Monitoring, Logging and Auditing · 3m

**🌳 Decision trees**

- Detect & remediate non-compliance: Config rules + SSM Automation vs EventBridge + Lambda
- Centralized logs & metrics across accounts

**📖 Read**

- [AWS Config conformance packs](https://docs.aws.amazon.com/config/latest/developerguide/conformance-packs.html)
- [Cross-account log data sharing with subscriptions](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CrossAccountSubscriptions.html)

**🛠️ Lab — Governance**

- [ ] Config aggregator in the security account covering all accounts
- [ ] Config rule `s3-bucket-public-read-prohibited` with automatic SSM remediation
- [ ] CloudWatch Logs subscription from dev to a central Firehose → S3 in the security account
- [ ] Metric filter + alarm on `UnauthorizedOperation` errors in CloudTrail logs

💰 Config charges per rule evaluation — delete rules after

**🌙 Evening:** Flashcards + redo all mistakes of weeks 1–2 (rest before the diagnostic)

### Day 12 · Fri 9 Oct — Light day: security wrap-up + prep for the diagnostic

**🌅 Lectures** — 37m raw, ~30m at speed

- **[D] §17 Security: Defense in Depth** (2m)
    - Architecture Patterns - Security · 2m
- **[D] §13 Deployment and Management** (7m)
    - AWS Health API and Dashboards · 3m
    - AWS Well-Architected Tool · 4m
- **[N] §10 Logs and Analytics** (5m)
    - Service Quotas · 5m
- **[N] §8 Security Services** (23m)
    - Network ACL · 10m
    - NACL - Rule Ordering · 13m

**🌳 Decision trees**

- Review all week 1–2 trees; fill the 'Exam traps' sections

**📖 Read**

- [SAP-C02 exam page (domains & weights)](https://aws.amazon.com/certification/certified-solutions-architect-professional/)

**🛠️ Lab — Clean-up & paper architecture**

- [ ] Tear down everything; check Cost Explorer for anything still billing
- [ ] Draw (Excalidraw) your org: accounts, OUs, SCPs, logging flow, security tooling, network hub

💰 Free

**🌙 Evening:** Light: flashcards only. Sleep early.

### Sat 10 Oct — DIAGNOSTIC — TD Timed Set 1 (180 min)

**Diagnostic: TD Timed Set 1 (75 questions, 180 min) in the morning.** Afternoon: go through every explanation (right and wrong) and log each miss in mistakes.md with the tree it belongs to. A low score is expected — this measures the gap, not you.

**🌙 Evening:** Finish the Timed Set 1 review

---

## Week 3 — Compute, load balancing, containers, storage, databases, edge, DR

### Day 13 · Sun 11 Oct — EC2, instance networking, Auto Scaling, Spot & fleets

**🌅 Lectures** — 2h25 raw, ~2h04 at speed

- **[M] §5 Compute & Load Balancing** (38m)
    - Solution Architecture on AWS · 4m
    - EC2 · 10m
    - High Performance Computing (HPC) · 6m
    - Auto Scaling · 8m
    - Auto Scaling Update Strategies · 5m
    - Spot Instances & Spot Fleet · 5m
- **[N] §7 Networking Primer** (53m)
    - Bring Your Own IP · 6m
    - Elastic Network Interface · 10m
    - Enhanced Networking · 5m
    - Placement Groups · 18m
    - Prefix Lists · 6m
    - NAT Gateway Performance · 2m
    - Egress-Only Internet Gateways · 6m
- **[N] §9 Deployment Services** (41m)
    - Overview of Launch Templates · 6m
    - Base Concepts - EC2 Auto Scaling · 9m
    - Overview of Simple Scaling Policy · 6m
    - ASG - Scheduled Scaling Policy · 3m
    - ASG - Step Scaling Policy · 3m
    - Overview of Auto-Scaling Lifecycle Hooks · 9m
    - Practical - Auto-Scaling Lifecycle Hooks · 5m
- **[N] §14 Cost Optimizations** (13m)
    - Overview of EC2 Fleet · 8m
    - Allocation Strategy for Spot Instances · 5m

**🌳 Decision trees**

- EC2 purchase option: On-Demand vs RI vs Savings Plans vs Spot vs Capacity Reservation
- Scaling strategy: target tracking vs step vs scheduled vs predictive; lifecycle hooks
- Placement group: cluster vs spread vs partition

**📖 Read**

- [EC2 purchasing options](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-purchasing-options.html)
- [Auto Scaling groups with multiple instance types](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-mixed-instances-groups.html)
- [Placement groups](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/placement-groups.html)

**🛠️ Lab — Auto Scaling**

- [ ] ASG with a launch template and mixed instances (On-Demand base + Spot, capacity-optimized)
- [ ] Lifecycle hook on launch that runs an SSM document before InService
- [ ] Instance refresh to roll out a new AMI; compare with a warm pool

💰 Small instances — tear down tonight

**🌙 Evening:** TD Section-Based: *Design for New Solutions* (first chunk)

### Day 14 · Mon 12 Oct — Load balancing, Global Accelerator, edge compute locations

**🌅 Lectures** — 2h19 raw, ~1h59 at speed

- **[M] §5 Compute & Load Balancing** (40m)
    - Elastic Load Balancers - Part 1 · 9m
    - Elastic Load Balancers - Part 2 · 7m
    - AWS Global Accelerator · 3m
    - Comparison of Solutions Architecture · 11m
    - AWS Outposts · 4m
    - AWS WaveLength · 2m
    - AWS Local Zones · 4m
- **[N] §4 Load Balancing Solutions** (1h26)
    - Load Balancing in AWS · 13m
    - Application Load Balancers · 9m
    - Listener and Target Groups · 8m
    - Network Load Balancers · 8m
    - Availability Zones & ELB Nodes · 4m
    - ELB - Cross Zone Loadbalancing · 3m
    - ELB - Access Logs · 6m
    - Load Balancer IP Address Types · 9m
    - Sticky Sessions · 9m
    - IP Attachments in NLB · 2m
    - Client IP Preservation · 8m
    - HTTPS Listeners in ELB · 7m
- **[N] §13 Migration Planning** (8m)
    - AWS Outposts · 8m
- **[D] §9 DNS, Caching, and Performance Optimization** (5m)
    - AWS Global Accelerator · 5m

**🌳 Decision trees**

- Entry point: ALB vs NLB vs GWLB vs Global Accelerator vs CloudFront
- Static IP / allow-listing requirements
- [Cross-zone load balancing: how is traffic spread across targets?](decisions/networking/elb-cross-zone.md)
- [IPv6 with Elastic Load Balancing](decisions/networking/elb-ipv6.md)

**📖 Read**

- [Elastic Load Balancing FAQ](https://aws.amazon.com/elasticloadbalancing/faqs/)
- [Global Accelerator FAQ](https://aws.amazon.com/global-accelerator/faqs/)

**🛠️ Lab — Load balancing**

- [ ] ALB with host- and path-based routing and weighted target groups
- [ ] NLB with Elastic IPs; observe client IP preservation vs proxy protocol
- [ ] Global Accelerator in front of ALBs in two regions; kill one region and time the failover

💰 Global Accelerator has a fixed hourly fee; ALB/NLB hourly — tear down tonight

**🌙 Evening:** TD Review Set 2 (chunk 1, ~15 questions) + Section-Based New Solutions

### Day 15 · Tue 13 Oct — Containers & Lambda

**🌅 Lectures** — 2h12 raw, ~1h53 at speed

- **[M] §5 Compute & Load Balancing** (36m)
    - Amazon ECS - Elastic Container Service · 11m
    - Amazon ECR - Elastic Container Registry · 3m
    - Amazon EKS - Elastic Kubernetes Service · 4m
    - ECS Anywhere & EKS Anywhere · 4m
    - AWS Lambda - Part 1 · 7m
    - AWS Lambda - Part 2 · 7m
- **[N] §12 Container Services** (40m)
    - Overview of ECR · 7m
    - Understanding Container Orchestration · 11m
    - Elastic Container Service · 5m
    - ECS - Components · 7m
    - Elastic Kubernetes Service · 6m
    - AWS Fargate · 4m
- **[N] §17 CDN, API Gateways and Lambda** (33m)
    - Overview of Lambda Versioning · 3m
    - Overview of Lambda Alias · 3m
    - Weighted Alias Practical · 2m
    - Lambda Concurrency · 4m
    - Reserved vs Provisioned Concurrency · 10m
    - Lambda Shared Layers · 4m
    - Connectivity Features of AWS Lambda · 7m
- **[D] §12 Docker Containers and PaaS** (16m)
    - AWS App Runner · 11m
    - Architecture Patterns - Containers and PaaS · 5m
- **[D] §11 Serverless Applications** (7m)
    - AWS Lambda Invocations and Concurrency · 7m

**🌳 Decision trees**

- Compute platform: EC2 vs ECS vs EKS vs Fargate vs Lambda vs App Runner vs Beanstalk
- Lambda concurrency: reserved vs provisioned

**📖 Read**

- [Lambda concurrency](https://docs.aws.amazon.com/lambda/latest/dg/lambda-concurrency.html)
- [Amazon ECS best practices guide](https://docs.aws.amazon.com/AmazonECS/latest/bestpracticesguide/intro.html)

**🛠️ Lab — Containers & Lambda**

- [ ] ECS Fargate service behind an ALB; explain task role vs task execution role; service auto scaling
- [ ] Lambda alias with weighted traffic shifting between two versions
- [ ] Reserved vs provisioned concurrency: throttle a function on purpose
- [ ] Optional: EKS cluster (control plane billed hourly)

💰 Fargate tasks/ALB hourly — tear down tonight

**🌙 Evening:** TD Review Set 2 (chunk 2) + Section-Based New Solutions

### Day 16 · Wed 14 Oct — Storage: EBS, EFS, FSx, S3 advanced, Storage Gateway, Backup

**🌅 Lectures** — 3h04 raw, ~2h41 at speed

- **[M] §6 Storage** (1h07)
    - EBS & Local Instance Store · 9m
    - Amazon EFS · 9m
    - Amazon S3 · 10m
    - Amazon S3 - Storage Class Analysis · 1m
    - Amazon S3 - Storage Lens · 6m
    - S3 Solution Architecture · 6m
    - Amazon FSx · 8m
    - Amazon FSx - Solution Architectures · 3m
    - AWS DataSync · 4m
    - AWS DataSync - Solution Architecture · 1m
    - AWS Data Exchange · 2m
    - AWS Transfer Family · 5m
    - AWS Storage Services Price Comparison · 3m
- **[N] §15 Storage Services** (1h54)
    - EBS Volume Types · 12m
    - EFS File System Policies · 8m
    - EFS Access Points · 9m
    - Overview of AWS Backup · 4m
    - Overview of S3 Multi-Part Uploads · 11m
    - S3 Transfer Acceleration · 7m
    - Range GET in S3 · 6m
    - S3 Requester Pays - New · 7m
    - S3 Encryption · 13m
    - S3 - Object Lock · 9m
    - S3 Inventory · 4m
    - S3 Batch Operations · 6m
    - Overview of Amazon FSx · 10m
    - Amazon FSx for Lustre · 8m
- **[M] §14 Migration** (3m)
    - AWS Backup · 3m

**🌳 Decision trees**

- Storage: EBS vs instance store vs EFS vs FSx (Windows / Lustre / ONTAP / OpenZFS) vs S3
- S3 storage class & lifecycle
- S3 data protection: versioning, replication, Object Lock, Backup
- [Backup: DLM vs AWS Backup vs native backups](decisions/storage/backup-strategy.md)

**📖 Read**

- [S3 storage classes](https://aws.amazon.com/s3/storage-classes/)
- [Choosing an Amazon FSx file system](https://aws.amazon.com/fsx/when-to-choose-fsx/)
- [S3 Object Lock](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html)

**🛠️ Lab — Storage**

- [ ] EFS with two access points enforcing different POSIX users/paths; mount from two AZs
- [ ] S3 lifecycle across classes + S3 Inventory + a Batch Operations job over the inventory
- [ ] Object Lock in **governance** mode only (compliance mode cannot be undone until retention ends)
- [ ] AWS Backup plan with a cross-region copy

💰 Pennies — but never use Object Lock compliance mode in a sandbox

**🌙 Evening:** TD Review Set 2 (chunk 3) + Section-Based New Solutions

### Day 17 · Thu 15 Oct — Databases: RDS, Aurora, DynamoDB, ElastiCache

**🌅 Lectures** — 3h03 raw, ~2h34 at speed

- **[M] §8 Databases** (39m)
    - DynamoDB · 12m
    - Amazon OpenSearch · 3m
    - RDS · 10m
    - Aurora - Part 1 · 7m
    - Aurora - Part 2 · 7m
- **[N] §5 Database Primer** (2h15)
    - Revising RDS Read Replicas · 8m
    - RDS Read Replicas Practical · 3m
    - RDS Multi-AZ Deployments · 5m
    - RDS Multi-AZ Deployment Types · 8m
    - RDS Event Notification · 5m
    - RDS Proxy - Updated · 8m
    - Overview of Amazon Aurora · 15m
    - Overview of Aurora Serverless · 12m
    - Aurora Global Database · 10m
    - RDS Storage Auto-Scaling · 5m
    - Aurora Scaling · 3m
    - AWS ElastiCache · 7m
    - Core Components of DynamoDB · 4m
    - DynamoDB Consistency Model · 6m
    - Read and Write Capacity Units · 5m
    - Capacity Modes in DynamoDB · 5m
    - DynamoDB Streams · 10m
    - DynamoDB Global Tables · 6m
    - DynamoDB Accelerator (DAX) · 5m
    - IAM DB Authentication · 5m
- **[D] §10 AWS Database Services** (9m)
    - Amazon RDS Anti-Patterns and Alternatives · 4m
    - Architecture Patterns - AWS Databases · 5m

**🌳 Decision trees**

- Database choice: RDS vs Aurora vs DynamoDB vs DocumentDB vs Neptune vs Keyspaces vs Timestream vs Redshift
- Multi-region database: Aurora Global vs DynamoDB global tables vs cross-region read replica
- Read scaling & caching: replicas vs ElastiCache vs DAX vs RDS Proxy
- [RDS Proxy: when does it fix the problem?](decisions/databases/rds-proxy.md)
- [RDS auto scaling: what scales by itself?](decisions/databases/rds-auto-scaling.md)
- [DynamoDB: how many RCU and WCU?](decisions/databases/dynamodb-capacity.md)

**📖 Read**

- [Aurora Global Database](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-global-database.html)
- [DynamoDB global tables](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GlobalTables.html)
- [RDS Proxy](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy.html)

**🛠️ Lab — Databases**

- [ ] Aurora cluster with a reader; trigger a failover and measure downtime
- [ ] DynamoDB global table in two regions + Streams → Lambda
- [ ] Lambda → RDS Proxy → Aurora with IAM DB authentication
- [ ] Paper: Aurora Global Database planned switchover vs unplanned failover (RPO/RTO)

💰 Aurora instances are billed hourly — tear down tonight

**🌙 Evening:** TD Review Set 2 (chunk 4) + Section-Based New Solutions

### Day 18 · Fri 16 Oct — Caching & edge (CloudFront, API Gateway) + Disaster Recovery

**🌅 Lectures** — 2h54 raw, ~2h33 at speed

- **[M] §7 Caching** (36m)
    - CloudFront - Part 1 · 8m
    - CloudFront - Part 2 · 5m
    - Lambda@Edge and CloudFront Functions · 10m
    - Lambda@Edge Reduce Latency · 3m
    - Amazon ElastiCache · 5m
    - Handling Extreme Rates · 5m
- **[M] §5 Compute & Load Balancing** (21m)
    - API Gateway · 13m
    - API Gateway - Part 2 · 5m
    - AWS AppSync · 3m
- **[M] §14 Migration** (13m)
    - Disaster Recovery · 11m
    - AWS FIS - Fault Injection Simulator · 2m
- **[N] §17 CDN, API Gateways and Lambda** (1h23)
    - Revising - Overview of  Amazon CloudFront · 9m
    - CloudFront - Origin Access Control · 6m
    - Custom Error Pages in CloudFront · 6m
    - Multiple Origin Configuration in CloudFront · 4m
    - High-Availability with Origin FailOver · 6m
    - Overview of CloudFront Signed URLs · 9m
    - Lambda@Edge · 11m
    - CloudFront Functions · 3m
    - Differences - CloudFront Functions vs Lambda@Edge · 3m
    - Introduction to API Gateway · 5m
    - REST APIs vs HTTP APIs · 4m
    - API Keys and Usage Plans · 7m
    - API Gateway Endpoint Types · 3m
    - API Gateway Logging · 7m
- **[N] §5 Database Primer** (7m)
    - RTO & RPO · 7m
- **[D] §13 Deployment and Management** (14m)
    - RPO, RTO, and DR Strategies · 12m
    - AWS Elastic Disaster Recovery · 2m

**🌳 Decision trees**

- DR strategy: backup & restore vs pilot light vs warm standby vs multi-site active/active
- Edge logic: Lambda@Edge vs CloudFront Functions
- API Gateway: REST vs HTTP vs WebSocket; edge vs regional vs private

**📖 Read**

- [Disaster recovery of workloads on AWS (whitepaper)](https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-workloads-on-aws.html)
- [Restricting access to an S3 origin (OAC)](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html)
- [API Gateway endpoint types](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-endpoint-types.html)

**🛠️ Lab — Edge + DR**

- [ ] CloudFront with OAC to a private bucket + an origin group for failover; signed URLs on one path
- [ ] CloudFront Function rewriting a header
- [ ] Private REST API reachable only through an interface endpoint; usage plan + API key
- [ ] Pilot light: DB replica + stopped app tier in region B, Route 53 failover; run the failover

💰 Moderate — tear down tonight

**🌙 Evening:** TD Review Set 2 (finish)

### Sat 17 Oct — Consolidation week 3

**[N] 'Exam Preparation Practice Test 1' timed in the morning.** Then re-read week 3 trees and redo mistakes.

**🌙 Evening:** Review [N] Practice Test 1

---

## Week 4 — Integration, data, deployment, operations, migration, cost

### Day 19 · Sun 18 Oct — Application integration: SQS, SNS, EventBridge, Step Functions, MQ

**🌅 Lectures** — 2h32 raw, ~2h08 at speed

- **[M] §9 Service Communication** (34m)
    - Step Functions · 10m
    - SQS · 9m
    - Amazon MQ · 2m
    - Amazon SNS · 4m
    - Amazon SNS - SQS Fan Out Pattern · 6m
    - Amazon SNS - Message Delivery Retries · 3m
- **[N] §6 Application Integration** (1h41)
    - Revising SQS · 9m
    - SQS Dead Letter Queues · 8m
    - SQS Queue Types · 3m
    - FIFO Queue · 3m
    - Architecture - Auto-Scaling based on SQS Messages · 4m
    - Architecture - Message Queues in Database Transactions · 4m
    - Amazon MQ · 6m
    - Simple Notification Service (SNS) · 9m
    - SNS Fanout Architecture · 4m
    - SNS Message Filtering · 4m
    - Amazon Event Bridge · 10m
    - Concepts - AWS EventBridge · 13m
    - Overview of Step Functions · 6m
    - Security Incident Response with AWS Step Functions · 9m
    - AWS SES · 5m
    - Amazon AppFlow · 4m
- **[D] §11 Serverless Applications** (17m)
    - Application Integration Services Comparison · 9m
    - Architecture Patterns - Serverless · 8m

**🌳 Decision trees**

- Messaging: SQS vs SNS vs EventBridge vs Kinesis vs Amazon MQ
- Orchestration: Step Functions Standard vs Express (vs SWF legacy)

**📖 Read**

- [Choosing between messaging services for serverless applications](https://aws.amazon.com/blogs/compute/choosing-between-messaging-services-for-serverless-applications/)
- [Choosing a Step Functions workflow type](https://docs.aws.amazon.com/step-functions/latest/dg/choosing-workflow-type.html)

**🛠️ Lab — Integration**

- [ ] SNS → SQS fan-out with filter policies; DLQ + redrive
- [ ] FIFO queue with message groups: prove per-group ordering
- [ ] EventBridge cross-account event bus + archive & replay
- [ ] Step Functions workflow with Retry/Catch and a human-approval (task token) step

💰 Free tier level

**🌙 Evening:** TD Section-Based: Continuous Improvement (finish) + TD Review Set 3 (chunk 1)

### Day 20 · Mon 19 Oct — Data engineering & analytics

**🌅 Lectures** — 1h51 raw, ~1h43 at speed

- **[M] §10 Data Engineering** (1h10)
    - Amazon Kinesis Data Streams · 4m
    - Amazon Data Firehose · 9m
    - Amazon Managed Service for Apache Flink · 2m
    - Streaming Architectures · 8m
    - Amazon MSK · 4m
    - AWS Batch · 7m
    - Amazon EMR · 6m
    - Running Jobs on AWS · 2m
    - AWS Glue · 2m
    - Redshift · 9m
    - Amazon DocumentDB · 2m
    - Amazon Timestream · 2m
    - Amazon Athena · 5m
    - Amazon QuickSight · 4m
    - Big Data Architecture · 4m
- **[N] §10 Logs and Analytics** (31m)
    - Amazon Kinesis · 8m
    - Amazon Kinesis Capabilities · 8m
    - Amazon OpenSearch · 4m
    - OpenSearch Storage Tiers · 6m
    - Amazon Athena · 5m
- **[D] §15 Analytics Services** (10m)
    - Other Analytics Services · 8m
    - Architecture Patterns - Analytics · 2m

**🌳 Decision trees**

- Streaming ingestion: Kinesis Data Streams vs Firehose vs MSK
- Analytics engine: Athena vs Redshift vs EMR vs OpenSearch vs Glue

**📖 Read**

- [Kinesis Data Streams FAQ](https://aws.amazon.com/kinesis/data-streams/faqs/)
- [Amazon Data Firehose FAQ](https://aws.amazon.com/firehose/faqs/)
- [AWS Lake Formation](https://docs.aws.amazon.com/lake-formation/latest/dg/what-is-lake-formation.html)

**🛠️ Lab — Data pipeline**

- [ ] Kinesis Data Streams → Firehose (Parquet conversion) → S3 → Glue crawler → Athena
- [ ] Lake Formation: grant column-level access to one table to another principal
- [ ] Paper: when would you swap in MSK, EMR or Redshift?

💰 Kinesis shards bill hourly — tear down tonight

**🌙 Evening:** TD Section-Based: *Accelerate Workload Migration and Modernization* (chunk 1) + Review Set 3 (chunk 2)

### Day 21 · Tue 20 Oct — Deployment: CI/CD, CloudFormation, Beanstalk, Image Builder

**🌅 Lectures** — 2h17 raw, ~1h58 at speed

- **[M] §12 Deployment and Instance Management** (31m)
    - Elastic Beanstalk · 7m
    - CodeDeploy · 10m
    - CloudFormation · 8m
    - SAM - Serverless Application Model · 2m
    - AWS CDK - Cloud Development Kit · 2m
    - AWS Cloud Map · 2m
- **[M] §17 Other Services** (12m)
    - CICD · 9m
    - EC2 Image Builder · 3m
- **[N] §9 Deployment Services** (1h26)
    - AWS CodeBuild · 11m
    - AWS CodeDeploy · 9m
    - AWS CodePipeline · 10m
    - Overview of Elastic Beanstalk · 9m
    - AWS Elastic Beanstalk - Deployment Policies · 9m
    - AWS Elastic Beanstalk Deployment Policy - Rolling · 6m
    - Elastic Beanstalk Deployment Policy - Rolling with Additional Batch · 14m
    - AWS ElasticBeanstalk - Blue/Green Deployment Method · 4m
    - Overview of EC2 Image Builder · 14m
- **[D] §13 Deployment and Management** (8m)
    - AWS CloudFormation · 5m
    - Architecture Patterns - Deployment and Management · 3m

**🌳 Decision trees**

- Deployment strategy: in-place vs rolling vs rolling with batch vs immutable vs blue/green vs canary
- IaC at scale: CloudFormation vs StackSets vs Service Catalog vs CDK

**📖 Read**

- [Blue/green deployments on AWS (whitepaper)](https://docs.aws.amazon.com/whitepapers/latest/blue-green-deployments/welcome.html)
- [CloudFormation DeletionPolicy](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-deletionpolicy.html)

**🛠️ Lab — CI/CD**

- [ ] CodePipeline: source → CodeBuild → CodeDeploy blue/green to an ASG (or ECS)
- [ ] CloudFormation: change set, drift detection, DeletionPolicy Snapshot on a DB, a custom resource
- [ ] Elastic Beanstalk blue/green with a CNAME swap

💰 Small — tear down tonight

**🌙 Evening:** TD Section-Based: Migration & Modernization (chunk 2) + Review Set 3 (chunk 3)

### Day 22 · Wed 21 Oct — Operations: Systems Manager, SAM, Batch, SWF, Transfer Family

**🌅 Lectures** — 1h56 raw, ~1h34 at speed

- **[M] §12 Deployment and Instance Management** (8m)
    - AWS Systems Manager - SSM · 8m
- **[N] §16 Systems Manager & Integration Services** (1h39)
    - Overview of AWS Systems Manager · 8m
    - Configuring SSM Agent · 10m
    - Overview of Session Manager · 7m
    - Overview of SSM - Run Command · 4m
    - Overview of AWS Systems Manager Automation · 8m
    - Points to Note - SSM Automation · 5m
    - AWS Systems Manager - Patch Manager · 12m
    - AWS Systems Manager - Inventory · 4m
    - AWS SAM · 11m
    - AWS Batch · 10m
    - AWS Simple Workflow Service · 11m — *legacy — know it exists; Step Functions is the answer for new designs*
    - AWS AppStream 2.0 · 4m
    - AWS Transfer Family · 5m
- **[N] §8 Security Services** (9m)
    - Amazon CodeGuru · 9m

**🌳 Decision trees**

- Instance access & patching: Session Manager vs bastion vs EC2 Instance Connect; Patch Manager
- Batch processing: AWS Batch vs Lambda vs Fargate vs EMR

**📖 Read**

- [What is AWS Systems Manager](https://docs.aws.amazon.com/systems-manager/latest/userguide/what-is-systems-manager.html)
- [Patch Manager](https://docs.aws.amazon.com/systems-manager/latest/userguide/patch-manager.html)

**🛠️ Lab — Operations**

- [ ] Session Manager with no inbound ports; session logs to S3
- [ ] Patch baseline + maintenance window across tagged instances
- [ ] Automation runbook executed across two accounts and two regions
- [ ] Parameter Store hierarchy read by path from a Lambda

💰 Free tier level

**🌙 Evening:** TD Section-Based: Migration & Modernization (finish) + Review Set 3 (chunk 4)

### Day 23 · Thu 22 Oct — Migration: 7Rs, discovery, MGN, DMS/SCT, Snow, DataSync

**🌅 Lectures** — 2h06 raw, ~1h48 at speed

- **[M] §14 Migration** (24m)
    - Cloud Migration Strategies - The 7Rs · 5m
    - Snow Family · 3m
    - Snow Family - Improving Performance · 1m
    - AWS DMS - Database Migration Services · 6m
    - AWS CART - Cloud Adoption Readiness Tool · 1m — *legacy tool — skim*
    - VM Migrations Services · 7m
    - AWS Migration Evaluator · 1m
- **[N] §13 Migration Planning** (46m)
    - Migration Stratergies · 5m
    - AWS Snowball Family · 9m
    - VMWare vCenter Migartions · 5m
    - AWS Application Discovery Service · 6m
    - Database Migration Service · 7m
    - AWS Schema Conversion · 5m
    - DMS Migration Types · 3m
    - AWS DataSync · 6m
- **[D] §14 Migration and Transfer Services** (27m)
    - Introduction · 1m
    - AWS Migration Tools Overview · 3m
    - AWS Database Migration Service (DMS) · 2m
    - AWS Application Migration Service (MGN) · 3m
    - AWS DataSync · 2m
    - AWS Snow Family · 5m
    - The 7 Rs of Migration · 8m
    - Architecture Patterns - Migration and Transfer · 3m
- **[M] §14 Migration** (13m)
    - Storage Gateway · 8m
    - Storage Gateway - Advanced Concepts · 5m
- **[N] §15 Storage Services** (16m)
    - AWS Storage Gateways · 13m
    - Points to Note - Storage Gateway · 3m

**🌳 Decision trees**

- The 7Rs: choosing a migration strategy
- Migration tooling: MGN vs DMS/SCT vs DataSync vs Transfer Family vs Snow vs Storage Gateway
- Data transfer: online vs offline (bandwidth × time math)

**📖 Read**

- [Migration strategies (7Rs)](https://docs.aws.amazon.com/prescriptive-guidance/latest/large-migration-guide/migration-strategies.html)
- [AWS Application Migration Service](https://docs.aws.amazon.com/mgn/latest/ug/what-is-application-migration-service.html)
- [AWS DMS](https://docs.aws.amazon.com/dms/latest/userguide/Welcome.html)

**🛠️ Lab — Migration**

- [ ] DMS: MySQL on EC2 → Aurora MySQL, full load + CDC; change a row and watch it replicate
- [ ] MGN: replicate an EC2 'on-prem' server and launch a test instance
- [ ] DataSync: NFS server on EC2 → S3
- [ ] Paper: 500 TB over a 1 Gbps link — how long, and what would you do instead?

💰 DMS replication instance hourly — tear down tonight

**🌙 Evening:** TD Review Set 3 (finish)

### Day 24 · Fri 23 Oct — Cost optimization + ML & other services

**🌅 Lectures** — 2h24 raw, ~2h11 at speed

- **[M] §13 Cost Control** (28m)
    - Cost Allocation Tags · 1m
    - AWS Tag Editor · 0m
    - Trusted Advisor · 4m
    - AWS Service Quotas · 1m
    - EC2 Launch Types & Savings Plan · 3m
    - S3 Cost Savings · 4m
    - S3 Storage Classes - Reminder · 6m
    - AWS Budgets & Cost Explorer · 6m
    - AWS Compute Optimizer · 2m
    - EC2 Reserved Instance · 1m
- **[M] §16 Machine Learning** (30m)
    - Amazon Bedrock · 4m
    - Rekognition Overview · 4m
    - Transcribe Overview · 3m
    - Polly Overview · 4m
    - Translate Overview · 1m
    - Lex + Connect Overview · 2m
    - Comprehend Overview · 2m
    - Comprehend Medical Overview · 2m
    - SageMaker AI Overview · 3m
    - Kendra Overview · 1m
    - Personalize Overview · 2m
    - Textract Overview · 1m
    - Machine Learning Summary · 1m
- **[M] §17 Other Services** (22m)
    - Other Services · 0m
    - Alexa for Business, Lex & Connect · 2m — *Alexa for Business is discontinued — focus on Lex & Connect*
    - Kinesis Video Streams · 2m
    - AWS WorkSpaces · 6m
    - Amazon AppStream 2.0 · 2m
    - AWS Device Farm · 1m
    - Amazon Macie · 1m
    - Amazon SES · 3m
    - Amazon Pinpoint · 2m
    - AWS IoT Core · 2m
    - Other Services Summary · 1m
- **[N] §14 Cost Optimizations** (58m)
    - AWS Compute Optimizer · 7m
    - Trusted Advisor · 10m
    - Tagging Strategies · 5m
    - Tagging Best Practices · 3m
    - EC2 Pricing Models · 11m
    - Reserved Instances · 10m
    - On-Demand Capacity Reservation · 4m
    - EC2 Tenancy Attribute · 6m
    - Turning Off Reserved Instance Sharing · 2m
- **[D] §18 Additional Services** (6m)
    - AWS License Manager · 4m
    - AWS Cost Management Tools · 2m

**🌳 Decision trees**

- Cost visibility & control: tags, Cost Explorer, CUR/Data Exports, Budgets actions, Compute Optimizer, Trusted Advisor
- Purchase commitments: RI (standard/convertible) vs Compute SP vs EC2 Instance SP

**📖 Read**

- [Cost Optimization pillar](https://docs.aws.amazon.com/wellarchitected/latest/cost-optimization-pillar/welcome.html)
- [What are Savings Plans](https://docs.aws.amazon.com/savingsplans/latest/userguide/what-is-savings-plans.html)
- [Budgets actions](https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-controls.html)

**🛠️ Lab — Cost governance**

- [ ] Activate cost allocation tags; group Cost Explorer by tag and by account
- [ ] Budget action that attaches a deny policy when the sandbox exceeds a threshold
- [ ] Data Exports (CUR 2.0) to S3 and query with Athena
- [ ] SCP/tag policy requiring `env` on EC2 creation

💰 Free

**🌙 Evening:** Flashcards + mistakes review

### Sat 24 Oct — Consolidation week 4

**[N] 'Exam Preparation Practice Test 2' timed in the morning.** Then re-read all week 4 trees and the full mistakes log. Final check: nothing left running in the sandbox.

**🌙 Evening:** Review [N] Practice Test 2

---

## Exam simulation week

| Date | Morning / afternoon | Evening |
|---|---|---|
| Sun 25 Oct | **TD Timed Set 4** (180 min) + full review | Log mistakes |
| Mon 26 Oct | Gap-fixing on Set 4 misses + **[M] §18 Exam Preparation** (68m: sample questions walkthrough) | Flashcards |
| Tue 27 Oct | **TD Timed Set 6** (180 min) + full review | Log mistakes |
| Wed 28 Oct | Gap-fixing + **[D] Sample Practice Test** | Review |
| Thu 29 Oct | **Skill Builder official practice exam** | Review |
| Fri 30 Oct | **TD Randomized Test** (lighter) + re-read all 'Exam traps' sections | mistakes.md one last pass |
| Sat 31 Oct | Light review of trees only. No new questions after lunch. | Rest |
| **Sun 1 Nov** | **🎯 EXAM** |  |

**Kept in reserve for a retake:** TD Timed Set 5 and [N] Exam Preparation Practice Test 3.

## If a retake is needed (2 – 16 Nov)

1. Same day: book the earliest slot on **Sun 15 or Mon 16 Nov**. Slots will be scarce before C02 retires.
2. Use the score report's per-domain feedback to rank weak domains.
3. Nov 2–13: re-watch the weak domains' lectures, rebuild their trees, redo their TD section-based tests.
4. Around Nov 10: TD Timed Set 5. Around Nov 12: [N] Practice Test 3.

---

## Appendix — unscheduled lectures

Left out on purpose: duplicates of scheduled content, basics you already know from SAA, or hands-on demos (you run your own labs). Use them when a topic doesn't click.

### [N] [NEW]

- **§1 Getting started with the course** — 1 lecture, 6m
- **§4 Load Balancing Solutions** — 5 lectures, 36m (incl. 3 hands-on)
- **§6 Application Integration** — 8 lectures, 33m (incl. 2 hands-on)
- **§7 Networking Primer** — 3 lectures, 40m
- **§9 Deployment Services** — 7 lectures, 49m (incl. 5 hands-on)
- **§12 Container Services** — 5 lectures, 48m
- **§13 Migration Planning** — 1 lecture, 6m
- **§14 Cost Optimizations** — 4 lectures, 25m
- **§15 Storage Services** — 23 lectures, 2h14 (incl. 4 hands-on)
- **§16 Systems Manager & Integration Services** — 2 lectures, 8m (incl. 2 hands-on)
- **§17 CDN, API Gateways and Lambda** — 12 lectures, 1h05 (incl. 4 hands-on)
- **§18 Machine Learning Services** — 8 lectures, 29m
- **§19 Other Important Services** — 3 lectures, 21m

### [D] Davis

- **§1 Introduction and Course Download** — 2 lectures, 8m
- **§2 AWS Accounts and Organizations** — 12 lectures, 1h18 (incl. 7 hands-on)
- **§3 Identity Management and Permissions** — 19 lectures, 1h49 (incl. 6 hands-on)
- **§4 AWS Directory Services and Federation** — 4 lectures, 25m (incl. 1 hands-on)
- **§5 Advanced Amazon VPC** — 13 lectures, 1h21 (incl. 6 hands-on)
- **§6 Hybrid Connectivity** — 5 lectures, 32m
- **§7 Compute, Auto Scaling, and Load Balancing** — 21 lectures, 2h02 (incl. 6 hands-on)
- **§8 AWS Storage Services** — 18 lectures, 1h27 (incl. 4 hands-on)
- **§9 DNS, Caching, and Performance Optimization** — 12 lectures, 1h05 (incl. 3 hands-on)
- **§10 AWS Database Services** — 16 lectures, 1h09 (incl. 2 hands-on)
- **§11 Serverless Applications** — 13 lectures, 1h16 (incl. 4 hands-on)
- **§12 Docker Containers and PaaS** — 16 lectures, 1h40 (incl. 6 hands-on)
- **§13 Deployment and Management** — 23 lectures, 2h22 (incl. 13 hands-on)
- **§15 Analytics Services** — 5 lectures, 26m (incl. 1 hands-on)
- **§16 Monitoring, Logging and Auditing** — 5 lectures, 22m (incl. 3 hands-on)
- **§17 Security: Defense in Depth** — 17 lectures, 1h28 (incl. 5 hands-on)
- **§18 Additional Services** — 8 lectures, 30m (incl. 3 hands-on)
- **§20 Additional Training Resources** — 1 lecture, 2m

[M] Maarek's §18 Exam Preparation is scheduled for Mon 26 Oct. §19 (Congratulations) is for after you pass.
