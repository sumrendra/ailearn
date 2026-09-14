#!/usr/bin/env npx tsx
import { getVocabContentStatus } from "../src/lib/tcf-program/vocab-catalog";

const status = getVocabContentStatus();
console.log(JSON.stringify(status, null, 2));
