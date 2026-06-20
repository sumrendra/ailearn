import type { ComponentType } from "react";

import { AiAgents } from "./AiAgents";
import { ExcelMastery } from "./ExcelMastery";
import { FrenchAdvanced } from "./FrenchAdvanced";
import { FrenchFundamentals } from "./FrenchFundamentals";
import { JavaAdvanced } from "./JavaAdvanced";
import { JavaComplete } from "./JavaComplete";
import { JavaFrameworks } from "./JavaFrameworks";
import { KafkaEssentials } from "./KafkaEssentials";
import { KubernetesInfra } from "./KubernetesInfra";
import { LLMFoundations } from "./LLMFoundations";
import { MicroservicesArchitecture } from "./MicroservicesArchitecture";
import { RagVectorDbs } from "./RagVectorDbs";
import { SqlMastery } from "./SqlMastery";
import { SystemDesign } from "./SystemDesign";
import type { PathObjectProps } from "./types";

const REGISTRY: Record<string, ComponentType<PathObjectProps>> = {
  "llm-foundations": LLMFoundations,
  "rag-vector-dbs": RagVectorDbs,
  "ai-agents": AiAgents,
  "sql-mastery": SqlMastery,
  "french-fundamentals": FrenchFundamentals,
  "excel-mastery": ExcelMastery,
  "java-complete": JavaComplete,
  "java-frameworks": JavaFrameworks,
  "kafka-essentials": KafkaEssentials,
  "kubernetes-infra": KubernetesInfra,
  "microservices-architecture": MicroservicesArchitecture,
  "system-design": SystemDesign,
  "java-advanced": JavaAdvanced,
  "french-advanced": FrenchAdvanced,
};

export function PathObject({
  slug,
  ...props
}: { slug: string } & PathObjectProps) {
  const Comp = REGISTRY[slug];
  if (!Comp) return null;
  return <Comp {...props} />;
}

export {
  AiAgents,
  ExcelMastery,
  FrenchAdvanced,
  FrenchFundamentals,
  JavaAdvanced,
  JavaComplete,
  JavaFrameworks,
  KafkaEssentials,
  KubernetesInfra,
  LLMFoundations,
  MicroservicesArchitecture,
  RagVectorDbs,
  SqlMastery,
  SystemDesign,
};

export type { PathObjectProps } from "./types";
