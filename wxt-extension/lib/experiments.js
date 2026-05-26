// This file is the small "experiment system" for the extension.
// To add a new experiment, define its variants, define its experiment config,
// then add that config to ACTIVE_EXPERIMENTS.

export const OCR_MODE_PLACEMENT_VARIANTS = {
  CONTROL: "control",
  CLOUD_FIRST: "cloud_first",
};

export const OCR_MODE_PLACEMENT_EXPERIMENT = {
  // storageKey is where the user's assigned variant is saved in
  // chrome.storage.sync. Do not rename this after launching an experiment unless
  // you intentionally want users to be re-randomized.
  storageKey: "ocrModePlacementExperimentVariant",

  // analyticsProperty is the normal PostHog event property name. This is not
  // using PostHog's experiments API; it is just another property on events.
  analyticsProperty: "ocr_mode_placement_experiment_variant",

  // The weights are relative probabilities. These two 0.5 values mean a 50/50
  // split between control and cloud_first.
  variants: [
    { value: OCR_MODE_PLACEMENT_VARIANTS.CONTROL, weight: 0.5 },
    { value: OCR_MODE_PLACEMENT_VARIANTS.CLOUD_FIRST, weight: 0.5 },
  ],
};

// Add new experiments here when they should be assigned and reported to
// PostHog. Remove old experiments from this list when an experiment is finished.
export const ACTIVE_EXPERIMENTS = [OCR_MODE_PLACEMENT_EXPERIMENT];

function getVariantValues(experiment) {
  // Convert [{ value: "control" }, { value: "new" }] into
  // ["control", "new"] so we can check whether a stored value is valid.
  return experiment.variants.map((variant) => variant.value);
}

function isValidVariant(experiment, variant) {
  // This prevents old, misspelled, or manually edited storage values from being
  // reused. If the stored variant is not valid, the user gets assigned again.
  return getVariantValues(experiment).includes(variant);
}

function pickWeightedVariant(experiment) {
  // Example: weights of 0.5 and 0.5 create a 50/50 split. Weights of 1 and 3
  // would create a 25/75 split. The exact numbers matter less than their ratio.
  const totalWeight = experiment.variants.reduce(
    (total, variant) => total + variant.weight,
    0,
  );
  let randomWeight = Math.random() * totalWeight;

  for (const variant of experiment.variants) {
    randomWeight -= variant.weight;

    if (randomWeight <= 0) {
      return variant.value;
    }
  }

  // Floating point math can be tiny bit imperfect, so fall back to the last
  // configured variant if the loop does not return.
  return experiment.variants[experiment.variants.length - 1].value;
}

export async function getExperimentVariant(experiment) {
  // First try to use the already-saved variant. This is what keeps the
  // assignment stable instead of changing every time the popup opens.
  const storedExperiment = await chrome.storage.sync.get([
    experiment.storageKey,
  ]);
  const storedVariant = storedExperiment[experiment.storageKey];

  if (isValidVariant(experiment, storedVariant)) {
    return storedVariant;
  }

  // Assign once, then store the result so the same user/install keeps seeing
  // the same experiment version.
  const assignedVariant = pickWeightedVariant(experiment);

  await chrome.storage.sync.set({
    [experiment.storageKey]: assignedVariant,
  });

  return assignedVariant;
}

export async function ensureActiveExperimentAssignments() {
  // Called during extension startup/install setup. This eagerly creates missing
  // assignments, but getExperimentVariant also works if a UI opens first.
  for (const experiment of ACTIVE_EXPERIMENTS) {
    await getExperimentVariant(experiment);
  }
}

export async function getActiveExperimentAnalyticsProperties() {
  // PostHog calls this before sending events. It returns an object like:
  // { ocr_mode_placement_experiment_variant: "cloud_first" }
  const properties = {};

  for (const experiment of ACTIVE_EXPERIMENTS) {
    properties[experiment.analyticsProperty] =
      await getExperimentVariant(experiment);
  }

  return properties;
}
