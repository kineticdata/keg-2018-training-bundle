import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { compose, lifecycle, withHandlers } from 'recompose';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Utils, Loading } from 'common';
import { actions } from './redux/modules/app';
import * as selectors from 'kinops/src/redux/selectors';
import { Sidebar } from './components/Sidebar';
import { Sidebar as SettingsSidebar } from './components/settings/Sidebar';
import { About } from './components/about/About';
import { AlertForm } from './components/alerts/AlertForm';
import { Alerts } from './components/alerts/Alerts';
import { Settings } from './components/settings/Settings';
import { Discussion } from './components/discussion/Discussion';
import { EditProfile } from './components/profile/EditProfile';
import { Home } from './components/home/Home';
import { Notifications } from './components/notifications/Notifications';
import { ViewProfile } from './components/profile/ViewProfile';
import { TeamContainer } from './components/teams/TeamContainer';
import { TeamForm } from './components/teams/TeamForm';
import { TeamsContainer } from './components/teams/TeamsContainer';
import { IsolatedForm } from './components/shared/IsolatedForm';
import './assets/styles/master.scss';

export const AppComponent = props => {
  if (props.loading) {
    return <Loading text="App is loading ..." />;
  }
  return props.render({
    sidebar: !props.isGuest && (
      <Switch>
        <Route
          path="/settings"
          render={() => (
            <SettingsSidebar settingsBackPath={props.settingsBackPath} />
          )}
        />
        <Route
          render={() => (
            <Sidebar
              kapps={props.kapps}
              teams={props.teams}
              isSpaceAdmin={props.isSpaceAdmin}
              openSettings={props.openSettings}
            />
          )}
        />
      </Switch>
    ),
    main: (
      <Fragment>
        <Notifications />
        <div className="space layout">
          <Route path="/" exact component={Home} />
          <Route path="/about" exact component={About} />
          <Route path="/alerts" exact component={Alerts} />
          <Route path="/alerts/:id" exact component={AlertForm} />
          <Route path="/discussions/:id" exact component={Discussion} />
          <Route path="/profile" exact component={EditProfile} />
          <Route path="/profile/:username" exact component={ViewProfile} />
          <Route path="/settings" component={Settings} />
          <Route path="/teams" exact component={TeamsContainer} />
          <Switch>
            <Route path="/teams/new" exact component={TeamForm} />
            <Route path="/teams/:slug" exact component={TeamContainer} />
          </Switch>
          <Route path="/teams/:slug/edit" exact component={TeamForm} />
          <Route
            path="/kapps/:kappSlug/forms/:formSlug"
            exact
            component={IsolatedForm}
          />
          <Route
            path="/kapps/:kappSlug/submissions/:id"
            exact
            component={IsolatedForm}
          />
          <Route
            path="/kapps/:kappSlug/forms/:formSlug/submissions/:id"
            exact
            component={IsolatedForm}
          />
          <Route
            path="/datastore/forms/:slug/submissions/:id"
            render={({ match }) => (
              <Redirect
                to={`/settings/datastore/${match.params.slug}/${
                  match.params.id
                }`}
              />
            )}
          />
          <Route
            path="/datastore/forms/:slug"
            render={({ match }) => (
              <Redirect to={`/settings/datastore/${match.params.slug}/new`} />
            )}
          />
          <Route path="/reset-password" render={() => <Redirect to="/" />} />
        </div>
      </Fragment>
    ),
  });
};

export const mapStateToProps = state => ({
  loading: state.app.appLoading,
  kapps: state.kinops.kapps
    .sort((a, b) => a.name.localeCompare(b.name))
    .filter(kapp => kapp.slug !== 'admin'),
  teams: Utils.getTeams(state.kinops.profile).sort((a, b) =>
    a.name.localeCompare(b.name),
  ),
  isSpaceAdmin: state.kinops.profile.spaceAdmin,
  isGuest: selectors.selectIsGuest(state),
  pathname: state.router.location.pathname,
  settingsBackPath: state.app.settingsBackPath || '/',
});
const mapDispatchToProps = {
  fetchSettings: actions.fetchAppSettings,
  setSettingsBackPath: actions.setSettingsBackPath,
};

export const App = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers({
    openSettings: props => () => props.setSettingsBackPath(props.pathname),
  }),
  lifecycle({
    componentWillMount() {
      this.props.fetchSettings();
    },
  }),
)(AppComponent);
