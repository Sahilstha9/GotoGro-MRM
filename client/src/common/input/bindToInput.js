/**
 * eslint-disable-next-line @typescript-eslint/ban-types
 *
 * @param observable
 * @param key
 * @returns {{onChange: onChange, value: *}}
 */
export const bindToInput = (observable, key) => {
    return {
        value: observable[key],
        onChange: value => {
            observable[key] = value
        }
    }
}
