interface StatusMessageProps {
  message?: string;
}

const StatusMessage: React.FC<StatusMessageProps> = ({ message }) => (
  <div className="sorteo-finalizado">{message ?? ''}</div>
);

export default StatusMessage;