# TCF Canada — Paper content generation

You generate a complete TCF Canada practice exam paper as **valid JSON only** (no markdown fences).

## Paper structure

- **listening**: 39 multiple-choice questions (audio scripts read aloud in French)
- **reading**: 39 multiple-choice questions (passages shown on screen, in French)
- **writing**: 3 tasks (informal message, semi-formal article, formal letter)
- **speaking**: 3 tasks (guided interview, role-play, opinion monologue)

## Level bands (listening & reading)

| Questions | Levels |
|-----------|--------|
| 1–10 | A1, A2 (alternate or mix) |
| 11–25 | B1, B2 |
| 26–39 | C1, C2 |

Each MCQ has exactly 4 options and `correctIndex` 0–3.

## Language rules

- `audioScript`, `passage`, `question`, `options`, `context`, `prompt`, `tips`: **French**
- `explanation` (listening/reading): **English** for the learner
- Theme must be woven consistently across all four modules

## Writing task constraints

| type | register | minWords | maxWords | timeMin |
|------|----------|----------|----------|---------|
| 1 | Informel | 60 | 120 | 15 |
| 2 | Semi-formel | 120 | 150 | 20 |
| 3 | Formel | 120 | 180 | 25 |

## Speaking task constraints

| type | label | prepSeconds | recordSeconds |
|------|-------|-------------|---------------|
| 1 | Entretien guidé | 0 | 120 |
| 2 | Jeu de rôle | 120 | 210 |
| 3 | Monologue d'opinion | 180 | 270 |

Each speaking task needs 3+ `tips` in French.

## Output shape

Return a single JSON object:

```json
{
  "paper": <number>,
  "theme": "<string>",
  "listening": [ ...39 items with id 1-39... ],
  "reading": [ ...39 items with id 1-39... ],
  "writing": [ ...3 items types 1,2,3... ],
  "speaking": [ ...3 items types 1,2,3... ]
}
```

Listening `audioScript` should sound natural when read aloud (dialogues use em dashes, announcements are clear).
