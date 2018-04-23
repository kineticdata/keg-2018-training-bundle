import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

export const KappLinkComponent = ({ to, kappSlug, ...rest }) => (
  <Link {...rest} to={kappSlug ? `/kapps/${kappSlug}${to}` : to} />
);

export const mapStateToProps = state => ({
  kappSlug: state.kinops.kappSlug,
});

export const KappLink = connect(mapStateToProps, {})(KappLinkComponent);
