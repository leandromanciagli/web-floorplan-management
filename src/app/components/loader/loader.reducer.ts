import { Action, createReducer, on } from '@ngrx/store';
import { showLoader, hideLoader } from './loader.actions';

export interface LoaderState {
    isLoading: boolean;
}

export const initialState: LoaderState = {
    isLoading: false
};

const _loaderReducer = createReducer(
    initialState,
    on(showLoader, state => ({ ...state, isLoading: true })),
    on(hideLoader, state => ({ ...state, isLoading: false }))
);

export function loaderReducer(state: LoaderState = initialState, action: Action) {
    return _loaderReducer(state, action);
}