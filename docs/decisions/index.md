# Decisions

Each page answers **one question the exam keeps asking**, in the same order:

1. **The question** and the **trigger keywords** that should make you think of this page
2. **Fundamentals**: just enough to follow the tree
3. **Decision tree**
4. **Why each branch**: the reasoning, not just the rule
5. **Comparison table**
6. **Exam traps**: plausible distractors and why they're wrong
7. **Test yourself**: short scenarios with hidden answers. Solve with the tree first, then reveal.

## Identity & access

| Decision | Built on |
|---|---|
| [Will this request be allowed?](identity/policy-evaluation.md) | Day 1 |
| [Cross-account access](identity/cross-account-access.md) | Day 1 |
| [Multi-account foundations: Organizations, Control Tower, Identity Center, RAM, StackSets?](identity/multi-account.md) | Days 2–4 (28–30 Sep) |

## Security & monitoring

| Decision | Built on |
|---|---|
| [KMS key types: AWS owned, AWS managed or customer managed?](security/kms-key-types.md) | Day 9 (Tue 6 Oct) |
| [Secrets Manager vs Parameter Store (Standard or Advanced)?](security/secrets-storage.md) | Day 9 (Tue 6 Oct) |
| [CloudTrail: react, alert or keep the logs?](security/cloudtrail.md) | Day 10 (Wed 7 Oct) |
| [Security services: GuardDuty, Inspector, Macie, Security Hub… which one?](security/security-services.md) | Day 10 (Wed 7 Oct) |

## Compute

| Decision | Built on |
|---|---|
| [Auto Scaling groups: which scaling policy?](compute/asg-scaling-policies.md) | Day 13 (Sun 11 Oct) |
| [Spot fleets: which tool and which allocation strategy?](compute/spot-fleets.md) | Day 13 (Sun 11 Oct) |

## Networking

| Decision | Built on |
|---|---|
| [Route 53: which routing policy?](networking/route53-routing-policies.md) | Day 7 (Sun 4 Oct) |
| [Cross-zone load balancing](networking/elb-cross-zone.md) | Day 14 (Mon 12 Oct) |
| [IPv6 with Elastic Load Balancing](networking/elb-ipv6.md) | Day 14 (Mon 12 Oct) |
| [Direct Connect: which VIF, and how to make it resilient?](networking/direct-connect.md) | Day 6 (Fri 2 Oct) |
| [VPC to VPC: peering, Transit Gateway, PrivateLink or VPC Lattice?](networking/vpc-connectivity.md) | Days 5–6 (1–2 Oct) |
| [Edge: CloudFront or Global Accelerator?](networking/cloudfront-global-accelerator.md) | Days 14 & 18 (12 & 16 Oct) |

## Storage

| Decision | Built on |
|---|---|
| [Backup: DLM vs AWS Backup vs native](storage/backup-strategy.md) | Day 16 (Wed 14 Oct) |
| [EFS: performance mode, throughput mode and storage class](storage/efs-performance-storage.md) | Day 16 (Wed 14 Oct) |
| [S3: which storage class and lifecycle?](storage/s3-storage-classes.md) | Day 16 (Wed 14 Oct) |
| [FSx: which flavor, which deployment, and what not to touch?](storage/fsx.md) | Day 16 (Wed 14 Oct) |
| [Storage Gateway: which gateway type for a hybrid workload?](storage/storage-gateway.md) | Day 16 (Wed 14 Oct) |
| [DataSync, S3 Transfer Acceleration, File Gateway or Volume Gateway?](storage/data-transfer.md) | Day 16 (Wed 14 Oct) |

## Databases

| Decision | Built on |
|---|---|
| [RDS Proxy: when does it fix the problem?](databases/rds-proxy.md) | Day 17 (Thu 15 Oct) |
| [RDS auto scaling: what scales by itself?](databases/rds-auto-scaling.md) | Day 17 (Thu 15 Oct) |
| [DynamoDB: how many RCU and WCU?](databases/dynamodb-capacity.md) | Day 17 (Thu 15 Oct) |

## Resilience

| Decision | Built on |
|---|---|
| [Disaster recovery: which strategy for this RTO and RPO?](resilience/dr-strategy.md) | Day 18 (Fri 16 Oct) |

## Migration

| Decision | Built on |
|---|---|
| [The 7 Rs: which migration strategy?](migration/seven-rs.md) | Day 23 (Thu 22 Oct) |

## Analytics

| Decision | Built on |
|---|---|
| [Redshift: is it the right engine, and which feature fixes the problem?](analytics/redshift.md) | Day 20 (Mon 19 Oct) |

## Machine learning

| Decision | Built on |
|---|---|
| [AI services: which one does the job?](ml/ai-services.md) | Day 24 (Fri 23 Oct) |

*New pages are added as the [curriculum](../curriculum.md) progresses.*
