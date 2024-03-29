import '$lib/stores/theme';
import type { TranslationFunctions } from './i18n/i18n-types';

export type ExtractPromise<T> = T extends Promise<infer U> ? U : never;

export type ErrorMessage = {
  message: keyof TranslationFunctions["errors"];
  parameters: Parameters<TranslationFunctions["errors"][keyof TranslationFunctions["errors"]]>[0]
};
