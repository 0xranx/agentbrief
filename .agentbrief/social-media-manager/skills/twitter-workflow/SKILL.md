---
name: twitter-workflow
description: "When the user wants to draft tweets, plan threads, post to Twitter/X, or manage their Twitter presence"
---

# Twitter Workflow

## Prerequisites

Ensure `twitter-cli` is installed and authenticated:

```bash
# Install
uv tool install twitter-cli

# Auth via browser cookies (no API key needed)
# twitter-cli auto-extracts from Chrome/Arc/Firefox/Edge/Brave
twitter-cli timeline
```

If auth fails, the user needs to set `TWITTER_AUTH_TOKEN` and `TWITTER_CT0` environment variables from their browser cookies.

## Process

### 1. Draft Content

Before posting anything, always draft and present to the user for approval:

- **Single tweet**: Keep under 280 chars. Lead with the hook. End with a CTA or open question.
- **Thread**: Write each tweet as a standalone insight that also flows as a narrative. Number tweets (1/N format).
- **Reply/Quote**: Read the original tweet first (`twitter-cli tweet <id>`), then add genuine value.

### 2. Review & Approve

Present the draft clearly:
```
📝 Draft tweet:
---
[tweet content here]
---
Post this? (y/n)
```

Never post without explicit user confirmation.

### 3. Post

```bash
# Single tweet
twitter-cli post "Your tweet content here"

# Tweet with images (up to 4)
twitter-cli post "Check out these results" --image chart.png

# Quote tweet
twitter-cli post "My take on this:" --quote-url https://x.com/user/status/123

# Reply
twitter-cli post "Great point! Here's what I'd add..." --reply-to 123456789
```

### 4. Monitor & Engage

After posting, check engagement:

```bash
# Check your recent tweets and their metrics
twitter-cli me --yaml

# Search for mentions or relevant conversations
twitter-cli search "keyword" --tab latest

# Check replies to your tweet
twitter-cli tweet <tweet-id>
```

### 5. Iterate

Track what works:
- Which tweet formats get highest engagement?
- What time of day performs best?
- Which topics resonate most?

Use `twitter-cli me --yaml` output to analyze patterns and inform the next content batch.

## Anti-patterns

- Don't post multiple tweets in rapid succession — space them out
- Don't draft generic content — every tweet should have a specific audience and purpose
- Don't ignore replies — responding to comments boosts algorithmic visibility
- Don't post and forget — always check engagement within 1-2 hours
