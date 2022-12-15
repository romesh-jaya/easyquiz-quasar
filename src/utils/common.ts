import humanizeDuration from 'humanize-duration';

export const getLastUpdatedHumanized = (referenceDate: Date) => {
  let timeDiffMs: number;
  let durationHumanFriendly = 'unknown';
  let lastRefreshedText = '';

  if (referenceDate) {
    timeDiffMs = new Date().getTime() - referenceDate.getTime();
    if (timeDiffMs / 1000 < 60) {
      // in the last minute
      lastRefreshedText = 'Just now';
    } else {
      durationHumanFriendly = humanizeDuration(timeDiffMs, {
        largest: 1,
      });
      lastRefreshedText = `${durationHumanFriendly} ago`;
    }
  }

  return lastRefreshedText;
};
