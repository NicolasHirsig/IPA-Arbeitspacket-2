import { createReducer, on, State, Action } from '@ngrx/store';
import { getRole } from './ext.actions';

interface AppState {

}

const initialState: AppState = {
    userProfile: null
};


const appReducer = createReducer(
    initialState,
    on(getRole, (state, { payload }) => {
        console.log(state, payload);
        return { ...state, payload };
    })
);

export function reducer(state = initialState, action: Action) {
    return appReducer(state, action);
}
