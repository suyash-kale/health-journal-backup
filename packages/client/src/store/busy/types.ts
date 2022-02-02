import { BusyActionAddType, BusyActionRemoveType } from 'store/busy/actions';

export type BusyStateType = Array<string>;

export const BUSY_DEFAULT = [];

export type BusyActionType = BusyActionAddType | BusyActionRemoveType;
