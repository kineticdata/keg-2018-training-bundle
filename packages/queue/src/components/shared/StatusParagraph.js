import React from 'react';
import { UncontrolledTooltip, ButtonGroup, Button } from 'reactstrap';
import { KappLinkContainer as LinkContainer } from 'common';

const CLOSED_STATUSES = ['Cancelled', 'Complete'];

const getStatusClass = status =>
  `icon-wrapper status status-${status.toLowerCase().replace(/\s+/g, '-')}`;

const getStatusId = queueItem => `tooltip-${queueItem.id}-status-paragraph`;

const getStatusReason = queueItem => {
  switch (queueItem.values.Status) {
    case 'Pending':
      return queueItem.values['Pending Reason'];
    case 'Cancelled':
      return queueItem.values['Cancellation Reason'];
    case 'Complete':
      return queueItem.values.Resolution;
    default:
      return null;
  }
};

const PrevAndNextGroup = ({ prevAndNext }) => (
  <ButtonGroup className="queue-details-nav">
    <LinkContainer to={prevAndNext.prev || ''}>
      <Button color="inverse" disabled={!prevAndNext.prev}>
        <span className="icon">
          <span className="fa fa-fw fa-caret-left" />
        </span>
      </Button>
    </LinkContainer>
    <LinkContainer to={prevAndNext.next || ''}>
      <Button color="inverse" disabled={!prevAndNext.next}>
        <span className="icon">
          <span className="fa fa-fw fa-caret-right" />
        </span>
      </Button>
    </LinkContainer>
  </ButtonGroup>
);

export const StatusParagraph = ({ queueItem, prevAndNext }) => (
  <div className="status-paragraph">
    <p className={getStatusClass(queueItem.values.Status)}>
      {CLOSED_STATUSES.includes(queueItem.values.Status) ? (
        <span className="icon">
          <span className="fa fa-fw fa-circle" style={{ fontSize: '10px' }} />
        </span>
      ) : (
        <span className="icon">
          <span
            className="fa fa-fw fa-circle-o "
            style={{ fontSize: '10px' }}
          />
        </span>
      )}

      {queueItem.values.Status}
      <span className="status-reason" id={getStatusId(queueItem)}>
        {getStatusReason(queueItem)}
      </span>
      {queueItem.values.Status !== 'Open' && (
        <UncontrolledTooltip
          placement="top"
          target={getStatusId(queueItem)}
          delay={0}
        >
          {getStatusReason(queueItem)}
        </UncontrolledTooltip>
      )}
    </p>
    {prevAndNext && <PrevAndNextGroup prevAndNext={prevAndNext} />}
  </div>
);
