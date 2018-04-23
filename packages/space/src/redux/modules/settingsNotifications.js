import { List, Record, fromJS } from 'immutable';
import { Utils } from 'common';
import { Kapp } from '../../records';

const { namespace, noPayload, withPayload } = Utils;

export const NOTIFICATIONS_FORM_SLUG = 'notification-data';

export const types = {
  FETCH_NOTIFICATIONS: namespace(
    'settingsNotifications',
    'FETCH_NOTIFICATIONS',
  ),
  SET_NOTIFICATIONS: namespace('settingsNotifications', 'SET_NOTIFICATIONS'),
  SET_FETCH_NOTIFICATIONS_ERROR: namespace(
    'settingsNotifications',
    'SET_FETCH_NOTIFICATIONS_ERROR',
  ),
  SET_NOTIFICATION_TYPE: namespace(
    'settingsNotifications',
    'SET_NOTIFICATION_TYPE',
  ),
  FETCH_NOTIFICATION: namespace('settingsNotifications', 'FETCH_NOTIFICATION'),
  SET_NOTIFICATION: namespace('settingsNotifications', 'SET_NOTIFICATION'),
  RESET_NOTIFICATION: namespace('settingsNotifications', 'RESET_NOTIFICATION'),
  CLONE_NOTIFICATION: namespace('settingsNotifications', 'CLONE_NOTIFICATION'),
  SET_CLONE_SUCCESS: namespace('settingsNotifications', 'SET_CLONE_SUCCESS'),
  SET_CLONE_ERROR: namespace('settingsNotifications', 'SET_CLONE_ERROR'),
  DELETE_NOTIFICATION: namespace(
    'settingsNotifications',
    'DELETE_NOTIFICATION',
  ),
  SET_DELETE_SUCCESS: namespace('settingsNotifications', 'SET_DELETE_SUCCESS'),
  SET_DELETE_ERROR: namespace('settingsNotifications', 'SET_DELETE_ERROR'),
  FETCH_VARIABLES: namespace('settingsNotifications', 'FETCH_VARIABLES'),
  SET_VARIABLES: namespace('settingsNotifications', 'SET_VARIABLES'),
  SET_VARIABLES_ERROR: namespace('settingsNotifications', 'SET_VARIABLES_ERROR'),
};

export const actions = {
  fetchNotifications: noPayload(types.FETCH_NOTIFICATIONS),
  setNotifications: withPayload(types.SET_NOTIFICATIONS),
  setNotificationType: withPayload(types.SET_NOTIFICATION_TYPE),
  setFetchNotificationsError: withPayload(types.SET_FETCH_NOTIFICATIONS_ERROR),
  fetchNotification: withPayload(types.FETCH_NOTIFICATION),
  setNotification: withPayload(types.SET_NOTIFICATION),
  resetNotification: noPayload(types.RESET_NOTIFICATION),
  cloneNotification: withPayload(types.CLONE_NOTIFICATION),
  setCloneSuccess: noPayload(types.SET_CLONE_SUCCESS),
  setCloneError: withPayload(types.SET_CLONE_ERROR),
  deleteNotification: withPayload(types.DELETE_NOTIFICATION),
  setDeleteSuccess: noPayload(types.SET_DELETE_SUCCESS),
  setDeleteError: withPayload(types.SET_DELETE_ERROR),
  fetchVariables: noPayload(types.FETCH_VARIABLES),
  setVariables: withPayload(types.SET_VARIABLES),
  setVariablesError: withPayload(types.SET_VARIABLES_ERROR),
};

export const selectPrevAndNext = state => {
  const notifications = state.settingsNotifications.notifications || List();
  const notification = state.settingsNotifications.notification;
  if (notification !== null) {
    const currentItemIndex = notifications.findIndex(
      item => item.id === notification.id,
    );
    const prevItem =
      currentItemIndex > 0 ? notifications.get(currentItemIndex - 1).id : null;
    const nextItem =
      currentItemIndex < notifications.size - 1
        ? notifications.get(currentItemIndex + 1).id
        : null;
    return {
      prev: prevItem && `/settings/notifications/${prevItem}`,
      next: nextItem && `/settings/notifications/${nextItem}`,
    };
  }
};

export const selectKapps = state =>
  state.variablesLoading ? List() : List(state.variables.kapps)

export const State = Record({
  // Notification List
  loading: true,
  errors: [],
  notifications: List(),
  notificationType: 'Template',
  // Notification List Actions
  cloning: false,
  deleting: false,
  submissionActionErrors: [],
  // Single Notification
  notification: null,
  notificationLoading: true,
  variables: null,
  variablesLoading: true,
});

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.FETCH_NOTIFICATIONS:
      return state.set('loading', true).set('errors', []);
    case types.SET_NOTIFICATIONS:
      return state
        .set('loading', false)
        .set('errors', [])
        .set('notifications', List(payload));
    case types.SET_NOTIFICAION_TYPE:
      return state.set('notifiationType', payload);
    case types.SET_FETCH_NOTIFICATIONS_ERROR:
      return state.set('loading', false).set('errors', payload);
    case types.FETCH_NOTIFICATION:
      return state.set('notificationLoading', true);
    case types.SET_NOTIFICATION:
      return state
        .set('notificationLoading', false)
        .set('notification', payload);
    case types.CLONE_NOTIFICATION:
      return state.set('cloning', true);
    case types.SET_CLONE_SUCCESS:
      return state.set('cloning', false);
    case types.SET_CLONE_ERROR:
      return state.set('cloning', false).set('submissionActionErrors', payload);
    case types.DELETE_NOTIFICATION:
      return state.set('deleting', true);
    case types.SET_DELETE_SUCCESS:
      return state.set('deleting', false);
    case types.SET_DELETE_ERROR:
      return state
        .set('deleting', false)
        .set('submissionActionErrors', payload);
    case types.FETCH_VARIABLES:
      return state.set('variablesLoading', true);
    case types.SET_VARIABLES:
      return state
        .set('variablesLoading', false)
        .set('variables', fromJS(payload));
    case types.SET_VARIABLES_ERROR:
      return state
        .set('variablesErrors', payload)
        .set('variablesLoading', false);
    default:
      return state;
  }
};
