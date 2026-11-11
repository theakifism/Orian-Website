import React from 'react';
import { T, useTx } from '../content';

const MAP_SRC =
  'https://www.google.com/maps?q=Plot%20no%202%2C%20Kgn%20Nagar%2C%20near%20St%20Joseph%20School%2C%20Godhni%2C%20Nagpur%2C%20Maharashtra%20441123&output=embed';

const DIRECTIONS_URL =
  'https://www.google.com/maps/dir/?api=1&destination=Plot+no+2%2C+Kgn+Nagar%2C+near+St+Joseph+School%2C+Godhni%2C+Nagpur%2C+Maharashtra+441123';

/**
 * Google Maps embed in a plain rounded frame with a small location chip and a
 * directions link. (The old scanning sweep, targeting grid and corner brackets
 * were removed with the rest of the decorative effects.)
 *
 * `compact` drops the directions button for tight spots; the grid card on the
 * home page puts its own directions link under the map instead.
 */
const MapEmbed = ({ className = '', compact = false }) => {
  const t = useTx();
  return (
    <div className={`o2-mapframe ${className}`}>
      <iframe
        title={t('MapEmbed.1', 'Orian Teleservices Location')}
        src={MAP_SRC}
        width="100%"
        height="100%"
        style={{ border: 0, filter: 'var(--map-filter)' }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />

      <div className="o2-mapchip">
        <i aria-hidden="true" />
        <b><T k="MapEmbed.2" d={'Orian HQ'} /></b>
        {!compact && <span><T k="MapEmbed.3" d={'• Nagpur, India'} /></span>}
      </div>

      {!compact && (
        <a href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer" className="o2-btn o2-btn-primary o2-mapdir" data-track="map_directions">
          <T k="MapEmbed.4" d={'Get Directions →'} />
        </a>
      )}
    </div>
  );
};

export const MAP_DIRECTIONS_URL = DIRECTIONS_URL;
export default MapEmbed;
