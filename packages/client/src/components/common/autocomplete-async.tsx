import React, { useState, ReactElement, useCallback, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { FilterOptionsState } from '@mui/material';

import {
  ResponseEntityType,
  ResponseEntitiesType,
  RequestEntitiesType,
} from '@health-journal/server';
import useDebounce from 'hooks/useDebounce';

// option type for user added option.
export type AddOptionType<T> = T & {
  inputValue?: string;
};

// generic onSelect type for single & multi select.
type OnSelectType<
  T extends Record<string, unknown>,
  Multiple extends boolean | undefined
> = (value: Multiple extends true ? Array<T> : null | T) => void;

interface AutocompleteAsyncProps<
  T extends Record<string, unknown>,
  Multiple extends boolean | undefined
> {
  multiple?: Multiple;
  value: Multiple extends true ? Array<T> : null | T;
  onSelect: OnSelectType<T, Multiple>;
  label: string;
  placeholder: string;
  error?: boolean;
  helperText?: Array<string>;
  getOptionLabel: (option: T) => string;
  // get user added option.
  getAddOption: (inputValue: string) => Required<AddOptionType<T>>;
  // triggered when user added option is selected.
  addOption: (
    option: Required<AddOptionType<T>>
  ) => Promise<ResponseEntityType<T>>;
  // list of options.
  getOptions: (
    data: RequestEntitiesType<T>
  ) => Promise<ResponseEntitiesType<T>>;
}

export const AutocompleteAsync = <
  T extends Record<string, unknown>,
  Multiple extends boolean | undefined
>({
  multiple = false,
  label,
  placeholder,
  value,
  onSelect,
  error = false,
  helperText,
  getOptionLabel,
  getAddOption,
  addOption,
  getOptions,
}: AutocompleteAsyncProps<T, Multiple>): ReactElement => {
  const [open, setOpen] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  const [options, setOptions] = useState<Array<T>>([]);

  const [defaultOptions, setDefaultOptions] = useState<null | Array<T>>(null);

  const [text, setText] = useState<string>('');

  const search = useDebounce<string>(text);

  // filtering user search options.
  const filterOptions = useCallback(
    (
      opts: Array<T>,
      params: FilterOptionsState<T>
    ): Array<AddOptionType<T>> => {
      const filtered = createFilterOptions<AddOptionType<T>>()(opts, params);
      const { inputValue } = params; // search value.
      if (
        !options.some(
          option =>
            inputValue.toLowerCase() === getOptionLabel(option).toLowerCase()
        ) &&
        inputValue
      ) {
        // adding user added option.
        filtered.push(getAddOption(inputValue));
      }
      return filtered;
    },
    [getAddOption, getOptionLabel, options]
  );

  // onChange for single select.
  const onChangeSingle = useCallback(
    (opt: null | AddOptionType<T>) => {
      const select = onSelect as OnSelectType<T, false>;
      if (opt && opt.inputValue) {
        // user added option is selected.
        setLoading(true);
        addOption(opt as Required<AddOptionType<T>>)
          .then(({ entity }) => {
            // adding the newly added option to the options.
            setOptions(arr => [entity, ...arr]);
            // selecting the newly added option.
            select(entity);
          })
          .finally(() => setLoading(false));
      } else {
        // selected option from the options list.
        select(opt);
      }
    },
    [addOption, onSelect]
  );

  // onChange for multiple select.
  const onChangeMultiple = useCallback(
    (opts: Array<AddOptionType<T>>) => {
      const pArr: Array<Promise<T>> = [];
      for (const option of opts) {
        if (option.inputValue) {
          // user added option.
          pArr.push(
            new Promise((resolve, reject) =>
              addOption(option as Required<AddOptionType<T>>).then(
                ({ entity }) => resolve(entity),
                reject
              )
            )
          );
        } else {
          // option from option list.
          pArr.push(Promise.resolve(option));
        }
      }
      Promise.all(pArr).then(arr => (onSelect as OnSelectType<T, true>)(arr));
    },
    [addOption, onSelect]
  );

  // handling search.
  useEffect(() => {
    if (search) {
      // when searched.
      setLoading(true);
      getOptions({ search })
        .finally(() => setLoading(false))
        .then(({ entities }) => setOptions(entities));
    } else if (defaultOptions) {
      // search is empty by have already loaded option of first page.
      // avoiding service call & adding previously loaded first page options.
      setOptions([...defaultOptions]);
    } else {
      // no search term & default options are not loaded.
      // this will be the mounting phase.
      // loading default options.
      setLoading(true);
      getOptions({})
        .finally(() => setLoading(false))
        .then(({ entities }) => {
          setOptions([...entities]);
          setDefaultOptions([...entities]);
        });
    }
  }, [getOptions, search, defaultOptions]);

  return (
    <Autocomplete
      multiple={multiple}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      value={value}
      options={options}
      getOptionLabel={getOptionLabel}
      onChange={(_e, d) =>
        Array.isArray(d) ? onChangeMultiple(d) : onChangeSingle(d)
      }
      onInputChange={(_e, t) => setText(t)}
      filterOptions={filterOptions}
      renderInput={params => (
        <TextField
          {...params}
          error={error}
          helperText={helperText}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading && <CircularProgress color='inherit' size={20} />}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
          margin='dense'
          variant='standard'
          label={label}
          placeholder={placeholder}
        />
      )}
    />
  );
};

export default AutocompleteAsync;
