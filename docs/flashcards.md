---
hide:
  - toc
---

# Flashcards

**From the site**: built from the decision pages. **Exam extras**: other things worth knowing for SAP-C02. Flip, then **Next**, or **Missed** to see the card again later.

<div id="fc-app"></div>

<!--
HOW TO EDIT
- One section per decision page: the link in the "##" heading becomes the card's "Go deeper" link.
- One card = one block:  ??? info|warning|tip "Front"  + indented back.
    info = Service · warning = Warning · tip = Tip
- No double quotes inside the front text.
- To prune, delete the block.
- Decks: a <div class="fc-deck" data-name="..."></div> line starts a deck; every card below it belongs to that deck.
-->

<div class="fc-deck" data-name="From the site"></div>

## [Will this request be allowed?](decisions/identity/policy-evaluation.md)

??? warning "An SCP that allows `s3:*` is attached to the account. Can users now use S3?"
    **No.** SCPs, RCPs, permissions boundaries, session and endpoint policies **never grant**. An identity or resource policy must still allow.

??? info "Who is NOT restricted by SCPs?"
    The **management account** and **service-linked roles**. The **root user of member accounts is** restricted.

??? tip "SCP vs RCP, in one line?"
    **SCP** caps what *your principals* can do. **RCP** caps what *anyone*, even outside the org, can do *on your resources*.

??? warning "Bucket policy with `aws:SourceIp` for traffic coming through a VPC endpoint?"
    Doesn't match: requests carry **private** IPs. Use `aws:SourceVpce` or `aws:SourceVpc`.

??? tip "Switching an OU to an allow-list SCP: in which order?"
    **Attach the allow SCP first, then detach `FullAWSAccess`.** The allow must exist at every level, root → OU → account.

??? info "Can on-prem or a peered VPC use an S3 gateway endpoint?"
    **No.** Gateway endpoints are route table entries, same VPC and same Region only. From outside → **interface endpoint**.

??? tip "Stop instances in a VPC from writing to buckets outside the company?"
    **VPC endpoint policy** restricting resources, e.g. `aws:ResourceOrgID` = your org.

## [Cross-account access](decisions/identity/cross-account-access.md)

??? info "Assume a role vs resource-based policy: the key difference?"
    Assuming a role **drops the caller's own permissions**. A resource policy lets the caller **keep its identity**: needed to act on resources in both accounts in one operation.

??? tip "A SaaS vendor assumes a role in many customers' accounts. What protects you?"
    Trust policy with an **`sts:ExternalId`** condition (confused deputy).

??? tip "Grant all accounts of the org, including future ones?"
    Resource policy with **`aws:PrincipalOrgID`**.

??? info "Share a subnet, Transit Gateway or Resolver rule with another account?"
    **AWS RAM.**

??? warning "Role chaining: maximum session duration?"
    **1 hour**, whatever the role's max session duration.

??? warning "Role in B trusts account A. Can A's users assume it now?"
    Not yet: A's principals also need **`sts:AssumeRole`** on that role in their own identity policy.

??? info "S3 Object Ownership: the three settings?"
    **Bucket owner enforced** (ACLs off, default) · **Bucket owner preferred** · **Object writer**.

??? warning "ACLs disabled for a week, then re-enabled. Who owns objects uploaded during that week?"
    Still the **bucket owner**. Objects from *before* go back to their uploaders, with their old ACLs restored.

??? warning "Does disabling S3 ACLs delete them?"
    **No**, they're ignored and come back if ACLs are re-enabled. Move ACL grants to the bucket policy **before** disabling.

??? warning "Upload with a `public-read` ACL to a bucket with ACLs disabled?"
    Fails: **400 `AccessControlListNotSupported`**. Only no ACL or `bucket-owner-full-control` is accepted.

## [KMS key types and envelope encryption](decisions/security/kms-key-types.md)

??? info "AWS owned vs AWS managed vs customer managed key?"
    **Owned**: free, invisible. **Managed** (`aws/s3`…): visible in CloudTrail, policy not editable, yearly rotation. **Customer managed**: full control (policy, rotation, disable), $1/month.

??? warning "Share an EBS snapshot encrypted with `aws/ebs` with another account?"
    Impossible. **Copy it re-encrypted with a customer managed key**, grant the other account in the key policy, then share.

??? tip "Rotate a key every 90 days?"
    **Customer managed key** with a custom rotation period (90–2560 days). AWS managed keys rotate yearly, fixed.

??? info "Does key rotation require re-encrypting data?"
    **No.** Same key ID and ARN; KMS keeps the old material to decrypt older data.

??? tip "Keys in a single-tenant HSM you control? Keys outside AWS?"
    **CloudHSM custom key store**. **External key store (XKS)**.

??? info "Max size for KMS `Encrypt`?"
    **4 KB.** Anything bigger → **envelope encryption**.

??? info "Envelope encryption in three steps?"
    1. `GenerateDataKey` → plaintext + encrypted data key. 2. Encrypt data locally, **erase the plaintext key**. 3. Store the **encrypted** data key with the data.

??? tip "Prepare data keys now, encrypt later, no plaintext key in between?"
    **`GenerateDataKeyWithoutPlaintext`**, then `Decrypt` when needed.

??? warning "Busy SSE-KMS bucket hits `ThrottlingException` or high KMS cost?"
    Enable **S3 Bucket Keys**: up to 99% fewer KMS calls.

??? warning "Delete vs disable a KMS key?"
    **Delete** (7–30 day wait) = data lost forever. **Disable** = reversible.

## [Secrets Manager vs Parameter Store](decisions/security/secrets-storage.md)

??? tip "Rotate a database password automatically with the least overhead?"
    **Secrets Manager** (native rotation for RDS, Aurora, Redshift, DocumentDB).

??? tip "Cheapest place for a static API key?"
    **Parameter Store Standard**, `SecureString`. Free.

??? info "Max value size: Parameter Store Standard, Parameter Store Advanced, Secrets Manager?"
    Parameter Store Standard **4 KB** · Parameter Store Advanced **8 KB** · Secrets Manager **64 KB**.

??? info "Parameter Store or Secrets Manager: share with another account?"
    Parameter Store **Advanced** via **RAM**. Secrets Manager: **resource policy + customer managed key**.

??? info "Same secret available in another Region for DR?"
    Secrets Manager **replica secrets**.

## [CloudTrail: react, alert or keep](decisions/security/cloudtrail.md)

??? tip "React within seconds to one API call?"
    **EventBridge** rule → Lambda / SNS / SSM.

??? tip "Alert when more than N failed logins in 5 minutes?"
    **CloudWatch Logs metric filter + alarm.** EventBridge can't count.

??? info "Who downloaded this S3 object?"
    **S3 data events** on the trail (off by default) or S3 server access logs.

??? warning "Is MFA Delete WORM?"
    No: root with MFA can still delete. *Nobody can delete* → **Object Lock compliance mode**.

??? info "Detect unusual API activity without a threshold?"
    **CloudTrail Insights.**

??? info "CloudTrail Event history keeps what, for how long?"
    **Management events, 90 days**, free, no trail needed.

## [Auto Scaling groups: which scaling policy?](decisions/compute/asg-scaling-policies.md)

??? tip "Default scaling policy, least overhead?"
    **Target tracking.**

??? tip "EC2 instances in an Auto Scaling group process messages from an SQS queue. Which metric should the target tracking policy use?"
    **Backlog per instance** = `ApproximateNumberOfMessagesVisible` ÷ number of InService instances (published as a custom metric). Target = how many messages one instance can handle within the acceptable delay. Queue length alone doesn't account for the fleet size.

??? warning "Predictive scaling for Black Friday?"
    No: predictive needs a **recurring** pattern. One-off event → **scheduled** scaling.

??? warning "New instances keep being added before the first ones take load. Cooldown?"
    **Instance warmup.** Cooldown only applies to simple scaling.

??? tip "10-minute boot makes scale-out too slow?"
    **Warm pool**, **predictive** scaling, or a baked **AMI**.

??? warning "App is down but the ASG doesn't replace instances?"
    Turn on the **ELB health check type**. Default is EC2 status checks only.

??? info "Run a script before an instance is terminated?"
    **Lifecycle hook** (`Terminating:Wait`).

## [Spot fleets](decisions/compute/spot-fleets.md)

??? tip "Default Spot allocation strategy?"
    **price-capacity-optimized.**

??? warning "lowest-price to save money?"
    Cheapest pools are reclaimed first: **most interruptions**.

??? info "Spot interruption notice?"
    **2 minutes**, via **EventBridge** or instance metadata. A **rebalance recommendation** may come earlier.

??? warning "You cancel a Spot Instance request (or a Spot Fleet). What happens to the Spot Instances it already launched?"
    **They keep running.** Canceling only stops new launches. Order matters: **cancel the request first, then terminate the instances** (a Spot Fleet can be canceled with its terminate option). Terminating first while a **persistent** request is still open makes it launch replacements.

??? tip "A service on Spot must always serve traffic?"
    ASG **mixed instances** with an **On-Demand base**.

## [Route 53 routing policies](decisions/networking/route53-routing-policies.md)

??? warning "Geolocation records without a default record?"
    Users matching no location get **no answer**.

??? info "Route 53: health check a private resource?"
    Health check based on a **CloudWatch alarm**.

??? warning "CNAME at the zone apex?"
    Not allowed. **Alias** record.

??? tip "Shift traffic by growing a Region's area?"
    **Geoproximity** with a positive **bias**.

??? info "Route 53 multivalue answer returns?"
    Up to **8 healthy** records, random. Not a load balancer.

??? tip "An app runs in two Regions. Route 53 failover is too slow because clients cache DNS answers. Which service fails over between Regions almost instantly?"
    **AWS Global Accelerator.** Clients use 2 static anycast IPs that never change; Global Accelerator health-checks the endpoints and shifts traffic to the healthy Region in seconds, with no DNS TTL to wait for.

## [Cross-zone load balancing](decisions/networking/elb-cross-zone.md)

??? info "Cross-zone default and cost: ALB, NLB, GWLB?"
    **ALB**: on, free. **NLB** and **GWLB**: off, inter-AZ data **charged** when on.

??? tip "AZ-a has 2 targets, AZ-b 8. Load per target with cross-zone off, then on?"
    Off: **25%** (AZ-a) vs **6.25%** (AZ-b). On: **10%** each.

??? warning "Turn off cross-zone on an ALB to save money?"
    It's **free** on ALB: saves nothing. And it can only be turned off **per target group**.

??? tip "Zonal shift / AZ isolation needs which setting?"
    Cross-zone **off** + **same capacity in every AZ**.

??? warning "NLB source IP stickiness, users behind a corporate NAT?"
    They all share one IP → **all land on one target**.

??? tip "Keep user sessions without stickiness?"
    Store sessions in **ElastiCache** or **DynamoDB**.

## [IPv6 with Elastic Load Balancing](decisions/networking/elb-ipv6.md)

??? tip "Least effort to support IPv6 clients?"
    **Dualstack** ALB or NLB. Targets can stay IPv4.

??? warning "Load balancer is dualstack but IPv6 clients time out?"
    Check **SG `::/0`**, **NACL** IPv6 rules, **route `::/0` → IGW**.

??? warning "Dualstack LB, custom domain unreachable over IPv6?"
    Missing the **alias AAAA** record.

??? info "Stop paying for public IPv4 on an internet-facing ALB?"
    **`dualstack-without-public-ipv4`**.

??? info "Egress-only internet gateway?"
    IPv6 **outbound only**. Can't serve inbound clients.

## [Direct Connect: VIFs and resiliency](decisions/networking/direct-connect.md)

??? tip "Private, public, transit VIF: one line each?"
    **Private**: into a VPC (VGW or DX gateway). **Public**: AWS public endpoints (S3, DynamoDB…). **Transit**: into a Transit Gateway via a DX gateway.

??? warning "Does a public VIF give internet access?"
    **No.** Only AWS public prefixes.

??? warning "Reach S3 over a private VIF?"
    Only through an **S3 interface endpoint** in the VPC. A **gateway endpoint doesn't work from on-prem**.

??? warning "Is Direct Connect encrypted?"
    **No.** **VPN over a public VIF**, Private IP VPN on a transit VIF, or **MACsec**.

??? info "Can VPCs talk to each other through a DX gateway?"
    **No.** Use a **Transit Gateway**.

??? tip "Direct Connect: maximum resiliency?"
    **2 DX locations × 2 connections** on separate devices. Cheap option: DX + **VPN backup**.

??? warning "Direct Connect LAG for resilience?"
    A LAG is in **one location**: no protection against losing it.

??? info "How many VIFs on a hosted Direct Connect connection?"
    **One.**

??? warning "BGP session goes down after adding on-prem routes?"
    More than **100 prefixes** (default) on a private/transit VIF. **Summarize.**

??? tip "Connectivity needed this week?"
    **Site-to-Site VPN** now. DX takes weeks.

## [Backup strategy](decisions/storage/backup-strategy.md)

??? warning "DLM to back up RDS or DynamoDB?"
    No: **DLM = EBS snapshots and AMIs only.**

??? tip "Backups nobody can delete, not even root?"
    **AWS Backup Vault Lock, compliance mode.**

??? tip "Protect backups from a compromised account (ransomware)?"
    **Logically air-gapped vault.**

??? info "AWS Backup cross-account copy: prerequisites?"
    Same **Organization**, cross-account backup enabled, and **not** an AWS managed key (`aws/rds`, `aws/ebs`).

??? info "Rewind a database in place?"
    Only **Aurora Backtrack** (MySQL-compatible). PITR always restores to a **new** resource.

## [EFS performance and storage](decisions/storage/efs-performance-storage.md)

??? info "Change the performance mode of an existing EFS file system?"
    **Impossible.** New file system + DataSync.

??? tip "Small EFS is fast for hours, then throughput collapses?"
    **Burst credits** exhausted. Switch to **Elastic** (or Provisioned).

??? tip "EFS with spiky or unknown throughput?"
    **Elastic** throughput.

??? info "EFS Archive storage class requires?"
    **Elastic** throughput.

??? warning "EFS for Windows clients?"
    EFS is NFS only. → **FSx for Windows File Server**.

## [S3 storage classes](decisions/storage/s3-storage-classes.md)

??? tip "Rarely accessed but needed in milliseconds?"
    **Glacier Instant Retrieval.**

??? tip "Unknown or changing access pattern?"
    **Intelligent-Tiering.**

??? info "Minimum storage duration: IA, Glacier IR, Glacier Flexible, Deep Archive?"
    **30 · 90 · 90 · 180 days.**

??? info "Glacier Flexible and Deep Archive retrieval times?"
    Flexible: Expedited **1–5 min**, Standard **3–5 h**, Bulk **5–12 h**. Deep Archive: **≤12 h**, Bulk **≤48 h**.

??? warning "One Zone-IA for data you can't re-create?"
    No: lost with the AZ.

??? warning "Lifecycle rule Glacier → Standard?"
    Impossible. **Restore**, then copy over itself.

??? tip "S3: invisible storage cost from failed multipart uploads?"
    Lifecycle **AbortIncompleteMultipartUpload**.

## [FSx](decisions/storage/fsx.md)

??? warning "Test a Multi-AZ FSx failover?"
    **Change the throughput capacity.** Never modify or delete FSx's ENIs.

??? tip "Which FSx: SMB + AD · HPC on S3 · NetApp · ZFS?"
    **Windows File Server** · **Lustre** · **ONTAP** · **OpenZFS**.

??? warning "Lustre Scratch for data that must survive?"
    No replication, no backups → **Persistent**.

??? warning "Multi-AZ ONTAP unreachable from a peered VPC?"
    Floating IPs outside the VPC CIDR: use a **Transit Gateway**.

??? tip "Keep the old file server name after moving to FSx for Windows?"
    **DNS alias** on the file system.

??? info "Shrink FSx storage or switch Single-AZ → Multi-AZ?"
    Neither in place. **New file system + copy.**

## [Storage Gateway](decisions/storage/storage-gateway.md)

??? tip "Volume Gateway stored vs cached?"
    **Stored**: full copy on-prem, async backup. **Cached**: primary in AWS, hot data cached.

??? tip "Replace physical tapes, keep the backup software?"
    **Tape Gateway** → Glacier / Deep Archive.

??? warning "Files added straight to S3 don't show on the File Gateway share?"
    **`RefreshCache`** or automated cache refresh.

??? warning "Several sites write the same bucket through File Gateways?"
    **No locking** across gateways. One writer per prefix, or FSx.

??? info "Recover Volume Gateway data in AWS after a disaster?"
    Create **EBS volumes** from its snapshots.

??? info "Read a Glacier object through a File Gateway?"
    Not until it's **restored** in S3.

## [DataSync vs Transfer Acceleration vs gateways](decisions/storage/data-transfer.md)

??? tip "DataSync or a gateway: the one question?"
    **Must on-prem apps keep using the data afterwards?** Yes → gateway. No → DataSync.

??? tip "How much data does 100 Mbps move per day?"
    About **1 TB**.

??? warning "Transfer Acceleration for a data center in the same Region?"
    Helps with **distance**, not a slow local link.

??? warning "Transfer Acceleration to EFS or FSx?"
    **S3 only.** → DataSync.

??? warning "DataSync to an EBS volume?"
    Not supported. Destinations: **S3, EFS, FSx**.

??? info "Partners send files over SFTP?"
    **AWS Transfer Family.**

??? tip "DataSync must not use the internet?"
    Agent → **DataSync interface endpoint** over a **private VIF**.

## [RDS Proxy](decisions/databases/rds-proxy.md)

??? tip "Lambda functions cause too many connections errors?"
    **RDS Proxy.**

??? warning "RDS Proxy for high CPU from read queries?"
    No extra capacity. → **Read replicas** or **ElastiCache**.

??? info "Can RDS Proxy be public?"
    **No.** VPC only, Lambda must be in the VPC.

??? info "RDS Proxy and failover?"
    Up to **66% faster**: clients stay connected, no DNS wait.

## [RDS auto scaling](decisions/databases/rds-auto-scaling.md)

??? info "When does RDS Storage Auto Scaling trigger?"
    Free space **< 10%**, for **5 min**, **6 h** since the last change.

??? warning "Enable storage auto scaling on Aurora?"
    Distractor: Aurora storage grows **automatically**.

??? warning "Shrink RDS storage?"
    **Never in place.** New instance + migration.

??? tip "Scale database compute automatically?"
    **Aurora Serverless v2.**

??? warning "Aurora Auto Scaling for a saturated writer?"
    It adds **readers only**. Scale up the writer or Serverless v2.

## [DynamoDB capacity](decisions/databases/dynamodb-capacity.md)

??? tip "WCU and RCU formulas?"
    **WCU** = writes/s × ⌈size / 1 KB⌉ (×2 transactional). **RCU** = reads/s × ⌈size / 4 KB⌉ × (0.5 eventual · 1 strong · 2 transactional).

??? tip "10 writes/s of 2.5 KB?"
    10 × 3 = **30 WCU**.

??? tip "10 eventually consistent reads/s of 6 KB?"
    10 × 2 × 0.5 = **10 RCU**.

??? warning "Does a FilterExpression save RCU?"
    **No.** You pay for every item read. Use a key or GSI and Query.

??? warning "A DynamoDB table is throttled although its total provisioned RCU/WCU is far from used. Why, and what's the fix?"
    **Hot partition**: most requests hit the same partition key, and one partition is capped at 3,000 RCU / 1,000 WCU. Spread the traffic with a better key design (e.g. add a random suffix), or cache hot reads with **DAX**.

??? info "DynamoDB per-partition limits?"
    **3,000 RCU** and **1,000 WCU**.

## [The 7 Rs](decisions/migration/seven-rs.md)

??? tip "Which of the 7 Rs: minimal code changes AND reduce operational overhead?"
    **Replatform** (e.g. DB → RDS).

??? tip "Which of the 7 Rs: keep VMware tools and skills?"
    **Relocate** → VMware Cloud on AWS.

??? tip "Which of the 7 Rs: data center lease ends, migrate as fast as possible?"
    **Rehost** with **MGN**.

??? warning "SCT for Oracle on-prem → RDS for Oracle?"
    Same engine → **DMS only**. SCT is for a **different** engine.

??? info "7 Rs: what does repurchase mean?"
    Move to a **SaaS** product; migrate the data, retire the app.

## [Redshift](decisions/analytics/redshift.md)

??? tip "Many concurrent users queue on Redshift?"
    **Concurrency Scaling.** Resize helps per-query speed.

??? warning "Cross-Region snapshot copy fails for a KMS-encrypted cluster?"
    Missing **snapshot copy grant** in the destination Region.

??? tip "Share live data with another account, no copy?"
    **Data sharing** (RA3 / Serverless).

??? tip "Analysts need Aurora's transactional data in Redshift within seconds, without building or running an ETL pipeline (no Glue, no DMS). What do you use?"
    **Aurora zero-ETL integration with Redshift.** Aurora replicates changes to Redshift automatically, near real time, nothing to manage. Also works from RDS for MySQL and DynamoDB.

??? info "Redshift: make `COPY` / `UNLOAD` traffic go through the VPC?"
    **Enhanced VPC Routing.**

??? warning "Analysts query S3 logs a few times a month: Redshift?"
    No → **Athena**.

## [AI services](decisions/ml/ai-services.md)

??? tip "Extract fields from scanned invoices?"
    **Textract.**

??? tip "Polly vs Transcribe?"
    **Polly** speaks text. **Transcribe** writes speech.

??? tip "Diagnoses and medications from doctor notes?"
    **Comprehend Medical.**

??? tip "Call center with a self-service bot?"
    **Connect + Lex.**

??? tip "Summarize or generate text?"
    **Bedrock.** Comprehend only classifies and extracts.

??? tip "Employees ask questions in plain English over internal docs?"
    **Kendra** (or Bedrock Knowledge Bases).

??? info "Humans review low-confidence results?"
    **Amazon A2I.**

<div class="fc-deck" data-name="Exam extras"></div>

## Multi-account and governance

??? tip "A company wants a new multi-account environment with guardrails, account vending and centralized logging, with the least effort. Which service?"
    **AWS Control Tower.** It sets up a landing zone (log archive and audit accounts), **Account Factory** for new accounts, and controls (guardrails) on OUs.

??? info "AWS Control Tower controls: what implements preventive, detective and proactive controls?"
    **Preventive** = SCPs (block the action). **Detective** = AWS Config rules (report non-compliance). **Proactive** = CloudFormation Hooks (check resources before they're created).

??? tip "AWS Organizations: how do you enforce the same tag keys and allowed values across every account?"
    **Tag policies.** To also *require* a tag at creation, add an SCP that denies the create action when the tag is missing.

??? tip "A security account must manage GuardDuty, Security Hub or Config for the whole organization, not the management account. How?"
    Register it as a **delegated administrator** for that service in AWS Organizations.

??? info "AWS Organizations consolidated billing: what's the benefit besides a single bill?"
    Usage is **aggregated for volume pricing tiers**, and **Reserved Instance and Savings Plans discounts are shared** across accounts (sharing can be turned off per account).

??? tip "Deploy the same CloudFormation stack in every account of an OU, including accounts created later. How?"
    **CloudFormation StackSets** with **service-managed permissions** and **automatic deployment** turned on.

??? tip "Developers must launch only approved, pre-configured products (e.g. a hardened EC2 stack) without getting broad IAM permissions. Which service?"
    **AWS Service Catalog.** A **launch constraint** gives the product an IAM role, so users only need permission to launch the product.

## Identity and directories

??? tip "Employees must sign in once with the company's existing Okta or Entra ID and access many AWS accounts. Which service?"
    **IAM Identity Center** connected to the external IdP (**SAML 2.0** for sign-in, **SCIM** to sync users and groups), with permission sets per account.

??? info "Amazon Cognito: user pool vs identity pool?"
    **User pool** = sign-up / sign-in directory, returns **JWT tokens**. **Identity pool** = exchanges an identity (user pool, Google, SAML…) for **temporary AWS credentials**.

??? tip "A mobile app's users must upload photos directly to S3 with temporary AWS credentials. Which service gives those credentials?"
    **Cognito identity pool** (federated identities), with an IAM role scoped per user, e.g. `${cognito-identity.amazonaws.com:sub}` in the S3 prefix.

??? tip "AWS apps (WorkSpaces, EC2 domain join…) must authenticate against the on-prem Active Directory, without copying users to AWS. Which Directory Service option?"
    **AD Connector**: a proxy to the on-prem AD, nothing stored in AWS. **AWS Managed Microsoft AD** is a real AD in AWS (can trust the on-prem AD).

??? warning "Directory Service: create a trust between Simple AD and the on-prem Active Directory?"
    **Simple AD doesn't support trusts.** For a trust, use **AWS Managed Microsoft AD**.

??? tip "Find every resource (bucket, role, KMS key…) shared with a principal outside the organization. Which service?"
    **IAM Access Analyzer** (external access findings). It also validates policies and generates least-privilege policies from CloudTrail activity.

## Security services

??? tip "Detect threats (crypto-mining, compromised credentials) from CloudTrail, VPC Flow Logs and DNS logs, with no agent to install. Which service?"
    **Amazon GuardDuty.**

??? tip "Find buckets containing personal data (PII) across all S3 buckets of the organization. Which service?"
    **Amazon Macie.**

??? tip "Continuously scan EC2 instances, ECR container images and Lambda functions for software vulnerabilities. Which service?"
    **Amazon Inspector.**

??? tip "Aggregate security findings from all accounts and check them against CIS and AWS Foundational Security Best Practices. Which service?"
    **AWS Security Hub.**

??? tip "Investigate the root cause of a GuardDuty finding with a graph of related activity. Which service?"
    **Amazon Detective.**

??? tip "Centrally enforce AWS WAF rules, Shield Advanced, security groups and Network Firewall policies across all accounts, including new ones. Which service?"
    **AWS Firewall Manager** (requires AWS Organizations and AWS Config).

??? info "AWS Shield Standard vs Shield Advanced?"
    **Standard**: free, automatic, layer 3/4 protection. **Advanced**: paid, **Shield Response Team (SRT)**, **cost protection** for scaling during an attack, layer 7 protection with WAF, health-based detection.

??? tip "Block SQL injection and rate-limit requests per IP in front of CloudFront, an ALB or API Gateway. Which service?"
    **AWS WAF**: managed rule groups + a **rate-based rule**.

??? tip "All VPC egress traffic needs managed stateful inspection and domain-name filtering. Which service?"
    **AWS Network Firewall**, usually in a central inspection VPC behind a Transit Gateway.

??? tip "Continuously check that resources stay compliant (e.g. no public buckets, encrypted volumes) and fix them automatically. Which service?"
    **AWS Config rules** with **automatic remediation** (SSM Automation documents). Package rules for the org with **conformance packs**.

??? info "ACM certificate for a CloudFront distribution: in which Region must it be? And for an ALB?"
    **CloudFront: us-east-1** (N. Virginia). **ALB: the ALB's own Region.**

??? tip "Process highly sensitive data on EC2 in an environment isolated even from the instance's root user and admins. What do you use?"
    **AWS Nitro Enclaves.**

## Networking

??? warning "VPC peering: A is peered with B, and B with C. Can A reach C?"
    **No**, peering isn't transitive. Peer A and C directly, or use a **Transit Gateway**.

??? warning "Two VPCs with overlapping CIDRs must communicate. Can you peer them?"
    **No.** Expose the specific service with **PrivateLink** (endpoint service behind an NLB), or re-address one VPC.

??? tip "A SaaS provider must expose one service privately to hundreds of customer VPCs, with overlapping CIDRs, in one direction only. What do you use?"
    **AWS PrivateLink**: an **endpoint service** behind a **Network Load Balancer**; customers create interface endpoints.

??? tip "On-prem servers must resolve names in a Route 53 private hosted zone. What do you create?"
    A **Route 53 Resolver inbound endpoint** in the VPC, and a conditional forwarder on the on-prem DNS servers pointing to it.

??? tip "EC2 instances in many VPCs must resolve the on-prem domain corp.local. What do you create?"
    A **Route 53 Resolver outbound endpoint** + a **forwarding rule** for the domain, **shared with RAM** to the other accounts and associated with their VPCs.

??? tip "Dozens of VPCs each have NAT gateways. How do you centralize internet egress to cut cost and inspect traffic?"
    **Transit Gateway** + a central **egress VPC** with NAT gateways (and optionally Network Firewall). Spoke VPCs route `0.0.0.0/0` to the TGW.

??? info "Transit Gateway: how do you keep dev and prod VPCs isolated while both reach a shared-services VPC?"
    **Separate TGW route tables**: dev and prod attachments associate with their own route table, which only has routes (propagations) to shared services.

??? info "NAT gateway: how do you make it highly available?"
    A NAT gateway lives in **one AZ**. Create **one per AZ** and route each private subnet to the NAT gateway in its own AZ.

??? tip "Insert third-party firewall appliances transparently into traffic flows, with automatic scaling. Which load balancer?"
    **Gateway Load Balancer** (GENEVE, with GWLB endpoints in the VPCs).

??? warning "An IDS needs the full packet contents of traffic in a VPC. Are VPC Flow Logs enough?"
    **No**, Flow Logs only record metadata (IPs, ports, bytes, accept/reject). Full packets → **VPC Traffic Mirroring**.

??? tip "One Site-to-Site VPN tunnel is limited to about 1.25 Gbps. How do you get more VPN bandwidth to AWS?"
    Terminate several VPN connections on a **Transit Gateway** with **ECMP** enabled, and spread traffic across them.

??? tip "Hundreds of remote employees need VPN access to resources in a VPC from their laptops. Which service?"
    **AWS Client VPN.** (Site-to-Site VPN is for networks, not individual users.)

## CloudFront and edge

??? tip "An S3 bucket is the origin of a CloudFront distribution. How do you make sure the bucket can only be read through CloudFront?"
    **Origin Access Control (OAC)** + a bucket policy allowing the `cloudfront.amazonaws.com` principal for that distribution. (OAI is the legacy version.)

??? tip "CloudFront: paying users must access many private files (a whole video library). Signed URLs or signed cookies?"
    **Signed cookies** (many files, URLs unchanged). **Signed URLs** for a single file or clients that don't support cookies.

??? info "CloudFront Functions vs Lambda@Edge?"
    **CloudFront Functions**: viewer request/response only, JavaScript, sub-millisecond, very cheap (header and URL rewrites, redirects). **Lambda@Edge**: also origin request/response, network access, longer runtime, Node.js/Python.

??? tip "CloudFront must switch to a backup origin when the primary returns 5xx errors. What do you configure?"
    An **origin group** (primary + secondary origin, failover on chosen status codes).

??? tip "Content must not be served to users in certain countries. What do you use on CloudFront?"
    **Geographic restrictions** (allow list or block list of countries).

??? info "AWS Global Accelerator vs CloudFront?"
    **Global Accelerator**: TCP/UDP, **2 static anycast IPs**, no caching, fast Regional failover. **CloudFront**: HTTP(S) **CDN with caching** at the edge.

## Compute and serverless

??? info "AWS Lambda: maximum timeout and memory?"
    **15 minutes**, **10,240 MB**. Longer jobs → ECS/Fargate, Batch or Step Functions.

??? tip "A latency-critical API on Lambda suffers from cold starts. What do you configure?"
    **Provisioned concurrency** (pre-initialized environments). For Java, Python and .NET, **SnapStart** is the cheaper alternative.

??? tip "One Lambda function must always have capacity, and must not be able to use up the account's concurrency. What do you set?"
    **Reserved concurrency** on that function: it's both a guaranteed minimum and a maximum.

??? tip "A workflow waits for a human approval and can last several weeks. Step Functions Standard or Express?"
    **Standard** (up to **1 year**, exactly-once). **Express** = up to **5 minutes**, high volume, at-least-once.

??? info "API Gateway: the three endpoint types?"
    **Edge-optimized** (through CloudFront, global clients), **Regional** (clients in the same Region, or your own CloudFront), **Private** (only from a VPC via an interface endpoint).

??? tip "API Gateway: each customer must get its own request quota and throttling limit. What do you configure?"
    **Usage plans** with **API keys** (per-key throttling and quotas).

??? info "EC2 placement groups: cluster, spread and partition?"
    **Cluster**: one AZ, lowest latency (HPC). **Spread**: each instance on distinct hardware, **max 7 per AZ** (critical instances). **Partition**: groups of instances on separate racks (HDFS, Cassandra, Kafka).

??? info "Elastic Beanstalk: which deployment policies avoid downtime and roll back fastest?"
    **Immutable** (new instances in a new ASG, swapped in when healthy) and **blue/green** (new environment, **swap environment URLs**). All-at-once has downtime; rolling reduces capacity.

??? tip "A new Lambda version must get 10% of traffic for 10 minutes, then 100%, with automatic rollback on alarms. How?"
    **CodeDeploy** with a **canary** deployment configuration (e.g. `Canary10Percent10Minutes`) shifting traffic between **Lambda alias** versions.

??? warning "EC2 instance store for data that must survive a stop or a hardware failure?"
    **No.** Instance store is lost when the instance is **stopped, terminated** or the host fails. Use **EBS** (or replicate the data).

??? info "EBS gp3 vs io2 Block Express?"
    **gp3**: general purpose, IOPS and throughput set **independently of size**, cheapest SSD. **io2 Block Express**: highest IOPS, sub-ms latency, **99.999% durability**, **Multi-Attach**: critical databases.

??? tip "Applications need single-digit-millisecond latency for users in one city / on 5G devices / in the company's own data center. Which AWS infrastructure for each?"
    **Local Zones** / **Wavelength** / **Outposts**.

## Messaging and streaming

??? info "SQS FIFO queue: ordering and throughput?"
    Order kept **per message group ID**, **exactly-once** processing (deduplication window 5 min). **300 msg/s** per API action, **3,000** with batching, higher in high-throughput mode.

??? tip "SQS messages are processed twice because processing takes longer than expected. What do you change?"
    Increase the **visibility timeout** (or extend it with `ChangeMessageVisibility` while processing).

??? tip "Some SQS messages keep failing and block the consumers. What do you add?"
    A **dead-letter queue** with a **maxReceiveCount** in the redrive policy.

??? info "SQS message retention: default and maximum?"
    **4 days** by default, up to **14 days**.

??? tip "One event must be delivered to several independent consumers, each processing at its own pace. Which pattern?"
    **SNS fan-out**: one SNS topic → several **SQS queues** (or an EventBridge rule with several targets).

??? info "Kinesis Data Streams vs Amazon Data Firehose?"
    **Data Streams**: real time, your own consumers, **replay**, retention 24 h to 365 days, shards. **Firehose**: fully managed **delivery** to S3, Redshift, OpenSearch, Splunk…, buffering (near real time), no replay, no code.

??? tip "Several Kinesis Data Streams consumers compete for the read throughput of the same shards. What fixes it?"
    **Enhanced fan-out**: each consumer gets its own **2 MB/s per shard**, pushed over HTTP/2.

??? tip "Events that went through an EventBridge event bus must be replayed after a bug fix. What do you need?"
    **EventBridge archive and replay** (archive the bus, replay a time window).

??? tip "Migrate an on-prem ActiveMQ or RabbitMQ broker without changing application code. Which service?"
    **Amazon MQ.** SQS/SNS would need code changes (different APIs and protocols).

## Databases

??? info "Aurora Global Database: typical RPO and RTO for a Regional failover?"
    **RPO ≈ 1 second** (storage-level replication), **RTO < 1 minute** (promote a secondary Region).

??? tip "Testers need a full copy of a 5 TB production Aurora database in minutes, at low cost. How?"
    **Aurora cloning** (copy-on-write: only changed pages use new storage).

??? info "RDS Multi-AZ (instance) vs read replica?"
    **Multi-AZ instance**: **synchronous** standby for HA, automatic failover, **not readable**. **Read replica**: **asynchronous**, readable, can be in another Region, can be promoted.

??? info "RDS Multi-AZ DB cluster deployment: what's different?"
    **1 writer + 2 readable standbys** in 3 AZs, faster failover (typically under 35 s), MySQL and PostgreSQL.

??? tip "A DynamoDB app must accept reads and writes in several Regions (active-active). What do you use?"
    **DynamoDB global tables.**

??? tip "Trigger a Lambda function every time an item changes in a DynamoDB table. What do you enable?"
    **DynamoDB Streams** + a Lambda event source mapping.

??? info "ElastiCache: Redis (Valkey) vs Memcached?"
    **Redis/Valkey**: replication, **Multi-AZ failover**, persistence, rich data structures (sorted sets, pub/sub). **Memcached**: simple, multithreaded, **no replication or persistence**.

??? tip "A game needs a real-time leaderboard sorted by score. Which service and feature?"
    **ElastiCache for Redis/Valkey** with **sorted sets**.

??? tip "Purpose-built databases: graph · time series · MongoDB-compatible · Cassandra-compatible?"
    **Neptune** · **Timestream** · **DocumentDB** · **Keyspaces**.

## Disaster recovery and migration

??? info "The four DR strategies, from slowest/cheapest to fastest/most expensive?"
    **Backup & restore** (hours) → **Pilot light** (data replicated, core services off; tens of minutes) → **Warm standby** (scaled-down full copy running; minutes) → **Multi-site active/active** (near zero).

??? tip "On-prem servers need continuous block-level replication to AWS and recovery in minutes after a disaster. Which service?"
    **AWS Elastic Disaster Recovery** (DRS).

??? tip "Rehost hundreds of on-prem servers to EC2 with continuous replication and a short cutover window. Which service?"
    **AWS Application Migration Service** (MGN).

??? tip "Migrate a production database to AWS with minimal downtime. Which DMS mode?"
    **Full load + change data capture (CDC)**: copy the data, then keep replicating changes until cutover.

??? info "AWS Application Discovery Service: agentless vs agent-based discovery?"
    **Agentless** (VMware vCenter): VM inventory and utilization. **Agent-based**: also **processes and network connections** → server **dependency mapping**.

??? tip "Petabytes must move to AWS but the network is too slow. What do you use?"
    Several **AWS Snowball Edge** devices (Snowmobile is retired). Then DataSync for the changes.

??? tip "Build the business case (TCO) for migrating a data center to AWS. Which service?"
    **Migration Evaluator.**

## S3 beyond storage classes

??? info "S3 Replication Time Control (RTC)?"
    **99.99% of objects replicated within 15 minutes**, with an SLA and replication metrics.

??? warning "You enable S3 replication on a bucket. Are the existing objects replicated?"
    **No**, only new objects. For existing ones → **S3 Batch Replication**.

??? tip "Many teams and apps share one bucket with different permissions, and the bucket policy is becoming too large. What do you use?"
    **S3 Access Points**: one access point per app or team, each with its own policy.

??? tip "Clients in several Regions must reach S3 through one global endpoint that routes to the closest bucket. What do you use?"
    **S3 Multi-Region Access Points.**

??? tip "Run the same action (copy, tag, restore from Glacier, invoke Lambda) on billions of existing S3 objects. What do you use?"
    **S3 Batch Operations**, driven by an **S3 Inventory** report.

??? tip "Users must upload files directly to S3 without AWS credentials of their own. How?"
    **Presigned URLs** generated by the backend.

??? info "S3 Object Lock: governance vs compliance mode?"
    **Governance**: users with special permission can delete or shorten retention. **Compliance**: **nobody**, not even root, until retention ends. **Legal hold**: no end date. Requires **versioning**.

## Cost optimization

??? info "Compute Savings Plans vs EC2 Instance Savings Plans?"
    **Compute SP**: any instance family, size, Region, OS, plus **Fargate and Lambda** (up to ~66%). **EC2 Instance SP**: one family in one Region (up to ~72%).

??? info "Standard vs Convertible Reserved Instances?"
    **Standard**: biggest discount, can't change instance family, can be sold on the RI Marketplace. **Convertible**: smaller discount, can be **exchanged** for another family, OS or tenancy.

??? tip "Automatically stop EC2 / RDS instances or apply a restrictive SCP when a budget is exceeded. What do you use?"
    **AWS Budgets actions.**

??? tip "Get right-sizing recommendations for EC2, EBS, Lambda and ECS on Fargate based on actual utilization. Which service?"
    **AWS Compute Optimizer.**

??? tip "Finance needs the most detailed billing data, queryable with Athena or QuickSight. What do you set up?"
    **Cost and Usage Report** (CUR 2.0, via **Data Exports**) to S3.

??? warning "You add a cost allocation tag to resources. Does it appear in Cost Explorer right away, including past costs?"
    **No.** It must be **activated** in the Billing console (management account), and only applies **from activation onward**.

??? tip "A launch next week needs guaranteed EC2 capacity in a specific AZ, without a 1-year commitment. What do you buy?"
    An **On-Demand Capacity Reservation** (combine with Savings Plans for the discount).

## Operations and deployment

??? tip "Admins need shell access to EC2 instances without SSH keys, bastion hosts or an open port 22, with every session logged. What do you use?"
    **Systems Manager Session Manager.**

??? tip "Patch a fleet of EC2 and on-prem servers on a schedule. What do you use?"
    **Systems Manager Patch Manager** + **Maintenance Windows**.

??? warning "A CloudFormation stack was deleted and the RDS database with it. How do you prevent this?"
    **`DeletionPolicy: Snapshot`** (or `Retain`) on the database, plus **termination protection** on the stack.

??? tip "Detect manual changes made to resources managed by CloudFormation. What do you use?"
    **Drift detection.**

??? tip "See which resources a CloudFormation update will modify or replace before running it. What do you use?"
    **Change sets.**

??? info "Which EC2 metrics need the CloudWatch agent?"
    **Memory** and **disk space** usage (OS-level), and custom log files. CPU, network and disk I/O are available by default.

??? tip "Trace requests across microservices to find where the latency comes from. Which service?"
    **AWS X-Ray** (distributed tracing, service map).

??? tip "Stream CloudWatch Logs from every account into a central logging account in near real time. How?"
    **Subscription filters** → Kinesis Data Streams or Firehose in the central account (cross-account destination).

## Analytics and end-user computing

??? tip "Data lake on S3: grant column- and row-level permissions for Athena, Redshift Spectrum and EMR in one place. Which service?"
    **AWS Lake Formation.**

??? tip "Serverless ETL plus a central catalog of the data lake's schemas. Which service?"
    **AWS Glue** (crawlers, Data Catalog, ETL jobs).

??? tip "Full-text search and log analytics with dashboards. Which service?"
    **Amazon OpenSearch Service.**

??? tip "Business users need interactive BI dashboards, paid per user. Which service?"
    **Amazon QuickSight.**

??? tip "Run Spark or Hadoop jobs with control over the cluster, using Spot Instances for task nodes. Which service?"
    **Amazon EMR.**

??? tip "Remote employees need full virtual desktops / one application streamed to a browser. Which service for each?"
    **Amazon WorkSpaces** / **Amazon AppStream 2.0**.
