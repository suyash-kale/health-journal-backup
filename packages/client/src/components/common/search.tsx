import React, { FC, FormEvent, useCallback, useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import InputBase, { InputBaseProps } from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import SearchIcon from '@mui/icons-material/Search';
import CancelIcon from '@mui/icons-material/Cancel';

import useDebounce from 'hooks/useDebounce';

export type SearchProps = {
  onSearch: (s: string) => void;
  defaultText?: string;
  loading?: boolean;
} & InputBaseProps;

const Search: FC<SearchProps> = ({
  onSearch,
  defaultText = '',
  loading = false,
  ...props
}) => {
  const [elevation, setElevation] = useState<undefined | number>(undefined);

  const [text, setText] = useState(defaultText);

  const debounce = useDebounce(text);

  const [search, setSearch] = useState('');

  const onSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setSearch(text);
    },
    [text]
  );

  const onCancel = useCallback(() => {
    setText('');
    setSearch('');
  }, []);

  useEffect(() => {
    onSearch(search);
  }, [onSearch, search]);

  useEffect(() => {
    setSearch(debounce);
  }, [debounce]);

  const SearchIconRender = search ? (
    <CancelIcon onClick={onCancel} />
  ) : (
    <SearchIcon />
  );

  return (
    <Paper
      elevation={elevation}
      component='form'
      onSubmit={onSubmit}
      sx={{
        p: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: 400,
      }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder='Search ..'
        onFocus={() => setElevation(4)}
        onBlur={() => setElevation(undefined)}
        name='search'
        value={text}
        onChange={e => setText(e.target.value)}
        autoComplete='off'
        {...props}
      />
      <IconButton type='submit'>
        {loading ? <CircularProgress size={24} /> : SearchIconRender}
      </IconButton>
    </Paper>
  );
};

export default Search;
