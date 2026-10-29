import React from 'react';

export function InstallModal({ isOpen, onClose, onInstallPrompt, hasNativePrompt, isIOS }) {
	if (!isOpen) return null;

	return (
		<div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
			<div className="modal-content install-modal-box" onClick={(e) => e.stopPropagation()}>
				<div className="modal-header">
					<h2>📲 Install MultInstTuna App</h2>
					<button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
						✕
					</button>
				</div>

				<div className="modal-body">
					<div className="install-app-preview">
						<span className="install-preview-icon">🎶</span>
						<div>
							<h3 className="install-preview-title">MultInstTuna Pro</h3>
							<p className="install-preview-desc">
								Install directly to your home screen for full-screen tuning, fast launch, and
								100% offline access.
							</p>
						</div>
					</div>

					{hasNativePrompt ? (
						<div className="native-install-prompt-box">
							<p className="install-step-text">
								Your browser supports 1-click direct installation:
							</p>
							<button
								type="button"
								className="primary-install-cta-btn"
								onClick={() => {
									onInstallPrompt();
									onClose();
								}}
							>
								⬇️ Download & Install Now
							</button>
						</div>
					) : isIOS ? (
						<div className="ios-install-steps">
							<span className="install-step-badge">Apple iOS (Safari)</span>
							<ol className="install-instructions-list">
								<li>
									Tap the <strong>Share</strong> button <span className="share-icon-preview">⎋ / [↑]</span> at the bottom of your Safari screen.
								</li>
								<li>
									Scroll down the menu and tap <strong>"Add to Home Screen" ➕</strong>.
								</li>
								<li>
									Tap <strong>"Add"</strong> in the top right corner.
								</li>
							</ol>
							<p className="install-tip">
								MultInstTuna will be added to your home screen just like a native App Store app!
							</p>
						</div>
					) : (
						<div className="android-manual-steps">
							<span className="install-step-badge">Android Chrome / Mobile Browser</span>
							<ol className="install-instructions-list">
								<li>
									Tap the <strong>three dots (⋮)</strong> menu in the top-right corner of your browser.
								</li>
								<li>
									Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
								</li>
								<li>
									Confirm by tapping <strong>"Install"</strong>.
								</li>
							</ol>
							<p className="install-tip">
								Once installed, open it directly from your app drawer or home screen.
							</p>
						</div>
					)}
				</div>

				<div className="modal-footer">
					<button className="primary-modal-btn" onClick={onClose}>
						Close
					</button>
				</div>
			</div>
		</div>
	);
}

export default InstallModal;

