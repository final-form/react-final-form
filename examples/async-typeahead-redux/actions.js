export const requestGithubUsers = (query) => ({
  type: "GITHUB_USERS_REQUEST",
  query,
});

export const storeGithubUsers = (query, users) => ({
  type: "GITHUB_USERS_RESPONSE",
  query,
  users,
});

export const searchGithubUsers = (query) => (dispatch) => {
  dispatch(requestGithubUsers(query));

  fetch(`https://api.github.com/search/users?q=${query}`)
    .then((res) => res.json())
    .then(({ items: users }) => dispatch(storeGithubUsers(query, users)));
};
