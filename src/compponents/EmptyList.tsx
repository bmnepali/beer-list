interface EmptyListProps {
  children?: any;
}

const EmptyList: React.FC<EmptyListProps> = ({ children }) => {
  return (
    <div className="empty-list">
      <div>Nothing to see yet.</div>
      {!!children ? <div>{children}</div> : null}
    </div>
  );
}

export default EmptyList;
