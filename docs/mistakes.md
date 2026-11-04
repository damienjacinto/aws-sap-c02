# Mistakes log

Every missed (or guessed) practice question goes here, **in my own words**. Never paste the original question: this repo is public, and paraphrasing is how the lesson sticks.

## Format

```markdown
### YYYY-MM-DD · <source, e.g. TD Section D1> · <topic>
- **Scenario:** one or two sentences, paraphrased
- **Deciding constraint I missed:** …
- **Right answer & why:** …
- **Why my answer was wrong:** …
- **Tree updated:** [link to the decision page]
```

## Log

### 2026-11-04 · Practice question · FSx Multi-AZ failover testing
- **Scenario:** a team runs FSx for Windows File Server in Multi-AZ and wants to test that clients survive a failover.
- **Deciding constraint I missed:** FSx manages its ENIs; AWS warns that modifying or deleting them can permanently break connectivity.
- **Right answer & why:** change the file system's **throughput capacity**. FSx fails over to the standby, then fails back. It's the supported way to trigger a failover.
- **Why my answer was wrong:** I didn't know there was a supported trigger, and touching the ENIs looked like a way to simulate a failure.
- **Tree updated:** [FSx: which flavor, which deployment, and what not to touch?](decisions/storage/fsx.md)

### 2026-11-04 · Practice question · S3 Object Ownership switched back and forth
- **Scenario:** several accounts upload to one shared bucket. ACLs are disabled with Bucket owner enforced for a while, then ACLs are turned back on. What happens to the files uploaded in between, and what should guide future settings?
- **Deciding constraint I missed:** re-enabling ACLs doesn't give ownership back for objects written while ACLs were disabled.
- **Right answer & why:** those objects **stay owned by the bucket owner**. Objects from before go back to their uploaders with their **old ACLs restored**. Going forward: keep ACLs disabled and use **bucket policies**; migrate ACL grants to the policy before disabling ACLs.
- **Why my answer was wrong:** I assumed switching the setting back reverted ownership of every object, as if nothing had happened.
- **Tree updated:** [Cross-account access → S3 Object Ownership](decisions/identity/cross-account-access.md#s3-object-ownership)
