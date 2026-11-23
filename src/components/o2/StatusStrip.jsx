import { Link } from 'react-router-dom';
import { STATUS_PAGE_URL } from '../../config/site';

/** Service information strip; this is not a live health monitor. */
const StatusStrip = () => {
  return (
    <div className="o2 o2-status" data-section="status-strip">
      <div className="o2-wrap">
        <div className="o2-status-in">
          <span>Messaging performance varies by route, operator and recipient handset.</span>
          <Link to={STATUS_PAGE_URL} data-track="status_strip_link">Service information</Link>
        </div>
      </div>
    </div>
  );
};

export default StatusStrip;
