import { USER } from '../constants';

export function userData(user) {
    return {
        type: USER,
        payload: user
    }
}