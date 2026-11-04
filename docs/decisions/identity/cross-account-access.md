---
tags:
  - "Domain 1: Organizational Complexity"
  - IAM
  - Multi-account
---

# Cross-account access

**The question:** a principal in account A needs to use something in account B. Which mechanism: assume a role, a resource-based policy, a RAM share, or IAM Identity Center?

**Trigger keywords:** *"another account"*, *"third-party vendor / SaaS / auditor"*, *"all accounts in the organization"*, *"central security / logging / shared services account"*, *"without long-term credentials"*, *"confused deputy"*, *"bucket shared by several accounts"*, *"ACLs disabled / re-enabled"*, *"Object Ownership"*.

## Fundamentals

| Mechanism | How it works | Caller keeps its own permissions? |
|---|---|---|
| **Assume an IAM role** | B has a role whose **trust policy** allows A. A's principal calls `sts:AssumeRole` and gets temporary credentials **in B** | ❌ No. While in the role, it only has the role's permissions |
| **Resource-based policy** | The resource in B (bucket, KMS key, queue, topic, Lambda, secret, ECR repo…) names A as a principal. A calls it with its own credentials | ✅ Yes. Useful when one process touches resources in both accounts |
| **AWS RAM share** | B shares the resource (subnets, Transit Gateway, Resolver rules, prefix lists, License Manager configs, some DB clusters…). It appears in A | n/a. Used for *infrastructure* that A consumes |
| **IAM Identity Center** | Workforce users sign in once and pick an account + permission set. Roles are provisioned in each account for you | n/a. For **humans**, not workloads |

**External ID:** a secret-ish value the third party must pass when assuming the role, set as a condition in the trust policy. It prevents the **confused deputy** problem, where a vendor serving many customers is tricked into using *your* role on behalf of someone else.

### STS APIs for temporary credentials

| API | Use case |
|---|---|
| `AssumeRole` | An AWS principal (IAM user or another role) assumes a role in its own or another account |
| `AssumeRoleWithSAML` | User signs in to an external **SAML IdP**, gets a SAML assertion, and trades it with STS for role credentials |
| `AssumeRoleWithWebIdentity` | User signs in to a **web IdP** (Google, Facebook, Amazon Cognito…), gets an **OIDC token**, and trades it with STS for role credentials |
| `GetSessionToken` | An **MFA-enabled IAM user** submits the code from their MFA device to get temporary credentials |
| `GetFederationToken` | Gets temporary credentials for a **federated user** |

### S3 Object Ownership

A bucket-level setting that decides **who owns uploaded objects** and **whether ACLs count**.

| Setting | ACLs | Owner of new objects | Uploads accepted |
|---|---|---|---|
| **Bucket owner enforced** (default for new buckets since 2023) | ❌ disabled, ignored for access | **Bucket owner**, always (also applies to existing objects) | No ACL or `bucket-owner-full-control` only. Other ACLs → `400 AccessControlListNotSupported` |
| **Bucket owner preferred** | ✅ | Bucket owner **if** the upload uses `bucket-owner-full-control`, otherwise the writer | All |
| **Object writer** (old default) | ✅ | The **uploading account** | All |

What happens when you switch:

- **Disable ACLs (→ enforced):** ACLs aren't deleted, only **ignored**. Access now comes only from policies (IAM, bucket policy, VPC endpoint policy, SCP/RCP). Before switching, **migrate any ACL grants to the bucket policy**.
- **Re-enable ACLs (→ writer or preferred):**
    - Objects uploaded **while enforced** stay **owned by the bucket owner**. They don't go back to the uploader.
    - Objects uploaded **before** go back to their original owners, and their **old ACLs are restored** (unless you migrated them to policies). The bucket owner loses control of those again, and a bucket policy can't grant access to objects it doesn't own.

## Decision tree

```mermaid
flowchart TD
    A([Principal in A needs<br/>something in B]) --> H{{Human users<br/>of the workforce?}}
    H -- Yes --> IC[IAM Identity Center<br/>+ permission sets]
    H -- "No: application / service" --> T{{Third party outside<br/>your organization?}}
    T -- Yes --> EXT["Role in B with trust policy<br/>+ sts:ExternalId condition"]
    T -- No --> R{{Is it infrastructure to use<br/>in A's own resources?<br/>subnet, TGW, resolver rule...}}
    R -- Yes --> RAM[AWS RAM share]
    R -- No --> RBP{{Does the service support<br/>resource-based policies?}}
    RBP -- No --> ROLE[Assume a role in B]
    RBP -- Yes --> BOTH{{Must the caller act on<br/>resources in BOTH accounts<br/>in the same operation?}}
    BOTH -- Yes --> RP[Resource-based policy<br/>+ identity policy in A]
    BOTH -- No --> MANY{{Many accounts need it?}}
    MANY -- "Yes, whole org / OU" --> ORG["Resource policy with<br/>aws:PrincipalOrgID or<br/>aws:PrincipalOrgPaths"]
    MANY -- No --> EITHER[Role or resource policy.<br/>Pick by the other constraints<br/>e.g. audit trail, object ownership]
    classDef answer fill:#e65100,stroke:#bf360c,color:#fff
    class IC,EXT,RAM,ROLE,RP,ORG,EITHER answer
```

## Why each branch

- **Humans → Identity Center.** One place to manage who can access which account, with temporary credentials only. IAM users per account don't scale and create long-term keys.
- **Third parties → role + External ID.** Never share access keys. The External ID condition is the textbook answer whenever a vendor assumes roles in many customers' accounts.
- **Infrastructure → RAM.** You don't "access" a subnet or a Transit Gateway, you *use* it. RAM makes it appear in the other account with the owner keeping control.
- **Both accounts in one operation → resource policy.** Example: copying objects from a bucket in A to a bucket in B. If the process assumed a role in B, it would lose its access to A's bucket. A resource policy lets it keep its own identity.
- **Whole org → `aws:PrincipalOrgID`.** One condition instead of listing account IDs, and new accounts are covered automatically.
- **Services without resource policies** (most of EC2, RDS APIs, etc.) → a role is the only way.

## Comparison

| | Assume role | Resource-based policy | RAM | Identity Center |
|---|---|---|---|---|
| Works for any service | ✅ | ❌ supported services only | ❌ shareable types only | ✅ (via roles) |
| Caller keeps own permissions | ❌ | ✅ | n/a | n/a |
| Who is logged in CloudTrail in B | The role session | The caller from A | n/a | The role session (with the user name) |
| Credentials | Temporary (STS) | Caller's own | n/a | Temporary |
| Typical exam use | Third parties, automation, "switch role" | S3/KMS/SQS/SNS/Lambda sharing, org-wide access | Shared VPC, TGW, Resolver rules | Workforce SSO |

## Exam traps

!!! warning "KMS: AWS managed keys can't be shared cross-account"
    You can't edit the key policy of an AWS managed key (`aws/s3`, `aws/ebs`…). To let another account decrypt, re-encrypt with a **customer managed key** and grant access in **both** its key policy and the caller's IAM policy. This is a very common exam scenario (e.g. sharing encrypted snapshots or AMIs).

!!! warning "S3: the bucket owner can't read uploaded objects"
    With ACLs enabled (Object writer), objects uploaded by account A into B's bucket are owned by A, and B's bucket policy doesn't apply to them. Fix: **Bucket owner enforced**. If ACLs must stay on, use **Bucket owner preferred** plus a bucket policy that **requires** the `bucket-owner-full-control` ACL on `PutObject`.

!!! warning "S3: re-enabling ACLs doesn't undo ownership"
    Objects written while Bucket owner enforced was on **stay owned by the bucket owner** after ACLs come back. Only the objects that existed before go back to their uploaders, with their **old ACLs restored**. Ownership isn't a switch you can flip back and forth on existing objects.

!!! warning "S3: disabling ACLs deletes them"
    No. They're kept but **ignored**, and come back if you re-enable ACLs. Anything that relied on an ACL grant (e.g. a log-delivery or cross-account reader) **loses access** the moment you disable them, unless you moved the grant into the bucket policy first.

!!! warning "S3: uploads fail after disabling ACLs"
    Clients that send an ACL other than `bucket-owner-full-control` (e.g. `public-read`, explicit grants) get `AccessControlListNotSupported`. Fix the clients to send no ACL; grant access in the bucket policy.

!!! warning "Role chaining caps the session at 1 hour"
    Assuming a role from a role session limits the session to 1 hour, whatever the role's max session duration.

!!! warning "Trust policy alone isn't enough"
    B's role trusts A, but A's principal also needs `sts:AssumeRole` on that role ARN in its own identity policy. This is the cross-account "both sides must allow" rule again.

## Test yourself

??? question "1. A SaaS monitoring vendor needs read-only access to CloudWatch metrics in 40 customer accounts. What do you set up in each account?"
    An IAM role with read-only CloudWatch permissions whose **trust policy** allows the vendor's account **with a condition on `sts:ExternalId`** (the unique value the vendor gives you). No access keys.

??? question "2. A nightly job in account A copies objects from A's bucket to a bucket in account B. Which mechanism?"
    **Resource-based bucket policy on B's bucket** granting A's job role `s3:PutObject`, plus an identity policy in A. The job keeps access to both buckets under one identity. With Bucket owner enforced on B's bucket, B owns the copies.

??? question "3. All 120 accounts in the org must be able to write logs to a central bucket, including accounts created next month. Cheapest to maintain?"
    Bucket policy allowing writes with the condition **`aws:PrincipalOrgID` = the org's ID**. New accounts are covered automatically.

??? question "4. A shared-services account owns a Transit Gateway that 30 workload accounts must attach their VPCs to. How?"
    **Share the TGW with AWS RAM** to the org or OU, then each account creates its VPC attachment.

??? question "5. Account A shares an encrypted EBS snapshot with account B, but B can't create a volume from it. The snapshot is encrypted with the default `aws/ebs` key. Fix?"
    AWS managed keys can't be shared. **Copy the snapshot re-encrypted with a customer managed key**, grant B `kms:Decrypt`/`kms:CreateGrant` etc. in that key's policy, share the new snapshot, and give B's principals matching IAM permissions.

??? question "6. Three teams in separate accounts upload to a shared bucket. ACLs are disabled for a week (Bucket owner enforced), then re-enabled (Object writer). Who owns the files from that week, and the files from before?"
    Files uploaded **during** the enforced week stay **owned by the bucket owner**. Files uploaded **before** are owned again by the uploading teams, with their **old ACLs restored**. For the future: keep ACLs disabled and grant the teams access with the **bucket policy**; migrate ACL grants to the policy before disabling ACLs.

## Related

- [Will this request be allowed?](policy-evaluation.md)
- AWS docs: [S3 Object Ownership and disabling ACLs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/about-object-ownership.html)
- AWS docs: [The confused deputy problem](https://docs.aws.amazon.com/IAM/latest/UserGuide/confused-deputy.html)
