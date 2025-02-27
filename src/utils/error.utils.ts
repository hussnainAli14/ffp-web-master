import { DatabaseError } from '@neondatabase/serverless';

export function unpackError(error: unknown): string {
  if (error instanceof Error) {
    const err = error as DatabaseError;
    switch (err?.code) {
      case '23505': { // Unique violation
        const detailMatch = /\((.*?)\)=\((.*?)\)/.exec(err?.detail || '');
        const field = detailMatch?.[1] || 'field';
        const value = detailMatch?.[2] || 'value';
        return `Duplicate value '${value}' for ${field}.`;
      }
      case '22P02': // Invalid text representation (e.g., invalid UUID)
        return 'Invalid input format.';
      case '23503': { // Foreign key violation
        const detailMatch = /"(.*?)"/.exec(err?.detail || '');
        const field = detailMatch?.[1] || 'field';
        return `Referenced record for ${field} not found.`;
      }
      case '23502': { // Not null violation
        const detailMatch = /column "(.*?)"/.exec(error?.message || '');
        const field = detailMatch?.[1] || 'field';
        return `The field '${field}' cannot be null.`;
      }
      default:
        return `${error?.message}`;
    }
  }

  return 'An unknown error occurred.';
}