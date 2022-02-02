import React, { FC, useCallback, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Button from '@mui/lab/LoadingButton';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

import { MealTypeType } from '@health-journal/server';
import { remove as deleteService } from 'services/meal-type';
import Loading from 'components/common/loading';

export interface DeleteProps {
  row?: MealTypeType;
  onClose: () => void;
  onDone: () => void;
}

export const Delete: FC<DeleteProps> = ({ row, onClose, onDone }) => {
  const [loading, setLoading] = useState<boolean>(false);

  const onDelete = useCallback(() => {
    if (row) {
      setLoading(true);
      deleteService({
        IdMealType: row.IdMealType,
      })
        .then(onDone)
        .finally(() => setLoading(false));
    }
  }, [row, onDone]);

  return (
    <Dialog open={!!row} maxWidth='sm' fullWidth>
      <Loading loading={loading}>
        <DialogTitle>
          Delete meal type
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container>
            <Grid item sm={12}>
              Are you sure you want to delete <strong>{row?.title}</strong>?
            </Grid>
            <Grid item sm={12} textAlign='right'>
              <Button variant='outlined' sx={{ mr: 2 }} onClick={onClose}>
                Cancel
              </Button>
              <Button
                color='error'
                variant='contained'
                endIcon={<DeleteIcon />}
                onClick={onDelete}
              >
                Delete
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Loading>
    </Dialog>
  );
};

export default Delete;
