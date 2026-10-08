import type { ChangeEvent, KeyboardEvent, ClipboardEvent } from 'react';

function formatPhone(value: string) {
  let digits = value.replace(/\D/g, '');
  if (value.startsWith('+7') || (digits.length === 11 && /^[78]/.test(digits))) digits = digits.slice(1);
  digits = digits.slice(0, 10);
  let formatted = '+7';
  if (digits) formatted += ` (${digits.slice(0, 3)}`;
  if (digits.length >= 3) formatted += ') ';
  if (digits.length > 3) formatted += digits.slice(3, 6);
  if (digits.length > 6) formatted += `-${digits.slice(6, 8)}`;
  if (digits.length > 8) formatted += `-${digits.slice(8, 10)}`;
  return formatted;
}

function update(input: HTMLInputElement, value: string, digitsBeforeCursor: number) {
  input.value = formatPhone(value);
  input.setCustomValidity('');
  let remaining = Math.max(1, digitsBeforeCursor);
  let cursor = input.value.length;
  for (let i = 0; i < input.value.length; i++) {
    if (/\d/.test(input.value[i]) && --remaining === 0) { cursor = i + 1; break; }
  }
  while (cursor < input.value.length && /\D/.test(input.value[cursor])) cursor++;
  input.setSelectionRange(cursor, cursor);
}

export function PhoneInput({ disabled }: { disabled: boolean }) {
  function change(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const before = input.value.slice(0, input.selectionStart ?? input.value.length).replace(/\D/g, '').length;
    update(input, input.value, before + (input.value.startsWith('+7') || /^[78]\d{10}$/.test(input.value.replace(/\D/g, '')) ? 0 : 1));
  }

  function erase(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== 'Backspace' && event.key !== 'Delete') return;
    const input = event.currentTarget;
    let start = Math.max(2, input.selectionStart ?? 2);
    let end = Math.max(start, input.selectionEnd ?? start);
    if (start === end) {
      if (event.key === 'Backspace') {
        while (start > 2 && /\D/.test(input.value[start - 1])) start--;
        if (start > 2) start--;
      } else {
        while (end < input.value.length && /\D/.test(input.value[end])) end++;
        end++;
      }
    }
    event.preventDefault();
    const before = input.value.slice(0, start).replace(/\D/g, '').length;
    update(input, input.value.slice(0, start) + input.value.slice(end), before);
  }

  function paste(event: ClipboardEvent<HTMLInputElement>) {
    const pasted = event.clipboardData.getData('text');
    if (!/^[78]\d{10}$/.test(pasted.replace(/\D/g, ''))) return;
    event.preventDefault();
    update(event.currentTarget, pasted, 11);
  }

  return <input name="phone" type="tel" inputMode="tel" autoComplete="tel" defaultValue="+7" placeholder="+7 (999) 123-45-67" required pattern="\+7 \([0-9]{3}\) [0-9]{3}-[0-9]{2}-[0-9]{2}" disabled={disabled}
    onChange={change} onKeyDown={erase} onPaste={paste}
    onFocus={event => { if (event.currentTarget.selectionStart === 0) event.currentTarget.setSelectionRange(2, 2); }}
    onBlur={event => event.currentTarget.setCustomValidity(/^\+7\d{10}$/.test(event.currentTarget.value.replace(/[^+\d]/g, '')) ? '' : 'Введите номер телефона полностью: +7 и 10 цифр.')} />;
}
