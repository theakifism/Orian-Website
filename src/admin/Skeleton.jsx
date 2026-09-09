const Skeleton = ({ className = '' }) => (
  <div className={`bg-[var(--overlay)] rounded animate-pulse ${className}`} />
);

export default Skeleton;
