import React, { FC, Fragment, useCallback, useEffect, useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddIcon from '@mui/icons-material/Add';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import SettingsIcon from '@mui/icons-material/Settings';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/lab/LoadingButton';

import { MealCategoryType } from '@health-journal/server';
import { list as listService } from 'services/meal-category';
import { localTime } from 'utility/date';
import Search from 'components/common/search';
import IconMerge from 'components/common/icon-merge';
import Loading from 'components/common/loading';
import Create from 'components/meal-type/create';
import Delete from 'components/meal-type/delete';

const Category: FC = () => {
  const [open, setOpen] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  const [search, setSearch] = useState<string>('');

  const [row, setRow] = useState<undefined | MealCategoryType>(undefined);

  const [deleteRow, setDeleteRow] = useState<undefined | MealCategoryType>(
    undefined
  );

  const [rows, setRows] = useState<Array<MealCategoryType>>([]);

  const onClose = useCallback(() => {
    setOpen(false);
    setRow(undefined);
    setDeleteRow(undefined);
  }, []);

  const loadRows = useCallback(() => {
    setLoading(true);
    listService({ search })
      .then(({ entities }) => setRows(entities))
      .finally(() => setLoading(false));
  }, [search]);

  const onDone = useCallback(() => {
    onClose();
    loadRows();
  }, [onClose, loadRows]);

  const onEdit = useCallback((r: MealCategoryType) => {
    setRow(r);
    setOpen(true);
  }, []);

  useEffect(() => {
    loadRows();
  }, [loadRows]);

  return (
    <Grid item sm={12}>
      <Typography variant='h3' align='center' sx={{ mb: 3 }}>
        <IconMerge
          Primary={RestaurantIcon}
          primary={{
            fontSize: 'large',
            sx: {
              mr: 2,
            },
          }}
          Secondary={SettingsIcon}
          secondary={{
            fontSize: 'medium',
            sx: {
              mr: 2,
            },
          }}
        />
        Meal category
      </Typography>

      <Create open={open} row={row} onClose={onClose} onDone={onDone} />

      <Delete row={deleteRow} onClose={onClose} onDone={onDone} />

      <Grid
        container
        direction='row'
        justifyContent='right'
        alignItems='center'
        sx={{
          mb: 2,
        }}
      >
        <Search onSearch={text => setSearch(text)} loading={loading} />
        <Button
          variant='contained'
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
          sx={{
            ml: 2,
          }}
        >
          Create
        </Button>
      </Grid>

      <Paper>
        <Loading loading={loading}>
          <List>
            {loading && !rows.length && (
              <ListItem>
                <CircularProgress size={24} sx={{ mr: 2 }} />
                Loading ..
              </ListItem>
            )}
            {!loading && !rows.length && <ListItem>No data ..</ListItem>}
            {rows.map((r, i) => (
              <Fragment key={`fragment-${r.IdMealCategory}`}>
                {!!i && <Divider key={`divider-${r.IdMealCategory}`} />}
                <ListItem
                  key={`list-item-${r.IdMealCategory}`}
                  secondaryAction={
                    <>
                      <IconButton onClick={() => onEdit(r)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => setDeleteRow(r)}>
                        <DeleteIcon />
                      </IconButton>
                    </>
                  }
                >
                  <ListItemText>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                      }}
                    >
                      {r.title}
                      {r.fromTime && r.tillTime && (
                        <Chip
                          sx={{
                            ml: 2,
                          }}
                          avatar={<AccessTimeIcon />}
                          label={`${localTime(r.fromTime)} - ${localTime(
                            r.tillTime
                          )}`}
                        />
                      )}
                    </div>
                  </ListItemText>
                </ListItem>
              </Fragment>
            ))}
          </List>
        </Loading>
      </Paper>
    </Grid>
  );
};

export default Category;
