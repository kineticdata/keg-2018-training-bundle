import React from 'react';
import { compose, withState, withHandlers } from 'recompose';
import { Link } from 'react-router-dom';

import { getTeamColor, getTeamIcon } from '../../utils';

import { Avatar } from './Avatar';

const TeamCardComponent = props => {
  const { team, showMembers, toggleShowMembers } = props;
  const { name, slug, description, memberships } = team;
  return (
    <div className="card t-card">
      <div className="header" style={{ backgroundColor: getTeamColor(team) }}>
        <span />
        <i className={`fa fa-${getTeamIcon(team)} card-icon`} />
        {/*{slug && (
          <Link to={`/teams/${slug}/edit`}>
            <span className="fa fa-fw fa-ellipsis-v edit" />
          </Link>
        )}*/}
        <span />
      </div>
      <div className="content">
        <h1>{name}</h1>
        <pre>{description}</pre>

        {slug && (
          <Link to={`/teams/${slug}`} className="btn btn-primary btn-sm">
            View Team
          </Link>
        )}
        {memberships && memberships.length > 0 ? (
          <p className="members-toggle" onClick={toggleShowMembers}>
            {showMembers ? 'Less' : 'More'}
            <span
              className={`fa fa-fw fa-chevron-${showMembers ? 'up' : 'down'}`}
            />
          </p>
        ) : (
          <p>No members</p>
        )}
        {memberships && memberships.length > 0 && showMembers ? (
          <Members members={memberships} />
        ) : null}
      </div>
    </div>
  );
};

const toggleShowMembers = ({ showMembers, setShowMembers }) => () =>
  setShowMembers(!showMembers);

export const TeamCard = compose(
  withState('showMembers', 'setShowMembers', false),
  withHandlers({
    toggleShowMembers,
  }),
)(TeamCardComponent);

const Members = ({ members }) => (
  <div className="t-card-members-container">
    <h1>Members</h1>
    <div className="t-card-members-wrapper">
      {(members || []).map(member => {
        return (
          <div
            className={`t-card-member ${member.online ? 'online' : ''}`}
            key={member.user.username}
          >
            <Avatar user={member.user} size={26} />
          </div>
        );
      })}
    </div>
  </div>
);
