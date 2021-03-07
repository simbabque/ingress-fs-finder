/**
 *  Rudimentary type for DateTimeformatOptions to apease TypeScript
 *   @see https://github.com/microsoft/TypeScript/issues/35865#issuecomment-763866416
 */

declare namespace Intl {
    interface DateTimeFormatOptions {
      dateStyle?: 'full' | 'long' | 'medium' | 'short';
      timeStyle?: 'full' | 'long' | 'medium' | 'short';
    }
  }
  