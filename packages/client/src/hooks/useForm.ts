import { useCallback, useState } from 'react';
import { validate as classValidate } from 'class-validator';

import { ErrorsType, transformValidationErrors } from '@health-journal/server';
import useNotification from 'hooks/useNotification';

export type UseFormReturn<T> = [
  T,
  <K extends keyof T>(key: K, value: T[K]) => void,
  ErrorsType<T>,
  (key?: keyof T, f?: T) => Promise<void>,
  (errs: ErrorsType<T>) => void,
  (o?: T | undefined) => void
];

const useForm = <T>(
  Constructor: { new (): T },
  DEFAULT_VALUE: Partial<T> = {}
): UseFormReturn<T> => {
  const [addNotification] = useNotification();

  const [form, setForm] = useState<T>(
    Object.assign(new Constructor(), DEFAULT_VALUE)
  );

  const [errors, setErrors] = useState<ErrorsType<T>>({});

  // validate the form, if key is provided will only validate the key.
  const validate = useCallback(
    (key?: keyof T, data: T = form): Promise<void> =>
      new Promise((resolve, reject) => {
        classValidate(data as Record<string, unknown>, {
          stopAtFirstError: true,
        }).then(arr => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const errs: ErrorsType<T> = transformValidationErrors<T>(arr);
          // if the key is provided, will only update the error for the provided key.
          // if the key is not provided, will update the error for the entire form.
          setErrors(prev => ({
            ...prev,
            ...(key ? { [key]: errs[key.toString() as keyof T] } : errs),
          }));
          if (Object.keys(errs).length) {
            // showing notification only when validating the entire form.
            if (!key) {
              addNotification(`The form is not valid.`, 'warning');
            }
            reject();
          } else {
            resolve();
          }
        });
      }),
    [form, addNotification]
  );

  // for updating the key's value in the form & will auto validate the key.
  const updateValue = useCallback<
    <K extends keyof T>(key: K, value: T[K]) => void
  >(
    (key, value) => {
      setForm(prev => {
        const errs = Object.assign(new Constructor(), {
          ...prev,
          [key]: value,
        });
        // validate the value of the key.
        validate(key, errs).catch(() => '');
        return errs;
      });
    },
    [Constructor, validate]
  );

  // for updating the errors.
  const updateErrors = useCallback((errs: ErrorsType<T>) => {
    setErrors(prev => ({ ...prev, ...errs }));
  }, []);

  const reset = useCallback(
    (o?: T) => {
      setForm(o || new Constructor());
      setErrors({});
    },
    [Constructor]
  );

  return [form, updateValue, errors, validate, updateErrors, reset];
};

export default useForm;
