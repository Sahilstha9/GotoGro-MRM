/**
 *
 * @param {number} current
 * @param {number} max
 * @returns {string}
 */
export const getLengthConstraintColor = (current, max) => {
    const warningLimit = Math.max(max * 0.8, max - 50)

    if (current > max) return "danger"
    else if (current > warningLimit) return "warning"
    return "normal"
}
