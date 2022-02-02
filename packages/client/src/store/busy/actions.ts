import { Action } from 'store/types';
import { eActions } from 'store/const';

export interface BusyActionAddType extends Action {
  key: string;
}
export const add = (key: string): BusyActionAddType => ({
  type: eActions.BUSY_ADD,
  key,
});

export interface BusyActionRemoveType extends Action {
  key: string;
}
export const remove = (key: string): BusyActionRemoveType => ({
  type: eActions.BUSY_REMOVE,
  key,
});
