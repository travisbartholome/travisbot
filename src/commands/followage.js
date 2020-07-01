const axios = require('axios').default;
const {
  differenceInDays,
  differenceInMonths,
  differenceInYears,
  formatDistanceStrict,
  getDaysInMonth,
  subMonths,
} = require('date-fns');

/**
 * Get the amount of time that a given user has been following a given channel.
 * @param {number} fromUser The user id of the follower
 * @param {string} fromDisplayName The display name of the follower
 * @param {number} toUser The user id of the followed channel
 * @param {object} twitchApiOptions Twitch API options (must include a Client-ID header)
 */
module.exports = (fromUser, fromDisplayName, toUser, twitchApiOptions) => axios.get(
  `https://api.twitch.tv/helix/users/follows?from_id=${fromUser}&to_id=${toUser}`,
  twitchApiOptions,
)
  .then(({ data: result }) => {
    if (!result.total) {
      // If response is broken or result is 0, send this
      return Promise.resolve(`${fromDisplayName} doesn't seem to be following FeelsBadMan`);
    }

    const data = result.data[0];
    const { followed_at: followedAt, from_name: fromName } = data;
    const followDate = new Date(followedAt);
    const currentDate = new Date();

    let diffMsg = '';

    // This could have been simpler, but I didn't really like the format
    //    of the built-in date-fns distanceInWords functions for intervals
    //    larger than a month
    if (differenceInMonths(currentDate, followDate) < 1) {
      diffMsg = formatDistanceStrict(currentDate, followDate);
    } else {
      // This method for finding the difference in days was chosen to account
      //    for different month lengths
      // `lastMonthFollowDate` is the date in the month prior to the current
      //    date where the day of the month is the same as the day of month
      //    for `followDate`
      const lastMonthFollowDate = subMonths(currentDate, 1).setUTCDate(followDate.getUTCDate());
      const monthModulus = getDaysInMonth(lastMonthFollowDate);
      const diffDays = differenceInDays(currentDate, lastMonthFollowDate) % monthModulus;

      const diffMonths = differenceInMonths(currentDate, followDate) % 12;
      const diffYears = differenceInYears(currentDate, followDate);

      if (diffYears > 0) diffMsg += `${diffYears} year${diffYears === 1 ? '' : 's'}, `;
      diffMsg += `${diffMonths} month${diffMonths === 1 ? '' : 's'}${diffYears > 0 ? ',' : ''}
          and ${diffDays} day${diffDays === 1 ? '' : 's'}`;
    }

    return Promise.resolve(`${fromName} has been following for ${diffMsg}!`);
  });
