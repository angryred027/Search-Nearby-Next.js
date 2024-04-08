import { INearby } from "../types";

type placeState = {
    place: INearby | null;
}

type placeAction = 
    | { type: 'SET_PLACE', payload: INearby }
    | { type: 'CLEAR_PLACE' }

export function placeReducer(state: placeState, action: placeAction) {
    switch (action.type) {
        case 'SET_PLACE':
            return action.payload;
        case 'CLEAR_PLACE':
            return null;
        default:
            console.debug(`[placeReducer] Unknown action ${JSON.stringify(action)}`);
            return state;
    }
}