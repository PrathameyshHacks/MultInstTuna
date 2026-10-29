import React from 'react';

export function Header({
	darkMode,
	onToggleTheme,
	a4Freq,
	onOpenCalibration,
	isListening,
	onOpenInstallModal,
	isStandalone,
}) {
	return (
		<header className="tuner-header">
			<div className="header-brand">
				<div className="brand-logo-wrap">
					<span className="brand-icon">🎶</span>
				</div>
				<div className="brand-text">
					<h1 className="brand-title">MultInstTuna</h1>
					<span className="brand-tagline">Pro Universal & Indian Classical Tuner</span>
				</div>
			</div>

			<div className="header-actions">
				{!isStandalone && (
					<button
						className="header-btn install-btn"
						onClick={onOpenInstallModal}
						title="Install App for Offline Use"
						aria-label="Install App"
					>
						📲 <span className="btn-text">Install</span>
					</button>
				)}

				<button
					className="header-btn calibration-btn"
					onClick={onOpenCalibration}
					title="Calibration & Settings"
					aria-label="Open settings"
				>
					⚙️ <span className="btn-text">A4 = {a4Freq}Hz</span>
				</button>

				<button
					className="header-btn theme-toggle-btn"
					onClick={onToggleTheme}
					title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
					aria-label="Toggle theme"
				>
					{darkMode ? '☀️' : '🌙'}
				</button>
			</div>
		</header>
	);
}

export default Header;
