---
hide:
  - toc
---

# Flashcards

Shuffled on every visit. Flip the card, then **Next**, or **Missed** to see it again later in the session.

<div id="fc-app"></div>

<!--
HOW TO EDIT
- One section per decision page: the link in the "##" heading becomes the card's "Go deeper" link.
- One card = one block:  ??? info|warning|tip "Front"  + indented back.
    info = Service · warning = Warning · tip = Tip
- No double quotes inside the front text.
- To prune, delete the block.
-->

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

??? tip "Scale SQS workers on which metric?"
    **Backlog per instance** = messages visible ÷ InService instances.

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

??? tip "Near-instant Regional failover, no DNS caching?"
    **Global Accelerator.**

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

??? warning "Throttling while total capacity is fine?"
    **Hot partition.** Fix the key design, or DAX for reads.

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

??? tip "Near-real-time analytics from Aurora with no pipeline?"
    **Zero-ETL integration.**

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
