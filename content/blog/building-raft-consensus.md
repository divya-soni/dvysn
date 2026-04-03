---
title: Building Raft Consensus from Scratch in Go
date: 2024-11-08
excerpt: A step-by-step walkthrough of implementing leader election, log replication, and membership changes using the Raft distributed consensus algorithm.
---

Paxos has been the academic gold standard for distributed consensus since the 1990s, but its reputation for being difficult to implement correctly led Ongaro & Ousterhout to design Raft with understandability as the primary goal.

The key insight is that Raft decomposes consensus into three relatively independent subproblems: leader election, log replication, and safety. Solving each independently makes the algorithm far easier to reason about.

## Core Data Structures

Every Raft node maintains a small amount of persistent state: the current term, who it voted for in that term, and its log. Everything else can be derived on restart.

```go
type State int

const (
  Follower  State = iota
  Candidate
  Leader
)

type Raft struct {
  mu          sync.Mutex
  id          string
  peers       []string
  state       State
  currentTerm int
  votedFor    string
  log         []LogEntry
  commitIndex int
  lastApplied int
}
```

## The State Machine Loop

The core of a Raft node is a simple event loop. At any point, the node is in one of three states: follower, candidate, or leader. Each state has its own logic for handling incoming RPCs and timer events.

```go
func (r *Raft) Run() {
  for {
    switch r.getState() {
    case Follower:
      r.runFollower()
    case Candidate:
      r.runCandidate()
    case Leader:
      r.runLeader()
    }
  }
}

func (r *Raft) runFollower() {
  timeout := randomTimeout(150, 300) // ms
  select {
  case <-r.heartbeat:
    // reset — stay follower
  case <-time.After(timeout):
    r.setState(Candidate)
  }
}
```

## Leader Election

When a follower stops hearing from the leader (election timeout), it transitions to candidate and starts a new term. A node wins if it collects votes from a majority of the cluster.

The key safety property: a candidate can only win if its log is at least as up-to-date as any other node's log. This prevents a stale node from winning an election and overwriting committed entries.

## Takeaways

Building Raft from scratch is one of the best ways to develop intuition for distributed systems. The algorithm is elegant in its simplicity, and the implementation challenges reveal exactly why consensus is hard.
