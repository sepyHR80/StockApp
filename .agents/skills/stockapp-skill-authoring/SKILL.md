---
name: stockapp-skill-authoring
description: Create or update repository-local StockApp skills with concise triggers, maintained references and validation.
---

Read the installed skill-creator guidance when available. Check existing project skills first and improve the matching workflow before creating a new one. Add a distinct project workflow under `.agents/skills/<name>/SKILL.md` with matching name and a narrow description. Link canonical architecture and runbooks, and keep their details in those documents. Keep skills independently discoverable and ensure they neither expand permissions nor require unrelated work. Run the bundled quick validator when available and the repository documentation workflow checks. Walk through one realistic scenario and report whether it was reviewed on paper or exercised in a running system.

Validation scenario. A new request for historical research overlaps stockapp-ml-research. Improve that skill, validate its frontmatter and walk through a concrete temporal-split request. [Codex skills documentation](https://developers.openai.com/codex/skills/)
