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
