import React from 'react';
import { CoreForm } from 'react-kinetic-core';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { compose, withHandlers, withState } from 'recompose';
import { parse } from 'query-string';


// Asynchronously import the global dependencies that are used in the embedded
// forms. Note that we deliberately do this as a const so that it should start
// immediately without making the application wait but it will likely be ready
// before users nagivate to the actual forms.
const globals = import('common/globals');

const UnauthenticatedFormComponent = ({
  kappSlug,
  formSlug,
  submissionId,
  handleCreated,
  handleLoaded,
  formName,
  values,
}) => (
  <div className="services">
  <div className="container">
    <div className="form-wrapper">
      {submissionId ? (
        <div>
          <CoreForm
            submission={submissionId}
            globals={globals}
            created={handleCreated}
            loaded={handleLoaded}
          />
        </div>
      ) : (
        <div>
          <CoreForm
            kapp={kappSlug}
            form={formSlug}
            globals={globals}
            created={handleCreated}
            loaded={handleLoaded}
            values={values}
          />
        </div>
      )}
    </div>
  </div>
</div>
);

const valuesFromQueryParams = queryParams => {
  const params = parse(queryParams);
  return Object.entries(params).reduce((values, [key, value]) => {
    if (key.startsWith('values[')) {
      const vk = key.match(/values\[(.*?)\]/)[1];
      return { ...values, [vk]: value };
    }
    return values;
  }, {});
};

const mapStateToProps = (state, { match: { params } }) => ({
  submissionId: params.id,
  kappSlug: params.kappSlug,
  formSlug: params.formSlug,
  values: valuesFromQueryParams(state.router.location.search),
});

export const handleCreated = props => response => {
  props.push(`/kapps/${props.kappSlug}/submissions/${response.submission.id}`);
};

export const handleLoaded = props => form => {
  props.setFormName(form.name());
};

export const UnauthenticatedForm = compose(
  connect(mapStateToProps, {push}),
  withState('formName', 'setFormName', ''),
  withHandlers({ handleCreated, handleLoaded  }),
)(UnauthenticatedFormComponent);
