import type { ScenarioModel, ScenarioModelId, LeverValues } from '@/types';
import { cfoModel } from './cfo';
import { cooModel } from './coo';
import { cmoModel } from './cmo';
import { ctaioModel } from './ctaio';

/** Registry of the four deterministic scenario models (§9). */
export const SCENARIO_MODELS: Record<ScenarioModelId, ScenarioModel> = {
  cfo: cfoModel,
  coo: cooModel,
  cmo: cmoModel,
  ctaio: ctaioModel,
};

/** Default lever values for a model, keyed by lever id. */
export function defaultLeverValues(model: ScenarioModel): LeverValues {
  const values: LeverValues = {};
  for (const lever of model.levers) {
    values[lever.id] = lever.default;
  }
  return values;
}

export { cfoModel, cooModel, cmoModel, ctaioModel };
