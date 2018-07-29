import React from "react";
import { connect } from "react-redux";
import { Field } from "react-final-form";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import withKeyword from "./withKeyword";
import { propOr, pathOr } from "ramda";
import arrify from "arrify";

import { searchGithubUsers } from "./actions";

const AdaptedTypeahead = ({ input, render, meta, ...rest }) => (
  <AsyncTypeahead {...input} {...rest} selected={input.value} />
);

const GithubUserTypeahead = ({
  name,
  keyword,
  updateKeyword,
  searchGithubUsers,
  loading,
  options,
  ...props
}) => (
  <Field
    name={name}
    component={AdaptedTypeahead}
    parse={propOr(null, 0)}
    format={arrify}
    placeholder="Write a github username"
    labelKey="login"
    options={options}
    onSearch={searchGithubUsers}
    isLoading={loading}
    onInputChange={updateKeyword}
  />
);

const mapStateToProps = (state, { keyword }) => ({
  options: pathOr([], [keyword, "value"], state),
  loading: pathOr(false, [keyword, "loading"], state)
});
const mapDispatchToProps = { searchGithubUsers };
export default withKeyword(
  connect(mapStateToProps, mapDispatchToProps)(GithubUserTypeahead)
);
