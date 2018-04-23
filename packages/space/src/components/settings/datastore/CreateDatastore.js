import React from 'react';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { compose, withHandlers, withState } from 'recompose';

import { DatastoreForm } from '../../../records';

import { actions } from '../../../redux/modules/settingsDatastore';

const CreateDatastoreComponent = ({
  spaceAdmin,
  setNewForm,
  newForm,
  bridges,
  loading,
  creating,
  handleSave,
  handleNameChange,
  match,
}) => (
  <div className="datastore-container">
    <div className="datastore-content pane scrollable">
      <div className="page-title-wrapper">
        <div className="page-title">
          <h3>
            <Link to="/">home</Link> /{` `}
            <Link to="/settings">settings</Link> /{` `}
            <Link to={`/settings/datastore/`}>datastore</Link> /{` `}
          </h3>
          <h1>New Datastore</h1>
        </div>
      </div>
      <div className="datastore-settings">
        <h3>THIS FUNCTIONALITY IS NOT CURRENTLY WORKING</h3>
        <h3 className="section-title">General Settings</h3>
        <div className="settings">
          <div className="form-row">
            <div className="col">
              <div className="form-group required">
                <label htmlFor="name">Datastore Name</label>
                <input
                  id="name"
                  name="name"
                  onChange={e => handleNameChange(e.target.value)}
                  value={newForm.name}
                  className="form-control"
                />
              </div>
            </div>
            <div className="col">
              <div className="form-group required">
                <label htmlFor="slug">Datastore Slug</label>
                <input
                  id="slug"
                  name="slug"
                  onChange={e =>
                    setNewForm(newForm.set('slug', e.target.value))
                  }
                  value={newForm.slug}
                  className="form-control"
                />
              </div>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="name">
              Datastore Description <small>(optional)</small>
            </label>
            <textarea
              id="description"
              className="form-control"
              onChange={e =>
                setNewForm(newForm.set('description', e.target.value))
              }
              value={newForm.description || ''}
              rows="3"
              name="description"
            />
          </div>
          <div className="form-group">
            <label htmlFor="name">Bridge Name</label>
            <select
              id="bridgeName"
              name="bridgeName"
              onChange={e =>
                setNewForm(newForm.set('bridgeName', e.target.value))
              }
              value={newForm.bridgeName}
              className="form-control"
            >
              <option />
              {bridges.map(b => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
          <div className="pull-right">
            <Link to="/datastore" className="btn btn-link">
              Cancel
            </Link>
            <button
              disabled={newForm.name === '' || newForm.slug === '' || creating}
              type="button"
              onClick={handleSave()}
              className="btn btn-secondary ml-3"
            >
              Create Form
            </button>
          </div>
        </div>
      </div>
    </div>
    <div className="datastore-sidebar">
      <h3>New Datastore</h3>
      <p>
        Creating a new Datastore will create a new Kinetic Request datastore
        form to be used for storing data.
      </p>
      <p>
        <strong>Bridge Name:</strong> Select the Kinetic Core bridge to allow
        for automatic bridge creation for this datastore (The Kinetic Core
        Bridge Adapter must first be installed into Bridgehub to allow this data
        to be retrieved via bridges).
      </p>
    </div>
  </div>
);

const handleSave = ({ createForm, newForm, push, setCreating }) => () => () => {
  setCreating(true);
  createForm({
    form: newForm,
    callback: () => push(`/datastore/${newForm.slug}/settings`),
  });
};

const handleNameChange = ({ setNewForm, newForm }) => value => {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');
  if (
    newForm.slug === '' ||
    slug.includes(newForm.slug) ||
    newForm.slug.includes(slug)
  ) {
    const updatedForm = newForm.set('name', value).set('slug', slug);
    setNewForm(updatedForm);
  } else {
    setNewForm(newForm.set('name', value));
  }
};

export const mapStateToProps = (state, { match: { params } }) => ({
  spaceAdmin: state.kinops.profile.spaceAdmin,
  bridges: state.settingsDatastore.bridges,
});

export const mapDispatchToProps = {
  push,
  createForm: actions.createForm,
};

export const CreateDatastore = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withState('newForm', 'setNewForm', DatastoreForm()),
  withState('creating', 'setCreating', false),
  withHandlers({
    handleSave,
    handleNameChange,
  }),
)(CreateDatastoreComponent);
