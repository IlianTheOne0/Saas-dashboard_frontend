import "../assets/styles/RealtimeCounter.css";

function Counter({ data })
{
	return (
		<div className="card counter-card">
			<h3 className="card-title">Right Now</h3>

			<div className="counter-content">
				<div className="active-users-count">{data.activeUsers}</div>
				<div className="sub-label">Active Users</div>

				<div className="progress-container">
					<div className="progress-bar">
						<div className="progress-segment" style={{ width: `${data.newVisitorPercent}%`, backgroundColor: "var(--error-C100)" }}>
							{data.newVisitorPercent}%
						</div>
						<div className="progress-segment" style={{ width: `${data.returningVisitorPercent}%`, backgroundColor: "var(--success-C100)" }}>
							{data.returningVisitorPercent}%
						</div>
					</div>

					<div className="legend">
						<div className="legend-item">
							<span className="dot" style={{ backgroundColor: "var(--error-C100)" }}></span>
							New Visitor
						</div>
						<div className="legend-item">
							<span className="dot" style={{ backgroundColor: "var(--success-C100)" }}></span>
							Returning Visitor
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Counter;