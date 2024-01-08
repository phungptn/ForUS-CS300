import './alert.css';

export function Alert( {alerts, setAlerts} ) {
    return (
        <>
            {alerts.map((alert, index) => (
                <div key={index} className={`alert alert-${alert.type} alert-dismissible text-start`} role="alert" data-bs-theme="dark">
                    {alert.message}
                    <button type="button" className="btn-close" aria-label="Đóng" onClick={() => setAlerts((alerts) => alerts.filter((alert, i) => i !== index))}>
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>
            ))}
        </>
    );
}