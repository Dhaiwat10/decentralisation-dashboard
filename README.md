## Decentralisation Dashboard

An explanatory visual that answers a deceptively simple question: Who has more validators?

The project compares Ethereum and Solana using two kinds of numbers that often get conflated:
- Validator keys (logical identities that can be batched by an operator)
- Validator machines (physical nodes participating in consensus)

It aims to make clear why the same word “validator” can describe very different realities depending on the network and metric.

### What this is
An opinionated, minimal dashboard that:
- Shows a daily snapshot of Ethereum beacon node count and active validator keys
- Shows a daily snapshot of Solana’s actively voting validators
- Surfaces short, human-first explanations next to each metric

### Why it matters
- Counting validator keys reflects how much stake is active, not how many independent machines or operators exist.
- On Ethereum, one operator can run a small fleet of beacon nodes that collectively manage thousands of keys.
- On Solana, the validator count maps more closely to distinct machines because each validator must meet high hardware and uptime requirements.

### How to read the numbers
- Ethereum — beacon node count: A rough proxy for distinct machines running the consensus layer. Fewer than validator keys by design.
- Ethereum — active validator keys: Every 32 ETH deposit registers a new key; operators can batch many keys behind a small number of machines.
- Solana — voting validators: The number of machines actively casting votes. Each validator generally corresponds to dedicated hardware.

### Limitations and caveats
- These are snapshots, not real-time metrics. Day-to-day variance is expected.
- Node counts for Ethereum are estimates from third-party sources and scraping heuristics.
- Validator counts do not measure decentralisation on their own. Independence of operators, hosting diversity, geography, and stake distribution all matter.
- A single entity can run multiple validators; conversely, a single machine can back many keys (on Ethereum).

### Data sources
- Ethereum beacon node count: [nodewatch.io](https://nodewatch.io/)
- Ethereum active validator keys: [Beacon API — state validators](https://ethereum.github.io/beacon-APIs/#/Beacon/getStateValidators)
- Solana voting validators: [RPC getVoteAccounts](https://solana.com/docs/rpc/http/getVoteAccounts)

### Questions this project explores next
- How many independent operators run the observed validators?
- How are validators distributed across hosting providers and regions?
- How concentrated is stake among the top operators?

### Feedback
If you spot inaccuracies, have better sources, or want to add nuance, please open an issue or PR. The goal is clarity, not scoreboard‑watching.
