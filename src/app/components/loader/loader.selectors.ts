import { createSelector, createFeatureSelector } from '@ngrx/store';
import { LoaderState } from './loader.reducer';

export const selectLoaderState = createFeatureSelector<LoaderState>('loader');

export const loaderSelector = createSelector(
    selectLoaderState,
    (state: LoaderState) => state.isLoading
);