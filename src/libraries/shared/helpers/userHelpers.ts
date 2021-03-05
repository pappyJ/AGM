/**
 * @param {state} List A collesction of states in Nigeria
 *
 */

export const states = [
    'abia',
    'abuja',
    'adamawa',
    'akwa Ibom',
    'anambra',
    'bauchi',
    'bayelsa',
    'benue',
    'borno',
    'cross river',
    'delta',
    'ebonyi',
    'edo',
    'ekiti',
    'enugu',
    'gombe',
    'imo',
    'jigawa',
    'kaduna',
    'kano',
    'katsina',
    'kebbi',
    'kogi',
    'kwara',
    'lagos',
    'nasarawa',
    'niger',
    'ogun',
    'ondo',
    'osun',
    'oyo',
    'plateau',
    'rivers',
    'sokoto',
    'taraba',
    'yobe',
    'zamfara',
];

/**
 * @param lgas = List of Local Goverment Areas
 *
 * @param lga = Local Goverment Area inserted by the user
 *
 * @param state = state selected by the user
 *
 */

type Origin = {
    state: string;
    lgas: string[];
}[];

export const OriginAudit = (lgas: Origin, lga: string, state: string) => {
    const check = lgas.some((el) =>
        // TODO: Replace the map with regular expression
        el.state.toLowerCase() === state.toLowerCase()
            ? el.lgas.map((val: string) => val.toLowerCase()).includes(lga)
            : false
    );

    return check;
};
