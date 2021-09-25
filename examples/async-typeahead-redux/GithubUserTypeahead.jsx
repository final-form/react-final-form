import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Field } from "react-final-form";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import useKeyword from "./useKeyword";
import { compose, propOr, pathOr } from "ramda";
import arrify from "arrify";

import { searchGithubUsers } from "./actions";

const AdaptedTypeahead = ({ input, render, meta, ...rest }) => (
  <AsyncTypeahead {...input} {...rest} selected={input.value} />
);

const GithubUserTypeahead = ({ name, ...props }) => {
  const { keyword, updateKeyword } = useKeyword(name);

  const dispatch = useDispatch();
  const getOptions = useCallback(pathOr([], [keyword, "value"]), [keyword]);
  const isLoading = useCallback(pathOr(false, [keyword, "loading"]), [keyword]);
  const handleOnSearch = useCallback(compose(dispatch, searchGithubUsers), [
    dispatch,
  ]);

  const options = useSelector(getOptions);
  const loading = useSelector(isLoading);

  return (
    <Field
      name={name}
      component={AdaptedTypeahead}
      parse={propOr(null, 0)}
      format={arrify}
      placeholder="Write a github username"
      labelKey="login"
      options={options}
      onSearch={handleOnSearch}
      isLoading={loading}
      onInputChange={updateKeyword}
    />
  );
};

export default GithubUserTypeahead;
