// src/components/StatusMessage.tsx
interface StatusMessageProps {
    message?: string;  // Permitir que sea undefined
  }
  
  const StatusMessage: React.FC<StatusMessageProps> = ({ message = '' }) => (
    <div className="sorteo-finalizado">{message}</div>
  );
  
  export default StatusMessage;
  